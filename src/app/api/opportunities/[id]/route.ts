import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    // Verifica se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    // Busca a oportunidade por id, checando se é pública (user_id nulo) ou pertence ao usuário
    const { data: opportunity, error } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', id)
      .or(`user_id.is.null,user_id.eq.${user.id}`)
      .single();

    if (error || !opportunity) {
      console.error("[GET /api/opportunities/[id]] Erro ao buscar:", error);
      return NextResponse.json({ error: "Oportunidade não encontrada" }, { status: 404 });
    }

    return NextResponse.json(opportunity);
  } catch (err: any) {
    console.error("[GET /api/opportunities/[id]] Erro crítico:", err);
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
