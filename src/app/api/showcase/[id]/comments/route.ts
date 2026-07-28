import { getCachedUser, createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: comments, error } = await supabase
    .from("showcase_comments")
    .select("id, content, created_at, user_id")
    .eq("project_id", id)
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Obter emails dos autores se houver comentários
  const userIds = [...new Set((comments || []).map((c) => c.user_id))];
  let authorMap: Record<string, string> = {};
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email")
      .in("id", userIds);
    if (profiles) {
      profiles.forEach((p: any) => {
        authorMap[p.id] = p.email;
      });
    }
  }

  const enrichedComments = (comments || []).map((c) => ({
    ...c,
    author_email: authorMap[c.user_id] || "Membro da Comunidade",
  }));

  return NextResponse.json(enrichedComments);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCachedUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const { content } = await request.json();

  if (!content || typeof content !== "string" || !content.trim()) {
    return NextResponse.json(
      { error: "O comentário não pode estar vazio" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data: comment, error } = await supabase
    .from("showcase_comments")
    .insert([
      {
        project_id: id,
        user_id: user.id,
        content: content.trim(),
      },
    ])
    .select("id, content, created_at, user_id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    ...comment,
    author_email: user.email || "Você",
  });
}
