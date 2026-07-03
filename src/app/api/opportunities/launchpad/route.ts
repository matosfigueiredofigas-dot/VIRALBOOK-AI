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
1. **Design Moderno**: Você não vai criar a estrutura do zero. VOCÊ DEVE USAR EXATAMENTE O SEGUINTE BOILERPLATE HTML, apenas substituindo os textos, ícones e títulos marcados com colchetes \`[ ]\`.
2. O Boilerplate abaixo já possui todos os estilos Tailwind "Ultra Premium" (Glow, Glassmorphism, Gradients, Dark Mode absoluto). NÃO mude as classes de layout, apenas preencha com o copywriting do SaaS.

BOILERPLATE HTML (Siga esta estrutura rigorosamente):
<!DOCTYPE html>
<html lang="pt-BR" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[NOME DO SAAS] - Waitlist</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>body { font-family: 'Inter', sans-serif; background-color: #09090b; color: #f4f4f5; }</style>
</head>
<body class="relative min-h-screen overflow-x-hidden selection:bg-indigo-500/30">
    <!-- Efeitos de Fundo (Glow e Grid) -->
    <div class="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>

    <nav class="relative z-10 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="font-bold text-xl tracking-tight flex items-center gap-2">
                <i class="fa-solid fa-rocket text-indigo-500"></i> [NOME DO SAAS]
            </div>
            <div class="text-sm text-zinc-400 font-medium">Lançamento em Breve</div>
        </div>
    </nav>

    <main class="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-400 mb-8 backdrop-blur-md">
            <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>
            [SUBHEADLINE CURTA OU TEXTO DE DESTAQUE]
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            [HEADLINE PRINCIPAL GIGANTE E PERSUASIVA]
        </h1>
        
        <p class="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl leading-relaxed">
            [PARÁGRAFO DE COPYWRITING FOCADO NA DOR DO CLIENTE. EXPLIQUE O QUE É E POR QUE É INCRÍVEL]
        </p>

        <!-- Formulário (MANTENHA A ESTRUTURA INTACTA) -->
        <div id="form-container" class="w-full max-w-md relative">
            <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-30"></div>
            <form action="/api/leads" method="POST" class="relative bg-[#18181b] border border-white/10 p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl">
                <input type="hidden" name="opportunity_id" value="${opportunityId}">
                <input type="hidden" name="redirect_to" value="/p/${slug}?success=true">
                <input type="email" name="email" required placeholder="Seu melhor e-mail corporativo..." class="flex-1 bg-transparent text-white px-4 py-3 outline-none border-none placeholder-zinc-500 text-sm">
                <button type="submit" class="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] whitespace-nowrap">
                    Garantir Acesso
                </button>
            </form>
        </div>

        <div id="success-msg" class="hidden mt-6 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center gap-3">
            <i class="fa-solid fa-check-circle text-xl"></i>
            <span class="font-medium">Inscrição confirmada! Fique de olho no seu e-mail.</span>
        </div>

        <div class="mt-8 flex items-center gap-4 text-xs text-zinc-500 font-medium">
            <div class="flex -space-x-2">
                <img src="https://i.pravatar.cc/100?img=1" class="w-6 h-6 rounded-full border-2 border-[#09090b]">
                <img src="https://i.pravatar.cc/100?img=2" class="w-6 h-6 rounded-full border-2 border-[#09090b]">
                <img src="https://i.pravatar.cc/100?img=3" class="w-6 h-6 rounded-full border-2 border-[#09090b]">
            </div>
            <span>Junte-se a +2.000 profissionais</span>
        </div>
    </main>

    <!-- Benefícios -->
    <section class="relative z-10 max-w-6xl mx-auto px-6 pb-32">
        <div class="grid md:grid-cols-3 gap-6">
            <!-- Card 1 -->
            <div class="bg-[#18181b]/50 border border-white/5 p-8 rounded-3xl hover:bg-[#18181b] hover:border-white/10 transition-colors">
                <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 mb-6 text-xl">
                    <i class="fa-solid [ÍCONE 1]"></i>
                </div>
                <h3 class="text-xl font-bold mb-3 text-white">[BENEFÍCIO 1]</h3>
                <p class="text-zinc-400 text-sm leading-relaxed">[DESCRIÇÃO DO BENEFÍCIO 1]</p>
            </div>
            <!-- Card 2 -->
            <div class="bg-[#18181b]/50 border border-white/5 p-8 rounded-3xl hover:bg-[#18181b] hover:border-white/10 transition-colors">
                <div class="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 mb-6 text-xl">
                    <i class="fa-solid [ÍCONE 2]"></i>
                </div>
                <h3 class="text-xl font-bold mb-3 text-white">[BENEFÍCIO 2]</h3>
                <p class="text-zinc-400 text-sm leading-relaxed">[DESCRIÇÃO DO BENEFÍCIO 2]</p>
            </div>
            <!-- Card 3 -->
            <div class="bg-[#18181b]/50 border border-white/5 p-8 rounded-3xl hover:bg-[#18181b] hover:border-white/10 transition-colors">
                <div class="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-pink-400 mb-6 text-xl">
                    <i class="fa-solid [ÍCONE 3]"></i>
                </div>
                <h3 class="text-xl font-bold mb-3 text-white">[BENEFÍCIO 3]</h3>
                <p class="text-zinc-400 text-sm leading-relaxed">[DESCRIÇÃO DO BENEFÍCIO 3]</p>
            </div>
        </div>
    </section>

    <script>
        if (window.location.search.includes('success=true')) {
            document.getElementById('form-container').style.display = 'none';
            document.getElementById('success-msg').style.display = 'flex';
        }
    </script>
</body>
</html>
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
