"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Loader2, Sparkles, Copy, CheckCircle2, Mail, Info, Send, Calendar, Tag, ChevronRight, FileText } from "lucide-react";
import { useRouter } from "next/navigation";

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

export function EmailFunnelClient({ initialOpportunities }: { initialOpportunities: Opportunity[] }) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<Opportunity[]>(initialOpportunities);
  const [selectedId, setSelectedId] = useState<string>(initialOpportunities[0]?.id || "");
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
      <Card className="border border-border bg-card/40 backdrop-blur-xl max-w-2xl mx-auto mt-8 text-center p-8">
        <CardHeader className="flex flex-col items-center justify-center space-y-4">
          <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-inner">
            <Mail className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold">Nenhum SaaS Criado</CardTitle>
          <CardDescription className="max-w-md mx-auto leading-relaxed">
            Para gerar sequências de e-mails automatizadas, você precisa ter salvo pelo menos um micro-SaaS a partir da Biblioteca ou do Radar de Ebooks.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-4">
          <Button onClick={() => router.push("/library")} className="bg-gradient-to-r from-primary to-blue-600 font-bold px-6 py-2 rounded-xl">
            Explorar Biblioteca de Ideias
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Painel de Configurações */}
      <Card className="border border-border/50 bg-card/30 backdrop-blur-md">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
            
            {/* Seletor do SaaS */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Send className="h-3.5 w-3.5" /> Escolha o Micro-SaaS
              </label>
              <select
                value={selectedId}
                onChange={(e) => {
                  setSelectedId(e.target.value);
                  setActiveEmailIdx(0);
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

            {/* Tom de Voz */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" /> Tom de Voz
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-900/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-white"
              >
                <option value="persuasivo" className="bg-zinc-950">Persuasivo & Convincente</option>
                <option value="amigável" className="bg-zinc-950">Amigável & Casual</option>
                <option value="técnico" className="bg-zinc-950">Técnico & Focado em Valor</option>
                <option value="audacioso" className="bg-zinc-950">Audacioso & Disruptivo</option>
              </select>
            </div>

            {/* Desconto de Lançamento */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" /> Desconto Fundador
              </label>
              <select
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full h-11 px-3 bg-zinc-900/50 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-primary transition-colors text-white"
              >
                <option value="10%" className="bg-zinc-950">10% OFF</option>
                <option value="20%" className="bg-zinc-950">20% OFF</option>
                <option value="30%" className="bg-zinc-950">30% OFF</option>
                <option value="Uso Grátis (7 dias)" className="bg-zinc-950">7 Dias Grátis</option>
              </select>
            </div>

          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleGenerate}
              disabled={generating}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-11 px-6 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Gerando Sequência...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                  {selectedOpp?.email_funnel ? "Regerar Sequência por IA" : "Gerar Funil de Lançamento (IA)"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exibição da Sequência */}
      {!selectedOpp?.email_funnel ? (
        <Card className="border border-dashed border-border/80 bg-zinc-950/20 p-12 text-center">
          <CardContent className="space-y-4">
            <div className="h-12 w-12 rounded-full bg-zinc-900 flex items-center justify-center mx-auto text-muted-foreground">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-white">Nenhum Funil Gerado</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Nenhuma sequência de e-mails ativa para o SaaS <strong>{selectedOpp?.saas_name}</strong>. Escolha as configurações acima e clique em Gerar para criar as copys.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Menu Lateral da Sequência */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">E-mails do Funil</h3>
            <div className="space-y-2.5">
              {selectedOpp.email_funnel.sequence.map((email, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveEmailIdx(idx);
                    setCopiedSection(null);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-start justify-between group",
                    activeEmailIdx === idx
                      ? "bg-primary/10 border-primary text-white shadow-md shadow-primary/5"
                      : "bg-zinc-950/30 border-white/5 text-zinc-400 hover:bg-zinc-900/30 hover:text-white"
                  )}
                >
                  <div className="space-y-1.5 max-w-[85%]">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{email.day}</span>
                    <h4 className="font-extrabold text-sm leading-snug line-clamp-1">{email.subject}</h4>
                    <p className="text-[11px] text-zinc-500 line-clamp-1">{email.purpose}</p>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0 transition-transform duration-300", activeEmailIdx === idx ? "text-primary transform translate-x-1" : "text-zinc-600 group-hover:text-zinc-300")} />
                </button>
              ))}
            </div>

            <Button
              onClick={handleExportTxt}
              variant="outline"
              className="w-full border-white/10 hover:bg-white/5 font-bold h-11 rounded-xl flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4 text-primary" />
              Exportar Sequência (.txt)
            </Button>
          </div>

          {/* Visualização de Email Ativo */}
          <div className="lg:col-span-2">
            {(() => {
              const email = selectedOpp.email_funnel.sequence[activeEmailIdx];
              return (
                <Card className="border border-border/50 bg-card/30 backdrop-blur-md relative">
                  <CardHeader className="border-b border-white/5 pb-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <div>
                        <span className="text-xxs uppercase font-extrabold text-primary tracking-widest px-2.5 py-0.5 rounded-full bg-primary/10">
                          {email.day} - {email.purpose}
                        </span>
                      </div>
                      <span className="text-xxs text-muted-foreground font-semibold">Passo {activeEmailIdx + 1} de 5</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    
                    {/* Assunto */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Assunto (Subject)</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xxs font-bold text-primary hover:bg-primary/10"
                          onClick={() => handleCopyText(email.subject, "subject")}
                        >
                          {copiedSection === "subject" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" /> Copiar Assunto
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-3 bg-zinc-950/40 rounded-xl border border-white/5 text-sm font-semibold text-white whitespace-pre-wrap leading-relaxed">
                        {email.subject}
                      </div>
                    </div>

                    {/* Preheader */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Pré-Cabeçalho (Preheader)</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xxs font-bold text-primary hover:bg-primary/10"
                          onClick={() => handleCopyText(email.preheader, "preheader")}
                        >
                          {copiedSection === "preheader" ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" /> Copiar Pré-cabeçalho
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-3 bg-zinc-950/40 rounded-xl border border-white/5 text-xs text-zinc-400 italic leading-relaxed">
                        {email.preheader}
                      </div>
                    </div>

                    {/* Corpo */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Corpo do E-mail</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xxs font-bold text-primary hover:bg-primary/10"
                          onClick={() => handleCopyText(email.body, "body")}
                        >
                          {copiedSection === "body" ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5 mr-1" /> Copiar Corpo do E-mail
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-5 bg-zinc-950/60 rounded-xl border border-white/5 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap max-h-[400px] overflow-y-auto font-sans pr-3">
                        {email.body}
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
