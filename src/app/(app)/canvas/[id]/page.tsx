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
    <div className="min-h-screen bg-background text-foreground p-8 font-sans print:bg-white print:text-black">
      
      {/* Controles apenas na tela (escondidos na impressão) */}
      <div className="print:hidden flex justify-between items-center mb-8 border-b border-border pb-4">
        <a href="/dashboard" className="flex items-center gap-2 text-primary hover:underline font-medium">
          <ArrowLeft className="h-4 w-4" /> Voltar ao Radar
        </a>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">Dica: Salve como PDF na janela de impressão.</p>
          <a href={`/teardown/${opportunity.id}`} className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            📊 Dossiê de Mercado
          </a>
          <a href={`/hunter/${opportunity.id}`} className="bg-rose-600 hover:bg-rose-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            🎯 Hunter AI (Leads)
          </a>
          <a href={`/ads/${opportunity.id}`} className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm">
            📢 Ads (Anúncios)
          </a>
          <a href={`/advisors?oppId=${opportunity.id}`} className="bg-zinc-900 hover:bg-black text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2">
            🎓 Mentores
          </a>
          <a href={`/email-funnel?oppId=${opportunity.id}`} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm">
            📧 E-mails (Lançamento)
          </a>
          <a href="#launchpad" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 shadow-sm">
            🚀 Launchpad (Página)
          </a>
          <LivePreviewModal opportunity={opportunity} />
          <PrintButton />
        </div>
      </div>

      {/* Cabeçalho do Canvas */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold uppercase tracking-tight text-foreground print:text-black">{opportunity.saas_name}</h1>
        <p className="text-lg text-muted-foreground print:text-gray-600">Lean Canvas & Plano de Execução MVP</p>
        <div className="mt-2 text-sm text-gray-400 font-mono">
          Gerado por ViralBook AI | Score: {opportunity.viral_opportunity_score} | País: {opportunity.country}
        </div>
      </div>

      {/* Grid do Lean Canvas (Estilo Tradicional) */}
      <div className="border-2 border-border print:border-black grid grid-cols-5 grid-rows-3 gap-0 min-h-[600px] text-sm bg-card/30 backdrop-blur-md rounded-xl overflow-hidden print:bg-white print:rounded-none">
        
        {/* Problema (Col 1, Row 1-2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4 row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">1. Problema</h2>
          <p className="text-muted-foreground print:text-gray-700">{opportunity.problem_solved}</p>
        </div>

        {/* Solução (Col 2, Row 1) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">4. Solução</h2>
          <p className="text-muted-foreground print:text-gray-700">{opportunity.saas_name} (MVP)</p>
          <p className="text-muted-foreground print:text-gray-700 mt-2 line-clamp-4">{opportunity.mvp_features}</p>
        </div>

        {/* Proposta de Valor (Col 3, Row 1-2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4 row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">2. Proposta de Valor Única</h2>
          <p className="text-muted-foreground print:text-gray-700">{opportunity.competitive_advantage}</p>
        </div>

        {/* Vantagem Injusta (Col 4, Row 1) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">9. Vantagem Injusta</h2>
          <p className="text-muted-foreground print:text-gray-700">Primeiro a chegar ao mercado impulsionado por alta demanda no Reddit ({opportunity.reddit_mentions} menções) e crescimento no Google (+{opportunity.trends_growth_monthly}%).</p>
        </div>

        {/* Segmento de Clientes (Col 5, Row 1-2) */}
        <div className="border-b border-border print:border-b-2 print:border-black p-4 row-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">3. Segmento de Clientes</h2>
          <p className="text-muted-foreground print:text-gray-700">{opportunity.target_audience}</p>
        </div>

        {/* Métricas Chave (Col 2, Row 2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">8. Métricas Chave</h2>
          <ul className="list-disc pl-4 text-muted-foreground print:text-gray-700">
            <li>Tráfego de Busca Orgânica</li>
            <li>Taxa de Conversão na Landing Page</li>
            <li>MRR (Receita Recorrente)</li>
          </ul>
        </div>

        {/* Canais (Col 4, Row 2) */}
        <div className="border-r border-b border-border print:border-r-2 print:border-b-2 print:border-black p-4">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">5. Canais</h2>
          <ul className="list-disc pl-4 text-muted-foreground print:text-gray-700">
            <li>Google Ads (Termos do E-book)</li>
            <li>Comunidades do Reddit</li>
            <li>Cold Email (Outreach)</li>
          </ul>
        </div>

        {/* Estrutura de Custos (Col 1-2, Row 3) */}
        <div className="border-r border-border print:border-r-2 print:border-black p-4 col-span-3">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">7. Estrutura de Custos</h2>
          <p className="text-muted-foreground print:text-gray-700 mb-1"><strong>Tempo de Desenvolvimento:</strong> {opportunity.development_time}</p>
          <p className="text-muted-foreground print:text-gray-700"><strong>Dificuldade Técnica:</strong> {opportunity.implementation_difficulty}</p>
          <p className="text-muted-foreground/60 italic mt-2 print:text-gray-500">Custos operacionais iniciais quase zerados utilizando Vercel e Supabase.</p>
        </div>

        {/* Fontes de Receita (Col 3-5, Row 3) */}
        <div className="p-4 col-span-2">
          <h2 className="font-bold flex items-center gap-2 mb-2 uppercase text-foreground print:text-black">6. Fontes de Receita</h2>
          <p className="text-muted-foreground print:text-gray-700 mb-1"><strong>Modelo:</strong> {opportunity.monetization_model}</p>
          <p className="text-muted-foreground print:text-gray-700 mb-1"><strong>Preço Sugerido:</strong> {opportunity.suggested_price}</p>
          <p className="text-green-500 font-bold mt-2 print:text-green-700">Receita Potencial Estimada: {opportunity.potential_revenue}</p>
        </div>

      </div>

      <LaunchpadManager opportunity={opportunity} initialLeads={initialLeads || []} />

    </div>
  )
}
