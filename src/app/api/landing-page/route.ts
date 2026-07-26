import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

function slugify(text: string): string {
  if (!text) return `saas-${Math.random().toString(36).substring(2, 7)}`;
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') || `saas-${Math.random().toString(36).substring(2, 7)}`;
}

function generateFallbackLandingPageData(opportunity: any, language: string = 'pt') {
  const isEn = language === 'en';
  const isEs = language === 'es';
  const name = opportunity.saas_name || 'Micro-SaaS';
  const problem = opportunity.problem_solved || 'Solução inteligente de alta produtividade';
  const audience = opportunity.target_audience || 'Profissionais e Criadores';

  return {
    headline: isEn ? `Transform Your Workflow with ${name}` : isEs ? `Transforme su Flujo de Trabajo con ${name}` : `Revolucione seu Trabalho com o ${name}`,
    subheadline: isEn ? `The all-in-one AI platform designed for ${audience}. ${problem}.` : isEs ? `La plataforma con IA diseñada para ${audience}. ${problem}.` : `A plataforma completa com IA feita para ${audience}. ${problem}.`,
    cta_text: isEn ? 'Join the VIP Waitlist' : isEs ? 'Unirse a la Lista VIP' : 'Garantir Acesso VIP Antecipado',
    theme_color: '#3b82f6',
    features: [
      {
        title: isEn ? 'Automated Insights' : isEs ? 'Perspicacia Automatizada' : 'Automação Inteligente',
        description: isEn ? `Eliminate repetitive tasks with AI algorithms tailored for ${audience}.` : isEs ? `Elimine tareas repetitivas con algoritmos diseñados para ${audience}.` : `Elimine tarefas repetitivas com algoritmos configurados para ${audience}.`,
        icon: 'Zap'
      },
      {
        title: isEn ? 'Smart Workflows' : isEs ? 'Flujos de Trabajo Ágiles' : 'Fluxos de Trabalho Ágeis',
        description: isEn ? `Built specifically to solve: "${problem}".` : isEs ? `Diseñado específicamente para resolver: "${problem}".` : `Criado especificamente para resolver: "${problem}".`,
        icon: 'Sparkles'
      },
      {
        title: isEn ? 'Enterprise Security' : isEs ? 'Seguridad Garantizada' : 'Segurança e Alta Escala',
        description: isEn ? 'Bank-grade encryption and cloud infrastructure ready for scale.' : isEs ? 'Cifrado bancario e infraestructura lista para escalar.' : 'Criptografia de ponta e infraestrutura em nuvem pronta para escalar.',
        icon: 'Shield'
      }
    ],
    benefits: [
      {
        title: isEn ? 'Save 10+ Hours/Week' : isEs ? 'Ahorre +10 Horas/Semana' : 'Economize 10+ Horas/Semana',
        description: isEn ? 'Automate manual processes and focus on strategy.' : isEs ? 'Automatice procesos manuales y concéntrese en su negocio.' : 'Automatize processos manuais e foque no crescimento do seu negócio.'
      },
      {
        title: isEn ? 'Zero Setup Needed' : isEs ? 'Sin Configuración Compleja' : 'Zero Configuração Requerida',
        description: isEn ? 'Start using the platform instantly without technical knowledge.' : isEs ? 'Comience a usar la plataforma al instante sin conocimientos técnicos.' : 'Comece a usar a plataforma instantaneamente sem necessidade de programação.'
      },
      {
        title: isEn ? 'Data-Driven Validation' : isEs ? 'Validación con Datos' : 'Validação Baseada em Dados',
        description: isEn ? 'Every feature is backed by real market demand metrics.' : isEs ? 'Cada característica está respaldada por métricas reales.' : 'Cada funcionalidade é respaldada por métricas reais de mercado.'
      }
    ],
    testimonials: [
      {
        name: 'Carlos Mendes',
        role: audience,
        quote: isEn ? `This solution solved exactly what I was struggling with every single day!` : isEs ? `¡Esta solución resolvió exactamente con lo que luchaba todos los días!` : `Esta solução resolveu exatamente a dor que eu enfrentava no meu dia a dia!`
      },
      {
        name: 'Ana Sofia',
        role: 'Tech Lead',
        quote: isEn ? `Unbelievable ROI. Simple, direct, and incredibly fast.` : isEs ? `ROI increíble. Simple, directo y muy rápido.` : `ROI inacreditável. Simples, direto e extremamente rápido.`
      }
    ],
    faqs: [
      {
        question: isEn ? `What is ${name}?` : isEs ? `¿Qué es ${name}?` : `O que é o ${name}?`,
        answer: isEn ? `${name} is an AI-powered platform that helps ${audience} resolve: ${problem}.` : isEs ? `${name} es una plataforma con IA que ayuda a ${audience} a resolver: ${problem}.` : `O ${name} é uma plataforma alimentada por IA que ajuda ${audience} a resolver: ${problem}.`
      },
      {
        question: isEn ? 'How does the waitlist work?' : isEs ? '¿Cómo funciona la lista de espera?' : 'Como funciona a lista de espera?',
        answer: isEn ? 'By joining today, you lock in a lifetime 50% discount and early access to the beta.' : isEs ? 'Al unirse hoy, asegura un 50% de descuento de por vida y acceso anticipado al beta.' : 'Ao se inscrever hoje, você garante 50% de desconto vitalício e acesso antecipado ao beta exclusivo.'
      }
    ]
  };
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { opportunityId, language = 'pt' } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório' }, { status: 400 });
    }

    const adminSupabase = createAdminClient();

    // 1. Buscar detalhes da Oportunidade via Admin (permite oportunidades públicas e de sementes)
    const { data: opportunity, error: fetchErr } = await adminSupabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (fetchErr || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    // 2. Verificar se já existe uma Landing Page para essa oportunidade para este usuário (ou global)
    const { data: existingLP } = await adminSupabase
      .from('landing_pages')
      .select('slug')
      .eq('opportunity_id', opportunityId)
      .eq('user_id', user?.id || null)
      .maybeSingle();

    if (existingLP) {
      return NextResponse.json({ success: true, slug: existingLP.slug, message: 'Landing page já existe!' });
    }

    const langName = language === 'en' ? 'English' : language === 'es' ? 'Spanish' : 'Portuguese';

    // 3. Chamar o Groq para gerar a Copywriting (com fallback automático em caso de erro)
    let data: any = null;

    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'placeholder_key') {
      const systemPrompt = `Você é um Copywriter especialista em conversão (Landing Pages) e lançamento de SaaS de alta conversão.
Sua missão é escrever todo o conteúdo de uma Landing Page com tema escuro (Dark Mode) para capturar leads (lista de espera) para uma nova ideia de SaaS.

DADOS DA IDEIA DO SAAS:
- Nome do SaaS: "${opportunity.saas_name}"
- Problema Resolvido: "${opportunity.problem_solved}"
- Público-Alvo: "${opportunity.target_audience}"
- Diferencial Competitivo: "${opportunity.competitive_advantage}"
- MVP Funcionalidades: "${opportunity.mvp_features}"
- Monetização/Preço: "${opportunity.monetization_model || ''} / ${opportunity.suggested_price || ''}"

CRITICAL INSTRUCTION: Write all generated string fields inside the JSON object strictly in ${langName}.

Você deve gerar e retornar estritamente um JSON no seguinte formato:
{
  "headline": "Título principal curto, impactante e viciante",
  "subheadline": "Subtítulo explicando o que o software faz e como ele resolve o problema de forma única",
  "cta_text": "Texto do botão de chamada para ação (ex: 'Garantir Acesso Antecipado', 'Quero entrar na lista')",
  "theme_color": "Uma cor hex que combina com o nicho (ex: '#3b82f6', '#a855f7', '#10b981', '#f97316')",
  "features": [
    {
      "title": "Recurso 1 (Título curto)",
      "description": "Explicação simples do recurso focada na dor do cliente",
      "icon": "Escolha entre: Zap, Shield, Sparkles, Layout, Database, Terminal, LineChart"
    },
    {
      "title": "Recurso 2 (Título curto)",
      "description": "Explicação simples",
      "icon": "Ícone da lista acima"
    },
    {
      "title": "Recurso 3 (Título curto)",
      "description": "Explicação simples",
      "icon": "Ícone da lista acima"
    }
  ],
  "benefits": [
    {
      "title": "Benefício 1 (Curto)",
      "description": "Como ele economiza tempo/dinheiro ou resolve o problema de forma prática"
    },
    {
      "title": "Benefício 2 (Curto)",
      "description": "Como muda a vida/trabalho do usuário"
    },
    {
      "title": "Benefício 3 (Curto)",
      "description": "Outro grande ganho"
    }
  ],
  "testimonials": [
    {
      "name": "Nome fictício de um cliente potencial ideal",
      "role": "Cargo ou ocupação fictícia",
      "quote": "Depoimento realista sobre a dor que sentia e como essa solução resolve perfeitamente"
    },
    {
      "name": "Nome de outro cliente fictício",
      "role": "Cargo fictício",
      "quote": "Depoimento realista"
    }
  ],
  "faqs": [
    {
      "question": "O que é o [Nome do SaaS]?",
      "answer": "Explicação simples de fácil entendimento para um leigo"
    },
    {
      "question": "Como funciona a lista de espera?",
      "answer": "Explicar que os inscritos receberão convite para testar o beta com desconto especial"
    },
    {
      "question": "Quando será o lançamento?",
      "answer": "Dizer que o MVP está em desenvolvimento rápido e será lançado nas próximas semanas"
    }
  ]
}

IMPORTANTE: Responda APENAS o JSON válido. Não adicione saudações ou explicações.`;

      const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];

      for (const model of models) {
        try {
          console.log(`[Landing Page Gen] Tentando modelo: ${model}`);
          const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'user', content: systemPrompt }],
            model: model,
            temperature: 0.7,
            response_format: { type: 'json_object' }
          });

          const reply = chatCompletion.choices[0]?.message?.content || '';
          if (reply) {
            data = JSON.parse(reply);
            console.log(`[Landing Page Gen] Gerado com sucesso usando: ${model}`);
            break;
          }
        } catch (err: any) {
          console.warn(`[Landing Page Gen] Aviso com modelo ${model}:`, err.message || err);
        }
      }
    }

    if (!data || !data.headline) {
      console.log(`[Landing Page Gen] Usando gerador estruturado de fallback`);
      data = generateFallbackLandingPageData(opportunity, language);
    }

    // 4. Gerar um slug amigável e único
    const baseSlug = slugify(opportunity.saas_name || 'saas');
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const { data: col } = await adminSupabase
        .from('landing_pages')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!col) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 5. Inserir no Banco de Dados
    const payload = {
      opportunity_id: opportunityId,
      slug,
      headline: data.headline,
      subheadline: data.subheadline,
      cta_text: data.cta_text,
      theme_color: data.theme_color || '#3b82f6',
      features: data.features,
      benefits: data.benefits,
      testimonials: data.testimonials,
      faqs: data.faqs,
      user_id: user?.id || null
    };

    const { error: insertErr } = await adminSupabase
      .from('landing_pages')
      .insert(payload);

    if (insertErr) {
      console.error(`[Landing Page Gen] Erro ao salvar em landing_pages:`, insertErr);
      throw new Error(`Erro ao salvar no banco: ${insertErr.message}`);
    }

    // Salvar também em opportunity_landing_pages se a tabela existir
    try {
      await adminSupabase.from('opportunity_landing_pages').insert(payload);
    } catch (e) {
      // Ignora erro se a tabela for obsoleta ou não existir
    }

    return NextResponse.json({ success: true, slug });

  } catch (error: any) {
    console.error('Erro na geração da Landing Page:', error);
    return NextResponse.json({ error: error.message || 'Erro interno de geração.' }, { status: 500 });
  }
}

