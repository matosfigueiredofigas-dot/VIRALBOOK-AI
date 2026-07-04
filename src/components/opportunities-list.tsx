"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Search, Loader2, Sparkles, Copy, CheckCircle2, TrendingUp, Heart, Share2, FileText, Bell, LayoutGrid, List, MessageSquare, Users, Trash2, Globe, Megaphone, DollarSign, Percent, HelpCircle, X, ChevronDown, ChevronUp, BarChart3, Database, Layers, Crosshair, Presentation, Bot } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

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

interface CollapsibleHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
  badge?: React.ReactNode;
}

function CollapsibleSectionHeader({ title, isOpen, onToggle, icon, badge }: CollapsibleHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 px-4 bg-zinc-900/40 hover:bg-zinc-900/60 border border-white/5 rounded-xl transition-all duration-300 group text-left cursor-pointer"
    >
      <div className="flex items-center gap-2.5">
        <span className="text-muted-foreground group-hover:text-primary transition-colors flex items-center justify-center">
          {icon}
        </span>
        <span className="font-bold text-xs text-zinc-200 tracking-wider uppercase group-hover:text-white transition-colors">
          {title}
        </span>
        {badge}
      </div>
      <div className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
    </button>
  );
}

function ScoreGauge({ score }: { score: number }) {
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "text-green-500" : score >= 60 ? "text-yellow-500" : "text-orange-500";
  const strokeColor = score >= 80 ? "stroke-green-500" : score >= 60 ? "stroke-yellow-500" : "stroke-orange-500";
  
  return (
    <div className="relative flex items-center justify-center w-11 h-11 bg-zinc-950 rounded-full border border-white/5 shadow-[0_0_15px_rgba(0,0,0,0.5)] shrink-0" title={`Score de Viralidade: ${score}`}>
      <svg className="w-11 h-11 transform -rotate-90 absolute">
        <circle cx="22" cy="22" r={radius} className="stroke-white/5" strokeWidth="3" fill="none" />
        <circle cx="22" cy="22" r={radius} className={cn("transition-all duration-1000", strokeColor)} strokeWidth="3" fill="none" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
      </svg>
      <span className={cn("absolute text-[11px] font-bold font-mono tracking-tighter", color)}>{score}</span>
    </div>
  );
}

const getCountryFlag = (code: string) => {
  if (code === 'BR') return '🇧🇷';
  if (code === 'US') return '🇺🇸';
  if (code === 'PT') return '🇵🇹';
  if (code === 'UK' || code === 'GB') return '🇬🇧';
  if (code === 'ES') return '🇪🇸';
  if (code === 'FR') return '🇫🇷';
  if (code === 'DE') return '🇩🇪';
  if (code === 'IN') return '🇮🇳';
  return '🌐';
};

