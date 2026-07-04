import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API não configurada' }, { status: 500 });
    }

    const { topNiches } = await req.json();

    if (!topNiches || !Array.isArray(topNiches) || topNiches.length === 0) {
      return NextResponse.json({ error: 'Lista de nichos inválida' }, { status: 400 });
    }

    const prompt = `Você é um Analista Estratégico de Mercado estilo Bloomberg.
Eu te passarei uma lista dos nichos de SaaS que estão crescendo mais rápido neste exato momento (baseado em volume do Reddit e % de crescimento).
Sua tarefa é analisar os padrões entre eles e me retornar um ÚNICO parágrafo (de impacto e direto ao ponto) revelando: Qual é a grande oportunidade escondida conectando esses nichos? O que o mercado está gritando que precisa?

Aqui estão os nichos do momento:
${topNiches.map((n, i) => `${i + 1}. ${n.saas_name} (Categoria: ${n.book_category}, Crescimento: +${n.trends_growth_monthly}%)`).join('\\n')}

Retorne APENAS o parágrafo da análise, sem introduções. Seja profissional, visionário e use um tom "Ultra Premium".`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
    });

    const summary = chatCompletion.choices[0]?.message?.content?.trim() || 'Análise não gerada.';

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error(`[API Trends Summary] Error:`, error);
    return NextResponse.json({ error: error.message || 'Erro interno' }, { status: 500 });
  }
}
