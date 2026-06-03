import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

async function checkAdmin(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  if (user.email === 'moisesdematos@gmail.com') return true;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

export async function POST() {
  try {
    const supabase = await createClient();
    const isAdmin = await checkAdmin(supabase);

    if (!isAdmin) {
      return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 });
    }

    // 1. Limpar oportunidades antigas de demonstração (opcional, mantemos as reais e limpamos as antigas de seed)
    // Para simplificar localmente, limpamos as oportunidades criadas pelo seeder ou apenas fazemos o truncate/delete
    const { error: deleteOppError } = await supabase
      .from('opportunities')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Limpa tudo
      
    if (deleteOppError) console.warn('Erro ao limpar base:', deleteOppError);

    // 2. Oportunidades de SaaS Baseadas em Livros Famosos
    const demoOpps = [
      {
        book_title: "Atomic Habits",
        book_author: "James Clear",
        book_category: "Produtividade",
        book_description: "Como criar hábitos saudáveis e quebrar os ruins através de pequenas mudanças de 1% diariamente.",
        country: "US",
        trends_growth_weekly: 12.5,
        trends_growth_monthly: 45.2,
        reddit_mentions: 342,
        viral_opportunity_score: 96,
        saas_name: "HabitGrid SaaS",
        problem_solved: "Dificuldade de manter consistência e responsabilização em rotinas pessoais e corporativas.",
        target_audience: "Profissionais remotos e equipas ágeis.",
        competitive_advantage: "Sistema de gamificação cooperativa e lembretes contextuais com inteligência artificial.",
        mvp_features: "Rastreador de hábitos em grelha, integração Slack/Teams, e relatórios semanais gerados por IA.",
        monetization_model: "SaaS Freemium (Subs mensal)",
        suggested_price: "$8 / utilizador",
        potential_revenue: "$5,000 / mês MRR",
        implementation_difficulty: "Baixa",
        development_time: "15 dias",
        prompt_lovable: "Crie um painel estilo Habito com grelha interactiva...",
        prompt_bolt: "npm install framer-motion lucide-react..."
      },
      {
        book_title: "The Lean Startup",
        book_author: "Eric Ries",
        book_category: "Negócios",
        book_description: "Metodologia ágil para validação contínua de hipóteses de negócio antes de investir capital pesado.",
        country: "BR",
        trends_growth_weekly: 8.2,
        trends_growth_monthly: 32.0,
        reddit_mentions: 189,
        viral_opportunity_score: 88,
        saas_name: "MVP Validation Tracker",
        problem_solved: "Desperdício de tempo e recursos construindo produtos que ninguém quer.",
        target_audience: "Fundadores de startups em estágio inicial.",
        competitive_advantage: "Gerador automatizado de questionários de dor com análise de sentimentos orientada por IA.",
        mvp_features: "Landing page builder ultra rápido para testes, rastreamento de cliques e insights qualitativos automáticos.",
        monetization_model: "Subscrição mensal ilimitada",
        suggested_price: "R$ 49 / mês",
        potential_revenue: "R$ 15,000 / mês MRR",
        implementation_difficulty: "Média",
        development_time: "20 dias",
        prompt_lovable: "Painel administrativo simples contendo tabelas de hipóteses...",
        prompt_bolt: "npx create-next-app@latest..."
      },
      {
        book_title: "The 4-Hour Workweek",
        book_author: "Timothy Ferriss",
        book_category: "Estilo de Vida",
        book_description: "Escapar da corrida dos ratos, viver em qualquer lugar e criar uma musa automatizada que gera renda passiva.",
        country: "PT",
        trends_growth_weekly: 15.0,
        trends_growth_monthly: 60.5,
        reddit_mentions: 512,
        viral_opportunity_score: 92,
        saas_name: "AutoDelegate Engine",
        problem_solved: "Sobrecarga de tarefas operacionais repetitivas e falta de tempo para focar na estratégia.",
        target_audience: "Solopreneurs e Criadores de Conteúdo.",
        competitive_advantage: "Integração total com plataformas de freelancers e bots de automação de fluxo de e-mails.",
        mvp_features: "Mapeador de fluxos de tarefas, IA que sugere delegações e templates prontos para e-mail auto-resposta.",
        monetization_model: "Pay-as-you-go ou Plano Pro",
        suggested_price: "€29 / mês",
        potential_revenue: "€8,000 / mês MRR",
        implementation_difficulty: "Alta",
        development_time: "30 dias",
        prompt_lovable: "Desenhe um dashboard com pipeline visual no estilo Kanban...",
        prompt_bolt: "npm install @supabase/supabase-js..."
      },
      {
        book_title: "Deep Work",
        book_author: "Cal Newport",
        book_category: "Produtividade",
        book_description: "Regras para o sucesso focado num mundo distraído. Concentração profunda sem interrupções.",
        country: "US",
        trends_growth_weekly: 9.8,
        trends_growth_monthly: 29.4,
        reddit_mentions: 211,
        viral_opportunity_score: 83,
        saas_name: "FocusBlock AI",
        problem_solved: "Distração constante com redes sociais, e-mails e Slack durante o horário produtivo.",
        target_audience: "Desenvolvedores e Escritores.",
        competitive_advantage: "Sistema inteligente de bloqueio e monitor de ondas de foco com detecção de padrões de fadiga.",
        mvp_features: "Bloqueador de sites Chrome, contador pomodoro com IA, e gráficos de tempo gasto em estado profundo.",
        monetization_model: "Subscrição Individual Anual",
        suggested_price: "$4.99 / mês",
        potential_revenue: "$3,500 / mês MRR",
        implementation_difficulty: "Baixa",
        development_time: "10 dias",
        prompt_lovable: "Crie uma interface Pomodoro futurista e limpa em dark mode...",
        prompt_bolt: "npm install lucide-react..."
      }
    ];

    const { data: insertedOpps, error: insertOppError } = await supabase
      .from('opportunities')
      .insert(demoOpps)
      .select();

    if (insertOppError) throw insertOppError;

    // 3. Limpar contatos e semear contatos de suporte de teste
    const { error: deleteContactsError } = await supabase
      .from('contacts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteContactsError) console.warn('Erro ao limpar contatos:', deleteContactsError);

    const demoContacts = [
      {
        name: "Carlos Fernandes",
        email: "carlos.fd@outlook.pt",
        message: "Olá! Fiz a compra do plano VIP via transferência bancária ontem às 22h, mas a minha conta ainda aparece como Gratuita. Podem ajudar-me? Obrigado!",
        status: "pending"
      },
      {
        name: "Diana Mendes",
        email: "diana.mendes@gmail.com",
        message: "Incrível plataforma! Seria possível exportar os relatórios das ideias geradas em formato PDF contendo os prompts prontos do Lovable? Isso ajudaria imenso.",
        status: "pending"
      },
      {
        name: "Arthur Silva",
        email: "arthur.silva@live.com",
        message: "O motor de IA gerou uma oportunidade espetacular baseada no livro Zero to One. O prompt do Bolt.new funcionou perfeitamente no meu deploy! Parabéns pelo projeto.",
        status: "resolved"
      }
    ];

    const { data: insertedContacts, error: insertContactsError } = await supabase
      .from('contacts')
      .insert(demoContacts)
      .select();

    if (insertContactsError) throw insertContactsError;

    return NextResponse.json({
      success: true,
      message: 'Base de dados de demonstração semeada com sucesso!',
      opportunitiesInsertedCount: insertedOpps.length,
      contactsInsertedCount: insertedContacts.length
    });

  } catch (error: any) {
    console.error('Erro ao semear banco de dados (Admin):', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
