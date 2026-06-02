import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { OpportunitiesList } from "@/components/opportunities-list"
import { AdvancedFilters } from "@/components/advanced-filters"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, TrendingUp, Zap } from "lucide-react"

import { getFilterDate } from "@/lib/utils"

export const dynamic = 'force-dynamic';

export default async function DashboardPage(props: { searchParams: Promise<{ country?: string, time?: string, search?: string, minScore?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const country = searchParams.country || null; // Opcional
  const time = searchParams.time || "all";
  const search = searchParams.search || "";
  const minScore = searchParams.minScore ? parseInt(searchParams.minScore) : 0;
  
  const filterDate = getFilterDate(time);

  // Busca os dados filtrando pelo país apenas se fornecido
  let query = supabase
    .from('opportunities')
    .select('*')
    .order('created_at', { ascending: false });

  if (country) {
    query = query.eq('country', country);
  }

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  if (minScore > 0) {
    query = query.gte('viral_opportunity_score', minScore);
  }

  if (search) {
    // Usando .or para buscar texto no nome do saas, problema resolvido ou categoria do livro
    query = query.or(`saas_name.ilike.%${search}%,problem_solved.ilike.%${search}%,book_category.ilike.%${search}%`);
  }

  const { data: opportunities } = await query;

  const totalOpps = opportunities?.length || 0;
  const avgScore = totalOpps > 0 
    ? Math.round(opportunities!.reduce((acc, curr) => acc + curr.viral_opportunity_score, 0) / totalOpps)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-primary to-blue-500 bg-clip-text text-transparent w-fit pb-1">
              Radar Global de Oportunidades
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Analisando dados globais para detectar a sua próxima startup baseada em fatos, não em achismos.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/welcome">
              <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <Zap className="h-4 w-4" />
                Assistir Tutorial
              </div>
            </a>
            <a href={`/api/export/csv?country=${country}&time=${time}`} download>
              <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                <Zap className="h-4 w-4" />
                Exportar CSV
              </div>
            </a>
          </div>
        </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Oportunidades SaaS ({country})</CardTitle>
            <Zap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOpps}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Score Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgScore}</div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mercado Alvo</CardTitle>
            <Globe className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{country}</div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Filters */}
      <AdvancedFilters />

      <OpportunitiesList initialData={opportunities || []} />
    </div>
  )
}
