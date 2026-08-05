import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const adminSupabase = createAdminClient();
    const { data, error } = await adminSupabase
      .from('app_settings')
      .select('key_name, key_value, updated_at');

    if (error) throw error;

    return NextResponse.json({ keys: data || [] });
  } catch (error: any) {
    console.error('Erro ao buscar chaves:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { key_name, key_value } = await req.json();

    if (!key_name) {
      return NextResponse.json({ error: 'key_name é obrigatório' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();
    
    // Se o valor estiver vazio, apagamos a chave
    if (!key_value || key_value.trim() === '') {
      const { error } = await adminSupabase
        .from('app_settings')
        .delete()
        .eq('key_name', key_name);
        
      if (error) throw error;
      return NextResponse.json({ success: true, message: 'Chave apagada com sucesso' });
    }

    // Caso contrário, fazemos upsert
    const { error } = await adminSupabase
      .from('app_settings')
      .upsert({
        key_name,
        key_value,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key_name' });

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Configuração salva com sucesso' });
  } catch (error: any) {
    console.error('Erro ao salvar configuração:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
