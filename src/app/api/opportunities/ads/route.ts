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

    // Se já existe um Ads gerado, apenas retorna
    if (opp.ads_ai_json) {
      return NextResponse.json({ ads: opp.ads_ai_json });
    }

    const prompt = `
Você é o "Ads Generator AI", um Diretor de Criação e Copywriter de elite (nível Russell Brunson / Ogilvy) especializado em tráfego pago para produtos SaaS.
Você conhece as fórmulas secretas que retêm a atenção nos primeiros 3 segundos do TikTok e geram cliques altíssimos no Facebook/Instagram Ads.

Eu tenho o seguinte produto SaaS:
Nome: ${opp.saas_name}
Público Alvo: ${opp.target_audience}
Problema: ${opp.problem_solved}
Solução (MVP): ${opp.mvp_features}

Sua missão é criar a campanha perfeita para mim em formato JSON, com as seguintes chaves EXATAS:

{
  "facebook_ads": [
    {
      "angle": "string (O ângulo de marketing. Ex: Agitando a Dor, Transformação, Prova Social)",
      "primary_text": "string (O texto longo da legenda do post. Use o método AIDA, emojis estratégicos e espaços. Pode ter até 15 linhas.)",
      "headline": "string (O título curto e muito chamativo que fica embaixo da imagem)",
      "call_to_action": "string (O botão ideal. Ex: Saiba mais, Cadastre-se)"
    }
  ],
  "tiktok_scripts": [
    {
      "style": "string (O estilo do vídeo. Ex: POV, Rotina, React, VSL Rápido)",
      "duration": "string (Ex: 30 segundos)",
      "script_blocks": [
        {
          "time": "string (Ex: 0-3s, 3-15s, etc)",
          "visual": "string (O que mostrar na tela/câmera. Instruções de gravação)",
          "audio": "string (A fala exata ou legenda na tela. Seja direto e impactante)"
        }
      ]
    }
  ],
  "creative_ideas": [
    {
      "concept": "string (Nome do conceito visual)",
      "description": "string (Instruções detalhadas para eu montar a imagem no Canva ou Photoshop)"
    }
  ]
}

Regras Cruciais:
1. Retorne APENAS o JSON válido. Comece com { e termine com }.
2. Gere exatamente 3 Facebook Ads (diferentes ângulos).
3. Gere exatamente 2 TikTok Scripts detalhados (um focado na dor, outro focado no produto/tutorial rápido).
4. Gere exatamente 3 Ideias Criativas para imagens/banners.
5. Use formatação limpa no "primary_text", usando \\n\\n para quebras de parágrafo onde necessário.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      response_format: { type: 'json_object' },
    });

    const jsonString = chatCompletion.choices[0]?.message?.content || '{}';
    const adsData = JSON.parse(jsonString);

    // Salvar no banco
    const { error: updateError } = await supabase
      .from('opportunities')
      .update({ ads_ai_json: adsData })
      .eq('id', opportunityId);

    if (updateError) {
      console.error('[Ads] Falha ao salvar no banco:', updateError);
      throw new Error('Falha ao salvar Ads no banco');
    }

    return NextResponse.json({ ads: adsData });
  } catch (error: any) {
    console.error('[Ads API] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Ads AI' }, { status: 500 });
  }
}