// Sub-componente para isolar os estados individuais (como expandir a sheet)
function OpportunityCard({ item }: { item: any }) {
  const router = useRouter();
  const pathname = usePathname();
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [generatingLP, setGeneratingLP] = useState(false);
  const [redditPainPoints, setRedditPainPoints] = useState<any[]>(item.reddit_pain_points || []);
  const [mappingReddit, setMappingReddit] = useState(false);
  const [marketingKit, setMarketingKit] = useState<any>(item.marketing_kit || {});
  const [generatingKit, setGeneratingKit] = useState(false);
  const [marketingTab, setMarketingTab] = useState<"twitter" | "linkedin" | "tiktok" | "email">("twitter");
  const [copiedMarketing, setCopiedMarketing] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  // Collapsible section states - start collapsed (false) to prevent infinite scrolling
  const [showMonetization, setShowMonetization] = useState(false);
  const [showMvpPlan, setShowMvpPlan] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showRedditPainPoints, setShowRedditPainPoints] = useState(false);
  const [showMarketingKit, setShowMarketingKit] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showGtmRoadmap, setShowGtmRoadmap] = useState(false);
  const [showTechStack, setShowTechStack] = useState(false);
  const [showCompetitors, setShowCompetitors] = useState(false);
  const [showPitchDeck, setShowPitchDeck] = useState(false);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [showCursorRules, setShowCursorRules] = useState(false);
  const [cursorRules, setCursorRules] = useState<string | null>(null);
  const [generatingModule, setGeneratingModule] = useState<string | null>(null);

  const [details, setDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleSheetOpen = async (open: boolean) => {
    setIsSheetOpen(open);
    if (open && !details) {
      setLoadingDetails(true);
      try {
        const res = await fetch(`/api/opportunities/${item.id}`);
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
          setRedditPainPoints(data.reddit_pain_points || []);
          setMarketingKit(data.marketing_kit || {});
          setCalcPrice(parseSuggestedPrice(data.suggested_price));
        }
      } catch (err) {
        console.error("Erro ao carregar detalhes:", err);
      } finally {
        setLoadingDetails(false);
      }
    }
  };

  // States for SaaS Financial Calculator
  const parseSuggestedPrice = (priceStr: string): number => {
    if (!priceStr) return 49;
    const match = priceStr.match(/\d+([.,]\d+)?/);
    if (match) {
      return parseFloat(match[0].replace(',', '.'));
    }
    return 49;
  };

  const [calcPrice, setCalcPrice] = useState<number>(parseSuggestedPrice(item.suggested_price));
  const [calcLeadsTarget, setCalcLeadsTarget] = useState<number>(1000);
  const [calcConversion, setCalcConversion] = useState<number>(2.0);
  const [calcChurn, setCalcChurn] = useState<number>(5.0);

  const generateMrrData = (priceStr: string) => {
    const price = priceStr ? parseFloat(priceStr.match(/\d+([.,]\d+)?/)?.[0]?.replace(',', '.') || '49') : 49;
    const data = [];
    let currentCustomers = 0;
    for (let i = 1; i <= 12; i++) {
      currentCustomers = Math.floor(currentCustomers + (5 * i) + Math.random() * 5);
      data.push({
        month: `Mês ${i}`,
        mrr: Math.floor(currentCustomers * price)
      });
    }
    return data;
  };

  const handleCopyMarketingText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMarketing(id);
    setTimeout(() => setCopiedMarketing(null), 2000);
  };

  const handleGenerateMarketingKit = async () => {
    setGeneratingKit(true);
    try {
      const res = await fetch("/api/opportunities/marketing-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar o Kit de Marketing.");
      }
      setMarketingKit(data.marketingKit || {});
      setShowMarketingKit(true);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao gerar o Kit de Marketing.");
    } finally {
      setGeneratingKit(false);
    }
  };

  const handleGenerateLandingPage = async () => {
    setGeneratingLP(true);
    try {
      const res = await fetch("/api/landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar a Landing Page.");
      }
      alert("Landing Page gerada com sucesso!");
      router.push("/landing-pages");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Ocorreu um erro ao gerar a Landing Page.");
    } finally {
      setGeneratingLP(false);
    }
  };

  const handleGeneratePremiumModule = async (moduleType: 'gtm' | 'tech' | 'competitor' | 'pitch' | 'sql' | 'cursor') => {
    setGeneratingModule(moduleType);
    try {
      const res = await fetch("/api/opportunities/premium-modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: item.id,
          moduleType,
          saasName: item.saas_name,
          problem: item.problem_solved,
          audience: item.target_audience,
          features: item.mvp_features
        }),
      });
      
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao gerar o módulo");
      
      if (moduleType === 'cursor') {
        setCursorRules(json.data);
        setShowCursorRules(true);
        return;
      }
      
      const colMap: any = {
        'gtm': 'gtm_roadmap',
        'tech': 'tech_stack',
        'competitor': 'competitor_analysis',
        'pitch': 'pitch_deck',
        'sql': 'sql_schema'
      };
      
      setDetails((prev: any) => ({ ...prev, [colMap[moduleType]]: json.data }));
      
      // Auto open the generated section
      if (moduleType === 'gtm') setShowGtmRoadmap(true);
      if (moduleType === 'tech') setShowTechStack(true);
      if (moduleType === 'competitor') setShowCompetitors(true);
      if (moduleType === 'pitch') setShowPitchDeck(true);
      if (moduleType === 'sql') setShowSqlSchema(true);
      
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao gerar módulo avançado.");
    } finally {
      setGeneratingModule(null);
    }
  };

  const handleMapRedditPainPoints = async () => {
    setMappingReddit(true);
    try {
      const res = await fetch("/api/opportunities/reddit-pain-points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: item.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao mapear dores.");
      }
      setRedditPainPoints(data.painPoints || []);
      setShowRedditPainPoints(true);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Erro de conexão ao mapear dores.");
    } finally {
      setMappingReddit(false);
    }
  };

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
          <div className="flex items-center gap-3">
            <ScoreGauge score={item.viral_opportunity_score || 0} />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm cursor-help" title={`Alvo: ${item.country}`}>{getCountryFlag(item.country)}</span>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-[9px] h-5 px-1.5 font-bold uppercase tracking-wider">
                  {(() => {
                    const s = item.viral_opportunity_score || 0;
                    if (s >= 95) return "🌟 Unicórnio (>95)";
                    if (s >= 80) return "⭐ Premium (>80)";
                    if (s >= 60) return "👍 Bom (>60)";
                    return "⚠️ Risco";
                  })()}
                </Badge>
              </div>
            </div>
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
              className={`h-8 w-8 ${pathname?.includes('/favorites') ? "text-red-500 hover:bg-red-500/10" : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"}`}
              onClick={async () => {
                const isFavoritePage = pathname?.includes('/favorites');
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
              title={pathname?.includes('/favorites') ? "Remover dos Favoritos" : "Favoritar"}
            >
              <Heart className={`h-4 w-4 ${pathname?.includes('/favorites') ? "fill-red-500 text-red-500" : ""}`} />
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
            href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&q=${encodeURIComponent(item.search_keyword || item.target_audience || item.saas_name)}&media_type=all`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:underline hover:text-blue-600 transition-colors"
            title="Buscar na Biblioteca de Anúncios do Facebook"
          >
            <FacebookIcon className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-blue-600">{item.facebook_ads_count || 0} ads</span>
          </a>
          <a
            href={`https://www.facebook.com/groups/search/groups/?q=${encodeURIComponent(item.search_keyword || item.target_audience || item.saas_name)}`}
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
        <Sheet onOpenChange={handleSheetOpen}>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-purple-600 text-white hover:bg-purple-700 hover:text-white border-none"
                    onClick={handleGenerateLandingPage}
                    disabled={generatingLP}
                  >
                    {generatingLP ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Gerando...
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" /> Gerar Landing Page
                      </>
                    )}
                  </Button>
                </div>
              </SheetTitle>
              <SheetDescription className="text-base text-foreground mt-2">
                {item.problem_solved}
              </SheetDescription>
            </SheetHeader>
            
            {loadingDetails ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Carregando detalhes e prompts...</p>
              </div>
            ) : details ? (
            <div className="space-y-4">
              {/* Como Monetizar */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Como Monetizar"
                  isOpen={showMonetization}
                  onToggle={() => setShowMonetization(!showMonetization)}
                  icon={<DollarSign className="h-4 w-4 text-green-400" />}
                />
                {showMonetization && (
                  <div className="bg-muted/50 p-4 rounded-xl border border-border/50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-foreground text-sm">{details.monetization_model}</p>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Preço Sugerido:</span>
                      <span className="font-bold text-green-500">{details.suggested_price?.replace(/R\$\s*/gi, "$ ").replace(/BRL\s*/gi, "$ ")}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-muted-foreground">Potencial:</span>
                      <span className="font-bold">{details.potential_revenue?.replace(/R\$\s*/gi, "$ ").replace(/BRL\s*/gi, "$ ")}</span>
                    </div>

                    <div className="mt-6">
                      <div className="text-xs font-bold text-zinc-400 mb-4 flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-green-500" /> Projeção de MRR (12 Meses)
                      </div>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={generateMrrData(details.suggested_price)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                            <XAxis dataKey="month" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={10} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickFormatter={(val) => `$${val}`} />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                              itemStyle={{ color: '#22c55e', fontWeight: 'bold' }}
                              formatter={(value) => [`$${value}`, 'MRR']}
                            />
                            <Line type="monotone" dataKey="mrr" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Plano do MVP */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Plano do MVP"
                  isOpen={showMvpPlan}
                  onToggle={() => setShowMvpPlan(!showMvpPlan)}
                  icon={<List className="h-4 w-4 text-blue-400" />}
                />
                {showMvpPlan && (
                  <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <p className="text-foreground text-sm leading-relaxed">{details.mvp_features}</p>
                    <div className="flex gap-2 mt-4 text-xs">
                      <Badge variant="outline" className="bg-background">⏱️ {details.development_time}</Badge>
                      <Badge variant="outline" className="bg-background">🧠 {details.implementation_difficulty}</Badge>
                    </div>
                  </div>
                )}
              </div>

              {/* Plano de Ação GTM (30 Dias) */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Roadmap Go-To-Market (30 Dias)"
                  isOpen={showGtmRoadmap}
                  onToggle={() => setShowGtmRoadmap(!showGtmRoadmap)}
                  icon={<Crosshair className="h-4 w-4 text-orange-400" />}
                />
                {showGtmRoadmap && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {!details?.gtm_roadmap ? (
                      <div className="text-center p-4">
                        <Button 
                          onClick={() => handleGeneratePremiumModule('gtm')} 
                          disabled={generatingModule === 'gtm'}
                          className="bg-orange-600 hover:bg-orange-500 text-white"
                        >
                          {generatingModule === 'gtm' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                          Gerar Roadmap GTM (IA)
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {details.gtm_roadmap.weeks?.map((week: any, i: number) => (
                          <div key={i} className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                            <h4 className="text-sm font-bold text-orange-400 mb-2">Semana {week.week}: {week.focus}</h4>
                            <ul className="list-disc pl-5 text-xs text-zinc-300 space-y-1">
                              {week.actions?.map((action: string, j: number) => <li key={j}>{action}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Tech Stack Sugerida */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Tech Stack Recomendada"
                  isOpen={showTechStack}
                  onToggle={() => setShowTechStack(!showTechStack)}
                  icon={<Layers className="h-4 w-4 text-blue-400" />}
                />
                {showTechStack && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {!details?.tech_stack ? (
                      <div className="text-center p-4">
                        <Button 
                          onClick={() => handleGeneratePremiumModule('tech')} 
                          disabled={generatingModule === 'tech'}
                          className="bg-blue-600 hover:bg-blue-500 text-white"
                        >
                          {generatingModule === 'tech' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Layers className="mr-2 h-4 w-4" />}
                          Descobrir Stack Ideal
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(details.tech_stack).map(([key, tech]: any) => (
                          <div key={key} className="bg-zinc-950/50 p-3 rounded-lg border border-white/5">
                            <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">{key.replace('_', ' ')}</span>
                            <div className="font-bold text-blue-400 text-sm">{tech.name}</div>
                            <div className="text-xs text-zinc-400 mt-1">{tech.reason}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Análise de Concorrentes */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Análise de Concorrentes & Brechas"
                  isOpen={showCompetitors}
                  onToggle={() => setShowCompetitors(!showCompetitors)}
                  icon={<Crosshair className="h-4 w-4 text-red-400" />}
                />
                {showCompetitors && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {!details?.competitor_analysis ? (
                      <div className="text-center p-4">
                        <Button 
                          onClick={() => handleGeneratePremiumModule('competitor')} 
                          disabled={generatingModule === 'competitor'}
                          className="bg-red-600 hover:bg-red-500 text-white"
                        >
                          {generatingModule === 'competitor' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                          Analisar Concorrentes (IA)
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {details.competitor_analysis.competitors?.map((comp: any, i: number) => (
                          <div key={i} className="bg-zinc-950/50 p-3 rounded-lg border border-red-500/10">
                            <div className="font-bold text-red-400 text-sm mb-1">{comp.name}</div>
                            <div className="text-xs text-zinc-300"><strong>Fraqueza:</strong> {comp.weakness}</div>
                            <div className="text-xs text-green-400 mt-1"><strong>Nossa Vantagem:</strong> {comp.our_advantage}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pitch Deck HTML */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Pitch Deck (Apresentação)"
                  isOpen={showPitchDeck}
                  onToggle={() => setShowPitchDeck(!showPitchDeck)}
                  icon={<Presentation className="h-4 w-4 text-indigo-400" />}
                />
                {showPitchDeck && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {!details?.pitch_deck ? (
                      <div className="text-center p-4">
                        <Button 
                          onClick={() => handleGeneratePremiumModule('pitch')} 
                          disabled={generatingModule === 'pitch'}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white"
                        >
                          {generatingModule === 'pitch' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Presentation className="mr-2 h-4 w-4" />}
                          Gerar Slides do Pitch
                        </Button>
                      </div>
                    ) : (
                      <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                        {details.pitch_deck.slides?.map((slide: any, i: number) => (
                          <div key={i} className="min-w-[280px] w-[280px] h-[160px] bg-white text-black p-5 rounded-xl shadow-lg flex flex-col justify-center snap-center shrink-0">
                            <h3 className="font-extrabold text-lg mb-2 text-indigo-900 text-center">{slide.title}</h3>
                            <p className="text-xs text-slate-700 text-center leading-relaxed">{slide.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SQL Schema */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Arquitetura de Banco de Dados (SQL)"
                  isOpen={showSqlSchema}
                  onToggle={() => setShowSqlSchema(!showSqlSchema)}
                  icon={<Database className="h-4 w-4 text-emerald-400" />}
                />
                {showSqlSchema && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {!details?.sql_schema ? (
                      <div className="text-center p-4">
                        <Button 
                          onClick={() => handleGeneratePremiumModule('sql')} 
                          disabled={generatingModule === 'sql'}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white"
                        >
                          {generatingModule === 'sql' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
                          Gerar Tabelas Supabase
                        </Button>
                      </div>
                    ) : (
                      <div className="relative group">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => navigator.clipboard.writeText(details.sql_schema)}
                        >
                          Copiar SQL
                        </Button>
                        <pre className="text-[10px] text-emerald-400 bg-black p-4 rounded-lg overflow-x-auto max-h-[300px]">
                          <code>{details.sql_schema}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Exportação para Cursor AI / V0 */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Exportar Engenharia (Cursor AI)"
                  isOpen={showCursorRules}
                  onToggle={() => setShowCursorRules(!showCursorRules)}
                  icon={<Bot className="h-4 w-4 text-emerald-400" />}
                />
                {showCursorRules && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
                    {!cursorRules ? (
                      <div className="text-center p-4">
                        <Button 
                          onClick={() => handleGeneratePremiumModule('cursor')} 
                          disabled={generatingModule === 'cursor'}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                        >
                          {generatingModule === 'cursor' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
                          Gerar .cursorrules Mágico
                        </Button>
                        <p className="text-xs text-muted-foreground mt-2">
                          Gera as regras exatas de stack, estilos e db para colar no Cursor AI ou v0.dev.
                        </p>
                      </div>
                    ) : (
                      <div className="relative group/sql">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white border-none backdrop-blur-sm z-10"
                          onClick={() => copyToClipboard(typeof cursorRules === 'string' ? cursorRules : JSON.stringify(cursorRules, null, 2), 'cursor')}
                        >
                          {copiedPrompt === 'cursor' ? <CheckCircle2 className="h-4 w-4 mr-1 text-green-400" /> : <Copy className="h-4 w-4 mr-1" />}
                          Copiar Regras
                        </Button>
                        <pre className="text-[10px] text-emerald-400 bg-black p-4 rounded-lg overflow-x-auto max-h-[300px] whitespace-pre-wrap">
                          <code>{typeof cursorRules === 'string' ? cursorRules : JSON.stringify(cursorRules, null, 2)}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Validação Social & Canais */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Validação Social & Canais"
                  isOpen={showValidation}
                  onToggle={() => setShowValidation(!showValidation)}
                  icon={<Globe className="h-4 w-4 text-teal-400" />}
                />
                {showValidation && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <a
                      href={`https://www.reddit.com/search/?q=${encodeURIComponent(details.target_audience || details.saas_name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-500/5 p-4 rounded-xl border border-orange-500/10 hover:border-orange-500/30 transition-all block group/reddit"
                    >
                      <div className="flex items-center gap-2 text-orange-500 font-bold mb-2">
                        <Search className="h-5 w-5" />
                        Validação Reddit
                      </div>
                      <div className="text-2xl font-extrabold text-foreground mb-1 group-hover/reddit:text-orange-500 transition-colors">
                        {details.reddit_mentions || 0}
                        <span className="text-xs font-normal text-muted-foreground ml-1 underline decoration-muted-foreground/30 group-hover/reddit:decoration-orange-500">menções ↗</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Representa a quantidade de discussões ativas e manifestações de dores de usuários em subreddits relevantes.
                      </p>
                    </a>

                    <div className="bg-blue-600/5 p-4 rounded-xl border border-blue-600/10 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-blue-500 font-bold mb-2">
                          <FacebookIcon className="h-5 w-5" />
                          Validação Facebook
                        </div>
                        <div className="flex flex-col gap-2">
                          <a
                            href={`https://www.facebook.com/ads/library/?active_status=all&ad_type=all&q=${encodeURIComponent(details.search_keyword || details.target_audience || details.saas_name)}&media_type=all`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-foreground hover:text-blue-500 transition-colors flex items-center justify-between group/link border-b border-border/20 pb-1"
                          >
                            <span>Anúncios Ativos:</span>
                            <span className="text-blue-500 underline decoration-blue-500/30 group-hover/link:decoration-blue-500">{details.facebook_ads_count || 0} campanhas ↗</span>
                          </a>
                          <a
                            href={`https://www.facebook.com/groups/search/groups/?q=${encodeURIComponent(details.search_keyword || details.target_audience || details.saas_name)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-bold text-foreground hover:text-indigo-400 transition-colors flex items-center justify-between group/link"
                          >
                            <span>Grupos do Nicho:</span>
                            <span className="text-indigo-400 underline decoration-indigo-400/30 group-hover/link:decoration-indigo-400">{details.facebook_groups_count || 0} ativos ↗</span>
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                        Presença comercial de anúncios concorrentes e grupos ativos ideais para tráfego orgânico e prospecção.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Dores Reais do Reddit (Mapeador de IA) */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Dores Reais do Reddit (Mapeador de IA)"
                  isOpen={showRedditPainPoints}
                  onToggle={() => setShowRedditPainPoints(!showRedditPainPoints)}
                  icon={<Search className="h-4 w-4 text-orange-500" />}
                  badge={redditPainPoints.length > 0 && (
                    <Badge variant="secondary" className="bg-orange-500/10 text-orange-400 border-none text-[10px] px-1.5 h-4">
                      {redditPainPoints.length}
                    </Badge>
                  )}
                />
                {showRedditPainPoints && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {redditPainPoints.length === 0 ? (
                      <div className="bg-orange-500/5 p-5 rounded-lg border border-orange-500/10 text-center space-y-4">
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Ainda não mapeado. Deixe a IA analisar as discussões e desabafos dos usuários no Reddit para extrair dores críticas e reais do seu público-alvo.
                        </p>
                        <Button
                          onClick={handleMapRedditPainPoints}
                          disabled={mappingReddit}
                          className="bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl h-10 px-5 text-xs inline-flex items-center gap-2"
                        >
                          {mappingReddit ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Mapeando dores...
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4 text-yellow-300 animate-pulse" /> Mapear Dores Reais (Reddit)
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {redditPainPoints.map((pain: any, index: number) => (
                          <div key={index} className="bg-orange-500/5 border border-orange-500/10 p-5 rounded-xl space-y-3 transition-all hover:border-orange-500/20">
                            <div className="flex justify-between items-start gap-2">
                              <h5 className="font-extrabold text-sm text-white leading-snug">
                                {index + 1}. {pain.pain_point}
                              </h5>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full border-none",
                                  pain.severity >= 4 
                                    ? "bg-red-500/20 text-red-400" 
                                    : pain.severity >= 3 
                                    ? "bg-yellow-500/20 text-yellow-400" 
                                    : "bg-zinc-800 text-zinc-400"
                                )}
                              >
                                Severidade: {pain.severity}/5
                              </Badge>
                            </div>

                            {pain.quotes && pain.quotes.length > 0 && (
                              <div className="space-y-2 border-l-2 border-orange-500/30 pl-3">
                                {pain.quotes.map((quote: string, qIdx: number) => (
                                  <p key={qIdx} className="text-xs text-zinc-400 italic">
                                    &ldquo;{quote}&rdquo;
                                  </p>
                                ))}
                              </div>
                            )}

                            {pain.source_title && (
                              <div className="pt-2.5 text-[10px] text-muted-foreground flex justify-between items-center flex-wrap gap-2 border-t border-white/5">
                                <span className="truncate max-w-[220px]" title={pain.source_title}>
                                  Origem: {pain.source_title}
                                </span>
                                {pain.source_url && (
                                  <a 
                                    href={pain.source_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-orange-400 hover:text-orange-300 hover:underline inline-flex items-center gap-0.5"
                                  >
                                    Ver Discussão ↗
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className="flex justify-end border-t border-white/5 pt-2">
                          <Button
                            onClick={handleMapRedditPainPoints}
                            disabled={mappingReddit}
                            variant="ghost"
                            className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/5 text-xs font-bold"
                          >
                            {mappingReddit ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Remapeando...
                              </>
                            ) : (
                              <>
                                Refazer Análise de IA ↗
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Kit de Lançamento & Marketing (IA) */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Kit de Lançamento & Marketing (IA)"
                  isOpen={showMarketingKit}
                  onToggle={() => setShowMarketingKit(!showMarketingKit)}
                  icon={<Megaphone className="h-4 w-4 text-purple-400" />}
                  badge={marketingKit && Object.keys(marketingKit).length > 0 && (
                    <Badge variant="secondary" className="bg-purple-500/10 text-purple-400 border-none text-[10px] px-1.5 h-4">
                      Pronto
                    </Badge>
                  )}
                />
                {showMarketingKit && (
                  <div className="bg-zinc-900/10 border border-white/5 p-4 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    {!marketingKit || Object.keys(marketingKit).length === 0 ? (
                      <div className="bg-primary/5 p-5 rounded-lg border border-primary/10 text-center space-y-4">
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                          Dificuldade em vender seu SaaS? Deixe a IA gerar copys prontas em formato de thread do Twitter/X, posts profissionais do LinkedIn, roteiros de vídeos para TikTok/Reels e e-mails de vendas frios.
                        </p>
                        <Button
                          onClick={handleGenerateMarketingKit}
                          disabled={generatingKit}
                          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-10 px-5 text-xs inline-flex items-center gap-2"
                        >
                          {generatingKit ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" /> Gerando Kit de Marketing...
                            </>
                          ) : (
                            <>
                              <Megaphone className="h-4 w-4 text-white" /> Gerar Kit de Marketing (IA)
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Tab Selector */}
                        <div className="grid grid-cols-4 p-1 bg-white/5 rounded-xl border border-white/5">
                          {(["twitter", "linkedin", "tiktok", "email"] as const).map((tab) => (
                            <button
                              key={tab}
                              type="button"
                              onClick={() => setMarketingTab(tab)}
                              className={cn(
                                "py-2 rounded-lg text-xxs font-bold uppercase transition-all duration-300 cursor-pointer",
                                marketingTab === tab
                                  ? "bg-primary text-primary-foreground shadow-md"
                                  : "text-muted-foreground hover:text-white"
                              )}
                            >
                              {tab === "twitter" && "Twitter/X"}
                              {tab === "linkedin" && "LinkedIn"}
                              {tab === "tiktok" && "TikTok/Reels"}
                              {tab === "email" && "E-mail"}
                            </button>
                          ))}
                        </div>

                        {/* Content display based on active tab */}
                        <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-xl space-y-3 relative group">
                          
                          {/* Twitter Thread Tab */}
                          {marketingTab === "twitter" && marketingKit.twitter_thread && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-xs font-semibold text-zinc-400">Sequência do Twitter/X (Thread)</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs font-bold text-primary hover:bg-primary/10 h-8"
                                  onClick={() => handleCopyMarketingText(marketingKit.twitter_thread.join("\n\n"), "tw-all")}
                                >
                                  {copiedMarketing === "tw-all" ? "Copiado!" : "Copiar Thread Completa"}
                                </Button>
                              </div>
                              <div className="space-y-3">
                                {marketingKit.twitter_thread.map((tweet: string, idx: number) => (
                                  <div key={idx} className="p-3 bg-zinc-950/40 rounded-lg border border-white/5 relative group/tweet">
                                    <div className="text-xxs text-primary font-bold mb-1">Tweet {idx + 1}/{marketingKit.twitter_thread.length}</div>
                                    <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-wrap">{tweet}</p>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6 absolute top-2.5 right-2.5 opacity-0 group-hover/tweet:opacity-100 transition-opacity"
                                      onClick={() => handleCopyMarketingText(tweet, `tw-${idx}`)}
                                    >
                                      {copiedMarketing === `tw-${idx}` ? <CheckCircle2 className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* LinkedIn Post Tab */}
                          {marketingTab === "linkedin" && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-xs font-semibold text-zinc-400">Postagem Profissional do LinkedIn</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs font-bold text-primary hover:bg-primary/10 h-8"
                                  onClick={() => handleCopyMarketingText(marketingKit.linkedin_post, "li")}
                                >
                                  {copiedMarketing === "li" ? "Copiado!" : "Copiar Texto"}
                                </Button>
                              </div>
                              <div className="p-4 bg-zinc-950/40 rounded-lg border border-white/5 max-h-[350px] overflow-y-auto pr-2">
                                <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-line">{marketingKit.linkedin_post}</p>
                              </div>
                            </div>
                          )}

                          {/* TikTok/Reels Script Tab */}
                          {marketingTab === "tiktok" && marketingKit.tiktok_script && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-xs font-semibold text-zinc-400">Roteiro de Vídeo Curto (TikTok/Reels)</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs font-bold text-primary hover:bg-primary/10 h-8"
                                  onClick={() => {
                                    const fullScript = `HOOK:\n"${marketingKit.tiktok_script.hook}"\n\nSCENES:\n${marketingKit.tiktok_script.scenes.map((s: any, i: number) => `CENA ${i+1}:\nVisual: [${s.visual}]\nFala: "${s.voiceover}"`).join("\n\n")}\n\nCTA:\n"${marketingKit.tiktok_script.cta}"`;
                                    handleCopyMarketingText(fullScript, "tk");
                                  }}
                                >
                                  {copiedMarketing === "tk" ? "Copiado!" : "Copiar Roteiro Completo"}
                                </Button>
                              </div>
                              <div className="space-y-3 text-xs">
                                <div className="p-3 bg-zinc-950/40 rounded-lg border border-white/5">
                                  <span className="font-bold text-red-400 block mb-1">🧲 O GANCHO (Primeiros 3s):</span>
                                  <p className="italic text-zinc-300">&ldquo;{marketingKit.tiktok_script.hook}&rdquo;</p>
                                </div>
                                
                                <div className="space-y-2">
                                  <span className="font-bold text-zinc-400 block">🎬 CENAS & NARRATIVA:</span>
                                  {marketingKit.tiktok_script.scenes.map((scene: any, idx: number) => (
                                    <div key={idx} className="p-3 bg-zinc-950/40 rounded-lg border border-white/5 space-y-1">
                                      <div className="text-[10px] text-zinc-500 uppercase font-bold">Cena {idx + 1}</div>
                                      <div className="text-zinc-500 font-semibold text-xxs">Vídeo: <span className="font-normal text-zinc-400 italic">[{scene.visual}]</span></div>
                                      <div className="text-zinc-200">Áudio (Falar): &ldquo;{scene.voiceover}&rdquo;</div>
                                    </div>
                                  ))}
                                </div>

                                <div className="p-3 bg-zinc-950/40 rounded-lg border border-white/5">
                                  <span className="font-bold text-green-400 block mb-1">📢 CHAMADA PARA AÇÃO (CTA):</span>
                                  <p className="font-semibold text-zinc-300">{marketingKit.tiktok_script.cta}</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Cold Email Tab */}
                          {marketingTab === "email" && (
                            <div className="space-y-4">
                              <div className="flex justify-between items-center pb-2 border-b border-white/5">
                                <span className="text-xs font-semibold text-zinc-400">E-mail de Prospecção Fria</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs font-bold text-primary hover:bg-primary/10 h-8"
                                  onClick={() => handleCopyMarketingText(marketingKit.cold_email, "em")}
                                >
                                  {copiedMarketing === "em" ? "Copiado!" : "Copiar E-mail"}
                                </Button>
                              </div>
                              <div className="p-4 bg-zinc-950/40 rounded-lg border border-white/5 pr-2">
                                <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-line">{marketingKit.cold_email}</p>
                              </div>
                            </div>
                          )}

                        </div>

                        <div className="flex justify-end border-t border-white/5 pt-2">
                          <Button
                            onClick={handleGenerateMarketingKit}
                            disabled={generatingKit}
                            variant="ghost"
                            className="text-primary hover:text-primary-foreground hover:bg-primary/5 text-xs font-bold"
                          >
                            {generatingKit ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Remontando...
                              </>
                            ) : (
                              <>
                                Refazer Copys de IA ↗
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

{/* SaaS Financial Calculator Section */}
                            {/* SaaS Financial Calculator Section */}
              <div className="border-t border-white/5 pt-6 space-y-2">
                <CollapsibleSectionHeader
                  title="Calculadora de Viabilidade Financeira (SaaS)"
                  isOpen={showCalculator}
                  onToggle={() => setShowCalculator(!showCalculator)}
                  icon={<TrendingUp className="h-4 w-4 text-emerald-400" />}
                />
                {showCalculator && (
                  <div className="bg-zinc-900/40 border border-white/5 p-5 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Simule a viabilidade financeira do seu SaaS em tempo real. Altere os parâmetros abaixo para ver as projeções de faturamento e metas de aquisição.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Inputs Column */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wide border-b border-white/5 pb-2">
                        Parâmetros de Simulação
                      </h5>
                      
                      {/* Price input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <label className="text-zinc-400 font-medium flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                            Preço da Assinatura (Mensal)
                          </label>
                          <span className="text-emerald-400 font-bold">${calcPrice}</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={calcPrice}
                            onChange={(e) => setCalcPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                            className="bg-zinc-950/40 border-white/5 text-xs text-white h-8 w-24 shrink-0"
                            min="1"
                          />
                          <input
                            type="range"
                            min="5"
                            max="500"
                            value={calcPrice}
                            onChange={(e) => setCalcPrice(parseInt(e.target.value))}
                            className="flex-1 accent-emerald-500 bg-zinc-950/40 cursor-pointer h-2 rounded-lg my-auto"
                          />
                        </div>
                      </div>

                      {/* Leads / Traffic input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <label className="text-zinc-400 font-medium flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-blue-400" />
                            Tráfego / Leads (Mensal)
                          </label>
                          <span className="text-blue-400 font-bold">{calcLeadsTarget.toLocaleString()} visitantes</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={calcLeadsTarget}
                            onChange={(e) => setCalcLeadsTarget(Math.max(100, parseInt(e.target.value) || 0))}
                            className="bg-zinc-950/40 border-white/5 text-xs text-white h-8 w-24 shrink-0"
                            min="100"
                          />
                          <input
                            type="range"
                            min="100"
                            max="50000"
                            step="100"
                            value={calcLeadsTarget}
                            onChange={(e) => setCalcLeadsTarget(parseInt(e.target.value))}
                            className="flex-1 accent-blue-500 bg-zinc-950/40 cursor-pointer h-2 rounded-lg my-auto"
                          />
                        </div>
                      </div>

                      {/* Conversion input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <label className="text-zinc-400 font-medium flex items-center gap-1">
                            <Percent className="h-3.5 w-3.5 text-purple-400" />
                            Taxa de Conversão
                          </label>
                          <span className="text-purple-400 font-bold">{calcConversion}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.1"
                            value={calcConversion}
                            onChange={(e) => setCalcConversion(Math.max(0.1, parseFloat(e.target.value) || 0))}
                            className="bg-zinc-950/40 border-white/5 text-xs text-white h-8 w-24 shrink-0"
                            min="0.1"
                            max="100"
                          />
                          <input
                            type="range"
                            min="0.1"
                            max="10"
                            step="0.1"
                            value={calcConversion}
                            onChange={(e) => setCalcConversion(parseFloat(e.target.value))}
                            className="flex-1 accent-purple-500 bg-zinc-950/40 cursor-pointer h-2 rounded-lg my-auto"
                          />
                        </div>
                      </div>

                      {/* Churn rate input */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <label className="text-zinc-400 font-medium flex items-center gap-1">
                            <HelpCircle className="h-3.5 w-3.5 text-red-400" />
                            Taxa de Churn (Cancelamento Mensal)
                          </label>
                          <span className="text-red-400 font-bold">{calcChurn}%</span>
                        </div>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            step="0.5"
                            value={calcChurn}
                            onChange={(e) => setCalcChurn(Math.max(0, parseFloat(e.target.value) || 0))}
                            className="bg-zinc-950/40 border-white/5 text-xs text-white h-8 w-24 shrink-0"
                            min="0"
                            max="100"
                          />
                          <input
                            type="range"
                            min="0"
                            max="25"
                            step="0.5"
                            value={calcChurn}
                            onChange={(e) => setCalcChurn(parseFloat(e.target.value))}
                            className="flex-1 accent-red-500 bg-zinc-950/40 cursor-pointer h-2 rounded-lg my-auto"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Projections Column */}
                    <div className="space-y-4">
                      <h5 className="text-xs font-bold text-zinc-300 uppercase tracking-wide border-b border-white/5 pb-2">
                        Métricas de Viabilidade & Prospecção
                      </h5>

                      {/* Metrics cards grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-zinc-950/40 rounded-lg border border-white/5 space-y-1">
                          <span className="text-[10px] text-zinc-400 font-medium block">Novos Clientes/Mês</span>
                          <span className="text-base font-bold text-blue-400">
                            {Math.round(calcLeadsTarget * (calcConversion / 100))}
                          </span>
                        </div>

                        <div className="p-3 bg-zinc-950/40 rounded-lg border border-white/5 space-y-1">
                          <span className="text-[10px] text-zinc-400 font-medium block">Lifetime Value (LTV)</span>
                          <span className="text-base font-bold text-emerald-400">
                            ${calcChurn > 0 ? Math.round(calcPrice / (calcChurn / 100)) : calcPrice * 100}
                          </span>
                        </div>
                      </div>

                      {/* 12-Month Projected MRR Card */}
                      <div className="p-4 bg-zinc-950/40 rounded-lg border border-emerald-500/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -mr-8 -mt-8" />
                        <span className="text-[10px] text-zinc-400 font-medium block">Receita Recorrente Projetada (12 Meses)</span>
                        <div className="flex items-baseline gap-1 mt-1">
                          <span className="text-2xl font-extrabold text-white">
                            ${(() => {
                              const newCustomers = calcLeadsTarget * (calcConversion / 100);
                              const churnRate = calcChurn / 100;
                              let totalCustomers = 0;
                              if (churnRate > 0) {
                                totalCustomers = newCustomers * ((1 - Math.pow(1 - churnRate, 12)) / churnRate);
                              } else {
                                totalCustomers = newCustomers * 12;
                              }
                              return Math.round(totalCustomers * calcPrice).toLocaleString();
                            })()}
                          </span>
                          <span className="text-xs text-emerald-400 font-semibold">/mês (MRR)</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">
                          Baseado em adquirir novos clientes mensalmente com retenção composta.
                        </p>
                      </div>

                      {/* Financial Goals / Targets list */}
                      <div className="space-y-2">
                        <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Clientes Necessários por Meta:</span>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center p-2 bg-zinc-950/20 rounded border border-white/5">
                            <span className="text-zinc-400">Meta $1k/mês:</span>
                            <span className="font-bold text-white">{Math.ceil(1000 / calcPrice)} clientes</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-zinc-950/20 rounded border border-white/5">
                            <span className="text-zinc-400">Meta $5k/mês:</span>
                            <span className="font-bold text-white">{Math.ceil(5000 / calcPrice)} clientes</span>
                          </div>
                          <div className="flex justify-between items-center p-2 bg-zinc-950/20 rounded border border-white/5">
                            <span className="text-zinc-400">Meta $10k/mês:</span>
                            <span className="font-bold text-white">{Math.ceil(10000 / calcPrice)} clientes</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>

              {/* Prompts de Construção */}
              <div className="space-y-2">
                <CollapsibleSectionHeader
                  title="Prompts de Construção"
                  isOpen={showPrompts}
                  onToggle={() => setShowPrompts(!showPrompts)}
                  icon={<Sparkles className="h-4 w-4 text-yellow-300" />}
                />
                {showPrompts && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
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
{`Atue como meu CTO e Estrategista de Negócios. Quero construir um SaaS chamado "${details.saas_name}".

📌 CONTEXTO DE NEGÓCIO:
- Problema a resolver: ${details.problem_solved}
- Público-Alvo: ${details.target_audience}
- Diferencial Competitivo: ${details.competitive_advantage}

🛠️ ESCOPO DO MVP:
${details.mvp_features}

💰 MONETIZAÇÃO:
- Modelo: ${details.monetization_model}
- Ticket: ${details.suggested_price}

Por favor, crie um plano de arquitetura técnica detalhado, sugira a stack ideal e me dê o passo a passo prático para começar a desenvolver agora.`}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(`Atue como meu CTO e Estrategista de Negócios. Quero construir um SaaS chamado "${details.saas_name}".\n\n📌 CONTEXTO DE NEGÓCIO:\n- Problema a resolver: ${details.problem_solved}\n- Público-Alvo: ${details.target_audience}\n- Diferencial Competitivo: ${details.competitive_advantage}\n\n🛠️ ESCOPO DO MVP:\n${details.mvp_features}\n\n💰 MONETIZAÇÃO:\n- Modelo: ${details.monetization_model}\n- Ticket: ${details.suggested_price}\n\nPor favor, crie um plano de arquitetura técnica detalhado, sugira a stack ideal e me dê o passo a passo prático para começar a desenvolver agora.`, 'universal')}
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
                      {details.prompt_lovable}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(details.prompt_lovable, 'lovable')}
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
                      {details.prompt_bolt}
                    </pre>
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="absolute top-8 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => copyToClipboard(details.prompt_bolt, 'bolt')}
                    >
                      {copiedPrompt === 'bolt' ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
            ) : (
              <div className="text-center py-20 text-muted-foreground flex flex-col items-center justify-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm font-medium">Carregando detalhes...</p>
              </div>
            )}
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
        showLeft={isSheetOpen && !isExpanded}
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

    const activeCountry = searchParams.get("country") || "ALL";

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
