import { useState, useMemo, useCallback } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { AIChatBox, type Message } from "@/components/AIChatBox";
import { getLoginUrl, apiBaseUrl, isOAuthConfigured } from "@/const";
import { STATIC_ARTICLES } from "@/data/articles";
import { STATIC_DECISIONS, type StaticDecision } from "@/data/decisions";
import { Menu, X, MessageSquare, BookOpen, Plus, Clock, Sparkles, AlertCircle, Scale, Gavel } from "lucide-react";

type SidebarTab = "articles" | "decisions" | "history";

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
  const [selectedDecisionId, setSelectedDecisionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("articles");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatError, setChatError] = useState<string | null>(null);
  const [sessionId] = useState(() => Math.random().toString(36).substring(2, 15));

  // Fetch all articles — no auth required
  const { data: apiArticles, isLoading: articlesLoading } = trpc.articles.list.useQuery(undefined, {
    enabled: true,
  });

  const articles: Article[] = useMemo(() => {
    if (apiArticles && apiArticles.length > 0) return apiArticles as Article[];
    return STATIC_ARTICLES;
  }, [apiArticles]);

  const hasBackend = apiBaseUrl !== "" && (!apiArticles || apiArticles.length > 0);
  const isStaticMode = !hasBackend;

  // Fetch user conversations — auth required
  const { data: conversations = [] } = trpc.conversations.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  // Chat mutation — public, works without auth
  const askMutation = trpc.chat.ask.useMutation({
    onSuccess: (data) => {
      setChatMessages(prev => [...prev, { role: "assistant", content: data.response }]);
      setChatError(null);
    },
    onError: (error) => {
      setChatError(error.message || "KI-Antwort fehlgeschlagen");
    },
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

  // Get selected decision
  const selectedDecision = useMemo(
    () => STATIC_DECISIONS.find(d => d.id === selectedDecisionId),
    [selectedDecisionId]
  );

  // Find decisions related to the selected article
  const relatedDecisions = useMemo(() => {
    if (!selectedArticle) return [];
    const articleNum = selectedArticle.number.replace(/^Art\.\s*/, "").trim();
    return STATIC_DECISIONS.filter(d =>
      d.articles.some(a => {
        const dArt = a.replace(/^Art\.\s*/, "").trim();
        return dArt === articleNum || dArt === selectedArticle.number;
      })
    );
  }, [selectedArticle]);

  // Filter articles
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

  // Filter decisions
  const filteredDecisions = useMemo(() => {
    if (!searchQuery) return STATIC_DECISIONS;
    const q = searchQuery.toLowerCase();
    return STATIC_DECISIONS.filter(d =>
      d.caseNumber.toLowerCase().includes(q) ||
      d.title.toLowerCase().includes(q) ||
      d.summary.toLowerCase().includes(q) ||
      d.articles.some(a => a.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  // Suggested questions
  const suggestedQuestions = useMemo(() => {
    if (!selectedArticle) return [];
    return [
      `Was bedeutet ${selectedArticle.number} im Alltag?`,
      `Gibt es Ausnahmen zu ${selectedArticle.number}?`,
      `Wie hat das BVerfG ${selectedArticle.number} ausgelegt?`,
    ];
  }, [selectedArticle]);

  // Handle sending a chat message
  const handleSendMessage = useCallback((content: string) => {
    setChatError(null);
    setChatMessages(prev => [...prev, { role: "user", content }]);
    askMutation.mutate({
      message: content,
      articleId: selectedArticle?.id,
      sessionId,
    });
  }, [askMutation, selectedArticle, sessionId]);

  // Reset chat when article changes
  const handleArticleSelect = (id: number) => {
    setSelectedArticleId(id);
    setSelectedDecisionId(null);
    setChatMessages([]);
    setChatError(null);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  // Handle decision selection
  const handleDecisionSelect = (id: number) => {
    setSelectedDecisionId(id);
    setSidebarTab("decisions");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  if (authLoading && isOAuthConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated && isOAuthConfigured) {
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
                setChatMessages([]);
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
              onClick={() => { setSidebarTab("articles"); setSearchQuery(""); }}
              className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-mono tracking-widest uppercase transition-colors ${
                sidebarTab === "articles"
                  ? "text-gold-light border-b-2 border-gold bg-ink/50"
                  : "text-parchment-light/60 hover:text-gold"
              }`}
            >
              <BookOpen size={14} />
              Artikel
            </button>
            <button
              onClick={() => { setSidebarTab("decisions"); setSearchQuery(""); }}
              className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-mono tracking-widest uppercase transition-colors ${
                sidebarTab === "decisions"
                  ? "text-gold-light border-b-2 border-gold bg-ink/50"
                  : "text-parchment-light/60 hover:text-gold"
              }`}
            >
              <Scale size={14} />
              Rechtsprechung
            </button>
            {isAuthenticated && (
              <button
                onClick={() => setSidebarTab("history")}
                className={`flex-1 flex items-center justify-center gap-1 py-3 text-xs font-mono tracking-widest uppercase transition-colors ${
                  sidebarTab === "history"
                    ? "text-gold-light border-b-2 border-gold bg-ink/50"
                    : "text-parchment-light/60 hover:text-gold"
                }`}
              >
                <MessageSquare size={14} />
                Verlauf
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
                    Keine Artikel gefunden.
                  </div>
                ) : (
                  <div className="divide-y divide-ink/30">
                    {filteredArticles.map((article: Article) => (
                      <button
                        key={article.id}
                        onClick={() => handleArticleSelect(article.id)}
                        className={`w-full text-left p-4 transition-colors hover:bg-ink/50 ${
                          selectedArticleId === article.id ? "bg-ink/40 border-l-4 border-gold" : "border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-gold-light font-mono font-bold text-sm">{article.number}</span>
                          <span className="text-[10px] text-parchment-light/40 font-mono uppercase tracking-wider">
                            {article.category}
                          </span>
                        </div>
                        <p className="text-sm text-parchment-light/80 line-clamp-2">{article.title}</p>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          )}

          {/* Decisions Tab */}
          {sidebarTab === "decisions" && (
            <>
              <div className="p-4 border-b border-ink/50 bg-ink/80">
                <Input
                  type="text"
                  placeholder="Entscheidungen suchen…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-ink/50 border-2 border-gold/70 text-parchment-light placeholder:text-muted-foreground focus:border-red-accent focus:ring-red-accent"
                />
              </div>
              <ScrollArea className="flex-1">
                {filteredDecisions.length === 0 ? (
                  <div className="p-4 text-center text-parchment-light/40 text-sm">
                    Keine Entscheidungen gefunden.
                  </div>
                ) : (
                  <div className="divide-y divide-ink/30">
                    {filteredDecisions.map((decision: StaticDecision) => (
                      <button
                        key={decision.id}
                        onClick={() => handleDecisionSelect(decision.id)}
                        className={`w-full text-left p-4 transition-colors hover:bg-ink/50 ${
                          selectedDecisionId === decision.id ? "bg-ink/40 border-l-4 border-gold" : "border-l-4 border-transparent"
                        }`}
                      >
                        <div className="flex items-baseline gap-2 mb-1">
                          <Gavel size={12} className="text-gold/60 shrink-0" />
                          <span className="text-gold-light font-mono font-bold text-xs">{decision.caseNumber}</span>
                          <span className="text-[10px] text-parchment-light/40 font-mono">
                            {new Date(decision.date).getFullYear()}
                          </span>
                        </div>
                        <p className="text-sm text-parchment-light/80 line-clamp-1 mb-1">{decision.title}</p>
                        <div className="flex flex-wrap gap-1">
                          {decision.articles.map(art => (
                            <span key={art} className="text-[9px] font-mono bg-red-accent/30 text-gold-light/80 px-1.5 rounded">
                              {art}
                            </span>
                          ))}
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
                <div className="p-4 text-center text-parchment-light/40 text-sm">
                  Noch keine Konversationen.
                </div>
              ) : (
                <div className="divide-y divide-ink/30">
                  {conversations.map((conv: { id: number; title: string; articleId: number | null; createdAt: Date }) => (
                    <button
                      key={conv.id}
                      onClick={() => {
                        setSelectedArticleId(conv.articleId);
                        setSidebarTab("articles");
                      }}
                      className="w-full text-left p-4 hover:bg-ink/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Clock size={12} className="text-gold/60" />
                        <span className="text-[10px] text-parchment-light/40 font-mono">
                          {new Date(conv.createdAt).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                      <p className="text-sm text-parchment-light/80 line-clamp-1">{conv.title}</p>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col bg-parchment">
          {/* Decision Detail View */}
          {selectedDecision && sidebarTab === "decisions" ? (
            <>
              <div className="bg-parchment-light border-b-4 border-red-accent px-6 py-4 flex-shrink-0">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-lg font-bold text-ink font-mono mr-3">{selectedDecision.caseNumber}</span>
                    <span className="text-[10px] text-ink/50 font-mono">
                      {new Date(selectedDecision.date).toLocaleDateString('de-DE')}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl text-ink font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedDecision.title}
                </h2>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedDecision.articles.map(art => {
                    const article = articles.find(a => a.number === art);
                    return (
                      <button
                        key={art}
                        onClick={() => {
                          if (article) handleArticleSelect(article.id);
                        }}
                        className="text-xs font-mono bg-red-accent/10 text-ink/70 hover:bg-red-accent/20 px-2 py-1 rounded transition-colors"
                      >
                        {art}
                      </button>
                    );
                  })}
                </div>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-6 max-w-4xl">
                  <div className="prose prose-lg max-w-none mb-6">
                    <h3 className="text-sm font-mono uppercase tracking-widest text-ink/60 mb-2">Zusammenfassung</h3>
                    <p className="text-ink leading-relaxed">{selectedDecision.summary}</p>
                  </div>
                  <div className="prose prose-lg max-w-none">
                    <h3 className="text-sm font-mono uppercase tracking-widest text-ink/60 mb-2">Bedeutung</h3>
                    <p className="text-ink leading-relaxed">{selectedDecision.significance}</p>
                  </div>

                  {/* Related Article Chat */}
                  <div className="mt-8 pt-6 border-t-2 border-ink/10">
                    <h3 className="text-sm font-mono uppercase tracking-widest text-ink/60 mb-3 flex items-center gap-2">
                      <Sparkles size={14} />
                      Fragen zu dieser Entscheidung
                    </h3>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => {
                          setSidebarTab("articles");
                          const art = articles.find(a => a.number === selectedDecision.articles[0]);
                          if (art) handleArticleSelect(art.id);
                        }}
                        className="text-left text-sm px-4 py-2 rounded border border-ink/20 hover:border-red-accent hover:bg-red-accent/5 text-ink/70 transition-colors"
                      >
                        → Zum verknüpften Artikel {selectedDecision.articles[0]} und KI-Chat
                      </button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          ) : selectedArticle ? (
            <>
              {/* Article Header */}
              <div className="bg-parchment-light border-b-4 border-red-accent px-6 py-4 flex-shrink-0">
                <div className="flex items-baseline justify-between mb-2">
                  <div>
                    <span className="text-3xl font-bold text-ink font-mono mr-3" style={{ fontFamily: "'Playfair Display', serif" }}>
                      {selectedArticle.number}
                    </span>
                    <span className="text-[10px] text-ink/50 font-mono uppercase tracking-widest bg-ink/10 px-2 py-1 rounded">
                      {selectedArticle.category}
                    </span>
                  </div>
                </div>
                <h2 className="text-xl text-ink font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {selectedArticle.title}
                </h2>
              </div>

              {/* Content Area: Article + Chat side by side on desktop */}
              <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Article Body */}
                <ScrollArea className="flex-1 lg:w-1/2">
                  <div className="p-6 max-w-4xl">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-ink leading-relaxed whitespace-pre-line text-lg">
                        {selectedArticle.body}
                      </p>
                    </div>

                    {/* Related Decisions */}
                    {relatedDecisions.length > 0 && (
                      <div className="mt-6 pt-6 border-t-2 border-ink/10">
                        <h3 className="text-sm font-mono uppercase tracking-widest text-ink/60 mb-3 flex items-center gap-2">
                          <Scale size={14} />
                          Verwandte Rechtsprechung ({relatedDecisions.length})
                        </h3>
                        <div className="flex flex-col gap-2">
                          {relatedDecisions.map(d => (
                            <button
                              key={d.id}
                              onClick={() => handleDecisionSelect(d.id)}
                              className="text-left p-3 rounded border border-ink/20 hover:border-gold hover:bg-gold/5 transition-colors"
                            >
                              <div className="flex items-baseline gap-2 mb-1">
                                <span className="text-xs font-mono font-bold text-ink/80">{d.caseNumber}</span>
                                <span className="text-[10px] text-ink/40">·</span>
                                <span className="text-xs text-ink/60">{new Date(d.date).getFullYear()}</span>
                              </div>
                              <p className="text-sm font-semibold text-ink/90 mb-1">{d.title}</p>
                              <p className="text-xs text-ink/60 line-clamp-2">{d.summary}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Suggested Questions */}
                    <div className="mt-8 pt-6 border-t-2 border-ink/10">
                      <h3 className="text-sm font-mono uppercase tracking-widest text-ink/60 mb-3 flex items-center gap-2">
                        <Sparkles size={14} />
                        Verständnisfragen
                      </h3>
                      <div className="flex flex-col gap-2">
                        {suggestedQuestions.map((q, i) => (
                          <button
                            key={i}
                            onClick={() => handleSendMessage(q)}
                            disabled={askMutation.isPending}
                            className="text-left text-sm px-4 py-2 rounded border border-ink/20 hover:border-red-accent hover:bg-red-accent/5 text-ink/70 transition-colors disabled:opacity-50"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollArea>

                {/* Chat Panel */}
                <div className="lg:w-1/2 border-t-2 lg:border-t-0 lg:border-l-2 border-ink/10 flex flex-col bg-parchment-light">
                  <AIChatBox
                    messages={chatMessages}
                    onSendMessage={handleSendMessage}
                    isLoading={askMutation.isPending}
                    placeholder={`Frage zu ${selectedArticle.number} stellen…`}
                    height="100%"
                    emptyStateMessage={`Stelle eine Frage zu ${selectedArticle.number} — ${selectedArticle.title}`}
                    suggestedPrompts={suggestedQuestions}
                  />
                  {chatError && (
                    <div className="px-4 py-2 bg-red-50 border-t border-red-200 flex items-start gap-2">
                      <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
                      <div className="text-xs text-red-700">
                        <p className="font-semibold">KI-Fehler</p>
                        <p>{chatError}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-parchment">
              <div className="text-center max-w-md">
                <BookOpen size={64} className="text-ink/20 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-ink mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  Grundgesetz der Bundesrepublik Deutschland
                </h2>
                <p className="text-ink/60">
                  Wähle einen Artikel oder eine Entscheidung aus der Sidebar, um mehr zu erfahren und Fragen zu stellen.
                </p>
                <p className="text-sm text-ink/40 mt-4">
                  {articles.length} Artikel · {STATIC_DECISIONS.length} Entscheidungen · {categories.length} Kategorien
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
