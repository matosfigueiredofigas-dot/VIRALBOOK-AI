import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Função auxiliar para validar se o usuário atual é o Admin principal
async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  if (['moisesdematos@gmail.com', 'edsonquicuca92@gmail.com'].includes(user.email)) return true;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

// EXCLUIR OPORTUNIDADE (DELETE - Admin Apenas)
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const opportunityId = searchParams.get('id');

    if (!opportunityId) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', opportunityId);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Oportunidade excluída com sucesso.' });

  } catch (error: any) {
    console.error('Erro na API de deletar oportunidade (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
