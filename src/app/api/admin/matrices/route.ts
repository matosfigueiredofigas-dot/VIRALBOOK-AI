import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { checkAdmin } from '@/utils/supabase/admin';
import { audiences, problems, technologies, monetizations } from '@/lib/matrices';

// 1. LISTAR ITENS DA MATRIZ (GET)
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: items, error } = await supabase
      .from('matrix_items')
      .select('*')
      .order('type', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error('Erro ao buscar matrizes:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}

// 2. INSERIR NOVO ITEM NA MATRIZ (POST)
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const { type, name, tier } = await req.json();

    if (!type || !name || !tier) {
      return NextResponse.json({ error: 'Campos type, name e tier são obrigatórios.' }, { status: 400 });
    }

    if (tier < 1 || tier > 6) {
      return NextResponse.json({ error: 'O Tier deve estar entre 1 e 6.' }, { status: 400 });
    }

    const validTypes = ['audience', 'problem', 'technology', 'monetization'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Tipo inválido.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('matrix_items')
      .insert([{ type, name: name.trim(), tier }])
      .select();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Este termo já está cadastrado nesta categoria.' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, item: data[0] });
  } catch (error: any) {
    console.error('Erro ao adicionar item na matriz:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}

// 3. APAGAR ITEM DA MATRIZ (DELETE)
export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID é obrigatório.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('matrix_items')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Item excluído com sucesso.' });
  } catch (error: any) {
    console.error('Erro ao deletar item da matriz:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}

// 4. RESTAURAR / SEMEAR MATRIZES PADRÃO (PUT)
export async function PUT(req: Request) {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    const { action } = await req.json();
    if (action !== 'seed') {
      return NextResponse.json({ error: 'Ação inválida.' }, { status: 400 });
    }

    // 1. Limpar tabela de matrizes
    const { error: deleteError } = await supabase
      .from('matrix_items')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Limpa tudo

    if (deleteError) throw deleteError;

    // 2. Mapear itens padrão das constantes estáticas em `src/lib/matrices.ts`
    const defaultItems = [
      ...audiences.map(item => ({ type: 'audience', name: item.name, tier: item.tier })),
      ...problems.map(item => ({ type: 'problem', name: item.name, tier: item.tier })),
      ...technologies.map(item => ({ type: 'technology', name: item.name, tier: item.tier })),
      ...monetizations.map(item => ({ type: 'monetization', name: item.name, tier: item.tier }))
    ];

    // Remover duplicados (mesmo tipo e nome) para evitar violação de UNIQUE constraint
    const seen = new Set<string>();
    const uniqueDefaultItems = defaultItems.filter(item => {
      const key = `${item.type}:${item.name.toLowerCase().trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Bulk insert (inserir em lotes de 100 para evitar limites de query)
    const chunkSize = 100;
    for (let i = 0; i < uniqueDefaultItems.length; i += chunkSize) {
      const chunk = uniqueDefaultItems.slice(i, i + chunkSize);
      const { error: insertError } = await supabase
        .from('matrix_items')
        .insert(chunk);

      if (insertError) throw insertError;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Matrizes padrão restauradas com sucesso.',
      count: uniqueDefaultItems.length
    });
  } catch (error: any) {
    console.error('Erro ao semear matrizes:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
