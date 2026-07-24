import { createClient, getCachedUser } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { FavoritesClient } from '@/components/favorites-client'
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
  const time = searchParams.time || "all";
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

  return <FavoritesClient favorites={favorites} />;
}
