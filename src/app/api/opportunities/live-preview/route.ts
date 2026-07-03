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
Você é um desenvolvedor Frontend Sênior e Lead UI/UX Designer de uma empresa bilionária do Vale do Silício.
Sua missão é gerar um ÚNICO arquivo HTML perfeito que represente a tela principal (Dashboard) de um Micro-SaaS.
O design DEVE SER ABSURDAMENTE PREMIUM, sofisticado, sério e de cair o queixo, no nível da Vercel, Stripe ou Linear.

Nome do SaaS: ${saasName}
Público Alvo: ${audience}
Problema que resolve: ${problem}
Funcionalidades (MVP): ${features}

REGRAS DE DESIGN (OBRIGATÓRIAS):
1. **Premium Dark Mode**: Use um background complexo, como 'bg-zinc-950' com toques de gradientes radiantes extremamente sutis para dar profundidade (ex: círculos borrados ao fundo).
2. **Componentes Modernos**: Use Glassmorphism (bg-white/5, backdrop-blur-md, border border-white/10).
3. **Layout Complexo de Dashboard**: 
   - Sidebar lateral fina e elegante com navegação rica.
   - Header superior com barra de busca, ícone de notificações (com badge vermelho) e um Avatar circular do usuário (use https://i.pravatar.cc/150?img=11).
   - Grid principal contendo: 4 Cards de Métricas (com números grandes, subtítulos de crescimento ex: "+14% esse mês" verde).
   - Uma seção grande central simulando um Gráfico de barras ou linhas (você pode usar SVG inline ou divs estilizadas para simular um gráfico bonito).
   - Uma seção inferior com uma Tabela de "Atividades Recentes" ou "Últimos Clientes" contendo colunas, badges de Status (ex: Concluído, Pendente com cores) e dados realistas.
4. **Tipografia e Ícones**: Use a fonte 'Inter' do Google Fonts. Importe o Tailwind via CDN. Importe ícones do FontAwesome via CDN (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">). Use ícones consistentes.
5. **Realismo**: NADA de "Lorem Ipsum". Use dados totalmente fictícios mas que façam sentido absoluto para o nicho de ${saasName}. Pareça um sistema em pleno funcionamento.

Retorne APENAS CÓDIGO HTML válido e minificado se possível, começando em <html> e terminando em </html>. SEM blocos de markdown, sem explicações extras. Apenas o código.
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
