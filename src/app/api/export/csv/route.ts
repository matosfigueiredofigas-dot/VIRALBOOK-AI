import { supabase as adminSupabase } from '@/lib/supabase'
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

import { getFilterDate } from '@/lib/utils'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const country = searchParams.get('country') || 'US'
  const time = searchParams.get('time') || 'all'
  const filterDate = getFilterDate(time);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse('Unauthorized. Faça login para exportar.', { status: 401 })
  }

  // Busca os dados
  let query = adminSupabase
    .from('opportunities')
    .select('*')
    .eq('country', country)
    .order('viral_opportunity_score', { ascending: false })

  if (filterDate) {
    query = query.gte('created_at', filterDate);
  }

  const { data, error } = await query;

  if (error || !data) {
    return NextResponse.json({ error: 'Falha ao buscar dados' }, { status: 500 })
  }

  // Define os headers do CSV
  const csvHeaders = [
    'SaaS Name', 'Score', 'Country', 'Book Category', 'Problem Solved',
    'Target Audience', 'Monetization', 'MRR Potential', 'Difficulty',
    'Reddit Mentions', 'Facebook Ads Count', 'Facebook Groups Count'
  ].join(',')

  // Mapeia os dados escapando aspas e vírgulas para evitar quebra do CSV
  const csvRows = data.map(row => {
    return [
      `"${(row.saas_name || '').replace(/"/g, '""')}"`,
      row.viral_opportunity_score,
      row.country,
      `"${(row.book_category || '').replace(/"/g, '""')}"`,
      `"${(row.problem_solved || '').replace(/"/g, '""')}"`,
      `"${(row.target_audience || '').replace(/"/g, '""')}"`,
      `"${(row.monetization_model || '').replace(/"/g, '""')}"`,
      `"${(row.potential_revenue || '').replace(/"/g, '""')}"`,
      row.implementation_difficulty,
      row.reddit_mentions || 0,
      row.facebook_ads_count || 0,
      row.facebook_groups_count || 0
    ].join(',')
  })

  const csvText = [csvHeaders, ...csvRows].join('\n')

  return new NextResponse(csvText, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="viralbook_opportunities_${country}.csv"`,
    },
  })
}
