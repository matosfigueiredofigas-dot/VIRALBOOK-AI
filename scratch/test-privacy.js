const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !serviceRoleKey) {
  console.error("Erro: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY ou SUPABASE_SERVICE_ROLE_KEY não definidos no .env.local");
  process.exit(1);
}

// Cliente Administrador (vê tudo no banco)
const adminSupabase = createClient(supabaseUrl, serviceRoleKey);
// Cliente Anônimo (simula um visitante deslogado)
const anonSupabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  console.log("=== INICIANDO TESTES DE PRIVACIDADE ===");
  console.log(`Supabase URL: ${supabaseUrl}`);

  // 1. Verificar registros existentes no banco com o Admin Client
  console.log("\n1. Buscando todas as oportunidades com o Admin Client (visão completa)...");
  const { data: allOpps, error: adminErr } = await adminSupabase
    .from('opportunities')
    .select('id, user_id, saas_name, book_title');

  if (adminErr) {
    console.error("Erro ao ler com Admin Client:", adminErr.message);
    return;
  }

  console.log(`Total de registros no banco: ${allOpps.length}`);
  const userCreatedOpps = allOpps.filter(o => o.user_id !== null);
  const globalOpps = allOpps.filter(o => o.user_id === null);
  
  console.log(`- Oportunidades Globais (sistema): ${globalOpps.length}`);
  console.log(`- Oportunidades criadas por usuários: ${userCreatedOpps.length}`);

  if (userCreatedOpps.length === 0) {
    console.log("\nAviso: Não há oportunidades criadas por usuários no banco para testar a privacidade.");
    console.log("Por favor, acesse a aplicação, faça login e gere uma nova oportunidade antes de rodar o teste.");
    return;
  }

  console.log("\nExemplo de oportunidade privada encontrada:");
  console.log(`- ID: ${userCreatedOpps[0].id}`);
  console.log(`- SaaS Name: ${userCreatedOpps[0].saas_name}`);
  console.log(`- User ID Proprietário: ${userCreatedOpps[0].user_id}`);

  // 2. Tentar acessar com o Anon Client
  console.log("\n2. Tentando acessar todas as oportunidades anonimamente (Anon Client)...");
  const { data: anonOpps, error: anonErr } = await anonSupabase
    .from('opportunities')
    .select('id, user_id, saas_name');

  if (anonErr) {
    console.error("Erro ao ler com Anon Client:", anonErr.message);
    return;
  }

  const anonUserCreated = anonOpps.filter(o => o.user_id !== null);
  console.log(`Total retornado para o Anon Client: ${anonOpps.length}`);
  console.log(`- Oportunidades privadas que vazaram para o Anon Client: ${anonUserCreated.length}`);

  if (anonUserCreated.length > 0) {
    console.log("\n[FALHA DE SEGURANÇA NO BANCO ❌]");
    console.log("As oportunidades criadas por usuários estão visíveis para o cliente anônimo!");
    console.log("Isso significa que as políticas de RLS (Row Level Security) NÃO foram ativadas no painel do Supabase.");
    console.log("Ação necessária: Vá no painel do Supabase -> SQL Editor, cole e execute as políticas do arquivo database/schema.sql.");
  } else {
    console.log("\n[SUCESSO DE SEGURANÇA NO BANCO DE DADOS ✅]");
    console.log("Nenhuma oportunidade privada de usuário vazou para o cliente anônimo.");
  }

  // 3. Simular requisições fingindo ser o Usuário A acessando dados do Usuário B
  const samplePrivateOpp = userCreatedOpps[0];
  const otherUserId = samplePrivateOpp.user_id;

  console.log(`\n3. Verificando o filtro da aplicação Next.js para o usuário logado...`);
  const simulatedUserId = "00000000-0000-0000-0000-000000000000"; // Usuário diferente do proprietário
  
  // Consulta simulando a regra do Next.js: .or(`user_id.is.null,user_id.eq.${simulatedUserId}`)
  const { data: simulatedResults, error: simError } = await anonSupabase
    .from('opportunities')
    .select('id, user_id, saas_name')
    .or(`user_id.is.null,user_id.eq.${simulatedUserId}`);

  if (simError) {
    console.error("Erro na consulta simulada:", simError.message);
    return;
  }

  const leakedInSimulation = simulatedResults.filter(o => o.user_id !== null && o.user_id !== simulatedUserId);
  console.log(`Resultados simulados para usuário ${simulatedUserId}: ${simulatedResults.length}`);
  console.log(`- Oportunidades privadas de outros que vazaram na consulta: ${leakedInSimulation.length}`);

  if (leakedInSimulation.length > 0) {
    console.log("\n[ALERTA ⚠️]");
    console.log("Mesmo com o filtro do Next.js, os dados vazariam se o RLS não estivesse ativado (pois a API do Supabase aceitou retornar os registros se a query não for estrita).");
  } else {
    console.log("\n[SUCESSO NA APLICAÇÃO ✅]");
    console.log("O filtro do Next.js bloqueou com sucesso as oportunidades de outros usuários.");
  }
}

runTests();
