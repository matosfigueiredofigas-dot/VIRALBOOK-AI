"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, CheckCircle2, Mail, Info, Send, Calendar, Tag, ChevronRight, FileText, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { MarketMarquee } from "@/components/market-marquee";

interface Email {
  day: string;
  purpose: string;
  subject: string;
  preheader: string;
  body: string;
}

interface EmailFunnel {
  sequence: Email[];
}

interface Opportunity {
  id: string;
  saas_name: string;
  target_audience: string;
  problem_solved: string;
  book_title: string;
  email_funnel: EmailFunnel | null;
}

export function EmailFunnelClient({ initialOpportunities, initialSelectedId }: { initialOpportunities: Opportunity[], initialSelectedId?: string }) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const validInitialId = initialSelectedId && initialOpportunities.some(o => o.id === initialSelectedId) ? initialSelectedId : initialOpportunities[0]?.id || "";
  const [selectedId, setSelectedId] = useState<string>(validInitialId);
  const [tone, setTone] = useState<string>("persuasivo");
  const [discount, setDiscount] = useState<string>("20%");
  const [generating, setGenerating] = useState<boolean>(false);
  const [activeEmailIdx, setActiveEmailIdx] = useState<number>(0);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const selectedOpp = opportunities.find(opp => opp.id === selectedId);

  const handleGenerate = async () => {
    if (!selectedId) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/opportunities/email-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId: selectedId, tone, discount }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro ao gerar o funil.");
      }

      // Atualizar lista local com o funil gerado
      const updatedOpps = opportunities.map(opp => {
        if (opp.id === selectedId) {
          return { ...opp, email_funnel: data.emailFunnel };
        }
        return opp;
      });
      setOpportunities(updatedOpps);
      setActiveEmailIdx(0);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Erro ao gerar o funil de e-mails.");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyText = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(type);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleExportTxt = () => {
    if (!selectedOpp?.email_funnel) return;
    let text = `SEQUÊNCIA DE LANÇAMENTO - ${selectedOpp.saas_name.toUpperCase()}\n\n`;
    selectedOpp.email_funnel.sequence.forEach((email, idx) => {
      text += `===========================================\n`;
      text += `E-MAIL ${idx + 1}: ${email.day} - ${email.purpose}\n`;
      text += `===========================================\n`;
      text += `Assunto: ${email.subject}\n`;
      text += `Pré-cabeçalho: ${email.preheader}\n\n`;
      text += `${email.body}\n\n\n`;
    });

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `funil-email-${selectedOpp.saas_name.toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (opportunities.length === 0) {
    return (
      <Card className="glass-card border-primary/20 max-w-2xl mx-auto mt-8 text-center p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
        <CardHeader className="flex flex-col items-center justify-center space-y-6 relative z-10">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(var(--primary),0.3)] border border-primary/30">
            <Mail className="h-10 w-10 animate-bounce" />
          </div>
          <CardTitle className="text-3xl font-black tracking-tight text-white">Nenhum Micro-SaaS Encontrado</CardTitle>
          <CardDescription className="max-w-md mx-auto leading-relaxed text-zinc-400 text-base">
            Para gerar sequências de e-mails automatizadas de alta conversão, você precisa ter salvo pelo menos um micro-SaaS a partir da Biblioteca ou do Radar de Ebooks.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-6 relative z-10">
          <Button onClick={() => router.push("/library")} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.4)] transition-all hover:scale-105 text-lg">
            Explorar Biblioteca de Ideias
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Ticker (Se houver SaaS selecionado, talvez mostrar no Ticker? Passar options genéricas se quisermos, mas aqui podemos passar o próprio opportunities) */}
      <MarketMarquee opportunities={opportunities} />

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25"></div>
        <div className="relative bg-zinc-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 uppercase">
            <Mail className="h-10 w-10 text-blue-500" />
            Email Matrix
          </h1>
          <p className="text-lg text-zinc-400 font-medium">Motor de Lançamento por Email (Gatilhos Automáticos)</p>
        </div>
      </div>

      {/* Painel de Configurações */}
      <Card className="glass-card border-blue-500/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.8)]" />
        <CardContent className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
            
            {/* Seletor do SaaS */}
            <div className="space-y-3 md:col-span-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Send className="h-4 w-4 text-blue-500" /> Escolha o Micro-SaaS
              </label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setActiveEmailIdx(0);
                }}
                className="w-full h-12 px-4 bg-zinc-900 border border-white/10 rounded-xl text-sm font-semibold focus:outline-none focus:border-blue-500 transition-colors text-white shadow-inner"
              >
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id} className="bg-zinc-950 text-white font-medium">
                    {opp.saas_name} (Inspirado em: {opp.book_title})
                  </option>
                ))}
              </select>
            </div>

            {/* Tom de Voz */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Info className="h-4 w-4 text-fuchsia-500" /> Tom da Copy
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-12 px-4 bg-zinc-900 border border-white/10 rounded-xl text-sm font-semibold focus:outline-none focus:border-fuchsia-500 transition-colors text-white shadow-inner"
              >
                <option value="persuasivo" className="bg-zinc-950">🔥 Persuasivo & Convincente</option>
                <option value="amigável" className="bg-zinc-950">👋 Amigável & Casual</option>
                <option value="técnico" className="bg-zinc-950">⚙️ Técnico & Focado em Valor</option>
                <option value="audacioso" className="bg-zinc-950">⚡ Audacioso & Disruptivo</option>
              </select>
            </div>

            {/* Desconto de Lançamento */}
            <div className="space-y-3">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Tag className="h-4 w-4 text-emerald-500" /> Gatilho de Preço
              </label>
              <select
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full h-12 px-4 bg-zinc-900 border border-white/10 rounded-xl text-sm font-semibold focus:outline-none focus:border-emerald-500 transition-colors text-white shadow-inner"
              >
                <option value="10%" className="bg-zinc-950">10% OFF</option>
                <option value="20%" className="bg-zinc-950">20% OFF (Recomendado)</option>
                <option value="30%" className="bg-zinc-950">30% OFF</option>
                <option value="Uso Grátis (7 dias)" className="bg-zinc-950">Trial de 7 Dias</option>
              </select>
            </div>

          </div>

          <div className="mt-8 flex justify-end pt-6 border-t border-white/5">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl h-12 px-8 flex items-center gap-3 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:scale-105"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Sintetizando Sequência...
                </>
              ) : (
                <>
                  <Zap className="h-5 w-5 text-yellow-300 animate-pulse" />
                  {selectedOpp?.email_funnel ? "Regerar Sequência por IA" : "Forjar Funil de Lançamento"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exibição da Sequência */}
      {!selectedOpp?.email_funnel ? (
        <Card className="border border-dashed border-white/10 bg-zinc-950/40 p-16 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <CardContent className="space-y-6 relative z-10">
            <div className="h-16 w-16 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center mx-auto text-zinc-600 shadow-inner group-hover:text-blue-500 group-hover:border-blue-500/30 transition-colors">
              <Mail className="h-8 w-8" />
            </div>
            <div>
              <h3 className="font-black text-xl text-white mb-2">Matrix Vazia</h3>
              <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed font-medium">
                Nenhuma sequência de e-mails armada para o alvo <strong className="text-white bg-white/5 px-2 py-0.5 rounded">{selectedOpp?.saas_name}</strong>. Ajuste os parâmetros acima e ative a forja.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Menu Lateral da Sequência */}
          <div className="space-y-4 sticky top-6">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 mb-4 flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-blue-500" /> Fluxo Automático
            </h3>
            <div className="space-y-3">
              {selectedOpp.email_funnel.sequence.map((email, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveEmailIdx(idx);
                    setCopiedSection(null);
                  }}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border transition-all duration-300 flex items-center justify-between group relative overflow-hidden",
                    activeEmailIdx === idx
                      ? "bg-blue-600/10 border-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "bg-zinc-950/40 border-white/5 text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                  )}
                >
                  {activeEmailIdx === idx && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  )}
                  <div className="space-y-2 max-w-[85%] relative z-10">
                    <span className={cn(
                      "text-[9px] uppercase font-black tracking-widest px-2 py-1 rounded-full",
                      activeEmailIdx === idx ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-zinc-500"
                    )}>
                      {email.day}
                    </span>
                    <h4 className="font-extrabold text-[13px] leading-snug line-clamp-1 group-hover:text-white transition-colors">{email.subject}</h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-1 font-medium">{email.purpose}</p>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-300 relative z-10", activeEmailIdx === idx ? "text-blue-400 transform translate-x-1" : "text-zinc-600 group-hover:text-zinc-400")} />
                </button>
              ))}
            </div>

            <Button
              onClick={handleExportTxt}
              variant="outline"
              className="w-full bg-zinc-950 border-white/10 hover:border-blue-500/50 hover:bg-zinc-900 text-zinc-300 hover:text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 mt-6 transition-all"
            >
              <FileText className="h-4 w-4 text-blue-400" />
              Exportar Payload (.txt)
            </Button>
          </div>

          {/* Visualização de Email Ativo */}
          <div className="lg:col-span-2">
            {(() => {
              const email = selectedOpp.email_funnel.sequence[activeEmailIdx];
              return (
                <Card className="glass-card border-blue-500/20 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  
                  <CardHeader className="bg-zinc-900/30 border-b border-white/5 py-5 flex flex-row justify-between items-center relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
                        <Mail className="h-4 w-4 text-blue-400" />
                      </div>
                      <span className="text-[10px] uppercase font-black text-blue-400 tracking-widest">
                        {email.day} - {email.purpose}
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest bg-black px-2 py-1 rounded border border-white/5">
                      Passo {activeEmailIdx + 1} de 5
                    </span>
                  </CardHeader>
                  
                  <CardContent className="p-8 space-y-8 relative z-10">
                    
                    {/* Assunto */}
                    <div className="space-y-3 group/section">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded">Subject / Assunto</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[10px] font-bold text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                          onClick={() => handleCopyText(email.subject, "subject")}
                        >
                          {copiedSection === "subject" ? (
                            <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> COPIADO!</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5 mr-1.5" /> COPIAR</>
                          )}
                        </Button>
                      </div>
                      <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl text-[15px] font-bold text-white shadow-inner group-hover/section:border-blue-500/30 transition-colors">
                        {email.subject}
                      </div>
                    </div>

                    {/* Preheader */}
                    <div className="space-y-3 group/section">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded">Preheader (Texto Oculto)</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[10px] font-bold text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors"
                          onClick={() => handleCopyText(email.preheader, "preheader")}
                        >
                          {copiedSection === "preheader" ? (
                            <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> COPIADO!</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5 mr-1.5" /> COPIAR</>
                          )}
                        </Button>
                      </div>
                      <div className="p-4 bg-zinc-950 border border-white/5 rounded-xl text-sm text-zinc-400 italic shadow-inner group-hover/section:border-blue-500/30 transition-colors">
                        "{email.preheader}"
                      </div>
                    </div>

                    {/* Corpo */}
                    <div className="space-y-3 group/section">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded">Payload (Corpo do Email)</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-[10px] font-bold text-blue-400 hover:text-emerald-400 hover:bg-emerald-400/10 bg-blue-500/10 border border-blue-500/20 transition-all"
                          onClick={() => handleCopyText(email.body, "body")}
                        >
                          {copiedSection === "body" ? (
                            <><CheckCircle2 className="h-3.5 w-3.5 mr-1.5 text-emerald-500" /> PAYLOAD COPIADO!</>
                          ) : (
                            <><Copy className="h-3.5 w-3.5 mr-1.5" /> COPIAR PAYLOAD</>
                          )}
                        </Button>
                      </div>
                      
                      {/* Interface de "Editor de Email" */}
                      <div className="rounded-xl border border-white/5 overflow-hidden shadow-2xl group-hover/section:border-blue-500/30 transition-colors">
                        <div className="bg-zinc-900 px-4 py-2 border-b border-white/5 flex gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                        </div>
                        <div className="bg-[#111111] p-6 text-[15px] text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[500px] overflow-y-auto font-sans">
                          {email.body}
                        </div>
                      </div>
                    </div>

                  </CardContent>
                </Card>
              );
            })()}
          </div>

        </div>
      )}
    </div>
  );
}
