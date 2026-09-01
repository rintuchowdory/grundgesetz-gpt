# GrundgesetzGPT v2 — Project TODO

## Database & Schema
- [x] Create articles table with number, title, category, body
- [x] Create conversations table for per-user chat history
- [x] Create messages table for conversation messages
- [x] Seed articles table with comprehensive Grundgesetz data (~120 articles, all major articles 1-146)
- [x] Make seed script idempotent (clears before re-seeding)
- [x] Export ARTICLES array for reuse in static fallback

## Server-Side Implementation
- [x] Add database query helpers in `server/db.ts` for articles, conversations, messages
- [x] Create tRPC procedure `articles.list` to fetch all articles with optional category filter
- [x] Create tRPC procedure `articles.getById` to fetch single article by ID
- [x] Create tRPC procedure `articles.search` — full-text search across number, title, body, category
- [x] Create tRPC procedure `articles.categories` — list all categories with article counts
- [x] Create tRPC procedure `chat.sendMessage` (protected) to handle AI chat with server-side LLM call
- [x] Create tRPC procedure `conversations.list` (protected) to fetch user's conversation history
- [x] Create tRPC procedure `conversations.create` (protected) to start new conversation
- [x] Create tRPC procedure `conversations.getMessages` (protected) to fetch messages for a conversation
- [x] Implement enhanced system prompt with detailed legal context (Verfassungsprinzipien, etc.)
- [x] Add error handling and validation for all procedures

## Frontend UI — Design System & Layout
- [x] Define parchment-and-gold color palette in `client/src/index.css`
- [x] Set up custom fonts (Playfair Display, Source Serif 4, JetBrains Mono)
- [x] Create main layout structure: header, sidebar, article panel, chat area
- [x] Implement responsive sidebar collapse on mobile (<640px)
- [x] Create custom layout for editorial design

## Frontend UI — Article Browser
- [x] Build article sidebar component with live search
- [x] Implement category filtering in sidebar (clickable category chips)
- [x] Create article list rendering with active state highlighting
- [x] Add article detail panel showing full text and metadata
- [x] Implement "Diesen Artikel befragen" button in detail panel (grammar fixed)
- [x] Show category tag under each article in sidebar
- [x] Add static fallback data (client/src/data/articles.ts) — works without backend
- [x] Articles load without authentication (publicProcedure, no auth gate)

## Frontend UI — Chat Interface
- [x] Integrate AIChatBox component from template
- [x] Connect AIChatBox to `chat.sendMessage` tRPC procedure
- [x] Implement dynamic suggested questions that update per article
- [x] Add markdown rendering for AI responses (via Streamdown in AIChatBox)
- [x] Implement typing indicator while awaiting response (via AIChatBox)
- [x] Add error states and retry logic
- [x] Load existing conversation messages when switching conversations (key prop for remount)

## Frontend UI — User Experience
- [x] Implement authentication check and redirect to login if needed
- [x] Add user profile/logout in header
- [x] Display conversation history in sidebar "Verlauf" tab
- [x] Allow switching between conversations (click in history tab)
- [x] Add "Neu" button in header to start fresh conversation
- [x] Add loading states and empty states throughout
- [x] Welcome screen with category overview and article count
- [x] Non-authenticated users can browse articles (chat requires login)

## Testing & Refinement
- [x] Unit tests for articles, conversations, and auth procedures (10 tests passing)
- [ ] Integration test for AI chat with article context
- [ ] Test conversation history persistence and retrieval
- [ ] Test responsive design on mobile/tablet/desktop
- [ ] Test authentication flow and session persistence
- [x] Verify API key is never exposed client-side (server-side LLM only)
- [ ] Performance testing with full article database
- [x] TypeScript check passes (tsc --noEmit)
- [x] Vite build succeeds with base path /grundgesetz-gpt/

## Deployment & Delivery
- [ ] Final visual polish and design refinement
- [ ] Seed the production database (run `node seed-articles.mjs` with DATABASE_URL)
- [ ] Deploy backend updates to Render
- [ ] Deploy frontend to GitHub Pages (automatic via CI on push to main)
- [ ] Verify static fallback works on GitHub Pages when API is cold-starting
