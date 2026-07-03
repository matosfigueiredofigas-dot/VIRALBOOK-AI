import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'placeholder_key',
});

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

    const { opportunityId } = await req.json();

    if (!opportunityId) {
      return NextResponse.json({ error: 'ID da oportunidade é obrigatório' }, { status: 400 });
    }

    // Busca os dados da oportunidade
    const { data: opp, error: oppError } = await supabase
      .from('opportunities')
      .select('*')
      .eq('id', opportunityId)
      .eq('user_id', user.id)
      .single();

    if (oppError || !opp) {
      return NextResponse.json({ error: 'Oportunidade não encontrada' }, { status: 404 });
    }

    // Se já existe um dossiê gerado, apenas retorna (para economizar tokens)
    if (opp.market_teardown_json) {
      return NextResponse.json({ teardown: opp.market_teardown_json });
    }

    const prompt = `
Você é o mais brilhante Estrategista de Mercado e Analista de Venture Capital do mundo (nível Y Combinator e a16z).
Sua missão é criar um "Dossiê de Inteligência Competitiva (Market Teardown)" implacável para a seguinte ideia de SaaS:

Nome do SaaS: ${opp.saas_name}
Público Alvo: ${opp.target_audience}
Problema Resolvido: ${opp.problem_solved}
Funcionalidades MVP: ${opp.mvp_features}
Vantagem Injusta Planejada: ${opp.competitive_advantage}

Você deve retornar EXCLUSIVAMENTE um objeto JSON válido, estruturado EXATAMENTE da seguinte forma:
{
  "market_overview": {
    "tam_sam_som": "string (Análise do tamanho do mercado com estimativas realistas em dólares)",
    "growth_cagr": "string (Estimativa de crescimento anual da indústria)",
    "key_trends": ["string (3 grandes tendências impulsionando essa demanda)"]
  },
  "competitors": [
    {
      "name": "string (Nome de um concorrente real global ou local)",
      "weakness": "string (A maior fraqueza que podemos explorar)",
      "strength": "string (A maior força deles)",
      "pricing": "string (Como eles cobram)",
      "our_edge": "string (Como este nosso MVP os derrota)"
    },
    // Gere 3 concorrentes
  ],
  "go_to_market_strategy": {
    "acquisition_channels": [
      {
        "channel": "string (Nome do canal, ex: SEO, Cold Email, Reddit)",
        "tactics": "string (Como executar especificamente para esse SaaS)"
      }
    ],
    "first_100_users": "string (Guia prático e sujo de como roubar/conseguir os 100 primeiros clientes pagos em 30 dias)"
  },
  "pricing_model_recommendation": {
    "logic": "string (Por que escolhemos este modelo de preço)",
    "tiers": [
      {
        "name": "string (Ex: Starter)",
        "price": "string (Preço exato)",
        "features": ["string"]
      },
      // Gere 2 ou 3 planos
    ]
  }
}
Responda APENAS com o JSON. Não use markdown, não coloque \`\`\`json. Comece com { e termine com }.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const jsonString = chatCompletion.choices[0]?.message?.content || '{}';
    const teardownData = JSON.parse(jsonString);

    // Salvar no banco
    const { error: updateError } = await supabase
      .from('opportunities')
      .update({ market_teardown_json: teardownData })
      .eq('id', opportunityId);

    if (updateError) {
      console.error('[Teardown] Falha ao salvar no banco:', updateError);
      throw new Error('Falha ao salvar dossiê no banco');
    }

    return NextResponse.json({ teardown: teardownData });
  } catch (error: any) {
    console.error('[Teardown API] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Dossiê' }, { status: 500 });
  }
}
