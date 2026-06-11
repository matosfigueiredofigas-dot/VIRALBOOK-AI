import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

export async function POST(req: Request) {
  try {
    const { messages, contextText } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    // Cria o System Prompt com o contexto do SaaS
    const systemPrompt = {
      role: 'system',
      content: `Você é um CTO e Mentor de Startups experiente e direto.
O usuário acabou de gerar a seguinte ideia de Micro-SaaS usando inteligência artificial:

CONTEXTO DA IDEIA:
${contextText}

Sua missão é ajudar o usuário a construir, nomear, precificar e programar essa ideia.
Dê respostas curtas, práticas, em português do Brasil e diretas ao ponto. Se o usuário pedir código (React, Next.js, etc), escreva o código. Se ele pedir nomes, dê nomes curtos e em inglês/português. Sempre seja encorajador, mas focado na execução e lançamento rápido.`
    };

    // Monta o payload final
    const payloadMessages = [systemPrompt, ...messages];

    // Fila de contingência para o chat: 1º Llama 70B, 2º Mixtral, 3º Llama 8B
    const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
    let reply = "";
    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Chat API] Tentando modelo: ${model}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: payloadMessages as any,
          model: model,
          temperature: 0.7,
          max_tokens: 1500,
        });

        reply = chatCompletion.choices[0]?.message?.content || "";
        if (reply) {
          console.log(`[Chat API] Resposta gerada com sucesso usando: ${model}`);
          break;
        }
      } catch (error: any) {
        console.warn(`[Chat API] Falha com o modelo ${model}. Tentando backup... Erro:`, error.message || error);
        lastError = error;
      }
    }

    if (!reply) {
      throw new Error(`Falha crítica: Todos os modelos de chat falharam. Último erro: ${lastError?.message || lastError}`);
    }

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Erro na rota de Chat AI:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar conversa.' }, { status: 500 });
  }
}
