"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Crosshair, Copy, Check, Search, Mail, MessageSquare, Loader2, XCircle } from "lucide-react";
import Link from "next/link";

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
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-rose-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-rose-600 rounded-full shadow-2xl">
            <Crosshair className="h-10 w-10 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Hunter AI Ativado...</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Nossos agentes SDR estão vasculhando a web, escrevendo scripts persuasivos e criando as queries de busca perfeitas para o seu SaaS. Aguarde...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ops! Falha na Prospecção</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={generateHunter} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
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

      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          Command Center de Prospecção
        </h1>
        <p className="text-lg text-gray-500">Hunter AI gerou scripts e buscas para: <span className="font-bold text-rose-600">{opportunity.saas_name}</span></p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Coluna 1: Persona & Buscas */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Crosshair className="w-24 h-24" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Seu Alvo (Decision Maker)</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Quem Assina o Cheque</p>
                <p className="text-gray-900 font-medium">{data.target_persona?.decision_maker}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Cargos no LinkedIn</p>
                <div className="flex flex-wrap gap-2">
                  {data.target_persona?.job_titles?.map((title: string, i: number) => (
                    <span key={i} className="bg-rose-50 text-rose-700 px-2.5 py-1 rounded-md text-xs font-semibold border border-rose-100">
                      {title}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-bold uppercase mb-2">Setores Alvo</p>
                <ul className="list-disc pl-4 text-sm text-gray-600 space-y-1">
                  {data.target_persona?.industries?.map((ind: string, i: number) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-[#111827] rounded-2xl p-6 shadow-xl text-white">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-rose-400" />
              <h2 className="text-xl font-bold">Google Dorks</h2>
            </div>
            <p className="text-gray-400 text-sm mb-6">Copie e cole essas queries no Google para encontrar centenas de perfis perfeitos no LinkedIn.</p>
            
            <div className="space-y-4">
              {data.google_dorks?.map((dork: any, i: number) => (
                <div key={i} className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                  <div className="px-4 py-2 bg-white/5 border-b border-white/10 text-xs text-gray-300 font-medium flex justify-between items-center">
                    <span>{dork.description}</span>
                  </div>
                  <div className="p-4 flex gap-3 items-start">
                    <code className="text-sm text-rose-200 font-mono break-all flex-1 select-all">
                      {dork.query}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(dork.query, `dork-${i}`)}
                      className="shrink-0 p-2 hover:bg-white/10 rounded-md transition-colors"
                      title="Copiar para área de transferência"
                    >
                      {copiedId === `dork-${i}` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-gray-400" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Coluna 2: Cold Emails & LinkedIn */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Sequência de Cold Emails</h2>
            </div>
            
            <div className="p-6 space-y-8">
              {data.cold_emails?.map((email: any, i: number) => (
                <div key={i} className="relative group">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {email.step}
                    </span>
                    <button 
                      onClick={() => copyToClipboard(`Assunto: ${email.subject}\n\n${email.body}`, `email-${i}`)}
                      className="text-sm text-gray-500 hover:text-black flex items-center gap-1 transition-colors"
                    >
                      {copiedId === `email-${i}` ? <><Check className="h-4 w-4 text-emerald-500" /> Copiado</> : <><Copy className="h-4 w-4" /> Copiar</>}
                    </button>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 font-sans">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-500 font-medium mr-2">Assunto:</span>
                      <span className="text-gray-900 font-bold">{email.subject}</span>
                    </div>
                    <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {email.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">Scripts para LinkedIn (DM)</h2>
            </div>
            
            <div className="p-6 grid sm:grid-cols-2 gap-6">
              {data.linkedin_scripts?.map((script: any, i: number) => (
                <div key={i} className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 transition-colors bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-gray-900 text-sm">{script.type}</span>
                    <button 
                      onClick={() => copyToClipboard(script.message, `linkedin-${i}`)}
                      className="p-1.5 text-gray-400 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      {copiedId === `linkedin-${i}` ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    "{script.message}"
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
