import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const email = formData.get('email') as string;
    const opportunity_id = formData.get('opportunity_id') as string;
    const redirect_to = formData.get('redirect_to') as string;

    if (!email || !opportunity_id) {
      return NextResponse.json({ error: 'Faltam campos obrigatórios' }, { status: 400 });
    }

    const supabase = await createClient();

    // Inserção pública do Lead (garantido pela policy de RLS INSERT WITH CHECK (true))
    const { error } = await supabase
      .from('opportunity_leads')
      .insert([
        {
          opportunity_id,
          email,
        }
      ]);

    if (error) {
      console.error('[Leads API] Erro ao salvar lead:', error);
      // Fallback: se não der para redirecionar, retorna JSON
      return NextResponse.json({ error: 'Falha ao salvar e-mail' }, { status: 500 });
    }

    if (redirect_to) {
      // Redireciona o usuário de volta para a Landing Page com status 303 para forçar um GET
      return NextResponse.redirect(new URL(redirect_to, req.url), 303);
    }

    return NextResponse.json({ success: true, message: 'Cadastrado com sucesso!' });
  } catch (error: any) {
    console.error('[Leads API] Erro catastrófico:', error);
    return NextResponse.json({ error: error.message || 'Erro de servidor' }, { status: 500 });
  }
}
