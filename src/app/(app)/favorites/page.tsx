import { createClient, getCachedUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { OpportunitiesList } from '@/components/opportunities-list'
import { AdvancedFilters } from '@/components/advanced-filters'
import { Heart } from 'lucide-react'
import { getFilterDate } from '@/lib/utils'

export const dynamic = 'force-dynamic';

export default async function FavoritesPage(props: { searchParams: Promise<{ search?: string, minScore?: string, country?: string, time?: string }> }) {
  const user = await getCachedUser();

  if (!user) {
    redirect('/login')
  }

  const supabase = await createClient();
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const minScore = searchParams.minScore ? parseInt(searchParams.minScore) : 0;
  const country = searchParams.country || "ALL";
  const time = searchParams.time || "now";
  const filterDate = getFilterDate(time);

  // 2. Busca as oportunidades que foram favoritadas por este usuário
  const { data: userFavorites, error } = await supabase
    .from('user_favorites')
    .select(`
      opportunity_id,
      opportunities (
        id,
        created_at,
        saas_name,
        problem_solved,
        viral_opportunity_score,
        country,
        trends_growth_monthly,
        reddit_mentions,
        facebook_ads_count,
        facebook_groups_count,
        target_audience,
        competitive_advantage,
        suggested_price,
        book_category
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar favoritos:", error);
  }

  // Extrai as oportunidades limpas do array retornado
  let favorites = userFavorites?.map((fav: any) => fav.opportunities).filter(Boolean) || [];

  // Filtros Globais (Barra de Topo)
  if (country !== "ALL") {
    favorites = favorites.filter((f: any) => f.country === country);
  }

  if (filterDate) {
    favorites = favorites.filter((f: any) => f.created_at >= filterDate);
  }

  // Aplica os Filtros Avançados em memória (para a lista de favoritos, é super rápido e evita joins complexos)
  if (minScore > 0) {
    favorites = favorites.filter((f: any) => f.viral_opportunity_score >= minScore);
  }
  
  if (search) {
    const s = search.toLowerCase();
    favorites = favorites.filter((f: any) => 
      (f.saas_name && f.saas_name.toLowerCase().includes(s)) ||
      (f.book_category && f.book_category.toLowerCase().includes(s)) ||
      (f.problem_solved && f.problem_solved.toLowerCase().includes(s))
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3 bg-gradient-to-br from-red-400 to-red-600 bg-clip-text text-transparent w-fit pb-1">
          <Heart className="h-8 w-8 text-red-500 fill-red-500/20" />
          Ideias Guardadas
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          O seu cofre de oportunidades de micro-SaaS. Todas as ideias que você salvou estão aqui.
        </p>
      </div>

      <AdvancedFilters />

      {favorites.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-border/50 rounded-xl bg-muted/20">
          <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">Sua coleção está vazia</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Não encontramos nenhuma oportunidade salva que atenda a esses filtros.
          </p>
          <a href="/dashboard" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4">
            Voltar para o Radar
          </a>
        </div>
      ) : (
        <OpportunitiesList initialData={favorites} hideSearch={true} />
      )}
    </div>
  )
}
