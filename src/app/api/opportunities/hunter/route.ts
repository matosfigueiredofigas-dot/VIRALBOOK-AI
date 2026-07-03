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

    // Se já existe um dossiê gerado, apenas retorna
    if (opp.hunter_ai_json) {
      return NextResponse.json({ hunter: opp.hunter_ai_json });
    }

    const prompt = `
Você é o "Hunter AI", o melhor Especialista de Outbound B2B e SDR Sênior do Vale do Silício.
Você é mestre na metodologia Predictable Revenue (Aaron Ross) e em Cold Emails ultracurtos e de altíssima conversão.

Eu tenho o seguinte produto SaaS:
Nome: ${opp.saas_name}
Público Alvo Original: ${opp.target_audience}
Problema: ${opp.problem_solved}
Solução: ${opp.mvp_features}

Sua missão é criar o "Command Center de Prospecção" perfeito para mim em formato JSON, com as seguintes chaves EXATAS:

{
  "target_persona": {
    "decision_maker": "string (Descreva quem assina o cheque ou sofre mais com o problema. Ex: Diretor de Vendas)",
    "job_titles": ["string (Liste 4 cargos exatos que devo buscar no LinkedIn)"],
    "industries": ["string (Liste 3 setores ideais)"]
  },
  "google_dorks": [
    {
      "description": "string (Para que serve essa busca. Ex: Buscar Diretores no setor X no LinkedIn)",
      "query": "string (A query exata para colar no Google. Ex: site:linkedin.com/in/ \\"Diretor de Vendas\\" AND (\\"SaaS\\" OR \\"Tecnologia\\"))"
    }
  ],
  "cold_emails": [
    {
      "step": "string (Ex: Dia 1 - Quebra-gelo, Dia 3 - Follow-up Agregando Valor, Dia 7 - Break-up)",
      "subject": "string (Assunto curto e que gere muita curiosidade, sem parecer marketing)",
      "body": "string (Corpo do email. DEVE SER CURTO, no máximo 4 linhas. Focado na dor, não na ferramenta. Use placeholders como [Nome]. Dê espaços com \\n\\n)"
    }
  ],
  "linkedin_scripts": [
    {
      "type": "string (Ex: Convite de Conexão, Mensagem após aceite)",
      "message": "string (Mensagem curta e humana para DM no LinkedIn, sem vender no primeiro contato)"
    }
  ]
}

Regras Cruciais:
1. Retorne APENAS o JSON válido.
2. Não use markdown, não use \`\`\`json. Comece com { e termine com }.
3. Nos e-mails, aplique as melhores práticas: seja brutalmente honesto, não use jargões difíceis, faça uma única pergunta (Call to Action macio) no final.
4. Gere 3 Google Dorks diferentes (ex: um para encontrar emails no Google Docs/Sheets vazados, outro para perfis do LinkedIn, etc).
5. Gere exatamente 3 Cold Emails formando uma cadência (Abertura, Follow-up, Despedida).
6. Gere exatamente 2 Scripts de LinkedIn.
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      response_format: { type: 'json_object' },
    });

    const jsonString = chatCompletion.choices[0]?.message?.content || '{}';
    const hunterData = JSON.parse(jsonString);

    // Salvar no banco
    const { error: updateError } = await supabase
      .from('opportunities')
      .update({ hunter_ai_json: hunterData })
      .eq('id', opportunityId);

    if (updateError) {
      console.error('[Hunter] Falha ao salvar no banco:', updateError);
      throw new Error('Falha ao salvar dossiê no banco');
    }

    return NextResponse.json({ hunter: hunterData });
  } catch (error: any) {
    console.error('[Hunter API] Error:', error);
    return NextResponse.json({ error: error.message || 'Erro ao gerar Hunter AI' }, { status: 500 });
  }
}
