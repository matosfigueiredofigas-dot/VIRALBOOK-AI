import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

function generateSlug(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const randomStr = Math.random().toString(36).substring(2, 6);
  return `${base}-${randomStr}`;
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'Chave da API da Groq não configurada' }, { status: 500 });
    }

    const { opportunityId, saasName, problem, audience, features } = await req.json();

    if (!opportunityId || !saasName || !problem) {
      return NextResponse.json({ error: 'Faltam parâmetros obrigatórios' }, { status: 400 });
    }

    // Verifica se a oportunidade pertence ao usuário
    const { data: opp, error: oppError } = await supabase
      .from('opportunities')
      .select('id, published_slug')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();

    if (oppError || !opp) {
      return NextResponse.json({ error: 'Oportunidade não encontrada ou acesso negado' }, { status: 404 });
    }

    // Se já tiver um slug, reutiliza, caso contrário cria um novo
    const slug = opp.published_slug || generateSlug(saasName);

    const prompt = `
Você é o melhor Desenvolvedor Frontend e Especialista em Copywriting de Conversão do mundo.
Sua missão é criar uma Landing Page HTML de altíssima conversão para coletar leads (Lista de Espera) para um novo SaaS.
A página será hospedada publicamente. O design deve ser ABSURDAMENTE PREMIUM, nível Stripe/Vercel/Linear.

Nome do SaaS: ${saasName}
Público Alvo: ${audience}
Problema: ${problem}
Funcionalidades: ${features}

DIRETRIZES DE DESIGN E CONVERSÃO:
1. **Design Moderno (Dark Mode ou Clean Light Mode)**: Use Tailwind CSS. Elementos de Glassmorphism, botões vibrantes com hover effects, sombras suaves (Glow), e tipografia forte (Inter).
2. **Estrutura (Copywriting)**:
   - **Hero Section**: Headline forte (promessa principal), Subheadline explicando como funciona, e o Formulário de Captura centralizado acima da dobra.
   - **Seção de Benefícios/Problema**: Três colunas com ícones FontAwesome explicando o que o software resolve.
   - **Footer Simples**: Copyright e nome do SaaS.
3. **Mecânica do Formulário (MUITO IMPORTANTE)**:
   - O formulário DEVE ter exatamente esta estrutura para funcionar:
     <form action="/api/leads" method="POST" class="...">
       <input type="hidden" name="opportunity_id" value="${opportunityId}">
       <input type="hidden" name="redirect_to" value="/p/${slug}?success=true">
       <input type="email" name="email" required placeholder="Seu melhor e-mail..." class="...">
       <button type="submit" class="...">Entrar na Lista de Espera</button>
     </form>
   - Abaixo do formulário, inclua uma pequena div condicional que mostre uma mensagem de sucesso, que vai aparecer caso a URL tenha '?success=true' (use um pequeno JS script no final da página para ler a URL e mostrar a div de sucesso, ocultando o form).
4. **Regras Técnicas**:
   - Retorne APENAS CÓDIGO HTML VÁLIDO e sem blocos de markdown (\`\`\`).
   - Importe Tailwind (<script src="https://cdn.tailwindcss.com"></script>) e FontAwesome (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">).
   - O texto da Landing Page deve ser persuasivo, agressivo no marketing, escrito em Português do Brasil.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3, 
    });

    let htmlCode = chatCompletion.choices[0]?.message?.content || '';
    htmlCode = htmlCode.replace(/```html/g, '').replace(/```/g, '').trim();

    // Salvar no Banco
    const { error: updateError } = await supabase
      .from('opportunities')
      .update({
        landing_page_html: htmlCode,
        published_slug: slug,
      })
      .eq('id', opportunityId)
      .eq('user_id', user.id);

    if (updateError) {
      throw new Error(`Erro ao salvar no banco: ${updateError.message}`);
    }

    return NextResponse.json({ slug, url: `/p/${slug}` });
  } catch (error: any) {
    console.error('[Launchpad] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Landing Page' }, { status: 500 });
  }
}
