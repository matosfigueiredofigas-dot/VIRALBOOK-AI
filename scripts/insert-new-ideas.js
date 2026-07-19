const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Erro: Credenciais do Supabase (URL ou Service Role Key) não encontradas no arquivo .env.local");
  process.exit(1);
}

// Cria o cliente usando o service role key para contornar políticas de RLS no insert
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false
  }
});

const newIdeas = [
  { name: "Agente de IA para compras empresariais (negocia fornecedores e faz cotações)", tier: 5 },
  { name: "Agente de auditoria financeira contínua", tier: 5 },
  { name: "Agente de gestão de contratos", tier: 5 },
  { name: "Agente para franquias (padroniza operações)", tier: 5 },
  { name: "Agente para hotéis (reservas, upsell e concierge)", tier: 5 },
  { name: "Agente para universidades privadas (matrículas e retenção)", tier: 5 },
  { name: "Agente para seguradoras (análise inicial de sinistros)", tier: 5 },
  { name: "Agente para concessionárias de veículos", tier: 4 },
  { name: "Agente para construtoras", tier: 4 },
  { name: "Agente para logística de última milha", tier: 5 },
  { name: "Agente para importação e exportação", tier: 5 },
  { name: "Agente de inteligência competitiva", tier: 5 },
  { name: "Agente para licitações públicas", tier: 5 },
  { name: "Agente para escritórios de contabilidade", tier: 5 },
  { name: "Agente de precificação dinâmica", tier: 5 },
  { name: "Agente para gestão de estoque", tier: 5 },
  { name: "Agente para onboarding de clientes", tier: 5 },
  { name: "Agente para Customer Success", tier: 5 },
  { name: "Agente para gestão de fornecedores", tier: 5 },
  { name: "Agente para monitoramento de indicadores (KPIs) em tempo real", tier: 5 },
  { name: "Empresa operada por IA (AI Operating Company)", tier: 6 },
  { name: "Conselho executivo de IA (CEO, CFO, COO, CMO e CTO virtuais)", tier: 6 },
  { name: "Sistema multiagente para bancos", tier: 6 },
  { name: "Sistema multiagente para petróleo e energia", tier: 6 },
  { name: "Plataforma de IA para mineração", tier: 6 },
  { name: "IA para gestão de portos", tier: 6 },
  { name: "IA para aeroportos", tier: 6 },
  { name: "IA para grandes redes hospitalares", tier: 6 },
  { name: "IA para governos digitais", tier: 6 },
  { name: "IA para forças de vendas globais", tier: 6 },
  { name: "IA para grandes grupos industriais", tier: 6 },
  { name: "IA para multinacionais de varejo", tier: 6 },
  { name: "IA para telecomunicações", tier: 6 },
  { name: "IA para operadores logísticos internacionais", tier: 6 },
  { name: "IA para fundos de private equity", tier: 6 },
  { name: "IA para fusões e aquisições (M&A)", tier: 6 },
  { name: "IA para gestão de cidades inteligentes", tier: 6 },
  { name: "IA para cadeias de suprimentos globais", tier: 6 },
  { name: "IA para empresas de infraestrutura", tier: 6 },
  { name: "Plataforma de 'Digital Workforce'", tier: 6 },
  { name: "IA que administra um shopping center inteiro", tier: 6 },
  { name: "IA que opera um condomínio de luxo", tier: 6 },
  { name: "IA para gerenciamento completo de um hotel cinco estrelas", tier: 6 },
  { name: "IA para administrar uma fazenda inteligente", tier: 6 },
  { name: "IA para controlar operações de mineração", tier: 6 },
  { name: "IA para redes de supermercados", tier: 6 },
  { name: "IA para gerenciamento de universidades", tier: 6 },
  { name: "IA para operações de companhias aéreas", tier: 6 },
  { name: "IA para gestão de cadeias de restaurantes", tier: 6 },
  { name: "IA para grupos empresariais com dezenas de empresas", tier: 6 },
  { name: "Plataforma SaaS com agentes", tier: 5 },
  { name: "Marketplace de agentes especializados", tier: 5 },
  { name: "AI Workforce as a Service", tier: 5 },
  { name: "Chief AI Officer as a Service", tier: 4 },
  { name: "Agentes para setores específicos (vertical AI)", tier: 5 },
  { name: "Sistema operacional empresarial com IA", tier: 6 },
  { name: "Sistema Operacional de Agentes para PMEs (AI Operating System)", tier: 6 },
  { name: "Stripe dos Agentes", tier: 5 },
  { name: "Banco para agentes", tier: 5 },
  { name: "App Store de Agentes", tier: 5 },
  { name: "Sistema operacional para robôs", tier: 6 },
  { name: "LinkedIn dos Agentes", tier: 5 },
  { name: "Mercado de conhecimento para IA", tier: 5 },
  { name: "Airbnb de capacidade computacional", tier: 6 },
  { name: "Empresa de 'treinamento' de agentes", tier: 5 },
  { name: "Plataforma de equipes digitais", tier: 5 },
  { name: "Mercado de habilidades", tier: 5 }
];

async function insertAll() {
  console.log(`Iniciando inserção de ${newIdeas.length} novos nichos no banco com privilégio de Admin...`);
  
  const formattedItems = newIdeas.map(item => ({
    type: 'audience',
    name: item.name,
    tier: item.tier
  }));

  // Vamos fazer upsert no banco
  const { data, error } = await supabase
    .from('matrix_items')
    .upsert(formattedItems, { onConflict: 'type,name' })
    .select();

  if (error) {
    console.error("Erro ao inserir itens no banco:", error);
    process.exit(1);
  }

  console.log(`Sucesso! ${data.length} itens inseridos ou atualizados com sucesso no banco de dados.`);
}

insertAll().catch(console.error);
