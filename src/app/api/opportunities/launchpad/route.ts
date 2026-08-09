import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
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

    const { opportunityId, saasName, problem, audience, features, theme = 'cyberpunk', language = 'pt' } = await req.json();

    if (!opportunityId || !saasName || !problem) {
      return NextResponse.json({ error: 'Faltam parâmetros obrigatórios' }, { status: 400 });
    }

    const targetLang = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Portuguese';

    const adminSupabase = createAdminClient();

    // Carrega a oportunidade (suporta públicas/sementes)
    const { data: opp, error: oppError } = await adminSupabase
      .from('opportunities')
      .select('id, published_slug')
      .eq('id', opportunityId)
      .single();

    if (oppError || !opp) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    // Se já tiver um slug, reutiliza, caso contrário cria um novo
    const slug = opp.published_slug || generateSlug(saasName);

    const themes: any = {
      cyberpunk: {
        bg: '#09090b', text: '#f4f4f5',
        navBg: 'bg-black/50 backdrop-blur-md border-b border-white/5',
        primaryColor: 'indigo-500', 
        primaryHover: 'indigo-400',
        cardBg: 'bg-[#18181b]/50 border border-white/5 hover:bg-[#18181b] hover:border-white/10',
        formBg: 'bg-[#18181b] border border-white/10',
        titleGradient: 'bg-gradient-to-b from-white to-white/60',
        pillBg: 'bg-white/5 border border-white/10 text-indigo-400'
      },
      minimalist: {
        bg: '#ffffff', text: '#171717',
        navBg: 'bg-white/80 backdrop-blur-md border-b border-black/5',
        primaryColor: 'black',
        primaryHover: 'zinc-800',
        cardBg: 'bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300',
        formBg: 'bg-white border border-zinc-200',
        titleGradient: 'bg-gradient-to-b from-black to-zinc-600',
        pillBg: 'bg-zinc-100 border border-zinc-200 text-zinc-800'
      },
      corporate: {
        bg: '#0f172a', text: '#f8fafc',
        navBg: 'bg-slate-900/80 backdrop-blur-md border-b border-white/10',
        primaryColor: 'blue-600',
        primaryHover: 'blue-500',
        cardBg: 'bg-slate-800/50 border border-slate-700 hover:bg-slate-800 hover:border-slate-600',
        formBg: 'bg-slate-800 border border-slate-700',
        titleGradient: 'bg-gradient-to-b from-white to-blue-200',
        pillBg: 'bg-blue-900/30 border border-blue-500/30 text-blue-300'
      }
    };
    const t = themes[theme] || themes.cyberpunk;

    const prompt = `
Você é o melhor Desenvolvedor Frontend e Especialista em Copywriting de Conversão do mundo.
Sua missão é criar uma Landing Page HTML de altíssima conversão para coletar leads (Lista de Espera) para um novo SaaS.
IMPORTANT: You MUST write ALL visible text, headlines, labels, features, and buttons in ${targetLang}.
A página será hospedada publicamente. O design deve ser ABSURDAMENTE PREMIUM, nível Stripe/Vercel/Linear.

Nome do SaaS: ${saasName}
Público Alvo: ${audience}
Problema: ${problem}
Funcionalidades: ${features}

DIRETRIZES DE DESIGN E CONVERSÃO (NÍVEL PREMIUM VERCEL/STRIPE):
1. **Design Moderno**: Você não vai criar a estrutura do zero. VOCÊ DEVE USAR EXATAMENTE O SEGUINTE BOILERPLATE HTML, apenas substituindo os textos, ícones e títulos marcados com colchetes \`[ ]\`.
2. O Boilerplate abaixo já possui todos os estilos Tailwind "Ultra Premium". NÃO mude as classes de layout, apenas preencha com o copywriting do SaaS. Se for alterar ícones, use nomes do FontAwesome 6 (ex: fa-solid fa-chart-line).
3. **Copywriting e Persuasão**: Na secção de Testemunhos (Prova Social), crie depoimentos 100% realistas de pessoas com cargos que fazem sentido para o público-alvo. Na secção de Preços, defina um preço realista (mensal) em USD ($) ou EUR (€) dependendo da língua, que mostre o valor da ferramenta. Na secção de FAQ, gere 2 perguntas extremamente comuns para este tipo de SaaS e responda de forma persuasiva.

BOILERPLATE HTML (Siga esta estrutura rigorosamente):
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[NOME DO SAAS] - Waitlist</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>body { font-family: 'Inter', sans-serif; background-color: ${t.bg}; color: ${t.text}; }</style>
</head>
<body class="relative min-h-screen overflow-x-hidden selection:bg-${t.primaryColor}/30">
    <!-- Efeitos de Fundo -->
    <div class="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
    <div class="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-${t.primaryColor}/20 blur-[120px] rounded-full z-0 pointer-events-none"></div>

    <nav class="relative z-10 ${t.navBg} sticky top-0">
        <div class="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div class="font-bold text-xl tracking-tight flex items-center gap-2">
                <i class="fa-solid fa-rocket text-${t.primaryColor}"></i> [NOME DO SAAS]
            </div>
            <a href="#join" class="text-sm font-medium bg-${t.primaryColor} text-white px-4 py-2 rounded-lg hover:bg-${t.primaryHover} transition-colors">Aderir Agora</a>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <main class="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full ${t.pillBg} text-xs font-medium mb-8 backdrop-blur-md border border-${t.primaryColor}/20">
            <span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-${t.primaryColor} opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-${t.primaryColor}"></span></span>
            [SUBHEADLINE CURTA DE DESTAQUE]
        </div>
        
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent ${t.titleGradient}">
            [HEADLINE PRINCIPAL GIGANTE E PERSUASIVA]
        </h1>
        
        <p class="text-lg md:text-xl opacity-70 mb-10 max-w-2xl leading-relaxed mx-auto">
            [PARÁGRAFO FOCADO NA DOR DO CLIENTE. EXPLIQUE O QUE É E POR QUE É INCRÍVEL]
        </p>

        <!-- Formulário Hero -->
        <div id="form-container" class="w-full max-w-md relative mx-auto" id="join">
            <div class="absolute -inset-1 bg-gradient-to-r from-${t.primaryColor} to-${t.primaryHover} rounded-2xl blur opacity-30"></div>
            <form action="/api/leads" method="POST" class="relative ${t.formBg} p-2 rounded-2xl flex flex-col sm:flex-row gap-2 shadow-2xl">
                <input type="hidden" name="opportunity_id" value="${opportunityId}">
                <input type="hidden" name="redirect_to" value="/p/${slug}?success=true">
                <input type="email" name="email" required placeholder="Seu melhor e-mail..." class="flex-1 bg-transparent px-4 py-3 outline-none border-none opacity-80 text-sm">
                <button type="submit" class="bg-${t.primaryColor} hover:bg-${t.primaryHover} text-white font-medium px-6 py-3 rounded-xl transition-all whitespace-nowrap">
                    Garantir Acesso
                </button>
            </form>
        </div>

        <div id="success-msg" class="hidden mt-6 px-6 py-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-xl flex items-center gap-3">
            <i class="fa-solid fa-check-circle text-xl"></i>
            <span class="font-medium">Inscrição confirmada! Fique de olho no seu e-mail.</span>
        </div>
    </main>

    <!-- SOCIAL PROOF (Marcas/Tração) -->
    <div class="relative z-10 border-y border-white/5 bg-black/10 py-8">
        <div class="max-w-6xl mx-auto px-6 text-center">
            <p class="text-xs uppercase tracking-widest font-bold opacity-40 mb-6">Junte-se a inovadores de empresas de topo (Waitlist)</p>
            <div class="flex flex-wrap justify-center items-center gap-10 opacity-30 grayscale">
                <i class="fa-brands fa-aws text-3xl"></i>
                <i class="fa-brands fa-google text-3xl"></i>
                <i class="fa-brands fa-microsoft text-3xl"></i>
                <i class="fa-brands fa-meta text-3xl"></i>
            </div>
        </div>
    </div>

    <!-- BENEFÍCIOS -->
    <section class="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">[TÍTULO DA SECÇÃO DE BENEFÍCIOS]</h2>
            <p class="opacity-60 max-w-xl mx-auto">[SUBTÍTULO SOBRE COMO VAI MUDAR A VIDA DELES]</p>
        </div>
        <div class="grid md:grid-cols-3 gap-6">
            <div class="${t.cardBg} p-8 rounded-3xl transition-colors">
                <div class="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-500 mb-6 text-xl"><i class="fa-solid [ÍCONE 1]"></i></div>
                <h3 class="text-xl font-bold mb-3">[BENEFÍCIO 1]</h3>
                <p class="opacity-70 text-sm leading-relaxed">[DESCRIÇÃO DO BENEFÍCIO 1]</p>
            </div>
            <div class="${t.cardBg} p-8 rounded-3xl transition-colors">
                <div class="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center text-purple-500 mb-6 text-xl"><i class="fa-solid [ÍCONE 2]"></i></div>
                <h3 class="text-xl font-bold mb-3">[BENEFÍCIO 2]</h3>
                <p class="opacity-70 text-sm leading-relaxed">[DESCRIÇÃO DO BENEFÍCIO 2]</p>
            </div>
            <div class="${t.cardBg} p-8 rounded-3xl transition-colors">
                <div class="w-12 h-12 bg-pink-500/10 border border-pink-500/20 rounded-2xl flex items-center justify-center text-pink-500 mb-6 text-xl"><i class="fa-solid [ÍCONE 3]"></i></div>
                <h3 class="text-xl font-bold mb-3">[BENEFÍCIO 3]</h3>
                <p class="opacity-70 text-sm leading-relaxed">[DESCRIÇÃO DO BENEFÍCIO 3]</p>
            </div>
        </div>
    </section>

    <!-- COMO FUNCIONA (HOW IT WORKS) -->
    <section class="relative z-10 bg-black/5 py-24">
        <div class="max-w-6xl mx-auto px-6">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold mb-4">Como Funciona</h2>
                <p class="opacity-60 max-w-xl mx-auto">Em apenas 3 passos simples.</p>
            </div>
            <div class="grid md:grid-cols-3 gap-8 relative">
                <!-- Linha de conexão visível em desktop -->
                <div class="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-${t.primaryColor}/30 to-transparent z-0"></div>
                
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-3xl ${t.cardBg} shadow-xl flex items-center justify-center text-3xl text-${t.primaryColor} mb-6 font-black border-t-2 border-${t.primaryColor}/50">1</div>
                    <h3 class="text-lg font-bold mb-2">[PASSO 1 TÍTULO]</h3>
                    <p class="opacity-70 text-sm">[PASSO 1 DESCRIÇÃO]</p>
                </div>
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-3xl ${t.cardBg} shadow-xl flex items-center justify-center text-3xl text-${t.primaryColor} mb-6 font-black border-t-2 border-${t.primaryColor}/50">2</div>
                    <h3 class="text-lg font-bold mb-2">[PASSO 2 TÍTULO]</h3>
                    <p class="opacity-70 text-sm">[PASSO 2 DESCRIÇÃO]</p>
                </div>
                <div class="relative z-10 flex flex-col items-center text-center">
                    <div class="w-24 h-24 rounded-3xl ${t.cardBg} shadow-xl flex items-center justify-center text-3xl text-${t.primaryColor} mb-6 font-black border-t-2 border-${t.primaryColor}/50">3</div>
                    <h3 class="text-lg font-bold mb-2">[PASSO 3 TÍTULO]</h3>
                    <p class="opacity-70 text-sm">[PASSO 3 DESCRIÇÃO]</p>
                </div>
            </div>
        </div>
    </section>

    <!-- TESTIMONIALS (PROVA SOCIAL) -->
    <section class="relative z-10 max-w-6xl mx-auto px-6 py-24">
        <div class="text-center mb-16">
            <h2 class="text-3xl font-bold mb-4">O que dizem os primeiros beta-testers</h2>
        </div>
        <div class="grid md:grid-cols-2 gap-6">
            <div class="${t.cardBg} p-8 rounded-2xl relative">
                <i class="fa-solid fa-quote-left absolute top-8 right-8 text-4xl opacity-10"></i>
                <div class="flex items-center gap-1 text-yellow-500 mb-4 text-xs"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                <p class="italic opacity-80 mb-6 text-sm">"[DEPOIMENTO POSITIVO FALSO SOBRE COMO O PRODUTO RESOLVEU A DOR EXATA]"</p>
                <div class="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?img=11" class="w-12 h-12 rounded-full border border-white/10" alt="User">
                    <div>
                        <div class="font-bold text-sm">[NOME DO TESTER 1]</div>
                        <div class="text-xs opacity-50">[CARGO/PROFISSÃO 1]</div>
                    </div>
                </div>
            </div>
            <div class="${t.cardBg} p-8 rounded-2xl relative">
                <i class="fa-solid fa-quote-left absolute top-8 right-8 text-4xl opacity-10"></i>
                <div class="flex items-center gap-1 text-yellow-500 mb-4 text-xs"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                <p class="italic opacity-80 mb-6 text-sm">"[DEPOIMENTO POSITIVO FALSO SOBRE POUPANÇA DE TEMPO/DINHEIRO]"</p>
                <div class="flex items-center gap-4">
                    <img src="https://i.pravatar.cc/150?img=32" class="w-12 h-12 rounded-full border border-white/10" alt="User">
                    <div>
                        <div class="font-bold text-sm">[NOME DO TESTER 2]</div>
                        <div class="text-xs opacity-50">[CARGO/PROFISSÃO 2]</div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- PRICING (PREÇOS) -->
    <section class="relative z-10 max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 class="text-3xl font-bold mb-4">Preços Simples e Transparentes</h2>
        <p class="opacity-60 mb-12">Entre na Waitlist hoje e garanta 50% de desconto vitalício.</p>
        
        <div class="${t.cardBg} max-w-lg mx-auto rounded-3xl p-8 border-t-4 border-${t.primaryColor} shadow-2xl relative overflow-hidden">
            <div class="absolute top-4 right-[-30px] bg-${t.primaryColor} text-white text-xs font-bold px-10 py-1 rotate-45">POPULAR</div>
            <h3 class="text-xl font-bold mb-2">Pro Early Bird</h3>
            <div class="text-4xl font-black mb-6">[PREÇO EM DÓLARES/EUROS]<span class="text-lg font-normal opacity-50">/mês</span></div>
            <ul class="text-left space-y-4 mb-8 text-sm opacity-80">
                <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-${t.primaryColor}"></i> [FUNCIONALIDADE PRO 1]</li>
                <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-${t.primaryColor}"></i> [FUNCIONALIDADE PRO 2]</li>
                <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-${t.primaryColor}"></i> [FUNCIONALIDADE PRO 3]</li>
                <li class="flex gap-3 items-center"><i class="fa-solid fa-check text-${t.primaryColor}"></i> Suporte Prioritário</li>
            </ul>
            <a href="#join" class="block w-full bg-${t.primaryColor} hover:bg-${t.primaryHover} text-white font-medium py-3 rounded-xl transition-all">
                Reservar a minha vaga agora
            </a>
        </div>
    </section>

    <!-- FAQ -->
    <section class="relative z-10 max-w-3xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 class="text-3xl font-bold mb-10 text-center">Perguntas Frequentes</h2>
        <div class="space-y-6 text-left">
            <div class="${t.cardBg} p-6 rounded-2xl">
                <h4 class="font-bold mb-2 text-lg">[PERGUNTA FREQUENTE 1?]</h4>
                <p class="opacity-70 text-sm leading-relaxed">[RESPOSTA DETALHADA PARA A PERGUNTA 1]</p>
            </div>
            <div class="${t.cardBg} p-6 rounded-2xl">
                <h4 class="font-bold mb-2 text-lg">[PERGUNTA FREQUENTE 2?]</h4>
                <p class="opacity-70 text-sm leading-relaxed">[RESPOSTA DETALHADA PARA A PERGUNTA 2]</p>
            </div>
            <div class="${t.cardBg} p-6 rounded-2xl">
                <h4 class="font-bold mb-2 text-lg">Quando será o lançamento oficial?</h4>
                <p class="opacity-70 text-sm leading-relaxed">Estamos na fase final de testes fechados. Quem estiver na Waitlist receberá o convite de acesso antecipado nas próximas semanas, por ordem de inscrição.</p>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="relative z-10 border-t border-white/5 pt-12 pb-8 px-6 text-center text-sm opacity-50">
        <div class="flex items-center justify-center gap-6 mb-6 text-xl">
            <a href="#" class="hover:text-${t.primaryColor} transition-colors"><i class="fa-brands fa-twitter"></i></a>
            <a href="#" class="hover:text-${t.primaryColor} transition-colors"><i class="fa-brands fa-linkedin"></i></a>
        </div>
        <p>&copy; 2026 [NOME DO SAAS]. Todos os direitos reservados.</p>
    </footer>

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
    const { error: updateError } = await adminSupabase
      .from('opportunities')
      .update({
        landing_page_html: htmlCode,
        published_slug: slug,
      })
      .eq('id', opportunityId);

    if (updateError) {
      throw new Error(`Erro ao salvar no banco: ${updateError.message}`);
    }

    return NextResponse.json({ slug, url: `/p/${slug}` });
  } catch (error: any) {
    console.error('[Launchpad] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Landing Page' }, { status: 500 });
  }
}
