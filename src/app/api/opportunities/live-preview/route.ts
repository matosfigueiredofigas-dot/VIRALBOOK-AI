import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

export async function POST(req: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    const { saasName, problem, audience, features } = await req.json();

    if (!saasName || !problem) {
      return NextResponse.json({ error: 'Faltam parâmetros obrigatórios' }, { status: 400 });
    }

    const prompt = `
Você é um desenvolvedor Frontend Sênior e UI/UX Designer.
Sua missão é gerar um único arquivo HTML que represente a tela principal (Dashboard) de um Micro-SaaS.

Nome do SaaS: ${saasName}
Público Alvo: ${audience}
Problema que resolve: ${problem}
Funcionalidades Principais (MVP): ${features}

REGRAS OBRIGATÓRIAS:
1. Retorne APENAS CÓDIGO HTML válido, sem blocos de markdown (\`\`\`), sem introdução ou explicação.
2. Use Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
3. Use Lucide Icons (ou FontAwesome) e uma fonte moderna (Inter ou Roboto) do Google Fonts.
4. Crie uma interface ultra-moderna, "dark mode" ou clean B2B, com Sidebar lateral, Header superior, e métricas em "Cards" bonitos (dashboard).
5. O texto na tela deve estar em Português do Brasil e ser realista (sem Lorem Ipsum).
6. O layout DEVE SER RESPONSIVO (flexbox, grid).
7. Simule um ambiente "logado" do SaaS com dados fictícios interessantes baseados no propósito do sistema.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile', // Usando um modelo forte para geração de código
      temperature: 0.2, // Baixa temperatura para código estruturado e focado
    });

    let htmlCode = chatCompletion.choices[0]?.message?.content || '';

    // Limpeza de possíveis blocos de markdown que o LLM possa retornar por erro
    htmlCode = htmlCode.replace(/```html/g, '').replace(/```/g, '').trim();

    return NextResponse.json({ html: htmlCode });
  } catch (error: any) {
    console.error('[LivePreview] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Live Preview' }, { status: 500 });
  }
}
