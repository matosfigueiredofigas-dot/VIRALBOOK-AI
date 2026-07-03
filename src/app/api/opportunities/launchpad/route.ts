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

DIRETRIZES DE DESIGN E CONVERSÃO (NÍVEL PREMIUM VERCEL/STRIPE):
1. **Design Moderno (Dark Mode Absoluto)**: Use Tailwind CSS. Fundo principal \`bg-[#09090b]\`, textos em \`text-zinc-100\` e \`text-zinc-400\`. Elementos de Glassmorphism, botões com brilho neon (ex: \`shadow-[0_0_30px_-5px_rgba(99,102,241,0.4)]\`), e tipografia forte (Inter).
2. **Estrutura Visual da Landing Page (Use todo o espaço vertical)**:
   - **Navbar**: Logo à esquerda, links falsos à direita (Features, Pricing), botão pequeno secundário de Login.
   - **Hero Section (GIGANTE)**: Um fundo com Mesh Gradient animado ou grid pattern abstrato escuro (\`bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]\`). Headline H1 gigantesca, persuasiva. Subheadline abaixo. 
   - **Formulário de Captura**: Coloque-o centralizado, grande, num card \`bg-[#18181b]/80 backdrop-blur border border-[#27272a] p-2 rounded-2xl flex max-w-lg mx-auto\`.
   - **Social Proof (Prova Social)**: Abaixo do botão de captura, coloque avatares sobrepostos falsos e o texto: "Junte-se a +2.000 profissionais na fila de espera".
   - **Seção de Benefícios (Grid 3x3 ou 3 Colunas)**: Cards maravilhosos para cada funcionalidade com ícones grandiosos (use fa-*).
   - **Footer Premium**: Simples, com links e copyright.
3. **Mecânica do Formulário (MUITO IMPORTANTE)**:
   - O formulário DEVE ter exatamente esta estrutura para funcionar:
     <form action="/api/leads" method="POST" class="flex w-full gap-2 relative z-10">
       <input type="hidden" name="opportunity_id" value="${opportunityId}">
       <input type="hidden" name="redirect_to" value="/p/${slug}?success=true">
       <input type="email" name="email" required placeholder="Seu melhor e-mail corporativo..." class="flex-1 bg-transparent text-white px-4 py-3 outline-none border-none placeholder-zinc-500">
       <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]">Entrar na Lista</button>
     </form>
   - Abaixo do formulário, inclua uma pequena div condicional que mostre uma mensagem de sucesso, que vai aparecer caso a URL tenha '?success=true' (use um pequeno script Vanilla JS no final para checar a URL, se true mostre a div de sucesso com texto verde e oculte o <form>).
4. **Regras Técnicas e de Copy**:
   - Retorne APENAS CÓDIGO HTML VÁLIDO.
   - Importe Tailwind (<script src="https://cdn.tailwindcss.com"></script>) e FontAwesome (<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">). Importe a fonte Inter.
   - O texto da Landing Page deve ser agressivo no marketing, escrito em Português do Brasil, focado na dor real de: ${problem}.
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
