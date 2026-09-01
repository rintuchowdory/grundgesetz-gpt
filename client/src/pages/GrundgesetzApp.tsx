import { useState, useMemo, useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { AIChatBox } from "@/components/AIChatBox";
import { getLoginUrl, apiBaseUrl } from "@/const";
import { STATIC_ARTICLES } from "@/data/articles";
import { Menu, X, MessageSquare, BookOpen, Plus, Clock } from "lucide-react";

type SidebarTab = "articles" | "history";

type Article = {
  id: number;
  number: string;
  title: string;
  category: string;
  body: string;
};

export default function GrundgesetzApp() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("articles");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);

  // Fetch all articles — no auth required (publicProcedure)
  const { data: apiArticles, isLoading: articlesLoading } = trpc.articles.list.useQuery(undefined, {
    enabled: true,
  });

  // Use API articles if available, otherwise fall back to static data
  const articles: Article[] = useMemo(() => {
    if (apiArticles && apiArticles.length > 0) return apiArticles as Article[];
    return STATIC_ARTICLES;
  }, [apiArticles]);

  const hasBackend = apiBaseUrl !== "" && (!apiArticles || apiArticles.length > 0);
  const isStaticMode = !hasBackend;

  // Fetch user conversations — auth required
  const utils = trpc.useUtils();
  const { data: conversations = [] } = trpc.conversations.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(articles.map((a: Article) => a.category));
    return Array.from(cats).sort();
  }, [articles]);

  // Get selected article
  const selectedArticle = useMemo(
    () => articles.find((a: Article) => a.id === selectedArticleId) || articles[0],
    [articles, selectedArticleId]
  );

  // Filter articles by search and category
  const filteredArticles = useMemo(() => {
    let result = articles;
    if (activeCategory) {
      result = result.filter((a: Article) => a.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((a: Article) =>
        a.number.toLowerCase().includes(q) ||
        a.title.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [articles, searchQuery, activeCategory]);

  // Generate suggested questions for current article
  const suggestedQuestions = useMemo(() => {
    if (!selectedArticle) return [];
    return [
      `Was bedeutet ${selectedArticle.number} im Alltag?`,
      `Gibt es Ausnahmen zu ${selectedArticle.number}?`,
      `Wie hat das BVerfG ${selectedArticle.number} ausgelegt?`,
    ];
  }, [selectedArticle]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated && !isStaticMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            GrundgesetzGPT
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            KI-Assistent für das Grundgesetz der Bundesrepublik Deutschland
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-gold hover:bg-gold-dark text-ink"
          >
            Mit Manus anmelden
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-ink text-parchment-light px-4 py-3 flex items-center justify-between flex-shrink-0 relative">
        <div className="flag-accent absolute inset-0 pointer-events-none" />
        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gold hover:text-gold-light transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gold-light" style={{ fontFamily: "'Playfair Display', serif" }}>
              GrundgesetzGPT
            </h1>
            <p className="text-xs text-gold tracking-widest font-mono">Deutsches Verfassungsrecht · KI-Assistent</p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentConversationId(null);
                setSidebarTab("articles");
              }}
              className="text-gold hover:text-gold-light hover:bg-ink/50 text-xs font-mono"
            >
              <Plus size={16} className="mr-1" />
              Neu
            </Button>
          )}
          <span className="text-xs text-parchment-light font-mono tracking-widest">
            {user?.name || "Gast"}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-72" : "w-0"
          } md:w-72 bg-gradient-to-b from-ink to-ink/95 border-r-4 border-red-accent flex flex-col overflow-hidden transition-all duration-300 flex-shrink-0`}
        >
          {/* Tabs */}
          <div className="flex border-b-2 border-red-accent/50 bg-ink/80">
            <button
              onClick={() => setSidebarTab("articles")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono tracking-widest uppercase transition-colors ${
                sidebarTab === "articles"
                  ? "text-gold-light border-b-2 border-gold bg-ink/50"
                  : "text-parchment-light/60 hover:text-gold"
              }`}
            >
              <BookOpen size={14} />
              Artikel
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setSidebarTab("history")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-mono tracking-widest uppercase transition-colors ${
                  sidebarTab === "history"
                    ? "text-gold-light border-b-2 border-gold bg-ink/50"
                    : "text-parchment-light/60 hover:text-gold"
                }`}
              >
                <MessageSquare size={14} />
                Verlauf
                {conversations.length > 0 && (
                  <span className="bg-gold/30 text-gold-light px-1.5 rounded-full text-[10px]">
                    {conversations.length}
                  </span>
                )}
              </button>
            )}
          </div>

          {/* Articles Tab */}
          {sidebarTab === "articles" && (
            <>
              {/* Search */}
              <div className="p-4 border-b border-ink/50 bg-ink/80">
                <Input
                  type="text"
                  placeholder="Artikel suchen…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-ink/50 border-2 border-gold/70 text-parchment-light placeholder:text-muted-foreground focus:border-red-accent focus:ring-red-accent"
                />
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="px-4 py-2 border-b border-ink/50 bg-ink/60 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                      !activeCategory
                        ? "bg-gold text-ink font-bold"
                        : "bg-ink/50 text-parchment-light/60 hover:text-gold"
                    }`}
                  >
                    Alle
                  </button>
                  {categories.map((cat: string) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
                      className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded transition-colors ${
                        activeCategory === cat
                          ? "bg-red-accent text-parchment-light font-bold"
                          : "bg-ink/50 text-parchment-light/60 hover:text-gold"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Article List */}
              <ScrollArea className="flex-1">
                {articlesLoading && !isStaticMode ? (
                  <div className="p-4 flex justify-center">
                    <Spinner />
                  </div>
                ) : filteredArticles.length === 0 ? (
                  <div className="p-4 text-center text-parchment-light/40 text-sm">
                    Keine Artikel gefunden
                  </div>
                ) : (
                  <div>
                    {filteredArticles.map((article: Article) => (
                      <button
                        key={article.id}
                        onClick={() => {
                          setSelectedArticleId(article.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 border-b border-ink/50 transition-colors ${
                          selectedArticle?.id === article.id
                            ? "bg-ink/80 border-l-4 border-red-accent text-gold-light shadow-md"
                            : "text-parchment-light hover:bg-ink/50 hover:border-l-4 hover:border-red-accent/50"
                        }`}
                      >
                        <div className="text-xs font-mono text-gold mb-1">{article.number}</div>
                        <div className="text-sm line-clamp-2">{article.title}</div>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-parchment-light/40 mt-1">
                          {article.category}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}

          {/* History Tab */}
          {sidebarTab === "history" && isAuthenticated && (
            <ScrollArea className="flex-1">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-parchment-light/40 text-sm">
                  <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
                  Noch keine Gespräche vorhanden.
                  <br />
                  Starten Sie ein neues Gespräch!
                </div>
              ) : (
                <div>
                  {conversations.map((conv: any) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setCurrentConversationId(conv.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 border-b border-ink/50 transition-colors ${
                        currentConversationId === conv.id
                          ? "bg-ink/80 border-l-4 border-red-accent text-gold-light shadow-md"
                          : "text-parchment-light hover:bg-ink/50 hover:border-l-4 hover:border-red-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={12} className="text-gold/60" />
                        <span className="text-xs font-mono text-gold/60">
                          {new Date(conv.createdAt).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="text-sm line-clamp-2">{conv.title}</div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Article Panel */}
          <div className="bg-gradient-to-b from-parchment-light to-parchment flex-shrink-0 overflow-y-auto max-h-64 p-6 border-b-4 border-red-accent/30 shadow-md">
            {selectedArticle ? (
              <div>
                <p className="text-xs text-muted-foreground tracking-widest font-mono mb-2 uppercase">
                  Grundgesetz für die Bundesrepublik Deutschland · 1949
                </p>
                <h2
                  className="text-2xl font-bold text-ink mb-2"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {selectedArticle.number} — {selectedArticle.title}
                </h2>
                <span className="inline-block bg-gradient-to-r from-german-red to-red-accent text-parchment-light text-xs px-4 py-2 font-mono tracking-widest mb-4 rounded shadow-md font-bold">
                  {selectedArticle.category}
                </span>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {selectedArticle.body}
                </p>
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      setCurrentConversationId(-1);
                      setSidebarTab("history");
                    } else {
                      window.location.href = getLoginUrl();
                    }
                  }}
                  className="mt-4 bg-gradient-to-r from-german-red to-red-accent text-parchment-light border-0 hover:from-red-accent hover:to-german-red shadow-md font-bold"
                >
                  {isAuthenticated ? "Diesen Artikel befragen →" : "Anmelden zum Chatten →"}
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">Wählen Sie einen Artikel aus</div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentConversationId && selectedArticle && isAuthenticated ? (
              <ChatInterface
                key={currentConversationId}
                conversationId={currentConversationId}
                articleId={selectedArticle.id}
                articleNumber={selectedArticle.number}
                articleTitle={selectedArticle.title}
                suggestedQuestions={suggestedQuestions}
                onConversationCreated={(id) => {
                  setCurrentConversationId(id);
                  utils.conversations.list.invalidate();
                }}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-parchment p-6">
                <div className="text-center max-w-md">
                  <div className="text-6xl mb-4">⚖️</div>
                  <h3
                    className="text-xl font-bold text-ink mb-2"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    Willkommen bei GrundgesetzGPT
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {isAuthenticated
                      ? 'Wählen Sie einen Artikel aus der Sidebar und klicken Sie auf "Diesen Artikel befragen", um das Gespräch zu starten.'
                      : "Durchsuchen Sie alle Artikel des Grundgesetzes. Melden Sie sich an, um mit dem KI-Assistenten zu chatten."}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {categories.slice(0, 5).map((cat: string) => (
                      <span
                        key={cat}
                        className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded bg-parchment-dark text-muted-foreground border border-border-muted"
                      >
                        {cat}
                      </span>
                    ))}
                    {categories.length > 5 && (
                      <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 text-muted-foreground">
                        +{categories.length - 5} weitere
                      </span>
                    )}
                  </div>
                  {articles.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-4 font-mono">
                      {articles.length} Artikel verfügbar
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

interface ChatInterfaceProps {
  conversationId: number;
  articleId: number;
  articleNumber: string;
  articleTitle: string;
  suggestedQuestions: string[];
  onConversationCreated: (id: number) => void;
}

function ChatInterface({
  conversationId: initialConvId,
  articleId,
  articleNumber,
  articleTitle,
  suggestedQuestions,
  onConversationCreated,
}: ChatInterfaceProps) {
  const [conversationId, setConversationId] = useState<number | null>(initialConvId === -1 ? null : initialConvId);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant' | 'system'; content: string }>>([
    {
      role: "assistant",
      content: `Willkommen bei GrundgesetzGPT. Ich bin Ihr KI-Assistent für das Grundgesetz der Bundesrepublik Deutschland.\n\nWir diskutieren gerade **${articleNumber} — ${articleTitle}**. Stellen Sie mir Ihre Fragen!`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const createConvMutation = trpc.conversations.create.useMutation();
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const getMessagesQuery = trpc.conversations.getMessages.useQuery(
    initialConvId > 0 ? initialConvId : -1,
    { enabled: initialConvId > 0 }
  );

  // Load existing conversation messages
  useEffect(() => {
    if (initialConvId > 0 && getMessagesQuery.data && getMessagesQuery.data.length > 0) {
      setMessages(getMessagesQuery.data.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })));
    }
  }, [initialConvId, getMessagesQuery.data]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message to UI
    setMessages(prev => [...prev, { role: "user", content: message }]);
    setIsLoading(true);

    try {
      let convId = conversationId;

      // Create conversation if needed
      if (!conversationId) {
        const conv = await createConvMutation.mutateAsync({
          title: `Frage zu ${articleNumber}`,
          articleId,
        });
        convId = conv.id;
        setConversationId(conv.id);
        onConversationCreated(conv.id);
      }

      if (!convId) throw new Error("Conversation ID not set");

      // Send message
      const response = await sendMessageMutation.mutateAsync({
        conversationId: convId,
        message,
        articleId,
      });

      // Add AI response
      setMessages(prev => [...prev, { role: "assistant", content: response.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-parchment">
      {/* Suggested questions */}
      <div className="px-6 py-3 border-b-2 border-red-accent/30 bg-gradient-to-r from-parchment via-parchment to-parchment-light flex flex-wrap gap-2 shadow-sm">
        {suggestedQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            disabled={isLoading}
            className="text-xs px-3 py-1 border-2 border-red-accent/50 rounded hover:bg-red-accent hover:text-parchment-light text-muted-foreground hover:border-red-accent transition-all italic font-medium disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
      <AIChatBox
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        placeholder="Stellen Sie eine Frage zum Grundgesetz…"
        height="100%"
      />
    </div>
  );
}
