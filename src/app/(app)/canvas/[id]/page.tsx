import { createClient, getCachedUser } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { PrintButton } from "@/components/print-button"
import { LivePreviewModal } from "@/components/live-preview-modal"
import { LaunchpadManager } from "@/components/launchpad-manager"

export const dynamic = 'force-dynamic';

export default async function CanvasPage(props: { params: Promise<{ id: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect("/login");
  }

  const supabase = await createClient();

  const params = await props.params;

  const { data: opportunity, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !opportunity) {
    notFound();
  }

  const { data: initialLeads } = await supabase
    .from('opportunity_leads')
    .select('*')
    .eq('opportunity_id', opportunity.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      
      {/* Controles apenas na tela (escondidos na impressão) */}
      <div className="print:hidden flex justify-between items-center mb-8 border-b pb-4">
        <a href="/dashboard" className="flex items-center gap-2 text-blue-600 hover:underline font-medium">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Radar
        </a>
        <div className="flex items-center gap-4">
          <p className="text-sm text-gray-500">Dica: Salve como PDF na janela de impressão.</p>
          <a href={`/teardown/${opportunity.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            📊 Dossiê de Mercado
          </a>
          <a href={`/hunter/${opportunity.id}`} className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            🎯 Hunter AI (Leads)
          </a>
          <LivePreviewModal opportunity={opportunity} />
          <PrintButton />
        </div>
      </div>

      {/* Cabeçalho do Canvas */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight">{opportunity.saas_name}</h1>
        <p className="text-lg text-gray-600">Lean Canvas & Plano de Execução MVP</p>
        <div className="mt-2 text-sm text-gray-400 font-mono">
          Gerado por ViralBook AI | Score: {opportunity.viral_opportunity_score} | País: {opportunity.country}
        </div>
      </div>

      {/* Grid do Lean Canvas (Estilo Tradicional) */}
      <div className="border-2 border-black grid grid-cols-5 grid-rows-3 gap-0 min-h-[600px] text-sm">
        
        {/* Problema (Col 1, Row 1-2) */}
        <div className="border-r-2 border-b-2 border-black p-4 row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">1. Problema</h2>
          <p className="text-gray-700">{opportunity.problem_solved}</p>
        </div>

        {/* Solução (Col 2, Row 1) */}
        <div className="border-r-2 border-b-2 border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">4. Solução</h2>
          <p className="text-gray-700">{opportunity.saas_name} (MVP)</p>
          <p className="text-gray-700 mt-2 line-clamp-4">{opportunity.mvp_features}</p>
        </div>

        {/* Proposta de Valor (Col 3, Row 1-2) */}
        <div className="border-r-2 border-b-2 border-black p-4 row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">2. Proposta de Valor Única</h2>
          <p className="text-gray-700">{opportunity.competitive_advantage}</p>
        </div>

        {/* Vantagem Injusta (Col 4, Row 1) */}
        <div className="border-r-2 border-b-2 border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">9. Vantagem Injusta</h2>
          <p className="text-gray-700">Primeiro a chegar ao mercado impulsionado por alta demanda no Reddit ({opportunity.reddit_mentions} menções) e crescimento no Google (+{opportunity.trends_growth_monthly}%).</p>
        </div>

        {/* Segmento de Clientes (Col 5, Row 1-2) */}
        <div className="border-b-2 border-black p-4 row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">3. Segmento de Clientes</h2>
          <p className="text-gray-700">{opportunity.target_audience}</p>
        </div>

        {/* Métricas Chave (Col 2, Row 2) */}
        <div className="border-r-2 border-b-2 border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">8. Métricas Chave</h2>
          <ul className="list-disc pl-4 text-gray-700">
            <li>Tráfego de Busca Orgânica</li>
            <li>Taxa de Conversão na Landing Page</li>
            <li>MRR (Receita Recorrente)</li>
          </ul>
        </div>

        {/* Canais (Col 4, Row 2) */}
        <div className="border-r-2 border-b-2 border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">5. Canais</h2>
          <ul className="list-disc pl-4 text-gray-700">
            <li>Google Ads (Termos do E-book)</li>
            <li>Comunidades do Reddit</li>
            <li>Cold Email (Outreach)</li>
          </ul>
        </div>

        {/* Estrutura de Custos (Col 1-2, Row 3) */}
        <div className="border-r-2 border-black p-4 col-span-3">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">7. Estrutura de Custos</h2>
          <p className="text-gray-700 mb-1"><strong>Tempo de Desenvolvimento:</strong> {opportunity.development_time}</p>
          <p className="text-gray-700"><strong>Dificuldade Técnica:</strong> {opportunity.implementation_difficulty}</p>
          <p className="text-gray-500 italic mt-2">Custos operacionais iniciais quase zerados utilizando Vercel e Supabase.</p>
        </div>

        {/* Fontes de Receita (Col 3-5, Row 3) */}
        <div className="p-4 col-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase">6. Fontes de Receita</h2>
          <p className="text-gray-700 mb-1"><strong>Modelo:</strong> {opportunity.monetization_model}</p>
          <p className="text-gray-700 mb-1"><strong>Preço Sugerido:</strong> {opportunity.suggested_price}</p>
          <p className="text-green-700 font-bold mt-2">Receita Potencial Estimada: {opportunity.potential_revenue}</p>
        </div>

      </div>

      <LaunchpadManager opportunity={opportunity} initialLeads={initialLeads || []} />

    </div>
  )
}
