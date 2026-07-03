"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, Users, UserCheck, MessageSquare, AlertTriangle, Lightbulb, TrendingUp, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

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

  const selectedOpp = opportunities.find(opp => opp.id === selectedId);

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

      // Atualizar lista local com os conselhos
      const updatedOpps = opportunities.map(opp => {
        if (opp.id === selectedId) {
          return { ...opp, advisor_advice: data.advisorAdvice };
        }
        return opp;
      });
      setOpportunities(updatedOpps);
      setActiveAdvisorIdx(0);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Erro ao consultar o conselho de mentores.");
    } finally {
      setGenerating(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (score >= 60) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-red-400 bg-red-500/10 border-red-500/20";
  };

  const getAdvisorTheme = (style: string) => {
    switch (style) {
      case "pg":
        return {
          bg: "bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40",
          text: "text-amber-400",
          activeBg: "bg-amber-500/10 border-amber-500 text-white",
          dot: "bg-amber-400",
          glow: "shadow-[0_0_15px_rgba(245,158,11,0.15)]",
          avatarBg: "bg-amber-500/20 text-amber-300 border-amber-500/30"
        };
      case "jobs":
        return {
          bg: "bg-zinc-800/10 border-zinc-700/30 hover:border-zinc-500/50",
          text: "text-zinc-200",
          activeBg: "bg-zinc-800/50 border-white text-white",
          dot: "bg-white",
          glow: "shadow-[0_0_15px_rgba(255,255,255,0.1)]",
          avatarBg: "bg-zinc-800 border-zinc-700 text-zinc-100"
        };
      case "levels":
        return {
          bg: "bg-fuchsia-500/5 border-fuchsia-500/20 hover:border-fuchsia-500/40",
          text: "text-fuchsia-400",
          activeBg: "bg-fuchsia-500/10 border-fuchsia-500 text-white",
          dot: "bg-fuchsia-400",
          glow: "shadow-[0_0_15px_rgba(217,70,239,0.15)]",
          avatarBg: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30"
        };
      case "naval":
        return {
          bg: "bg-teal-500/5 border-teal-500/20 hover:border-teal-500/40",
          text: "text-teal-400",
          activeBg: "bg-teal-500/10 border-teal-500 text-white",
          dot: "bg-teal-400",
          glow: "shadow-[0_0_15px_rgba(20,184,166,0.15)]",
          avatarBg: "bg-teal-500/20 text-teal-300 border-teal-500/30"
        };
      case "musk":
        return {
          bg: "bg-rose-500/5 border-rose-500/20 hover:border-rose-500/40",
          text: "text-rose-400",
          activeBg: "bg-rose-500/10 border-rose-500 text-white",
          dot: "bg-rose-400",
          glow: "shadow-[0_0_15px_rgba(244,63,94,0.15)]",
          avatarBg: "bg-rose-500/20 text-rose-300 border-rose-500/30"
        };
      case "altman":
        return {
          bg: "bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/40",
          text: "text-emerald-400",
          activeBg: "bg-emerald-500/10 border-emerald-500 text-white",
          dot: "bg-emerald-400",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
          avatarBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        };
      case "zuck":
        return {
          bg: "bg-blue-500/5 border-blue-500/20 hover:border-blue-500/40",
          text: "text-blue-400",
          activeBg: "bg-blue-500/10 border-blue-500 text-white",
          dot: "bg-blue-400",
          glow: "shadow-[0_0_15px_rgba(59,130,246,0.15)]",
          avatarBg: "bg-blue-500/20 text-blue-300 border-blue-500/30"
        };
      case "bezos":
        return {
          bg: "bg-orange-500/5 border-orange-500/20 hover:border-orange-500/40",
          text: "text-orange-400",
          activeBg: "bg-orange-500/10 border-orange-500 text-white",
          dot: "bg-orange-400",
          glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]",
          avatarBg: "bg-orange-500/20 text-orange-300 border-orange-500/30"
        };
      default:
        return {
          bg: "bg-primary/5 border-primary/20",
          text: "text-primary",
          activeBg: "bg-primary/10 border-primary text-white",
          dot: "bg-primary",
          glow: "shadow-none",
          avatarBg: "bg-primary/20 text-primary-foreground"
        };
    }
  };

  if (opportunities.length === 0) {
    return (
      <Card className="border border-border bg-card/40 backdrop-blur-xl max-w-2xl mx-auto mt-8 text-center p-8">
        <CardHeader className="flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Users className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold">Nenhum SaaS Criado</CardTitle>
          <CardDescription className="max-w-md mx-auto leading-relaxed">
            Para consultar o conselho de mentores, você precisa ter salvo pelo menos um micro-SaaS a partir da Biblioteca de Ideias ou do Radar de Ebooks.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-4">
          <Button onClick={() => router.push("/library")} className="bg-gradient-to-r from-primary to-blue-600 font-bold px-6 py-2 rounded-xl">
            Descobrir Ideias na Biblioteca
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Seletor do SaaS & Chamada */}
      <Card className="border border-border/50 bg-card/30 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            <div className="space-y-2 flex-grow max-w-2xl">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Escolha o Micro-SaaS para a sabatina
              </label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setActiveAdvisorIdx(0);
                }}
                className="w-full h-11 px-3 bg-zinc-900/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-white"
              >
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id} className="bg-zinc-950 text-white">
                    {opp.saas_name} (Inspirado em: {opp.book_title})
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-gradient-to-r from-primary to-blue-600 hover:opacity-95 text-white font-bold rounded-xl h-11 px-6 flex items-center gap-2 shrink-0"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Convocando Mentores...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                  {selectedOpp?.advisor_advice ? "Convocar Conselho Novamente" : "Reunir Conselho de Mentores (IA)"}
                </>
              )}
            </Button>

          </div>
        </CardContent>
      </Card>

      {/* Conselho Ativo */}
      {!selectedOpp?.advisor_advice ? (
        <Card className="border border-dashed border-border/80 bg-zinc-950/20 p-12 text-center">
          <CardContent className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-muted-foreground">
              <UserCheck className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Sala de Reuniões Vazia</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Os conselheiros estão aguardando o seu convite. Clique em <strong>Reunir Conselho de Mentores</strong> acima para iniciar a avaliação estratégica do SaaS <strong>{selectedOpp?.saas_name}</strong>.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          
          {/* Placar Geral do Conselho */}
          <Card className="border border-white/5 bg-zinc-900/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
              
              <div className="flex items-center gap-5">
                {/* Placar Circular */}
                <div className={cn(
                  "h-16 w-16 rounded-full flex flex-col items-center justify-center font-black text-xl border shrink-0",
                  getScoreColor(selectedOpp.advisor_advice.board_score)
                )}>
                  {selectedOpp.advisor_advice.board_score}
                  <span className="text-[8px] uppercase tracking-wider font-bold text-zinc-400">Score</span>
                </div>
                
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase text-primary tracking-widest flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Veredito Consolidado
                  </span>
                  <p className="text-base font-bold text-white leading-relaxed">
                    &ldquo;{selectedOpp.advisor_advice.verdict_summary}&rdquo;
                  </p>
                </div>
              </div>

              <div className="text-xs text-muted-foreground max-w-xs md:text-right">
                Este score reflete o nível de maturidade do modelo do MVP e a viabilidade de validação rápida segundo os conselheiros.
              </div>

            </CardContent>
          </Card>

          {/* Grid de Seleção de Advisors e Detalhes */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
            
            {/* Abas dos Advisors */}
            <div className="space-y-3 lg:col-span-1">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-1">Conselheiros</span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {selectedOpp.advisor_advice.advisors.map((advisor, idx) => {
                  const theme = getAdvisorTheme(advisor.avatar_style);
                  const isActive = activeAdvisorIdx === idx;
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveAdvisorIdx(idx)}
                      className={cn(
                        "p-3 rounded-xl border text-left flex items-center gap-3 transition-all duration-300 relative group",
                        isActive ? theme.activeBg + " " + theme.glow : theme.bg
                      )}
                    >
                      <div className={cn(
                        "h-8 w-8 rounded-full border flex items-center justify-center font-black text-xs shrink-0",
                        theme.avatarBg
                      )}>
                        {advisor.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="truncate pr-2">
                        <h4 className="font-extrabold text-xs text-white leading-snug">{advisor.name}</h4>
                        <p className="text-[10px] text-zinc-500 truncate">{advisor.role}</p>
                      </div>

                      {isActive && (
                        <div className={cn("absolute right-3 h-2 w-2 rounded-full", theme.dot)} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sabatina do Advisor Ativo */}
            <div className="lg:col-span-3">
              {(() => {
                const advisor = selectedOpp.advisor_advice.advisors[activeAdvisorIdx];
                const theme = getAdvisorTheme(advisor.avatar_style);
                
                return (
                  <Card className="border border-white/5 bg-zinc-900/20 backdrop-blur-md">
                    <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between flex-wrap gap-4">
                      
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-12 w-12 rounded-full border flex items-center justify-center font-black text-sm",
                          theme.avatarBg
                        )}>
                          {advisor.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-white">{advisor.name}</CardTitle>
                          <CardDescription className="text-xs text-zinc-400 font-semibold">{advisor.role}</CardDescription>
                        </div>
                      </div>

                      <span className="text-[11px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-zinc-300 px-3 py-1 rounded-full">
                        Veredito: <span className={theme.text}>{advisor.verdict}</span>
                      </span>

                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-6">
                      
                      {/* Crítica Severa */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-red-400/80 uppercase tracking-wider flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" /> Crítica Sincera (Sabatina)
                        </span>
                        <div className="p-5 bg-red-500/5 rounded-xl border border-red-500/10 text-sm text-zinc-300 leading-relaxed italic whitespace-pre-line">
                          &ldquo;{advisor.critical_review}&rdquo;
                        </div>
                      </div>

                      {/* Conselho Prático */}
                      <div className="space-y-2.5">
                        <span className="text-xs font-bold text-emerald-400/80 uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="h-4 w-4" /> Conselho Prático (Ação)
                        </span>
                        <div className="p-5 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-sm text-zinc-300 leading-relaxed whitespace-pre-line flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-extrabold text-white block mb-1">Como agir hoje:</span>
                            {advisor.actionable_advice}
                          </div>
                        </div>
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
