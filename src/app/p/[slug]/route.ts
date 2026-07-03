import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(
  request: Request,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const { slug } = params;

    const supabase = await createClient();

    // Buscar a oportunidade pelo slug
    const { data: opp, error } = await supabase
      .from('opportunities')
      .select('landing_page_html, saas_name')
      .eq('published_slug', slug)
      .single();

    if (error || !opp || !opp.landing_page_html) {
      return new NextResponse(
        '<html><body><h1>Landing Page não encontrada ou ainda não publicada.</h1></body></html>',
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // Retorna o HTML puro salvo no banco
    return new NextResponse(opp.landing_page_html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('[Launchpad GET] Error:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}
