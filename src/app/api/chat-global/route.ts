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

**CONHECIMENTO DA PLATAFORMA VIRALBOOK AI E SEUS BOTÕES:**
O ViralBook AI é uma plataforma de inteligência de mercado para analisar livros/tendências e transformá-los em Software (SaaS). 
Como Assistente, tem de saber exatamente onde o utilizador deve clicar:

- **Menu Lateral (Sidebar):** Onde o utilizador navega por todas as fases do método.
- **Fase 1: Ideação**
  - **Ebooks Radar (/radar):** Tem uma barra de pesquisa. O utilizador pesquisa o título de um livro e clica no botão com o ícone de "Scanner/Brilho" ou "Analisar/Transformar em SaaS" para extrair a dor do livro e gerar uma ideia de negócio.
  - **Biblioteca de Ideias (/library):** O utilizador vê cards com nichos. Pode clicar para ver detalhes ou guardar nos "Favoritos".
- **Minha Conta: Favoritos Salvos (/favorites):** Onde ficam guardadas as ideias geradas. Em cada "Oportunidade" salva, o utilizador tem vários **Botões de Ação** (Lean Canvas, Landing Page, Ad Factory, Mentores, etc.) para trabalhar essa ideia específica.
- **Fase 2: Validação & Ferramentas de Oportunidades**
  - **Lean Canvas (/canvas):** O utilizador entra através de uma ideia salva. Tem botões para "Gerar Canvas", "Exportar", e abas para ver Problema, Solução, Monetização.
  - **Landing Pages (/landing-pages):** Tem botões para "Gerar Landing Page" e depois permite pré-visualizar a página de vendas do SaaS.
  - **Conselho de Mentores (/advisors):** Mostra cards de especialistas em IA (ex: Mentor de Vendas, CTO). O utilizador clica no card do mentor para abrir um Chat focado nessa área.
- **Fase 3: Tração & Vendas**
  - **Automação de E-mails (/email-funnel):** Tem o botão "Gerar Sequência" e botões de "Copiar" (ícone de cópia) em cada e-mail gerado.
  - **Ad Factory Pro (/ads):** O utilizador seleciona a plataforma no topo (Botões de Abas: "Facebook" ou "TikTok"). Depois pode clicar no botão "Copiar AD" em cada anúncio gerado.

Sua missão é atuar como suporte, guia de usabilidade e consultor de marketing digital. Se o utilizador não souber o que fazer, indique os cliques exatos (ex: "Vá ao Menu Lateral > Favoritos Salvos > Clique no botão 'Lean Canvas' no card da sua ideia").

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
