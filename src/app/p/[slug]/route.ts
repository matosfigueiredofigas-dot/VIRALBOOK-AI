import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

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
      .select('id, landing_page_html, saas_name, launchpad_views')
      .eq('published_slug', slug)
      .single();

    if (error || !opp || !opp.landing_page_html) {
      return new NextResponse(
        '<html><body><h1>Landing Page não encontrada ou ainda não publicada.</h1></body></html>',
        { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    // Incrementa Views (background)
    supabase.from('opportunities')
      .update({ launchpad_views: (opp.launchpad_views || 0) + 1 })
      .eq('id', opp.id)
      .then(); // não bloqueia a resposta

    // Retorna o HTML puro salvo no banco
    return new NextResponse(opp.landing_page_html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('[Launchpad GET] Error:', error);
    return new NextResponse('Erro interno do servidor', { status: 500 });
  }
}
