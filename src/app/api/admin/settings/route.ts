import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkAdmin } from '@/utils/supabase/admin';

// Validação simples de tipo
type SettingsPayload = {
  ai_weights?: {
    trends: number;
    reddit: number;
    facebook: number;
    book: number;
    ai: number;
  }
};

const DEFAULT_WEIGHTS = {
  trends: 25,
  reddit: 20,
  facebook: 20,
  book: 20,
  ai: 15
};

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Qualquer usuário pode ler as configurações (necessário para calcular score ou exibir na UI)
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .eq('id', 'ai_weights')
      .single();

    // Se a tabela não existir ou estiver vazia, retorna os valores padrão
    if (error) {
      console.log('Nenhuma configuração encontrada no banco, usando padrão.');
      return NextResponse.json({ settings: { ai_weights: DEFAULT_WEIGHTS } });
    }

    return NextResponse.json({ settings: { ai_weights: data.value || DEFAULT_WEIGHTS } });
  } catch (error: any) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json({ settings: { ai_weights: DEFAULT_WEIGHTS } });
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const payload: SettingsPayload = await req.json();

    if (!payload.ai_weights) {
      return NextResponse.json({ error: 'Dados inválidos.' }, { status: 400 });
    }

    // Calcular se a soma é 100%
    const sum = Object.values(payload.ai_weights).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      return NextResponse.json({ error: `A soma dos pesos deve ser exatamente 100%. Soma atual: ${sum}%` }, { status: 400 });
    }

    // Upsert usando o admin client para contornar problemas se a RLS estiver mal configurada temporariamente
    const { createAdminClient } = await import('@/utils/supabase/admin');
    const adminSupabase = createAdminClient();

    const { error } = await adminSupabase
      .from('system_settings')
      .upsert({
        id: 'ai_weights',
        value: payload.ai_weights,
        updated_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, settings: payload });
  } catch (error: any) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
