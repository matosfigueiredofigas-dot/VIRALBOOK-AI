import { getCachedUser } from "@/utils/supabase/server";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCachedUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("showcase_projects")
    .select("title, tagline, description, url, category, tags")
    .eq("id", id)
    .single();

  if (!project) {
    return NextResponse.json({ error: "Projeto não encontrado" }, { status: 404 });
  }

  const prompt = `Atuas como um Perito de Marketing de Crescimento e Copywriting Viral de SaaS.
Gera um Kit de Lançamento Viral para o seguinte produto:

Nome: ${project.title}
Tagline: ${project.tagline}
Descrição: ${project.description || "N/A"}
Link: ${project.url}
Categoria: ${project.category}
Tags: ${project.tags?.join(", ") || "N/A"}

Responde EXCLUSIVAMENTE em formato JSON com esta estrutura exata:
{
  "twitter": "Uma thread envolvente de 3 a 4 tweets (usa emojis, gancho poderoso, explica o problema, a solução e termina com CTA para o link e para votar no ViralBook AI)",
  "linkedin": "Post profissional e persuasivo para o LinkedIn focado na história do fundador, o problema resolvido e os resultados",
  "productHunt": "Copy de apresentação clássica de maker para o Product Hunt / Reddit IndieHackers (incluindo 'Why we built this' e oferta especial)"
}
Mantém o tom entusiasmado, moderno e com alto potencial de conversão.`;

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = chatCompletion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(content);

    return NextResponse.json({
      twitter: parsed.twitter || "",
      linkedin: parsed.linkedin || "",
      productHunt: parsed.productHunt || "",
    });
  } catch (error: any) {
    console.error("Erro na geração do Launch Kit:", error);
    return NextResponse.json(
      { error: "Falha ao gerar o kit de lançamento" },
      { status: 500 }
    );
  }
}
