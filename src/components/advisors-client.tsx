"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  Loader2, Sparkles, Users, UserCheck, AlertTriangle, Lightbulb, TrendingUp, CheckCircle,
  Smartphone, Code, Laptop, Brain, Rocket, Sparkles as BotSparkles, Users as Network, Package,
  Volume2, Send, MessageSquare, ShieldAlert
} from "lucide-react";
import { useRouter } from "next/navigation";
import { MarketMarquee } from "@/components/market-marquee";

// --- TYPEWRITER COMPONENT ---
function TypewriterText({ text, speed = 15, onComplete }: { text: string, speed?: number, onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span>{displayedText}</span>;
}

// --- MAIN COMPONENT ---
interface Advisor {
  name: string;
  avatar_style: string;
  role: string;
  verdict: string;
  critical_review: string;
  actionable_advice: string;
}

interface AdvisorAdvice {
  board_score: number;
  verdict_summary: string;
  advisors: Advisor[];
}

interface Opportunity {
  id: string;
  saas_name: string;
  target_audience: string;
  problem_solved: string;
  book_title: string;
  advisor_advice: AdvisorAdvice | null;
}

export function AdvisorsClient({ initialOpportunities, initialSelectedId }: { initialOpportunities: Opportunity[], initialSelectedId?: string }) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const validInitialId = initialSelectedId && initialOpportunities.some(o => o.id === initialSelectedId) ? initialSelectedId : initialOpportunities[0]?.id || "";
  const [selectedId, setSelectedId] = useState<string>(validInitialId);
  const [generating, setGenerating] = useState<boolean>(false);
  const [activeAdvisorIdx, setActiveAdvisorIdx] = useState<number>(0);
  
  // TTS State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  
  // Chat State
  const [chatMessage, setChatMessage] = useState("");
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatHistory, setChatHistory] = useState<Record<number, { role: 'user' | 'assistant', content: string }[]>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  const selectedOpp = opportunities.find(opp => opp.id === selectedId);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, activeAdvisorIdx]);

  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [activeAdvisorIdx]);

  const handleGenerate = async () => {
    if (!selectedId) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/opportunities/advisors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao reunir o conselho.");
      }

      const updatedOpps = opportunities.map(opp => {
        if (opp.id === selectedId) {
          return { ...opp, advisor_advice: data.advisorAdvice };
        }
        return opp;
      });
      setOpportunities(updatedOpps);
      setActiveAdvisorIdx(0);
      setChatHistory({});
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Erro ao consultar o conselho de mentores.");
    } finally {
      setGenerating(false);
    }
  };

  const playAudio = (text: string) => {
    if (!window.speechSynthesis) {
      alert("Seu navegador não suporta síntese de voz.");
      return;
    }
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim() || !selectedOpp?.advisor_advice) return;
    
    const advisor = selectedOpp.advisor_advice.advisors[activeAdvisorIdx];
    const currentHist = chatHistory[activeAdvisorIdx] || [];
    
    const newHist = [...currentHist, { role: 'user' as const, content: chatMessage }];
    setChatHistory(prev => ({ ...prev, [activeAdvisorIdx]: newHist }));
    const msgToSend = chatMessage;
    setChatMessage("");
    setIsSendingChat(true);

    try {
      const res = await fetch("/api/opportunities/advisors/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          opportunityId: selectedId,
          advisorName: advisor.name,
          advisorRole: advisor.role,
          message: msgToSend
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setChatHistory(prev => ({
        ...prev,
        [activeAdvisorIdx]: [...newHist, { role: 'assistant', content: data.reply }]
      }));
    } catch (err: any) {
      alert(err.message || "Erro ao enviar mensagem.");
      setChatHistory(prev => ({ ...prev, [activeAdvisorIdx]: currentHist }));
      setChatMessage(msgToSend);
    } finally {
      setIsSendingChat(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]";
    return "text-red-400 bg-red-500/10 border-red-500/20 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]";
  };

  const getAdvisorTheme = (style: string) => {
    switch (style) {
      case "pg":
        return {
          icon: Code,
          bg: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
          text: "text-amber-400",
          activeBg: "bg-amber-500/20 border-amber-500 text-white",
          dot: "bg-amber-400 shadow-[0_0_5px_rgba(251,191,36,1)]",
          glow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
          avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/30"
        };
      case "jobs":
        return {
          icon: Smartphone,
          bg: "bg-zinc-800/10 border-zinc-700/30 hover:border-zinc-500/50",
          text: "text-zinc-200",
          activeBg: "bg-zinc-800/50 border-white text-white",
          dot: "bg-white shadow-[0_0_5px_rgba(255,255,255,1)]",
          glow: "shadow-[0_0_20px_rgba(255,255,255,0.1)]",
          avatarBg: "bg-zinc-800 border-zinc-700 text-zinc-100"
        };
      case "levels":
        return {
          icon: Laptop,
          bg: "bg-fuchsia-500/5 border-fuchsia-500/20 hover:border-fuchsia-500/40",
          text: "text-fuchsia-400",
          activeBg: "bg-fuchsia-500/20 border-fuchsia-500 text-white",
          dot: "bg-fuchsia-400 shadow-[0_0_5px_rgba(232,121,249,1)]",
          glow: "shadow-[0_0_20px_rgba(217,70,239,0.2)]",
          avatarBg: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30"
        };
      case "naval":
        return {
          icon: Brain,
          bg: "bg-teal-500/5 border-teal-500/20 hover:border-teal-500/40",
          text: "text-teal-400",
          activeBg: "bg-teal-500/20 border-teal-500 text-white",
          dot: "bg-teal-400 shadow-[0_0_5px_rgba(45,212,191,1)]",
          glow: "shadow-[0_0_20px_rgba(20,184,166,0.2)]",
          avatarBg: "bg-teal-500/20 text-teal-300 border-teal-500/30"
        };
      case "musk":
        return {
          icon: Rocket,
          bg: "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40",
          text: "text-rose-400",
          activeBg: "bg-rose-500/20 border-rose-500 text-white",
          dot: "bg-rose-400 shadow-[0_0_5px_rgba(251,113,133,1)]",
          glow: "shadow-[0_0_20px_rgba(244,63,94,0.2)]",
          avatarBg: "bg-rose-500/20 text-rose-300 border-rose-500/30"
        };
      case "altman":
        return {
          icon: BotSparkles,
          bg: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
          text: "text-emerald-400",
          activeBg: "bg-emerald-500/20 border-emerald-500 text-white",
          dot: "bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,1)]",
          glow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
          avatarBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        };
      case "zuck":
        return {
          icon: Network,
          bg: "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
          text: "text-blue-400",
          activeBg: "bg-blue-500/20 border-blue-500 text-white",
          dot: "bg-blue-400 shadow-[0_0_5px_rgba(96,165,250,1)]",
          glow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
          avatarBg: "bg-blue-500/20 text-blue-300 border-blue-500/30"
        };
      case "bezos":
        return {
          icon: Package,
          bg: "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40",
          text: "text-orange-400",
          activeBg: "bg-orange-500/20 border-orange-500 text-white",
          dot: "bg-orange-400 shadow-[0_0_5px_rgba(251,146,60,1)]",
          glow: "shadow-[0_0_20px_rgba(249,115,22,0.2)]",
          avatarBg: "bg-orange-500/20 text-orange-300 border-orange-500/30"
        };
      default:
        return {
          icon: Users,
          bg: "bg-primary/5 border-primary/20",
          text: "text-primary",
          activeBg: "bg-primary/20 border-primary text-white",
          dot: "bg-primary shadow-[0_0_5px_rgba(var(--primary),1)]",
          glow: "shadow-[0_0_20px_rgba(var(--primary),0.2)]",
          avatarBg: "bg-primary/20 text-primary-foreground border-primary/30"
        };
    }
  };

  if (opportunities.length === 0) {
    return (
      <Card className="glass-card border-primary/20 max-w-2xl mx-auto mt-8 text-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <CardHeader className="flex flex-col items-center justify-center space-y-6 relative z-10">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] border border-primary/30">
            <Users className="h-10 w-10 animate-bounce" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-white">Nenhum Micro-SaaS Encontrado</CardTitle>
          <CardDescription className="max-w-md mx-auto leading-relaxed text-zinc-400 text-base">
            Para consultar os Conselheiros Holográficos, você precisa ter salvo pelo menos um micro-SaaS a partir da Biblioteca de Ideias ou do Radar.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-6 relative z-10">
          <Button onClick={() => router.push("/library")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-105 text-lg">
            Acessar Banco de Ideias
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Ticker Global */}
      <MarketMarquee opportunities={opportunities} />

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-indigo-600 rounded-lg blur opacity-25"></div>
        <div className="relative bg-zinc-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 uppercase">
            <ShieldAlert className="h-10 w-10 text-teal-400" />
            Board of Advisors
          </h1>
          <p className="text-lg text-zinc-400 font-medium">Conselho Holográfico de Especialistas Virtuais</p>
        </div>
      </div>

      {/* Seletor do SaaS & Chamada */}
      <Card className="glass-card border-teal-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.8)]" />
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            
            <div className="space-y-3 flex-grow max-w-3xl">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Users className="h-4 w-4 text-teal-500" /> Qual SaaS apresentar ao Conselho?
              </label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setActiveAdvisorIdx(0);
                }}
                className="w-full h-12 px-4 bg-zinc-900 border border-white/10 rounded-xl text-sm font-semibold focus:outline-none focus:border-teal-500 transition-colors text-white shadow-inner"
              >
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id} className="bg-zinc-950 text-white font-medium">
                    {opp.saas_name} (Inspirado em: {opp.book_title})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl h-12 px-8 flex items-center gap-3 shrink-0 shadow-[0_0_20px_rgba(13,148,136,0.4)] transition-all hover:scale-105"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Convocando Avatares...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-teal-200 animate-pulse" />
                  {selectedOpp?.advisor_advice ? "Convocar Novamente" : "Reunir Conselho (IA)"}
                </>
              )}
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* Conselho Ativo */}
      {!selectedOpp?.advisor_advice ? (
        <Card className="border border-dashed border-white/10 bg-zinc-950/40 p-16 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <CardContent className="space-y-6 relative z-10">
            <div className="h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-600 shadow-inner group-hover:text-teal-400 group-hover:border-teal-500/30 transition-colors">
              <UserCheck className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-black text-xl text-white mb-2">Sala de Reuniões Virtual</h3>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                Os mentores holográficos aguardam a convocação para dissecar o MVP de <strong className="text-white bg-white/5 px-2 py-0.5 rounded">{selectedOpp?.saas_name}</strong>.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          
          {/* Placar Geral do Conselho */}
          <Card className="glass-card border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl -z-10 -mr-20 -mt-20" />
            <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
              
              <div className="flex items-center gap-6">
                <div className={cn(
                  "h-24 w-24 rounded-full flex flex-col items-center justify-center font-black text-3xl border-2 shrink-0 backdrop-blur-md",
                  getScoreColor(selectedOpp.advisor_advice.board_score)
                )}>
                  {selectedOpp.advisor_advice.board_score}
                  <span className="text-[9px] uppercase tracking-widest font-bold text-white/70 mt-1">Score</span>
                </div>
                
                <div className="space-y-2 max-w-2xl">
                  <span className="text-[10px] font-black uppercase text-teal-400 tracking-widest flex items-center gap-1.5 bg-teal-500/10 px-2 py-1 rounded w-fit border border-teal-500/20">
                    <TrendingUp className="h-3 w-3" /> Veredito Consolidado
                  </span>
                  <p className="text-xl font-bold text-white leading-relaxed">
                    &ldquo;{selectedOpp.advisor_advice.verdict_summary}&rdquo;
                  </p>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Grid de Seleção de Advisors e Detalhes */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start">
            
            {/* Abas dos Advisors */}
            <div className="space-y-4 xl:col-span-1 sticky top-6">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 flex items-center gap-2">
                <Network className="h-3.5 w-3.5 text-primary" /> Holo-Mentores
              </span>
              <div className="grid grid-cols-2 xl:grid-cols-1 gap-3">
                {selectedOpp.advisor_advice.advisors.map((advisor, idx) => {
                  const theme = getAdvisorTheme(advisor.avatar_style);
                  const isActive = activeAdvisorIdx === idx;
                  const Icon = theme.icon;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveAdvisorIdx(idx)}
                      className={cn(
                         "p-4 rounded-xl border text-left flex items-center gap-4 transition-all duration-300 relative group overflow-hidden",
                        isActive ? theme.activeBg + " " + theme.glow : theme.bg
                      )}
                    >
                      <div className={cn(
                        "h-10 w-10 rounded-full border flex items-center justify-center shrink-0 shadow-inner",
                        theme.avatarBg
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      
                      <div className="truncate pr-4 relative z-10">
                        <h4 className="font-black text-[13px] text-white leading-snug">{advisor.name}</h4>
                        <p className={cn("text-[10px] font-medium truncate", isActive ? "text-white/80" : "text-zinc-500")}>{advisor.role}</p>
                      </div>

                      {isActive && (
                        <div className={cn("absolute right-4 h-2.5 w-2.5 rounded-full animate-pulse", theme.dot)} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sabatina do Advisor Ativo */}
            <div className="xl:col-span-3">
              {(() => {
                const advisor = selectedOpp.advisor_advice!.advisors[activeAdvisorIdx];
                const theme = getAdvisorTheme(advisor.avatar_style);
                const Icon = theme.icon;
                const activeChat = chatHistory[activeAdvisorIdx] || [];
                
                return (
                  <Card className={cn("glass-card overflow-hidden flex flex-col relative", theme.glow, `border-${theme.text.split('-')[1]}-500/30`)}>
                    {/* Efeito Neon de fundo holográfico */}
                    <div className={cn("absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-10 pointer-events-none -mr-40 -mt-40", theme.text.replace('text', 'bg'))} />

                    <CardHeader className="border-b border-white/5 pb-6 pt-6 flex flex-row items-center justify-between flex-wrap gap-4 bg-zinc-900/60 backdrop-blur-xl relative z-10">
                      
                      <div className="flex items-center gap-5">
                        <div className={cn(
                          "h-16 w-16 rounded-full border-2 flex items-center justify-center shadow-2xl relative",
                          theme.avatarBg
                        )}>
                          <div className={cn("absolute inset-0 rounded-full border border-white/50 animate-ping opacity-20", theme.dot.replace('bg', 'border'))}></div>
                          <Icon className="h-8 w-8 relative z-10" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-black text-white">{advisor.name}</CardTitle>
                          <CardDescription className={cn("text-xs font-bold tracking-wider uppercase mt-1", theme.text)}>{advisor.role}</CardDescription>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => playAudio(advisor.critical_review)}
                          className={cn(
                            "h-10 text-xs font-bold transition-all border-white/10 hover:border-white/20 hover:bg-white/5 px-4",
                            isPlayingAudio ? "text-primary border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]" : "text-zinc-300 bg-zinc-950"
                          )}
                        >
                          <Volume2 className={cn("h-4 w-4 mr-2", isPlayingAudio && "animate-pulse")} />
                          {isPlayingAudio ? "Ouvindo Sintetizador..." : "Ouvir Audio Holográfico"}
                        </Button>
                        <span className="text-[11px] font-black uppercase tracking-widest bg-zinc-950 border border-white/10 text-zinc-300 px-4 py-2.5 rounded-lg shadow-inner flex items-center gap-2">
                          Veredito: <span className={cn(theme.text, "drop-shadow-md")}>{advisor.verdict}</span>
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-8 space-y-8 flex-grow relative z-10">
                      
                      {/* Crítica Severa (Typewriter) */}
                      <div className="space-y-3 group">
                        <span className="text-[10px] font-black text-red-400/90 uppercase tracking-widest flex items-center gap-2 bg-red-500/10 px-2.5 py-1 rounded w-fit border border-red-500/20">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-500 animate-pulse" /> Sabatina Crítica
                        </span>
                        <div className="p-6 bg-red-500/5 rounded-2xl border border-red-500/10 text-[15px] text-zinc-300 leading-relaxed italic whitespace-pre-line min-h-[100px] shadow-inner group-hover:border-red-500/20 transition-colors">
                          <span className="text-red-500 font-serif text-2xl leading-none">&ldquo;</span>
                          <TypewriterText text={advisor.critical_review} speed={12} />
                          <span className="text-red-500 font-serif text-2xl leading-none">&rdquo;</span>
                        </div>
                      </div>

                      {/* Conselho Prático */}
                      <div className="space-y-3 group">
                        <span className="text-[10px] font-black text-emerald-400/90 uppercase tracking-widest flex items-center gap-2 bg-emerald-500/10 px-2.5 py-1 rounded w-fit border border-emerald-500/20">
                          <Lightbulb className="h-3.5 w-3.5 text-emerald-500" /> Plano de Ação Direto
                        </span>
                        <div className="p-6 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 text-[15px] text-zinc-300 leading-relaxed whitespace-pre-line flex items-start gap-4 shadow-inner group-hover:border-emerald-500/20 transition-colors">
                          <div className="bg-emerald-500/20 p-2 rounded-full border border-emerald-500/30 shrink-0">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                          </div>
                          <div className="pt-0.5">
                            <span className="font-black text-white block mb-2 uppercase tracking-wide text-xs">Instrução Tática:</span>
                            <TypewriterText text={advisor.actionable_advice} speed={8} />
                          </div>
                        </div>
                      </div>
                      
                      {/* Área de Chat Interativo */}
                      <div className="pt-8 border-t border-white/5">
                        <span className="text-[10px] font-black text-blue-400/90 uppercase tracking-widest flex items-center gap-2 mb-6 bg-blue-500/10 px-2.5 py-1 rounded w-fit border border-blue-500/20">
                          <MessageSquare className="h-3.5 w-3.5 text-blue-500" /> Interface de Comunicação com {advisor.name.split(' ')[0]}
                        </span>
                        
                        {activeChat.length > 0 && (
                          <div className="space-y-6 mb-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                            {activeChat.map((msg, i) => (
                              <div key={i} className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                <div className={cn(
                                  "max-w-[85%] rounded-2xl px-5 py-4 text-[15px] leading-relaxed shadow-lg",
                                  msg.role === 'user' 
                                    ? "bg-blue-600 text-white rounded-br-sm font-medium" 
                                    : cn("bg-zinc-900/80 text-zinc-300 rounded-bl-sm border border-white/10 backdrop-blur-md", theme.glow)
                                )}>
                                  {msg.role === 'assistant' ? <TypewriterText text={msg.content} speed={10} /> : msg.content}
                                </div>
                              </div>
                            ))}
                            {isSendingChat && (
                              <div className="flex justify-start">
                                <div className="bg-zinc-900/80 text-zinc-400 border border-white/10 max-w-[85%] rounded-2xl rounded-bl-sm px-5 py-4 text-[15px] flex items-center gap-3 backdrop-blur-md">
                                  <Loader2 className="h-5 w-5 animate-spin text-zinc-500" /> 
                                  <span className="font-medium">{advisor.name.split(' ')[0]} está processando a resposta...</span>
                                </div>
                              </div>
                            )}
                            <div ref={chatEndRef} />
                          </div>
                        )}

                        <form 
                          onSubmit={(e) => { e.preventDefault(); handleSendChat(); }}
                          className="flex gap-3 relative"
                        >
                          <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder={`Argumente com ${advisor.name.split(' ')[0]}...`}
                            className="flex-1 bg-zinc-950/80 backdrop-blur-md border border-white/10 rounded-xl px-5 text-[15px] text-white focus:outline-none focus:border-blue-500 transition-colors h-14 shadow-inner"
                            disabled={isSendingChat}
                          />
                          <Button 
                            type="submit" 
                            disabled={!chatMessage.trim() || isSendingChat}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl px-6 h-14 shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
                          >
                            <Send className="h-5 w-5" />
                          </Button>
                        </form>
                      </div>

                    </CardContent>
                  </Card>
                );
              })()}
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
