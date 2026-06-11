"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Search, Loader2, Sparkles, Copy, CheckCircle2, TrendingUp, Heart, Share2, FileText, Bell, LayoutGrid, List, MessageSquare, Users, Trash2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

// Ícone personalizado do Facebook para evitar incompatibilidade de versão do lucide-react
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={props.className}
      width="24"
      height="24"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import { AIChatModal } from "@/components/ai-chat-modal";

// Sub-componente para isolar os estados individuais (como expandir a sheet)
function OpportunityCard({ item }: { item: any }) {
  const router = useRouter();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(type);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleShare = (id: string) => {
    const url = `${window.location.origin}/share/${id}`;
    navigator.clipboard.writeText(url);
    alert("Link secreto copiado para a área de transferência!");
  };

  return (
    <Card className="flex flex-col relative overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary to-blue-600" />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant={item.viral_opportunity_score >= 80 ? "default" : "secondary"}>
              Score: {item.viral_opportunity_score}
            </Badge>
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
              {(() => {
                const s = item.viral_opportunity_score || 0;
                if (s >= 95) return "🌟🌟🌟🌟🌟🌟 (>5 Estrelas)";
                if (s >= 80) return "⭐⭐⭐⭐⭐ (5 Estrelas)";
                if (s >= 60) return "⭐⭐⭐⭐ (4 Estrelas)";
                if (s >= 40) return "⭐⭐⭐ (3 Estrelas)";
                if (s >= 20) return "⭐⭐ (2 Estrelas)";
                return "⭐ (1 Estrela)";
              })()}
            </Badge>
            <Badge variant="outline">{item.country}</Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10"
              onClick={() => handleShare(item.id)}
              title="Copiar Link Secreto"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${typeof window !== 'undefined' && window.location.pathname.includes('/favorites') ? "text-red-500 hover:bg-red-500/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"}`}
              onClick={async () => {
                const isFavoritePage = typeof window !== 'undefined' && window.location.pathname.includes('/favorites');
                if (isFavoritePage) {
                  if (confirm("Deseja remover esta oportunidade dos favoritos?")) {
                    const res = await fetch('/api/favorites', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ opportunityId: item.id })
                    });
                    if (res.ok) {
                      alert('Removido dos favoritos!');
                      router.refresh();
                    } else {
                      alert('Erro ao remover.');
                    }
                  }
                } else {
                  const res = await fetch('/api/favorites', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ opportunityId: item.id })
                  });
                  if (res.status === 401) {
                    router.push('/login');
                  } else if (res.ok) {
                    alert('Adicionado aos favoritos!');
                  }
                }
              }}
              title={typeof window !== 'undefined' && window.location.pathname.includes('/favorites') ? "Remover dos Favoritos" : "Favoritar"}
            >
              <Heart className={`h-4 w-4 ${typeof window !== 'undefined' && window.location.pathname.includes('/favorites') ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/10"
              onClick={() => alert("Alerta de Monitoramento ativado! Avisaremos se este nicho explodir.")}
              title="Monitorar Alerta"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
              onClick={async () => {
                if (confirm(`Tem certeza que deseja excluir permanentemente a oportunidade "${item.saas_name}"?`)) {
                  const res = await fetch('/api/radar', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id })
                  });
                  if (res.ok) {
                    alert('Oportunidade excluída com sucesso!');
                    router.refresh();
                  } else {
                    const errData = await res.json().catch(() => ({}));
                    alert(errData.error || 'Erro ao excluir oportunidade.');
                  }
                }
              }}
              title="Excluir Oportunidade"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg line-clamp-1">{item.saas_name}</CardTitle>
        <CardDescription className="line-clamp-2 mt-1">
          {item.problem_solved}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1" title="Crescimento Mensal (Trends)">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="font-semibold text-green-500">+{item.trends_growth_monthly}%</span>
          </div>
          <a
            href={`https://www.reddit.com/search/?q=${encodeURIComponent(item.target_audience || item.saas_name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline hover:text-orange-500 transition-colors"
            title="Buscar no Reddit"
          >
            <Search className="h-4 w-4 text-orange-500" />
            <span className="font-semibold text-orange-500">{item.reddit_mentions} refs</span>
          </a>
          <a
            href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&q=${encodeURIComponent(item.target_audience || item.saas_name)}&media_type=all`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline hover:text-blue-600 transition-colors"
            title="Buscar na Biblioteca de Anúncios do Facebook"
          >
            <FacebookIcon className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-600">{item.facebook_ads_count || 0} ads</span>
          </a>
          <a
            href={`https://www.facebook.com/groups/search/groups/?q=${encodeURIComponent(item.target_audience || item.saas_name)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline hover:text-indigo-400 transition-colors"
            title="Buscar Grupos no Facebook"
          >
            <Users className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-indigo-400">{item.facebook_groups_count || 0} grps</span>
          </a>
        </div>

        <div className="text-sm font-medium mb-1">Diferencial:</div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {item.competitive_advantage}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-border/50 flex gap-2">
        <Sheet>
          <SheetTrigger render={<Button className="flex-1 bg-primary/10 text-primary hover:bg-primary/20" />}>
            Detalhes & Prompts <Sparkles className="ml-2 h-4 w-4" />
          </SheetTrigger>
          <SheetContent className={`w-full overflow-y-auto transition-all duration-300 ${isExpanded ? "!max-w-[90vw]" : "!max-w-xl"}`}>
            <SheetHeader className="mb-6 relative pr-12">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="absolute top-0 right-8 p-2 rounded-md hover:bg-muted text-muted-foreground transition-colors"
                title={isExpanded ? "Restaurar tamanho" : "Maximizar"}
              >
                {isExpanded ? "🗗" : "🗖"}
              </button>
              <SheetTitle className="text-2xl font-extrabold text-primary flex items-center gap-4 flex-wrap">
                {item.saas_name}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground border-none"
                    onClick={() => window.open(`/canvas/${item.id}`, '_blank')}
                  >
                    <FileText className="h-4 w-4 mr-2" /> Gerar Lean Canvas
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-none"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" /> Falar com CTO (IA)
                  </Button>
                </div>
              </SheetTitle>
              <SheetDescription className="text-base text-foreground mt-2">
                {item.problem_solved}
              </SheetDescription>
            </SheetHeader>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider">Como Monetizar</h4>
                <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                  <p className="text-foreground">{item.monetization_model}</p>
                  <Separator className="my-3" />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Preço Sugerido:</span>
                    <span className="font-bold text-green-500">{item.suggested_price?.replace(/R\$\s*/gi, "$ ").replace(/BRL\s*/gi, "$ ")}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="text-muted-foreground">Potencial:</span>
                    <span className="font-bold">{item.potential_revenue?.replace(/R\$\s*/gi, "$ ").replace(/BRL\s*/gi, "$ ")}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider">Plano do MVP</h4>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-foreground text-sm leading-relaxed">{item.mvp_features}</p>
                  <div className="flex gap-2 mt-4 text-xs">
                    <Badge variant="outline" className="bg-background">⏱️ {item.development_time}</Badge>
                    <Badge variant="outline" className="bg-background">🧠 {item.implementation_difficulty}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider">Validação Social & Canais</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a
                    href={`https://www.reddit.com/search/?q=${encodeURIComponent(item.target_audience || item.saas_name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500/5 p-4 rounded-lg border border-orange-500/10 hover:border-orange-500/30 transition-all block group/reddit"
                  >
                    <div className="flex items-center gap-2 text-orange-500 font-bold mb-2">
                      <Search className="h-5 w-5" />
                      Validação Reddit
                    </div>
                    <div className="text-2xl font-extrabold text-foreground mb-1 group-hover/reddit:text-orange-500 transition-colors">
                      {item.reddit_mentions || 0}
                      <span className="text-xs font-normal text-muted-foreground ml-1 underline decoration-muted-foreground/30 group-hover/reddit:decoration-orange-500">menções ↗</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Representa a quantidade de discussões ativas e manifestações de dores de usuários em subreddits relevantes.
                    </p>
                  </a>

                  <div className="bg-blue-600/5 p-4 rounded-lg border border-blue-600/10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-blue-500 font-bold mb-2">
                        <FacebookIcon className="h-5 w-5" />
                        Validação Facebook
                      </div>
                      <div className="flex flex-col gap-2">
                        <a
                          href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&q=${encodeURIComponent(item.target_audience || item.saas_name)}&media_type=all`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-foreground hover:text-blue-500 transition-colors flex items-center justify-between group/link border-b border-border/20 pb-1"
                        >
                          <span>Anúncios Ativos:</span>
                          <span className="text-blue-500 underline decoration-blue-500/30 group-hover/link:decoration-blue-500">{item.facebook_ads_count || 0} campanhas ↗</span>
                        </a>
                        <a
                          href={`https://www.facebook.com/groups/search/groups/?q=${encodeURIComponent(item.target_audience || item.saas_name)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-bold text-foreground hover:text-indigo-400 transition-colors flex items-center justify-between group/link"
                        >
                          <span>Grupos do Nicho:</span>
                          <span className="text-indigo-400 underline decoration-indigo-400/30 group-hover/link:decoration-indigo-400">{item.facebook_groups_count || 0} ativos ↗</span>
                        </a>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      Presença comercial de anúncios concorrentes e grupos ativos ideais para tráfego orgânico e prospecção.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm text-muted-foreground mb-2 uppercase tracking-wider flex items-center justify-between">
                  Prompts de Construção
                </h4>
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="text-xs font-semibold mb-1 text-purple-500">
                      Para{" "}
                      <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400 transition-colors">ChatGPT</a>
                      {" "}/{" "}
                      <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400 transition-colors">Claude</a>
                      {" "}/{" "}
                      <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-purple-400 transition-colors">Gemini</a>
                      {" "}(Universal)
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-sm text-foreground whitespace-pre-wrap font-mono border border-border/50">
{`Atue como meu CTO e Estrategista de Negócios. Quero construir um SaaS chamado "${item.saas_name}".

📌 CONTEXTO DE NEGÓCIO:
- Problema a resolver: ${item.problem_solved}
- Público-Alvo: ${item.target_audience}
- Diferencial Competitivo: ${item.competitive_advantage}

🛠️ ESCOPO DO MVP:
${item.mvp_features}

💰 MONETIZAÇÃO:
- Modelo: ${item.monetization_model}
- Ticket: ${item.suggested_price}

Por favor, crie um plano de arquitetura técnica detalhado, sugira a stack ideal e me dê o passo a passo prático para começar a desenvolver agora.`}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(`Atue como meu CTO e Estrategista de Negócios. Quero construir um SaaS chamado "${item.saas_name}".\n\n📌 CONTEXTO DE NEGÓCIO:\n- Problema a resolver: ${item.problem_solved}\n- Público-Alvo: ${item.target_audience}\n- Diferencial Competitivo: ${item.competitive_advantage}\n\n🛠️ ESCOPO DO MVP:\n${item.mvp_features}\n\n💰 MONETIZAÇÃO:\n- Modelo: ${item.monetization_model}\n- Ticket: ${item.suggested_price}\n\nPor favor, crie um plano de arquitetura técnica detalhado, sugira a stack ideal e me dê o passo a passo prático para começar a desenvolver agora.`, 'universal')}
                    >
                      {copiedPrompt === 'universal' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="relative group">
                    <div className="text-xs font-semibold mb-1 text-primary">
                      Para{" "}
                      <a href="https://v0.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary/80 transition-colors">Vercel v0</a>
                      {" "}/{" "}
                      <a href="https://lovable.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary/80 transition-colors">Lovable</a>
                      {" "}(Frontend)
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-sm text-foreground whitespace-pre-wrap font-mono border border-border/50">
                      {item.prompt_lovable}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(item.prompt_lovable, 'lovable')}
                    >
                      {copiedPrompt === 'lovable' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="relative group">
                    <div className="text-xs font-semibold mb-1 text-blue-500">
                      Para{" "}
                      <a href="https://bolt.new" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 transition-colors">Bolt.new</a>
                      {" "}/{" "}
                      <a href="https://cursor.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-400 transition-colors">Cursor</a>
                      {" "}(Backend/Fullstack)
                    </div>
                    <pre className="bg-muted p-4 rounded-lg text-sm text-foreground whitespace-pre-wrap font-mono border border-border/50">
                      {item.prompt_bolt}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(item.prompt_bolt, 'bolt')}
                    >
                      {copiedPrompt === 'bolt' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Button 
          variant="outline" 
          className="bg-blue-600/10 text-blue-400 hover:bg-blue-600/20 border-blue-500/20 px-3 h-10 flex items-center gap-2"
          onClick={() => setIsChatOpen(true)}
          title="Falar com o CTO"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline font-semibold">CTO Chat</span>
        </Button>
      </CardFooter>
      <AIChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        contextText={JSON.stringify(item, null, 2)} 
        projectName={item.saas_name} 
      />
    </Card>
  );
}

