import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { email, landingPageId } = await req.json();

    if (!email || !landingPageId) {
      return NextResponse.json({ error: 'E-mail e ID da página são obrigatórios.' }, { status: 400 });
    }

    // Validar formato básico de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Formato de e-mail inválido.' }, { status: 400 });
    }

    // Inserir lead na lista de espera
    const { error } = await supabase
      .from('waitlist_leads')
      .insert({
        landing_page_id: landingPageId,
        email: email.trim().toLowerCase()
      });

    if (error) {
      if (error.code === '23505') { // Código do PostgreSQL para Unique Violation
        return NextResponse.json({ error: 'Você já está inscrito nesta lista de espera!' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, message: 'Inscrição realizada com sucesso!' });

  } catch (error: any) {
    console.error('Erro na subscrição de lead:', error);
    return NextResponse.json({ error: error.message || 'Erro ao registrar e-mail.' }, { status: 500 });
  }
}
