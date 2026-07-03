"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Target, TrendingUp, Swords, Zap, Loader2, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";

interface TeardownDashboardProps {
  opportunity: {
    id: string;
    saas_name: string;
    market_teardown_json: any | null;
  };
}

export function TeardownDashboard({ opportunity }: TeardownDashboardProps) {
  const [data, setData] = useState<any>(opportunity.market_teardown_json);
  const [loading, setLoading] = useState(!opportunity.market_teardown_json);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!data) {
      generateTeardown();
    }
  }, []);

  const generateTeardown = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/opportunities/teardown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opportunityId: opportunity.id })
      });
      const result = await res.json();
      
      if (res.ok && result.teardown) {
        setData(result.teardown);
      } else {
        setError(result.error || "Falha ao gerar dossiê");
      }
    } catch (err) {
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-indigo-200 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 flex items-center justify-center bg-indigo-600 rounded-full shadow-2xl">
            <Target className="h-10 w-10 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-4">Mapeando o Campo de Batalha...</h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Nossos agentes estão dissecando seus concorrentes, calculando o tamanho do mercado e definindo a melhor estratégia de ataque. Isso pode levar até 20 segundos.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center">
        <XCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Ops! Falha na Inteligência</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button onClick={generateTeardown} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-6xl mx-auto py-8 font-sans">
      <Link href={`/canvas/${opportunity.id}`} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Canvas
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Dossiê Competitivo: <span className="text-indigo-600">{opportunity.saas_name}</span>
        </h1>
        <p className="text-xl text-gray-500">Market Teardown & Estratégia de Go-to-Market</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {/* Market Overview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-indigo-600">
              <TrendingUp className="h-6 w-6" />
              <h2 className="text-xl font-bold text-gray-900">Visão de Mercado</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Tamanho (TAM/SAM/SOM)</p>
                <p className="font-semibold text-gray-900">{data.market_overview?.tam_sam_som}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Crescimento Anual (CAGR)</p>
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md text-sm font-bold">
                  <TrendingUp className="h-3 w-3" /> {data.market_overview?.growth_cagr}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-2">Drivers & Tendências</p>
                <ul className="space-y-2">
                  {data.market_overview?.key_trends?.map((trend: string, i: number) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <Zap className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" /> {trend}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-black text-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-400" /> Preço Sugerido
            </h2>
            <p className="text-gray-400 text-sm mb-6">{data.pricing_model_recommendation?.logic}</p>
            <div className="space-y-4">
              {data.pricing_model_recommendation?.tiers?.map((tier: any, i: number) => (
                <div key={i} className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-indigo-300">{tier.name}</span>
                    <span className="font-mono font-bold">{tier.price}</span>
                  </div>
                  <ul className="text-xs text-gray-300 space-y-1">
                    {tier.features?.map((f: string, j: number) => (
                      <li key={j} className="flex gap-2"><CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0 mt-0.5" /> {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competitors & GTM */}
        <div className="md:col-span-2 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Swords className="h-6 w-6 text-red-500" /> Raio-X dos Concorrentes
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {data.competitors?.map((comp: any, i: number) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative overflow-hidden group hover:border-red-200 transition-colors">
                  <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-bl-lg">
                    {comp.pricing}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">{comp.name}</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-bold text-emerald-600 block mb-1">FORÇA DELES:</span>
                      <p className="text-gray-600">{comp.strength}</p>
                    </div>
                    <div>
                      <span className="font-bold text-red-500 block mb-1">FRAQUEZA:</span>
                      <p className="text-gray-600">{comp.weakness}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <span className="font-bold text-indigo-600 block mb-1">NOSSA VANTAGEM INJUSTA:</span>
                      <p className="font-medium text-gray-900">{comp.our_edge}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
              <Rocket className="h-6 w-6 text-indigo-600" /> Go-to-Market (GTM)
            </h2>
            
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 mb-6">
              <h3 className="font-bold text-indigo-900 mb-2">Estratégia para os 100 Primeiros Clientes</h3>
              <p className="text-indigo-800 leading-relaxed">{data.go_to_market_strategy?.first_100_users}</p>
            </div>

            <div className="grid gap-4">
              {data.go_to_market_strategy?.acquisition_channels?.map((channel: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="bg-gray-100 text-gray-700 font-bold px-4 py-2 rounded-lg whitespace-nowrap text-center">
                    {channel.channel}
                  </div>
                  <p className="text-sm text-gray-600">{channel.tactics}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

// Icon hack para evitar muitos imports extras
function Rocket(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 3.82-13.012c4.1 4.1 5 10 5 10l-3-3"/><path d="m9 12-5 5"/><path d="m15 15-5-5"/><path d="m18 18-5-5"/><path d="m21 21-5-5"/><path d="m12 9-5 5"/></svg>;
}
