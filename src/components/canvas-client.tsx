"use client";

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
  const { language } = useLanguage();
  const isEn = language === 'en';
  const isEs = language === 'es';

  const [opp, setOpp] = useState(initialOpp);
  const [isTranslating, setIsTranslating] = useState(false);

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
    <div className="min-h-screen bg-background text-foreground p-8 font-sans print:bg-white print:text-black">
      
      {/* Controles apenas na tela (escondidos na impressão) */}
      <div className="print:hidden flex flex-wrap justify-between items-center mb-8 border-b border-border pb-4 gap-4">
        <a href="/dashboard" className="flex items-center gap-2 text-primary hover:underline font-medium">
          <ArrowLeft className="h-4 w-4" /> {isEn ? "Back to Radar" : isEs ? "Volver al Radar" : "Voltar ao Radar"}
        </a>
        <div className="flex flex-wrap items-center gap-3">
          {isTranslating && (
            <span className="flex items-center gap-1.5 text-xs text-primary font-semibold animate-pulse bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {isEn ? "Translating Canvas..." : isEs ? "Traduciendo Canvas..." : "Traduzindo Canvas..."}
            </span>
          )}
          <p className="text-xs text-muted-foreground hidden lg:block">
            {isEn ? "Tip: Save as PDF in the print window." : isEs ? "Consejo: Guarde como PDF en la ventana de impresión." : "Dica: Salve como PDF na janela de impressão."}
          </p>
          <a href={`/teardown/${opp.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5">
            📊 {isEn ? "Market Dossier" : isEs ? "Dossier de Mercado" : "Dossiê de Mercado"}
          </a>
          <a href={`/hunter/${opp.id}`} className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5">
            🎯 {isEn ? "Hunter AI (Leads)" : isEs ? "Cazador IA (Leads)" : "Hunter AI (Leads)"}
          </a>
          <a href={`/ads/${opp.id}`} className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm">
            📢 {isEn ? "Ads (Campaigns)" : isEs ? "Ads (Campañas)" : "Ads (Campanhas)"}
          </a>
          <a href={`/advisors?oppId=${opp.id}`} className="bg-zinc-900 hover:bg-black text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5">
            🎓 {isEn ? "Advisors" : isEs ? "Mentores" : "Mentores"}
          </a>
          <a href={`/email-funnel?oppId=${opp.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm">
            📧 {isEn ? "Emails (Launch)" : isEs ? "Emails (Lanzamiento)" : "E-mails (Lançamento)"}
          </a>
          <a href="#launchpad" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3.5 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-sm">
            🚀 {isEn ? "Launchpad" : isEs ? "Lanzadera" : "Launchpad"}
          </a>
          <LivePreviewModal opportunity={opp} />
          <PrintButton />
        </div>
      </div>

      {/* Cabeçalho do Canvas */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-foreground print:text-black">{opp.saas_name}</h1>
        <p className="text-lg text-muted-foreground print:text-gray-600">
          {isEn ? "Lean Canvas & MVP Execution Plan" : isEs ? "Lean Canvas y Plan de Ejecución MVP" : "Lean Canvas & Plano de Execução MVP"}
        </p>
        <div className="mt-2 text-xs text-gray-400 font-mono">
          {isEn ? "Generated by ViralBook AI" : isEs ? "Generado por ViralBook AI" : "Gerado por ViralBook AI"} | Score: {opp.viral_opportunity_score} | {isEn ? "Country:" : isEs ? "País:" : "País:"} {opp.country}
        </div>
      </div>

      {/* Grid do Lean Canvas (Estilo Tradicional) */}
      <div className="border-2 border-border print:border-black grid grid-cols-1 md:grid-cols-5 md:grid-rows-3 gap-0 min-h-[600px] text-sm bg-card/30 backdrop-blur-md rounded-xl overflow-hidden print:bg-white print:rounded-none">
        
        {/* Problema (Col 1, Row 1-2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4 md:row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "1. Problem" : isEs ? "1. Problema" : "1. Problema"}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">{opp.problem_solved}</p>
        </div>

        {/* Solução (Col 2, Row 1) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "4. Solution" : isEs ? "4. Solución" : "4. Solução"}
          </h2>
          <p className="text-muted-foreground print:text-gray-700 font-bold">{opp.saas_name} (MVP)</p>
          <p className="text-muted-foreground print:text-gray-700 mt-2 line-clamp-4">{opp.mvp_features}</p>
        </div>

        {/* Proposta de Valor (Col 3, Row 1-2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4 md:row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "2. Unique Value Proposition" : isEs ? "2. Propuesta de Valor Única" : "2. Proposta de Valor Única"}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">{opp.competitive_advantage}</p>
        </div>

        {/* Vantagem Injusta (Col 4, Row 1) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "9. Unfair Advantage" : isEs ? "9. Ventaja Injusta" : "9. Vantagem Injusta"}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">
            {isEn 
              ? `First to market driven by high Reddit demand (${metrics.reddit_mentions} mentions) and Google growth (+${opp.trends_growth_monthly}%).` 
              : isEs 
              ? `Primero en llegar al mercado impulsado por alta demanda en Reddit (${metrics.reddit_mentions} menciones) y crecimiento en Google (+${opp.trends_growth_monthly}%).` 
              : `Primeiro a chegar ao mercado impulsionado por alta demanda no Reddit (${metrics.reddit_mentions} menções) e crescimento no Google (+${opp.trends_growth_monthly}%).`}
          </p>
        </div>

        {/* Segmento de Clientes (Col 5, Row 1-2) */}
        <div className="border-b border-border print:border-b-2 print:border-black p-4 md:row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "3. Customer Segments" : isEs ? "3. Segmentos de Clientes" : "3. Segmento de Clientes"}
          </h2>
          <p className="text-muted-foreground print:text-gray-700">{opp.target_audience}</p>
        </div>

        {/* Métricas Chave (Col 2, Row 2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "8. Key Metrics" : isEs ? "8. Métricas Clave" : "8. Métricas Chave"}
          </h2>
          <ul className="list-disc pl-4 text-muted-foreground print:text-gray-700 space-y-1">
            <li>{isEn ? "Organic Search Traffic" : isEs ? "Tráfico de Búsqueda Orgánica" : "Tráfego de Busca Orgânica"}</li>
            <li>{isEn ? "Landing Page Conversion Rate" : isEs ? "Tasa de Conversión en Landing Page" : "Taxa de Conversão na Landing Page"}</li>
            <li>{isEn ? "MRR (Recurring Revenue)" : isEs ? "MRR (Ingresos Recurrentes)" : "MRR (Receita Recorrente)"}</li>
          </ul>
        </div>

        {/* Canais (Col 4, Row 2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "5. Channels" : isEs ? "5. Canales" : "5. Canais"}
          </h2>
          <ul className="list-disc pl-4 text-muted-foreground print:text-gray-700 space-y-1">
            <li>{isEn ? "Google Ads (E-book Search Terms)" : isEs ? "Google Ads (Términos del Libro)" : "Google Ads (Termos do E-book)"}</li>
            <li>{isEn ? "Reddit Communities" : isEs ? "Comunidades de Reddit" : "Comunidades do Reddit"}</li>
            <li>{isEn ? "Cold Email (Outreach)" : isEs ? "Email Frío (Outreach)" : "Cold Email (Outreach)"}</li>
          </ul>
        </div>

        {/* Estrutura de Custos (Col 1-2, Row 3) */}
        <div className="border-r border-border print:border-r-2 print:border-black p-4 md:col-span-3">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "7. Cost Structure" : isEs ? "7. Estructura de Costes" : "7. Estrutura de Custos"}
          </h2>
          <p className="text-muted-foreground print:text-gray-700 mb-1">
            <strong>{isEn ? "Development Time:" : isEs ? "Tiempo de Desarrollo:" : "Tempo de Desenvolvimento:"}</strong> {opp.development_time}
          </p>
          <p className="text-muted-foreground print:text-gray-700">
            <strong>{isEn ? "Technical Difficulty:" : isEs ? "Dificultad Técnica:" : "Dificuldade Técnica:"}</strong> {opp.implementation_difficulty}
          </p>
          <p className="text-muted-foreground/60 italic mt-2 print:text-gray-500">
            {isEn 
              ? "Initial operating costs near zero using Vercel and Supabase." 
              : isEs 
              ? "Costes operativos iniciales casi nulos usando Vercel y Supabase." 
              : "Custos operacionais iniciais quase zerados utilizando Vercel e Supabase."}
          </p>
        </div>

        {/* Fontes de Receita (Col 3-5, Row 3) */}
        <div className="p-4 md:col-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">
            {isEn ? "6. Revenue Streams" : isEs ? "6. Fuentes de Ingresos" : "6. Fontes de Receita"}
          </h2>
          <p className="text-muted-foreground print:text-gray-700 mb-1">
            <strong>{isEn ? "Model:" : isEs ? "Modelo:" : "Modelo:"}</strong> {opp.monetization_model}
          </p>
          <p className="text-muted-foreground print:text-gray-700 mb-1">
            <strong>{isEn ? "Suggested Price:" : isEs ? "Precio Sugerido:" : "Preço Sugerido:"}</strong> {opp.suggested_price}
          </p>
          <p className="text-green-500 font-bold mt-2 print:text-green-700">
            {isEn ? "Estimated Potential Revenue:" : isEs ? "Ingresos Potenciales Estimados:" : "Receita Potencial Estimada:"} {opp.potential_revenue}
          </p>
        </div>

      </div>

      <LaunchpadManager opportunity={opp} initialLeads={initialLeads || []} />

    </div>
  );
}
