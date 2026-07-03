"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Megaphone, Copy, Check, Video, Image as ImageIcon, Loader2, XCircle, Layout } from "lucide-react";
import Link from "next/link";

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
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-2xl">
            <Megaphone className="h-10 w-10 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Fábrica de Anúncios Trabalhando...</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Nossa equipe de Copywriters AI está escrevendo textos que convertem e roteiros magnéticos para o seu SaaS. Isso pode levar alguns segundos.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ops! Falha na Criação</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={generateAds} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 font-sans w-full">
      <Link href={`/canvas/${opportunity.id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Canvas
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          Fábrica de <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Anúncios Virais</span>
        </h1>
        <p className="text-lg text-gray-500">Copywriting e Roteiros para a campanha de: <span className="font-bold text-indigo-600">{opportunity.saas_name}</span></p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Coluna Esquerda: Abas de Conteúdo */}
        <div className="lg:w-2/3 space-y-6">
          
          <div className="flex p-1 bg-gray-100 rounded-xl max-w-md">
            <button
              onClick={() => setActiveTab('facebook')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'facebook' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Layout className="h-4 w-4" /> Meta Ads (Texto)
            </button>
            <button
              onClick={() => setActiveTab('tiktok')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${activeTab === 'tiktok' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
            >
              <Video className="h-4 w-4" /> TikTok / Reels
            </button>
          </div>

          {activeTab === 'facebook' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {data.facebook_ads?.map((ad: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-blue-50 border-b border-blue-100 px-6 py-3 flex justify-between items-center">
                    <span className="text-blue-700 font-bold text-sm">Ângulo: {ad.angle}</span>
                    <button 
                      onClick={() => copyToClipboard(`${ad.primary_text}\n\nTítulo: ${ad.headline}\nBotão: ${ad.call_to_action}`, `fb-${i}`)}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors font-medium"
                    >
                      {copiedId === `fb-${i}` ? <><Check className="h-4 w-4" /> Copiado</> : <><Copy className="h-4 w-4" /> Copiar Ad</>}
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 rounded-full bg-gray-200 shrink-0"></div>
                      <div>
                        <p className="font-bold text-sm">{opportunity.saas_name}</p>
                        <p className="text-xs text-gray-500">Patrocinado · 🌍</p>
                      </div>
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed mb-4">
                      {ad.primary_text}
                    </div>
                    <div className="bg-gray-100 h-48 rounded-lg mb-4 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                      <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
                      <span className="text-xs font-medium">(Coloque seu vídeo ou imagem aqui)</span>
                    </div>
                    <div className="bg-gray-100 px-4 py-3 rounded-b-lg flex justify-between items-center border-t border-gray-200">
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold mb-0.5">FORMULÁRIO</p>
                        <p className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{ad.headline}</p>
                      </div>
                      <button className="bg-gray-300 hover:bg-gray-400 text-gray-900 font-bold py-1.5 px-4 rounded text-sm transition-colors">
                        {ad.call_to_action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'tiktok' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {data.tiktok_scripts?.map((script: any, i: number) => (
                <div key={i} className="bg-[#111827] text-white rounded-2xl border border-gray-800 shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <Video className="w-24 h-24" />
                  </div>
                  <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center">
                    <div>
                      <span className="text-pink-500 font-bold text-sm bg-pink-500/10 px-2.5 py-1 rounded-md mr-2">{script.style}</span>
                      <span className="text-gray-400 text-sm">⏱ {script.duration}</span>
                    </div>
                    <button 
                      onClick={() => {
                        const text = script.script_blocks.map((b: any) => `[${b.time}] VISUAL: ${b.visual}\nAUDIO: ${b.audio}`).join('\n\n');
                        copyToClipboard(text, `tk-${i}`);
                      }}
                      className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                    >
                      {copiedId === `tk-${i}` ? <><Check className="h-4 w-4 text-emerald-400" /> Copiado</> : <><Copy className="h-4 w-4" /> Copiar Script</>}
                    </button>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {script.script_blocks?.map((block: any, j: number) => (
                        <div key={j} className="flex gap-4">
                          <div className="w-16 shrink-0 text-right">
                            <span className="text-xs font-mono text-cyan-400 font-bold">{block.time}</span>
                          </div>
                          <div className="flex-1 space-y-1.5 pb-4 border-b border-gray-800 last:border-0 last:pb-0">
                            <div className="bg-gray-800/50 rounded p-2 text-xs text-gray-300">
                              <span className="font-bold text-gray-500 mr-2">CÂMERA/TELA:</span> {block.visual}
                            </div>
                            <div className="text-sm font-medium leading-relaxed">
                              <span className="font-bold text-pink-500 mr-2">FALA:</span> "{block.audio}"
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Coluna Direita: Ideias Criativas */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-orange-100 p-2 rounded-lg">
                <ImageIcon className="h-5 w-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Ideias para Imagens</h2>
            </div>
            
            <p className="text-sm text-gray-500 mb-6">Não sabe qual imagem usar no Meta Ads? Crie essas opções no Canva:</p>

            <div className="space-y-6">
              {data.creative_ideas?.map((idea: any, i: number) => (
                <div key={i} className="group">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-orange-600 transition-colors flex items-center gap-2">
                    <span className="flex items-center justify-center bg-gray-100 text-gray-500 rounded-full h-5 w-5 text-xs">
                      {i + 1}
                    </span>
                    {idea.concept}
                  </h3>
                  <p className="text-sm text-gray-600 pl-7 leading-relaxed">
                    {idea.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
