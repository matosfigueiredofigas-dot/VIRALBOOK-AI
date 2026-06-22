import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkAdmin, createAdminClient } from '@/utils/supabase/admin';

// 1. LISTAR MENSAGENS DE CONTATO (GET - Admin Apenas)
export async function GET() {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    // Usamos o cliente admin para evitar políticas de RLS e erros de recursão ao consultar perfis
    const adminSupabase = createAdminClient();
    const { data: contacts, error } = await adminSupabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ contacts });

  } catch (error: any) {
    console.error('Erro na API de listar contatos (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}

// 2. CRIAR NOVA MENSAGEM DE CONTATO (POST - Público)
export async function POST(req: Request) {
  try {
    // Usamos o admin client para contatos públicos para evitar recursão ou erros de RLS
    const adminSupabase = createAdminClient();
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    // Insere na tabela de contatos
    const { data, error } = await adminSupabase
      .from('contacts')
      .insert([{ name, email, message, status: 'pending' }])
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, contact: data[0] });

  } catch (error: any) {
    console.error('Erro ao enviar mensagem de contato:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}

// 3. ATUALIZAR STATUS DA MENSAGEM (PUT - Admin Apenas)
export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const { contactId, status } = await req.json();

    if (!contactId || !status) {
      return NextResponse.json({ error: 'Campos inválidos.' }, { status: 400 });
    }

    // Usamos o cliente admin para atualizar
    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from('contacts')
      .update({ status })
      .eq('id', contactId)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, contact: data[0] });

  } catch (error: any) {
    console.error('Erro na API de atualizar contato (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