export function OpportunitiesList({ initialData, hideSearch = false }: { initialData: any[], hideSearch?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState("");

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword) return;

    const activeCountry = searchParams.get("country") || "US";

    setLoading(true);
    try {
      const res = await fetch("/api/radar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword, country: activeCountry }),
      });
      
      if (res.ok) {
        setKeyword("");
        router.refresh(); 
      } else {
        alert("Falha ao analisar a tendência.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar para acionar a IA */}
      {!hideSearch && (
        <Card className="bg-muted/50 border-primary/20">
          <CardContent className="pt-6">
            <form onSubmit={handleScan} className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Ex: Mindful Productivity, Personal Finance, Dieting..." 
                  className="pl-10 h-10"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" disabled={loading || !keyword} className="h-10">
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Analisar Nicho
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-3">
              O algoritmo irá buscar os livros mais lidos sobre o tema, checar o Google Trends, mapear o Reddit e gerar a ideia do SaaS.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lista de Oportunidades */}
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-foreground">Oportunidades</h3>
        <div className="flex items-center gap-1 bg-background/50 p-1 rounded-lg border border-border/50 shadow-sm">
          <button 
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-md transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button 
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col gap-4"}>
        {initialData.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            Nenhuma oportunidade detectada ainda. Use a barra acima para iniciar o radar!
          </div>
        )}

        {initialData.map((item) => (
          <OpportunityCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
