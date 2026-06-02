/**
 * Script para rodar a automação 100% localmente.
 * Ideal para você deixar rodando no seu terminal enquanto não faz o deploy na web.
 */
const fetch = require('node-fetch');

// Vamos simular a chamada cron a cada 5 minutos (300000 ms) para testes.
const INTERVALO = 5 * 60 * 1000; 

const CRON_SECRET = 'minha_senha_super_secreta_local';

async function rodarRadarLocal() {
  console.log(`[${new Date().toLocaleTimeString()}] Iniciando o Radar Automático...`);
  try {
    const res = await fetch('http://localhost:3001/api/cron', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CRON_SECRET}`
      }
    });

    const data = await res.json();
    if (res.ok) {
      console.log(`✅ Sucesso! Nova Oportunidade Gerada:`, data.message);
    } else {
      console.error(`❌ Falha:`, data.error);
    }
  } catch (error) {
    console.error(`❌ Erro ao conectar com a API: Certifique-se que o Next.js está rodando (npm run dev)`);
  }
}

console.log("Robô local ativado! Rodando o radar periodicamente...");
// Roda a primeira vez logo de cara
rodarRadarLocal();
// Fica repetindo a cada X minutos
setInterval(rodarRadarLocal, INTERVALO);
