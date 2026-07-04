"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Megaphone, Copy, Check, Video, Image as ImageIcon, Loader2, XCircle, Layout, Flame, Zap } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdsDashboardProps {
  opportunity: {
    id: string;
    saas_name: string;
    ads_ai_json: any | null;
  };
}

export function AdsDashboard({ opportunity }: AdsDashboardProps) {
  const [data, setData] = useState<any>(opportunity.ads_ai_json);
  const [loading, setLoading] = useState(!opportunity.ads_ai_json);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'facebook' | 'tiktok'>('facebook');

  useEffect(() => {
    if (!data) {
      generateAds();
    }
  }, []);

  const generateAds = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/opportunities/ads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: opportunity.id })
      });
      const result = await res.json();
      
      if (res.ok && result.ads) {
        setData(result.ads);
      } else {
        setError(result.error || "Falha ao gerar Criativos");
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
          <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-2 border-4 border-fuchsia-500/50 rounded-full animate-spin direction-reverse"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 rounded-full shadow-[0_0_50px_rgba(99,102,241,0.4)] border border-indigo-500/20">
            <Megaphone className="h-12 w-12 text-indigo-400 animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-white">Ad Factory Ativada...</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Nossos Copywriters IA estão extraindo os gatilhos emocionais mais letais do mercado e escrevendo criativos virais.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <XCircle className="h-16 w-16 text-indigo-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold mb-2 text-white">Ops! Falha na Criação</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <button onClick={generateAds} className="bg-indigo-600/20 border border-indigo-500/50 text-indigo-400 font-bold px-6 py-2 rounded-lg hover:bg-indigo-600/40 transition-colors">
          Reiniciar Fábrica
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
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-fuchsia-600 rounded-lg blur opacity-25"></div>
        <div className="relative bg-zinc-950/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 uppercase">
            <Megaphone className="h-10 w-10 text-indigo-500" />
            Ad Factory Pro
          </h1>
          <p className="text-lg text-zinc-400 font-medium">Textos de alta conversão e roteiros virais injetados para: <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">{opportunity.saas_name}</span></p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Coluna Esquerda: Abas de Conteúdo */}
        <div className="lg:w-2/3 space-y-8">
          
          <div className="flex p-1.5 bg-zinc-900/50 border border-white/5 rounded-xl max-w-md shadow-inner backdrop-blur-md">
            <button
              onClick={() => setActiveTab('facebook')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all",
                activeTab === 'facebook' ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]" : "text-muted-foreground hover:text-white"
              )}
            >
              <Layout className="h-4 w-4" /> Meta Ads
            </button>
            <button
              onClick={() => setActiveTab('tiktok')}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all",
                activeTab === 'tiktok' ? "bg-fuchsia-600 text-white shadow-[0_0_15px_rgba(192,38,211,0.3)]" : "text-muted-foreground hover:text-white"
              )}
            >
              <Video className="h-4 w-4" /> TikTok / Reels
            </button>
          </div>

          {activeTab === 'facebook' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {data.facebook_ads?.map((ad: any, i: number) => (
                <Card key={i} className="glass-card border-indigo-500/20 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-indigo-500/20 transition-colors" />
                  
                  <CardHeader className="bg-indigo-500/5 border-b border-indigo-500/10 flex flex-row justify-between items-center py-4">
                    <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.1)]">
                      Ângulo: {ad.angle}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(`${ad.primary_text}\n\nTítulo: ${ad.headline}\nBotão: ${ad.call_to_action}`, `fb-${i}`)}
                      className="text-xs font-bold bg-zinc-900 border border-white/10 hover:border-indigo-500/50 text-indigo-400 px-4 py-1.5 rounded-full flex items-center gap-2 transition-all"
                    >
                      {copiedId === `fb-${i}` ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> COPIADO</> : <><Copy className="h-3.5 w-3.5" /> COPIAR AD</>}
                    </button>
                  </CardHeader>

                  <CardContent className="p-6 md:p-8">
                    {/* Mockup do Facebook (Dark Mode) */}
                    <div className="max-w-lg mx-auto bg-[#18191A] border border-[#3E4042] rounded-xl overflow-hidden shadow-2xl">
                      {/* Header do Mockup */}
                      <div className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shrink-0 flex items-center justify-center shadow-lg">
                          <Zap className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-[#E4E6EB] text-[15px] leading-tight">{opportunity.saas_name}</p>
                          <p className="text-xs text-[#B0B3B8] font-medium mt-0.5">Patrocinado · 🌍</p>
                        </div>
                      </div>
                      
                      {/* Primary Text */}
                      <div className="px-4 pb-3 text-[#E4E6EB] whitespace-pre-wrap text-[15px] leading-snug">
                        {ad.primary_text}
                      </div>

                      {/* Criativo */}
                      <div className="bg-[#242526] h-64 w-full flex flex-col items-center justify-center text-[#B0B3B8] border-y border-[#3E4042] relative overflow-hidden group/img cursor-pointer">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-0"></div>
                        <ImageIcon className="h-12 w-12 mb-3 opacity-30 z-10 group-hover/img:scale-110 transition-transform" />
                        <span className="text-sm font-semibold z-10 drop-shadow-md">[ Espaço para seu Vídeo/Imagem ]</span>
                      </div>

                      {/* CTA Section */}
                      <div className="bg-[#242526] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <p className="text-[11px] text-[#B0B3B8] uppercase tracking-wider font-semibold mb-1">FORMULÁRIO</p>
                          <p className="font-bold text-[#E4E6EB] text-[15px] leading-tight">{ad.headline}</p>
                        </div>
                        <button className="bg-[#3A3B3C] hover:bg-[#4E4F50] text-[#E4E6EB] font-bold py-2 px-6 rounded-lg text-[15px] transition-colors shrink-0">
                          {ad.call_to_action}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'tiktok' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {data.tiktok_scripts?.map((script: any, i: number) => (
                <Card key={i} className="bg-[#050505] border-white/5 overflow-hidden relative group shadow-2xl">
                  {/* Neons verticais simulando a interface do TikTok */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#00f2fe] via-[#4facfe] to-[#f093fb]"></div>
                  
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                    <Video className="w-32 h-32 text-fuchsia-500" />
                  </div>

                  <CardHeader className="bg-zinc-900/30 border-b border-white/5 py-5 flex flex-row justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] uppercase font-black tracking-widest text-[#00f2fe] bg-[#00f2fe]/10 px-3 py-1.5 rounded-md border border-[#00f2fe]/20 shadow-[0_0_15px_rgba(0,242,254,0.15)]">
                        {script.style}
                      </span>
                      <span className="text-zinc-400 text-xs font-mono font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        {script.duration}
                      </span>
                    </div>
                    <button 
                      onClick={() => {
                        const text = script.script_blocks.map((b: any) => `[${b.time}] VISUAL: ${b.visual}\nAUDIO: ${b.audio}`).join('\n\n');
                        copyToClipboard(text, `tk-${i}`);
                      }}
                      className="text-xs font-bold bg-zinc-900 border border-white/10 hover:border-fuchsia-500/50 text-fuchsia-400 px-4 py-1.5 rounded-full flex items-center gap-2 transition-all"
                    >
                      {copiedId === `tk-${i}` ? <><Check className="h-3.5 w-3.5 text-emerald-500" /> COPIADO</> : <><Copy className="h-3.5 w-3.5" /> COPIAR SCRIPT</>}
                    </button>
                  </CardHeader>
                  
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      {script.script_blocks?.map((block: any, j: number) => (
                        <div key={j} className="flex gap-6 relative">
                          {/* Timeline vertical */}
                          {j !== script.script_blocks.length - 1 && (
                            <div className="absolute top-10 left-8 w-px h-[calc(100%-10px)] bg-gradient-to-b from-white/10 to-transparent"></div>
                          )}
                          
                          <div className="w-20 shrink-0 text-right pt-1.5 z-10">
                            <span className="text-[11px] font-mono text-cyan-400 font-bold bg-cyan-400/10 px-2 py-1 rounded border border-cyan-400/20">{block.time}</span>
                          </div>

                          <div className="flex-1 space-y-3 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                            <div className="bg-zinc-900/60 rounded-xl p-4 text-xs text-zinc-300 border border-white/5 leading-relaxed shadow-inner">
                              <span className="text-[10px] font-black uppercase text-zinc-500 tracking-wider mr-2 bg-black px-1.5 py-0.5 rounded">🎥 VISUAL</span> 
                              {block.visual}
                            </div>
                            <div className="text-[15px] font-semibold leading-relaxed text-white pl-4 border-l-2 border-fuchsia-500">
                              <span className="text-[10px] font-black uppercase text-fuchsia-500 tracking-wider mr-2 bg-fuchsia-500/10 px-1.5 py-0.5 rounded">🎙️ FALA</span> 
                              "{block.audio}"
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>

        {/* Coluna Direita: Ideias Criativas */}
        <div className="lg:w-1/3">
          <Card className="glass-card border-orange-500/20 sticky top-6 shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-xl font-bold flex items-center gap-3 text-white">
                <div className="bg-orange-500/20 p-2 rounded-lg border border-orange-500/30">
                  <ImageIcon className="h-5 w-5 text-orange-400" />
                </div>
                Inspiração Visual
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-sm text-zinc-400 mb-6 font-medium">Buscando o gancho perfeito? Gere essas ideias no Canva ou Midjourney para parar o scroll instantaneamente:</p>

              <div className="space-y-6">
                {data.creative_ideas?.map((idea: any, i: number) => (
                  <div key={i} className="group relative pl-10">
                    <div className="absolute left-0 top-0 flex items-center justify-center bg-zinc-900 border border-white/10 text-orange-400 font-black rounded-xl h-7 w-7 text-xs shadow-inner group-hover:border-orange-500/50 group-hover:bg-orange-500/10 group-hover:text-orange-500 transition-all">
                      {i + 1}
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1.5 group-hover:text-orange-400 transition-colors">
                      {idea.concept}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                      {idea.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
