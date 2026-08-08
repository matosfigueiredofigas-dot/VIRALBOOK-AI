"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { ArrowLeft, Loader2 } from "lucide-react";
import { PrintButton } from "@/components/print-button";
import { LivePreviewModal } from "@/components/live-preview-modal";
import { LaunchpadManager } from "@/components/launchpad-manager";

interface CanvasClientProps {
  opportunity: any;
  metrics: any;
  initialLeads: any[];
}

export function CanvasClient({ opportunity: initialOpp, metrics, initialLeads }: CanvasClientProps) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  const [opp, setOpp] = useState(initialOpp);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(`/dashboard?open=${opp.id}`);
    }
  };

  useEffect(() => {
    if (!language || language === 'pt') {
      setOpp(initialOpp);
      return;
    }

    let isMounted = true;
    const translateContent = async () => {
      setIsTranslating(true);
      try {
        const payloadToTranslate = {
          problem_solved: initialOpp.problem_solved,
          mvp_features: initialOpp.mvp_features,
          competitive_advantage: initialOpp.competitive_advantage,
          target_audience: initialOpp.target_audience,
          development_time: initialOpp.development_time,
          implementation_difficulty: initialOpp.implementation_difficulty,
          monetization_model: initialOpp.monetization_model,
          suggested_price: initialOpp.suggested_price,
          potential_revenue: initialOpp.potential_revenue,
        };

        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: payloadToTranslate,
            targetLanguage: language
          })
        });

        const data = await res.json();
        if (isMounted && data.translatedPayload) {
          setOpp({
            ...initialOpp,
            ...data.translatedPayload
          });
        }
      } catch (err) {
        console.error("Translation error:", err);
      } finally {
        if (isMounted) setIsTranslating(false);
      }
    };

    translateContent();
    return () => { isMounted = false; };
  }, [language, initialOpp]);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans print:bg-white print:text-black">
      
      <div className="-mt-6 md:-mt-8 -mx-6 md:-mx-8">
        {/* Controles apenas na tela (escondidos na impressão) */}
        <div className="print:hidden flex flex-wrap justify-between items-center border-b border-border/50 px-6 md:px-8 py-4 gap-4 sticky top-0 z-[100] bg-background/95 backdrop-blur-md shadow-sm">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-primary hover:underline font-medium cursor-pointer bg-transparent border-0 p-0"
          >
            <ArrowLeft className="h-4 w-4" /> {t.blueprint.back}
          </button>
          <div className="flex flex-wrap items-center gap-3">
            {isTranslating && (
              <span className="flex items-center gap-1.5 text-xs text-primary font-semibold animate-pulse bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                {t.blueprint.translatingCanvas}
              </span>
            )}
            <a href={`/teardown/${opp.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5">
              📊 {t.blueprint.marketDossier}
            </a>
            <a href={`/hunter/${opp.id}`} className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5">
              🎯 {t.blueprint.hunterLeads}
            </a>
            <a href={`/ads/${opp.id}`} className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm">
              📢 {t.blueprint.adsCampaigns}
            </a>
            <a href={`/advisors?oppId=${opp.id}`} className="bg-zinc-900 hover:bg-black text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5">
              🎓 {t.common.advisors}
            </a>
            <a href={`/email-funnel?oppId=${opp.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm">
              📧 {t.blueprint.emailsLaunch}
            </a>
            <a href="#launchpad" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm">
              🚀 {t.blueprint.launchpad}
            </a>
            <LivePreviewModal opportunity={opp} />
            <PrintButton />
          </div>
        </div>

        <div className="p-6 md:p-8 pt-6">
          {/* Cabeçalho do Canvas */}
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold uppercase tracking-tight text-foreground print:text-black">{opp.saas_name}</h1>
            <p className="text-lg text-muted-foreground print:text-gray-600">
              {t.blueprint.canvasSubtitle}
            </p>
            <div className="mt-2 text-xs text-gray-400 font-mono">
              {t.blueprint.generatedBy} | {t.blueprint.score} {opp.viral_opportunity_score} | {t.blueprint.country} {opp.country}
            </div>
          </div>

      {/* Grid do Lean Canvas (Estilo Tradicional) */}
      <div className="border-2 border-border print:border-black grid grid-cols-1 md:grid-cols-5 md:grid-rows-3 gap-0 min-h-[600px] text-sm bg-card/30 backdrop-blur-md rounded-xl overflow-hidden print:bg-white print:rounded-none">
        
        {/* Problema (Col 1, Row 1-2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4 md:row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.problem}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">{opp.problem_solved}</p>
        </div>

        {/* Solução (Col 2, Row 1) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.solution}
          </h2>
          <p className="text-muted-foreground print:text-gray-700 font-bold">{opp.saas_name} (MVP)</p>
          <p className="text-muted-foreground print:text-gray-700 mt-2 line-clamp-4">{opp.mvp_features}</p>
        </div>

        {/* Proposta de Valor (Col 3, Row 1-2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4 md:row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.valueProp}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">{opp.competitive_advantage}</p>
        </div>

        {/* Vantagem Injusta (Col 4, Row 1) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.unfairAdvantage}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">
            {t.blueprint.unfairAdvantageDesc.replace('{mentions}', String(metrics.reddit_mentions)).replace('{growth}', String(opp.trends_growth_monthly))}
          </p>
        </div>

        {/* Segmento de Clientes (Col 5, Row 1-2) */}
        <div className="border-b border-border print:border-b-2 print:border-black p-4 md:row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.customerSegments}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">{opp.target_audience}</p>
        </div>

        {/* Métricas Chave (Col 2, Row 2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.keyMetrics}
          </h2>
          <ul className="list-disc pl-4 text-muted-foreground print:text-gray-700 space-y-1">
            <li>{t.blueprint.organicTraffic}</li>
            <li>{t.blueprint.lpConversion}</li>
            <li>{t.blueprint.mrr}</li>
          </ul>
        </div>

        {/* Canais (Col 4, Row 2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.channels}
          </h2>
          <ul className="list-disc pl-4 text-muted-foreground print:text-gray-700 space-y-1">
            <li>{t.blueprint.googleAds}</li>
            <li>{t.blueprint.redditCommunities}</li>
            <li>{t.blueprint.coldEmail}</li>
          </ul>
        </div>

        {/* Estrutura de Custos (Col 1-2, Row 3) */}
        <div className="border-r border-border print:border-r-2 print:border-black p-4 md:col-span-3">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.costStructure}
          </h2>
          <p className="text-muted-foreground print:text-gray-700 mb-1">
            <strong>{t.blueprint.devTime}</strong> {opp.development_time}
          </p>
          <p className="text-muted-foreground print:text-gray-700">
            <strong>{t.blueprint.techDifficulty}</strong> {opp.implementation_difficulty}
          </p>
          <p className="text-muted-foreground/60 italic mt-2 print:text-gray-500">
            {t.blueprint.initialCosts}
          </p>
        </div>

        {/* Fontes de Receita (Col 3-5, Row 3) */}
        <div className="p-4 md:col-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {t.blueprint.revenueStreams}
          </h2>
          <p className="text-muted-foreground print:text-gray-700 mb-1">
            <strong>{t.blueprint.model}</strong> {opp.monetization_model}
          </p>
          <p className="text-muted-foreground print:text-gray-700 mb-1">
            <strong>{t.blueprint.suggestedPrice}</strong> {opp.suggested_price}
          </p>
          <p className="text-green-500 font-bold mt-2 print:text-green-700">
            {t.blueprint.estRevenue} {opp.potential_revenue}
          </p>
        </div>

      </div>

      <LaunchpadManager opportunity={opp} initialLeads={initialLeads || []} />
        </div>
      </div>

    </div>
  );
}
