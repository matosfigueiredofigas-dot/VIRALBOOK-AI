import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { Groq } from 'groq-sdk';

async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if (['moisesdematos@gmail.com', 'edsonquicuca92@gmail.com'].includes(user.email)) return true;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

export async function GET() {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    // 1. Obter dados resumidos de Oportunidades do Banco
    const { data: opportunities, error } = await supabase
      .from('opportunities')
      .select('book_category, country, viral_opportunity_score, saas_name, implementation_difficulty')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const totalOpps = opportunities?.length || 0;

    // Calcular algumas estatísticas simples para enviar no prompt
    const categoriesMap: Record<string, number> = {};
    const countriesMap: Record<string, number> = {};
    let avgScore = 0;

    opportunities?.forEach(o => {
      if (o.book_category) {
        categoriesMap[o.book_category] = (categoriesMap[o.book_category] || 0) + 1;
      }
      if (o.country) {
        countriesMap[o.country] = (countriesMap[o.country] || 0) + 1;
      }
      avgScore += o.viral_opportunity_score || 0;
    });

    avgScore = totalOpps > 0 ? Math.round(avgScore / totalOpps) : 0;

    // Ordenar e pegar as principais categorias e países
    const topCategories = Object.entries(categoriesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => `${entry[0]} (${entry[1]} ideias)`)
      .join(', ') || 'Nenhuma';

    const topCountries = Object.entries(countriesMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => `${entry[0]} (${entry[1]} ideias)`)
      .join(', ') || 'Nenhum';

    const systemPrompt = `Você é o Diretor Estratégico de IA (AI Admin Copilot) da plataforma ViralBook AI.
Sua tarefa é analisar os dados estatísticos de oportunidades SaaS geradas a partir de Ebooks e produzir um relatório executivo de alta qualidade e premium para o administrador do painel.
Escreva um relatório direto, inspirador e estratégico em português de Portugal. Use Markdown para formatação.
Divida o relatório nas seguintes seções:
1. 📈 Resumo da Saúde do Mercado (Análise rápida baseada nos números fornecidos).
2. 🔥 Nichos Mais Quentes (Indique quais categorias estão em alta e por que são lucrativas).
3. 🗺️ Oportunidade Geográfica (Onde estão os mercados mais promissores com base nos países ativos).
4. 🧠 Recomendação do Copiloto (1 conselho acionável para o admin alavancar a plataforma).`;

    const userPrompt = `Estatísticas Atuais da Plataforma:
- Total de Ideias de SaaS Cadastradas: ${totalOpps}
- Score de Oportunidade Médio (0 a 100): ${avgScore}/100
- Principais Categorias Detectadas: ${topCategories}
- Países Mais Frequentes: ${topCountries}
- Exemplos de SaaS gerados recentemente: ${opportunities?.slice(0, 5).map(o => o.saas_name).join(', ') || 'Nenhum'}`;

    let reportMarkdown = '';
    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey) {
      try {
        const groq = new Groq({ apiKey });
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          model: 'llama-3.1-8b-instant',
          temperature: 0.6,
        });

        reportMarkdown = completion.choices[0]?.message?.content || '';
      } catch (err: any) {
        console.error('Falha na chamada do Groq para insights:', err.message || err);
      }
    }

    // Fallback se a API do Groq falhar ou não estiver configurada
    if (!reportMarkdown) {
      reportMarkdown = `### 📈 Resumo da Saúde do Mercado
Temos atualmente **${totalOpps} oportunidades** geradas com um Score de Oportunidade médio de **${avgScore}/100**. O ecossistema está ativo e a apresentar um rácio saudável de viabilidade de produtos.

### 🔥 Nichos Mais Quentes
A maior concentração de ideias geradas está na categoria **${topCategories}**. Isso demonstra um interesse crescente em automatização destas tarefas específicas. Recomenda-se criar campanhas focadas nestes temas para captar mais utilizadores premium.

### 🗺️ Oportunidade Geográfica
O mercado mais relevante tem sido **${topCountries}**. Há potencial para lançar landing pages focadas regionalmente para aumentar a taxa de conversão local.

### 🧠 Recomendação do Copiloto
*Dica do Motor de IA:* Considere adicionar tutoriais rápidos integrados de IA na secção de ferramentas para incentivar os utilizadores a iniciarem o desenvolvimento do MVP dos SaaS criados.`;
    }

    return NextResponse.json({ report: reportMarkdown });

  } catch (error: any) {
    console.error('Erro na API de insights (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
