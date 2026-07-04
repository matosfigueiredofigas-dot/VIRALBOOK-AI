"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Crosshair, Copy, Check, Search, Mail, MessageSquare, Loader2, XCircle, Target, Briefcase, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface HunterDashboardProps {
  opportunity: {
    id: string;
    saas_name: string;
    hunter_ai_json: any | null;
  };
}

export function HunterDashboard({ opportunity }: HunterDashboardProps) {
  const [data, setData] = useState<any>(opportunity.hunter_ai_json);
  const [loading, setLoading] = useState(!opportunity.hunter_ai_json);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      generateHunter();
    }
  }, []);

  const generateHunter = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/opportunities/hunter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: opportunity.id })
      });
      const result = await res.json();
      
      if (res.ok && result.hunter) {
        setData(result.hunter);
      } else {
        setError(result.error || "Falha ao gerar Command Center");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="relative w-32 h-32 mb-8">
          <div className="absolute inset-0 border-4 border-rose-500/30 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-4 border-rose-500/50 rounded-full animate-spin direction-reverse"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 rounded-full shadow-[0_0_50px_rgba(244,63,94,0.4)] border border-rose-500/20">
            <Crosshair className="h-12 w-12 text-rose-500 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">Hunter AI Ativado...</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Vasculhando a web, forjando scripts letais e criando queries Dorks para aniquilar as barreiras dos seus clientes em potencial.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <XCircle className="h-16 w-16 text-rose-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2 text-white">Ops! Falha na Prospecção</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button onClick={generateHunter} className="bg-rose-600/20 border border-rose-500/50 text-rose-500 font-bold px-6 py-2 rounded-lg hover:bg-rose-600/40 transition-colors">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans w-full space-y-8 animate-in fade-in zoom-in-95 duration-700">
      <Link href={`/canvas/${opportunity.id}`} className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-white transition-colors bg-zinc-900/50 px-4 py-2 rounded-full border border-white/5 w-fit">
        <ArrowLeft className="mr-2 h-4 w-4" /> Retornar à Base (Canvas)
      </Link>

      <div className="relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-lg blur opacity-25"></div>
        <div className="relative bg-zinc-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 uppercase">
            <Target className="h-10 w-10 text-rose-500" />
            Command Center
          </h1>
          <p className="text-lg text-zinc-400 font-medium">Arsenal tático gerado para dominar o mercado de: <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-500">{opportunity.saas_name}</span></p>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* Coluna 1: Persona & Buscas */}
        <div className="xl:col-span-1 space-y-8">
          
          {/* Target Profile Card */}
          <Card className="glass-card border-rose-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
              <Crosshair className="w-32 h-32 text-rose-500" />
            </div>
            <CardHeader className="border-b border-white/5 pb-4">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-rose-400" /> Perfil do Alvo (ICP)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6 relative z-10">
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                  <Zap className="h-3 w-3 text-orange-500" /> Quem Assina o Cheque
                </p>
                <p className="text-white font-bold text-lg">{data.target_persona?.decision_maker}</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-3">Cargos no LinkedIn</p>
                <div className="flex flex-wrap gap-2">
                  {data.target_persona?.job_titles?.map((title: string, i: number) => (
                    <span key={i} className="bg-rose-500/10 text-rose-400 px-3 py-1.5 rounded-md text-xs font-bold border border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-3">Setores de Atuação</p>
                <div className="space-y-2">
                  {data.target_persona?.industries?.map((ind: string, i: number) => (
                    <div key={i} className="bg-zinc-900/50 border border-white/5 px-3 py-2 rounded-lg text-sm text-zinc-300 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      {ind}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dorks Hacker Terminal */}
          <Card className="bg-[#0a0a0a] border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-emerald-900"></div>
            <CardHeader className="bg-zinc-900/50 border-b border-white/5">
              <CardTitle className="text-xl font-bold flex items-center gap-2 text-white">
                <Search className="h-5 w-5 text-emerald-500" /> Dorks Injector (Google)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-zinc-400 text-sm mb-6 font-medium">Execute essas queries no Google para burlar filtros e encontrar centenas de tomadores de decisão hiper-qualificados.</p>
              
              <div className="space-y-4">
                {data.google_dorks?.map((dork: any, i: number) => (
                  <div key={i} className="bg-black rounded-xl border border-white/10 overflow-hidden group hover:border-emerald-500/30 transition-colors">
                    <div className="px-4 py-2 bg-zinc-900 border-b border-white/10 text-[10px] text-emerald-500/70 font-black uppercase tracking-widest flex justify-between items-center">
                      <span>_ {dork.description}</span>
                    </div>
                    <div className="p-4 flex gap-3 items-start relative">
                      <code className="text-xs text-emerald-400 font-mono break-all flex-1 select-all leading-relaxed">
                        &gt; {dork.query}
                        <span className="inline-block w-1.5 h-3 bg-emerald-400 ml-1 animate-pulse" />
                      </code>
                      <button 
                        onClick={() => copyToClipboard(dork.query, `dork-${i}`)}
                        className="shrink-0 p-2 bg-zinc-900 hover:bg-emerald-500/20 rounded-md transition-colors border border-white/5 hover:border-emerald-500/50"
                        title="Copiar Payload"
                      >
                        {copiedId === `dork-${i}` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-zinc-500 group-hover:text-emerald-400" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Coluna 2: Cold Emails & LinkedIn */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Cold Email Sequences */}
          <Card className="glass-card border-blue-500/20 overflow-hidden">
            <CardHeader className="bg-blue-500/5 border-b border-blue-500/10">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                <div className="bg-blue-500/20 p-2 rounded-lg border border-blue-500/30">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                Sequência de Infiltração (Cold Email)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-8">
              {data.cold_emails?.map((email: any, i: number) => (
                <div key={i} className="relative group">
                  <div className="absolute -inset-4 bg-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"></div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                      {email.step}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(`Assunto: ${email.subject}\n\n${email.body}`, `email-${i}`)}
                      className="text-xs font-bold bg-zinc-900 border border-white/10 hover:border-blue-500/50 hover:text-blue-400 px-4 py-1.5 rounded-full flex items-center gap-2 transition-all"
                    >
                      {copiedId === `email-${i}` ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> COPIADO</> : <><Copy className="h-3.5 w-3.5" /> COPIAR</>}
                    </button>
                  </div>
                  
                  <div className="bg-zinc-950 border border-white/5 rounded-xl p-6 shadow-inner font-sans">
                    <div className="mb-4 pb-4 border-b border-white/5 flex gap-3 items-center">
                      <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-zinc-900 px-2 py-1 rounded">Subject</span>
                      <span className="text-white font-bold">{email.subject}</span>
                    </div>
                    <div className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-sm">
                      {email.body}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* LinkedIn Scripts */}
          <Card className="glass-card border-indigo-500/20 overflow-hidden">
            <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10">
              <CardTitle className="text-2xl font-bold flex items-center gap-3 text-white">
                <div className="bg-indigo-500/20 p-2 rounded-lg border border-indigo-500/30">
                  <MessageSquare className="h-6 w-6 text-indigo-400" />
                </div>
                Engajamento Direto (LinkedIn DM)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 grid md:grid-cols-2 gap-6">
              {data.linkedin_scripts?.map((script: any, i: number) => (
                <div key={i} className="bg-zinc-950 border border-white/5 rounded-xl p-6 hover:border-indigo-500/40 transition-colors group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <span className="font-bold text-white text-sm bg-indigo-500/20 px-3 py-1 rounded-md border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.1)]">{script.type}</span>
                    <button 
                      onClick={() => copyToClipboard(script.message, `linkedin-${i}`)}
                      className="p-2 bg-zinc-900 border border-white/5 hover:border-indigo-500/50 rounded-lg transition-all"
                    >
                      {copiedId === `linkedin-${i}` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-zinc-400 group-hover:text-indigo-400" />}
                    </button>
                  </div>
                  <div className="text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed relative z-10">
                    "{script.message}"
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
