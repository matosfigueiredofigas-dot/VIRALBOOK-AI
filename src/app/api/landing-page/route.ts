import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

// Helper para transformar nome do SaaS em Slug amigável
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por -
    .replace(/[^\w\-]+/g, '') // Remove caracteres especiais
    .replace(/\-\-+/g, '-') // Substitui múltiplos - por um único -
    .replace(/^-+/, '') // Remove - do início
    .replace(/-+$/, ''); // Remove - do fim
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { opportunityId } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório' }, { status: 400 });
    }

    // 1. Buscar detalhes da Oportunidade
    const { data: opportunity, error: fetchErr } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .single();

    if (fetchErr || !opportunity) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    if (opportunity.user_id && opportunity.user_id !== user?.id) {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 });
    }

    // Verificar se já existe uma Landing Page para essa oportunidade
    const { data: existingLP } = await supabase
      .from('landing_pages')
      .select('slug')
      .eq('opportunity_id', opportunityId)
      .single();

    if (existingLP) {
      return NextResponse.json({ success: true, slug: existingLP.slug, message: 'Landing page já existe!' });
    }

    // 2. Chamar o Groq para gerar a Copywriting
    const systemPrompt = `Você é um Copywriter especialista em conversão (Landing Pages) e lançamento de SaaS de alta conversão.
Sua missão é escrever todo o conteúdo de uma Landing Page com tema escuro (Dark Mode) para capturar leads (lista de espera) para uma nova ideia de SaaS.

DADOS DA IDEIA DO SAAS:
- Nome do SaaS: "${opportunity.saas_name}"
- Problema Resolvido: "${opportunity.problem_solved}"
- Público-Alvo: "${opportunity.target_audience}"
- Diferencial Competitivo: "${opportunity.competitive_advantage}"
- MVP Funcionalidades: "${opportunity.mvp_features}"
- Monetização/Preço: "${opportunity.monetization_model} / ${opportunity.suggested_price}"

Você deve gerar e retornar estritamente um JSON no seguinte formato:
{
  "headline": "Título principal curto, impactante e viciante (focado no benefício principal ou na dor de quem leu o livro base)",
  "subheadline": "Subtítulo explicando o que o software faz e como ele resolve o problema de forma única",
  "cta_text": "Texto do botão de chamada para ação (ex: 'Garantir Acesso Antecipado', 'Quero entrar na lista')",
  "theme_color": "Uma cor hex que combina com o nicho (ex: roxo '#a855f7', azul '#3b82f6', verde '#10b981', laranja '#f97316')",
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
      "quote": "Depoimento realista sobre a dor que sentia e como essa solução resolve perfeitamente (ex: 'Finalmente um app que foca em...')"
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

IMPORTANTE: Responda APENAS o JSON válido. Não adicione saudações, explicações ou blocos de código markdown (\`\`\`json). Apenas o JSON cru.`;

    const models = ['llama-3.3-70b-versatile', 'mixtral-8x7b-32768', 'llama-3.1-8b-instant'];
    let reply = '';
    let lastError: any = null;

    for (const model of models) {
      try {
        console.log(`[Landing Page Gen] Tentando modelo: ${model}`);
        const chatCompletion = await groq.chat.completions.create({
          messages: [{ role: 'user', content: systemPrompt }],
          model: model,
          temperature: 0.7,
          response_format: { type: 'json_object' }
        });

        reply = chatCompletion.choices[0]?.message?.content || '';
        if (reply) {
          console.log(`[Landing Page Gen] Gerado com sucesso usando: ${model}`);
          break;
        }
      } catch (err: any) {
        console.warn(`[Landing Page Gen] Erro com ${model}:`, err.message || err);
        lastError = err;
      }
    }

    if (!reply) {
      throw new Error(`Falha ao gerar conteúdo da Landing Page: ${lastError?.message || lastError}`);
    }

    const data = JSON.parse(reply);

    // 3. Gerar um slug amigável e único
    let baseSlug = slugify(opportunity.saas_name);
    let slug = baseSlug;
    let counter = 1;

    // Verificar colisão de slugs
    while (true) {
      const { data: col } = await supabase
        .from('landing_pages')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!col) break; // Slug único encontrado
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // 4. Inserir no Banco de Dados
    const { error: insertErr } = await supabase
      .from('landing_pages')
      .insert({
        opportunity_id: opportunityId,
        slug,
        headline: data.headline,
        subheadline: data.subheadline,
        cta_text: data.cta_text,
        theme_color: data.theme_color || '#a855f7',
        features: data.features,
        benefits: data.benefits,
        testimonials: data.testimonials,
        faqs: data.faqs,
        user_id: user?.id || null
      });

    if (insertErr) {
      throw new Error(`Erro ao salvar no banco: ${insertErr.message}`);
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

    // Carregar todas as landing pages associadas a oportunidades
    const { data: lps, error: lpErr } = await supabase
      .from('landing_pages')
      .select('id, slug, headline, created_at, opportunity_id, opportunities(saas_name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (lpErr) {
      throw lpErr;
    }

    // Carregar leads para cada landing page para contar
    const results = await Promise.all(
      (lps || []).map(async (lp: any) => {
        const { count } = await supabase
          .from('waitlist_leads')
          .select('*', { count: 'exact', head: true })
          .eq('landing_page_id', lp.id);

        return {
          id: lp.id,
          slug: lp.slug,
          headline: lp.headline,
          createdAt: lp.created_at,
          saasName: lp.opportunities?.saas_name || 'SaaS sem nome',
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
