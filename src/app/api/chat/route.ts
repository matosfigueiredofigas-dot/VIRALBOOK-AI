import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/ai-generate';
export async function POST(req: Request) {
  try {
    const { messages, contextText, language = 'pt' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    const targetLang = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Portuguese (Brazil)';

    // Cria o System Prompt com o contexto do SaaS
    const systemPrompt = {
      role: 'system',
      content: `Você é um CTO e Mentor de Startups experiente e direto.
O usuário acabou de gerar a seguinte ideia de Micro-SaaS usando inteligência artificial:

CONTEXTO DA IDEIA:
${contextText}

Sua missão é ajudar o usuário a construir, nomear, precificar e programar essa ideia.
CRITICAL INSTRUCTION: Respond ALL questions, code comments, and advice STRICTLY in the following language: **${targetLang}**.
Dê respostas curtas, práticas e diretas ao ponto. Se o usuário pedir código (React, Next.js, etc), escreva o código. Se ele pedir nomes, dê nomes curtos. Sempre seja encorajador, mas focado na execução e lançamento rápido.`
    };

    // Monta o payload final
    const payloadMessages = [systemPrompt, ...messages];

    // Chama a função centralizada que tenta o Groq e faz fallback para o Gemini 1.5 Flash
    const reply = await generateWithFallback({
      messages: payloadMessages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1500,
    });


    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Erro na rota de Chat AI:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar conversa.' }, { status: 500 });
  }
}
