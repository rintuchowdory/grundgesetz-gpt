import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getAllArticles,
  getArticleById,
  getUserConversations,
  createConversation,
  getConversationById,
  getConversationMessages,
  addMessage,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ===== Articles Router =====
  articles: router({
    /**
     * Fetch all articles with optional category filter
     */
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const allArticles = await getAllArticles();
        if (input?.category) {
          return allArticles.filter(a => a.category === input.category);
        }
        return allArticles;
      }),

    /**
     * Fetch a single article by ID
     */
    getById: publicProcedure
      .input(z.number())
      .query(async ({ input }) => {
        const article = await getArticleById(input);
        if (!article) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
        }
        return article;
      }),

    /**
     * Search articles by full-text query (title, number, body)
     */
    search: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .query(async ({ input }) => {
        const allArticles = await getAllArticles();
        const q = input.query.toLowerCase();
        return allArticles.filter(a =>
          a.number.toLowerCase().includes(q) ||
          a.title.toLowerCase().includes(q) ||
          a.body.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q)
        );
      }),

    /**
     * Get all unique categories with article counts
     */
    categories: publicProcedure.query(async () => {
      const allArticles = await getAllArticles();
      const categoryMap = new Map<string, number>();
      for (const a of allArticles) {
        categoryMap.set(a.category, (categoryMap.get(a.category) || 0) + 1);
      }
      return Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
    }),
  }),

  // ===== Conversations Router =====
  conversations: router({
    /**
     * Fetch all conversations for the current user
     */
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserConversations(ctx.user.id);
    }),

    /**
     * Create a new conversation
     */
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        articleId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const conversation = await createConversation({
          userId: ctx.user.id,
          title: input.title,
          articleId: input.articleId,
        });
        return conversation;
      }),

    /**
     * Fetch messages for a specific conversation
     */
    getMessages: protectedProcedure
      .input(z.number())
      .query(async ({ ctx, input: conversationId }) => {
        const conversation = await getConversationById(conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }
        return await getConversationMessages(conversationId);
      }),
  }),

  // ===== Chat Router =====
  chat: router({
    /**
     * Send a message and get AI response with article context
     * Handles the full conversation flow: store user message, call LLM, store AI response
     */
    sendMessage: protectedProcedure
      .input(z.object({
        conversationId: z.number(),
        message: z.string(),
        articleId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Verify conversation ownership
        const conversation = await getConversationById(input.conversationId);
        if (!conversation || conversation.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN", message: "Access denied" });
        }

        // Store user message
        await addMessage({
          conversationId: input.conversationId,
          role: "user",
          content: input.message,
        });

        // Fetch conversation history for context
        const conversationHistory = await getConversationMessages(input.conversationId);

        // Build enhanced system prompt
        let systemPrompt = `Du bist GrundgesetzGPT, ein präziser KI-Assistent für das Grundgesetz (GG) der Bundesrepublik Deutschland. Du bist ein juristischer Experte für deutsches Verfassungsrecht.

## Deine Rolle
- Du beantwortest Fragen zum Grundgesetz, zu Verfassungsrecht und zu grundlegenden Rechtsprinzipien in Deutschland
- Du sprichst standardmäßig Deutsch, kannst aber auf Englisch antworten wenn die Frage auf Englisch gestellt wird
- Du bist präzise, juristisch korrekt und achtest auf die exakte Artikel-Nummerierung

## Verhaltensrichtlinien
- **Präzision:** Zitiere exakte Artikel-Nummern (z.B. "Art. 1 Abs. 1 GG") und Absätze
- **Verständlichkeit:** Erkläre juristische Fachbegriffe in verständlicher Sprache
- **Rechtsprechung:** Verweise auf wegweisende Urteile des Bundesverfassungsgerichts (BVerfG) wenn relevant
- **Beispiele:** Nutze konkrete Beispiele aus dem deutschen Alltag zur Veranschaulichung
- **Eingrenzung:** Wenn eine Frage über das Grundgesetz hinausgeht (z.B. BGB, StGB), beantworte sie im Kontext des GG und weise auf das zuständige Gesetzbuch hin
- **Keine Rechtsberatung:** Weise darauf hin, dass deine Antworten keine Rechtsberatung ersetzen und bei konkreten rechtlichen Problemen ein Anwalt konsultiert werden sollte
- **Struktur:** Halte Antworten klar strukturiert (max. 4-5 Absätze) und verwende Markdown bei Bedarf
- **Neutralität:** Bleibe politisch neutral und objektiv

## Wichtige Verfassungsprinzipien ( stets im Kontext):
- Menschenwürde (Art. 1) als oberstes Prinzip
- Demokratieprinzip (Art. 20)
- Rechtsstaatsprinzip (Art. 20 Abs. 3)
- Sozialstaatsprinzip (Art. 20 Abs. 1)
- Bundesstaatsprinzip (Art. 20 Abs. 1)
- Ewigkeitsklausel (Art. 79 Abs. 3)
- Wesensgehaltsgarantie (Art. 19 Abs. 2)`;

        // Add article context if available
        if (input.articleId) {
          const article = await getArticleById(input.articleId);
          if (article) {
            systemPrompt += `\n\n--- AKUELLER KONTEXT ---\nAktuell diskutierter Artikel: ${article.number} — ${article.title}\nKategorie: ${article.category}\n\nArtikeltext:\n${article.body}\n\nBitte beziehe dich in deiner Antwort auf diesen Artikel und seinen verfassungsrechtlichen Kontext.`;
          }
        }

        // Prepare messages for LLM (convert DB format to LLM format)
        const messages = conversationHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));

        // Add current user message
        messages.push({
          role: "user" as const,
          content: input.message,
        });

        try {
          // Call LLM with server-side API key (system prompt as first message)
          const llmMessages = [
            { role: "system" as const, content: systemPrompt },
            ...messages,
          ];

          const response = await invokeLLM({
            messages: llmMessages,
          });

          const aiResponseContent = response.choices?.[0]?.message?.content;
          const aiResponse = typeof aiResponseContent === "string" 
            ? aiResponseContent 
            : "Entschuldigung, ich konnte keine Antwort generieren.";

          // Store AI response
          await addMessage({
            conversationId: input.conversationId,
            role: "assistant",
            content: aiResponse,
          });

          return {
            success: true,
            response: aiResponse,
          };
        } catch (error) {
          console.error("[Chat] LLM call failed:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to generate response. Please try again.",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
