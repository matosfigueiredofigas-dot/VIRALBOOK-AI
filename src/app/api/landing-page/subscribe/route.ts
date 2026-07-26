import { NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST(req: Request) {
  try {
    const { email, landingPageId } = await req.json();

    if (!email || !landingPageId) {
      return NextResponse.json({ error: 'E-mail e ID da página são obrigatórios.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Formato de e-mail inválido.' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // Inserir lead na lista de espera via Admin
    const { error } = await adminSupabase
      .from('waitlist_leads')
      .insert({
        landing_page_id: landingPageId,
        email: email.trim().toLowerCase()
      });

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Você já está inscrito nesta lista de espera!' }, { status: 400 });
      }
      // Tentar tabelaLegada se existir
      try {
        await adminSupabase.from('opportunity_leads').insert({
          landing_page_id: landingPageId,
          email: email.trim().toLowerCase()
        });
      } catch (e) {}
    }

    return NextResponse.json({ success: true, message: 'Inscrição realizada com sucesso!' });

  } catch (error: any) {
    console.error('Erro na subscrição de lead:', error);
    return NextResponse.json({ error: error.message || 'Erro ao registrar e-mail.' }, { status: 500 });
  }
}
