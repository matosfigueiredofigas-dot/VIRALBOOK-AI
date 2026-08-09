import { NextResponse } from 'next/server';
import { generateWithFallback } from '@/lib/ai-generate';

export async function POST(req: Request) {
  try {
    const { messages, url, language = 'pt' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensagens inválidas' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    const targetLang = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Portuguese (Brazil)';

    const systemPrompt = {
      role: 'system',
      content: `Você é o "ViralBot", o Assistente Virtual e Guia Especialista Oficial da plataforma "ViralBook AI".
O usuário está utilizando a plataforma neste momento, e o URL em que ele se encontra é: ${url}

**CONHECIMENTO DA PLATAFORMA VIRALBOOK AI:**
O ViralBook AI é uma plataforma de inteligência de mercado para encontrar, validar e estruturar ideias de Micro-SaaS e produtos digitais com IA. O conceito central é analisar livros e tendências de sucesso e transformá-los em Software (SaaS). Ferramentas disponíveis:
- **Comece por Aqui (/welcome):** Tutorial de início rápido.
- **Manual Oficial (/docs):** Documentação completa.
- **Dashboard (/dashboard):** Visão geral e acesso rápido.
- **Fase 1: Ideação**
  - **Ebooks Radar (/radar):** Analisar e-books mais vendidos (Hotmart, Amazon) para descobrir "dores" que podem virar um SaaS (Livros que valem milhões).
  - **Biblioteca de Ideias (/library):** Descobrir ideias validadas.
- **Fase 2: Validação**
  - **Landing Pages (/landing-pages):** Gerar páginas de vendas de alta conversão para o SaaS.
  - **Conselho de Mentores (/advisors):** Conversar com especialistas em IA para arquitetura e lançamento.
- **Fase 3: Tração & Vendas**
  - **Automação de E-mails (/email-funnel):** Criar sequências de email.
  - **Comunidade (/showcase):** Ver projetos de sucesso.
- **Ferramentas de Oportunidades:**
  - **Lean Canvas (/canvas):** Plano de negócios do SaaS.
  - **Ad Factory Pro (/ads):** Gerar copy para anúncios.

Sua missão é atuar como suporte, guia de usabilidade e consultor de marketing digital. Foque sempre no objetivo principal: ajudar o usuário a encontrar ideias lucrativas (especialmente em e-books de não-ficção) e criar um SaaS de sucesso.

CRITICAL INSTRUCTION: Respond ALL questions and advice STRICTLY in the following language: **${targetLang}**.
Dê respostas calorosas, encorajadoras, curtas e super práticas.`
    };

    const payloadMessages = [systemPrompt, ...messages];

    const reply = await generateWithFallback({
      messages: payloadMessages as any,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1000,
    });

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error('Erro na rota de Chat AI Global:', error);
    return NextResponse.json({ error: error.message || 'Erro ao processar conversa.' }, { status: 500 });
  }
}