// GET: Listar as Landing Pages geradas pelo usuário logado + contagem de leads
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const adminSupabase = createAdminClient();

    let { data: lps, error: lpErr } = await adminSupabase
      .from('landing_pages')
      .select('id, slug, headline, created_at, opportunity_id, opportunities(saas_name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (lpErr || !lps || lps.length === 0) {
      const { data: altLps } = await adminSupabase
        .from('opportunity_landing_pages')
        .select('id, slug, headline, created_at, opportunity_id, opportunities(saas_name)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (altLps) lps = altLps;
    }

    const results = await Promise.all(
      (lps || []).map(async (lp: any) => {
        const { count } = await adminSupabase
          .from('waitlist_leads')
          .select('*', { count: 'exact', head: true })
          .eq('landing_page_id', lp.id);

        return {
          id: lp.id,
          slug: lp.slug,
          headline: lp.headline,
          createdAt: lp.created_at,
          saasName: lp.opportunities?.saas_name || 'Micro-SaaS',
          leadsCount: count || 0
        };
      })
    );

    return NextResponse.json({ landingPages: results });

  } catch (error: any) {
    console.error('Erro ao listar Landing Pages:', error);
    return NextResponse.json({ error: error.message || 'Erro ao carregar dados.' }, { status: 500 });
  }
}
