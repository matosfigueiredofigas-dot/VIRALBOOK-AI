import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Função auxiliar para validar se o usuário atual é o Admin principal
async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  // Proteção dupla: pelo e-mail do dono ou checando o role na tabela profiles
  if (user.email === 'moisesdematos@gmail.com') return true;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

// 1. LISTAR TODOS OS USUÁRIOS (GET)
export async function GET() {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    // Busca os perfis da tabela pública. Ordena por data de criação.
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users: profiles });

  } catch (error: any) {
    console.error('Erro na API de listar usuários (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}

// 2. ATUALIZAR STATUS DO USUÁRIO (PUT)
export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const { userId, isPremium, role } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: 'UserId é obrigatório.' }, { status: 400 });
    }

    const updateData: any = {};
    if (isPremium !== undefined) updateData.is_premium = isPremium;
    if (role !== undefined) updateData.role = role;

    const { data, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select();

    if (error) throw error;

    return NextResponse.json({ success: true, user: data[0] });

  } catch (error: any) {
    console.error('Erro na API de atualizar usuário (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
