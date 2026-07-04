import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Groq } from 'groq-sdk';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { topNiches } = await request.json();

    if (!topNiches || !Array.isArray(topNiches) || topNiches.length === 0) {
      return NextResponse.json({ error: 'Parâmetro topNiches é obrigatório' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not defined");
    }
    const groq = new Groq({ apiKey });

    const prompt = `Você é um CTO visionário e analista de Venture Capital.
O usuário capturou as seguintes macro-tendências (Nichos) no seu radar atual, ordenadas por potencial (Hype Score):
${topNiches.map((n: any) => `- ${n.name} (Hype Score: ${n.maxScore})`).join('\n')}

Seu objetivo é cruzar essas informações e sugerir **1 ÚNICA GRANDE IDEIA DE MICRO-SAAS** que atue na interseção dos top 3 nichos citados acima.
Mostre como a combinação dessas frentes de mercado cria um diferencial competitivo massivo ("Oceano Azul").

Formato de Resposta Exigido:
Retorne um parágrafo denso, ultra premium, direto ao ponto (sem firulas como "Aqui está sua resposta") explicando a oportunidade. Mantenha em no máximo 4 frases de alto impacto em português.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 400,
    });

    const aiContent = chatCompletion.choices[0]?.message?.content || "";

    return NextResponse.json({ insight: aiContent });
  } catch (error: any) {
    console.error('Niches AI API Error:', error);
    return NextResponse.json({ error: error.message || 'Erro interno no servidor' }, { status: 500 });
  }
}
