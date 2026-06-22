import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

import { checkAdmin, createAdminClient } from '@/utils/supabase/admin';

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

    const adminSupabase = createAdminClient();
    const { error } = await adminSupabase
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
