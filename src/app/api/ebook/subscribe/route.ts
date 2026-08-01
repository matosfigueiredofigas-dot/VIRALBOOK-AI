import { Resend } from 'resend';
import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';

// ── Templates de email ────────────────────────────────────────────────────────
const DOMAIN = 'https://www.viralbook-ai.com';
const EBOOK_DOWNLOAD_URL = `${DOMAIN}/ebook-download`;

function emailWelcome(name: string) {
  return {
    subject: '📖 O teu eBook chegou — Livros que Valem Milhões',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 40px 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: white;">⚡ ViralBook AI</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">O teu eBook está pronto</p>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="font-size: 22px; font-weight: 800; color: #f0f0f0; margin-top: 0;">Olá${name ? `, ${name}` : ''}! 👋</h2>
          <p style="color: #a0a0a0; line-height: 1.7;">O teu eBook <strong style="color: #f0f0f0;">"Livros que Valem Milhões"</strong> está pronto para download.</p>
          <p style="color: #a0a0a0; line-height: 1.7;">Em menos de 90 minutos vais aprender como transformar qualquer bestseller numa oportunidade de Micro SaaS lucrativo.</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${EBOOK_DOWNLOAD_URL}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 800; font-size: 16px;">
              📥 Descarregar eBook Agora
            </a>
          </div>
          <p style="color: #666; font-size: 13px; line-height: 1.7;">Nos próximos 5 dias vou partilhar contigo os conceitos mais importantes do livro — direto no teu email, sem spam.</p>
        </div>
        <div style="background: #111; padding: 24px 32px; text-align: center; border-top: 1px solid #222;">
          <p style="color: #444; font-size: 12px; margin: 0;">© 2025 ViralBook AI · <a href="https://www.viralbook-ai.com" style="color: #3b82f6; text-decoration: none;">www.viralbook-ai.com</a></p>
        </div>
      </div>
    `
  };
}

function emailDay2() {
  return {
    subject: '🔍 Os 7 sinais de um livro com potencial de software (Dia 2)',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: white;">⚡ ViralBook AI · Dia 2</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #f0f0f0; margin-top: 0;">Os 7 Sinais que Revelam um Software Milionário</h2>
          <p style="color: #a0a0a0; line-height: 1.7;">Nem todos os livros escondem oportunidades de software. Aqui estão os 3 mais importantes dos 7 sinais que partilhei no eBook:</p>
          <div style="background: #111; border-left: 3px solid #3b82f6; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #f0f0f0; font-weight: 700;">✅ Sinal 1: O livro ensina um processo repetitivo</p>
            <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Se as pessoas precisam de repetir o processo diariamente, existe espaço para uma subscrição.</p>
          </div>
          <div style="background: #111; border-left: 3px solid #8b5cf6; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #f0f0f0; font-weight: 700;">✅ Sinal 5: Os reviews de 3 estrelas mencionam dificuldade de implementação</p>
            <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Frases como "precisava de uma ferramenta para aplicar isto" são briefings de produto gratuitos.</p>
          </div>
          <div style="background: #111; border-left: 3px solid #10b981; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #f0f0f0; font-weight: 700;">✅ Sinal 7: O autor não tem um software próprio</p>
            <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Se um bestseller com 500k cópias não tem software associado, a lacuna é óbvia.</p>
          </div>
          <p style="color: #a0a0a0; line-height: 1.7;">Amanhã partilho os 5 casos reais de livros que se tornaram startups avaliadas em mil milhões.</p>
        </div>
        <div style="background: #111; padding: 24px 32px; text-align: center; border-top: 1px solid #222;">
          <p style="color: #444; font-size: 12px; margin: 0;">© 2025 ViralBook AI · <a href="https://www.viralbook-ai.com" style="color: #3b82f6; text-decoration: none;">www.viralbook-ai.com</a></p>
        </div>
      </div>
    `
  };
}

function emailDay3() {
  return {
    subject: '🚀 Como o GTD virou o Todoist (e o que isto significa para ti) · Dia 3',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: white;">⚡ ViralBook AI · Dia 3</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #f0f0f0; margin-top: 0;">5 Livros que se Tornaram Startups de Sucesso</h2>
          <p style="color: #a0a0a0; line-height: 1.7;">Estes não são exemplos teóricos. São provas reais de que a fórmula funciona:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 12px 8px; color: #f0f0f0; font-weight: 700; font-size: 13px;">📚 Getting Things Done</td>
              <td style="padding: 12px 8px; color: #3b82f6; font-weight: 700; font-size: 13px;">→ Todoist ($500M+)</td>
            </tr>
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 12px 8px; color: #f0f0f0; font-weight: 700; font-size: 13px;">📚 The 4-Hour Work Week</td>
              <td style="padding: 12px 8px; color: #3b82f6; font-weight: 700; font-size: 13px;">→ Zapier ($5B+)</td>
            </tr>
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 12px 8px; color: #f0f0f0; font-weight: 700; font-size: 13px;">📚 Deep Work</td>
              <td style="padding: 12px 8px; color: #3b82f6; font-weight: 700; font-size: 13px;">→ Freedom ($10M ARR)</td>
            </tr>
            <tr style="border-bottom: 1px solid #222;">
              <td style="padding: 12px 8px; color: #f0f0f0; font-weight: 700; font-size: 13px;">📚 The Lean Startup</td>
              <td style="padding: 12px 8px; color: #3b82f6; font-weight: 700; font-size: 13px;">→ Mixpanel ($865M)</td>
            </tr>
            <tr>
              <td style="padding: 12px 8px; color: #f0f0f0; font-weight: 700; font-size: 13px;">📚 Atomic Habits</td>
              <td style="padding: 12px 8px; color: #10b981; font-weight: 700; font-size: 13px;">→ A tua oportunidade? 👀</td>
            </tr>
          </table>
          <p style="color: #a0a0a0; line-height: 1.7;">Amanhã ensino o método de 4 passos para passar da prateleira ao SaaS — em 48 horas.</p>
        </div>
        <div style="background: #111; padding: 24px 32px; text-align: center; border-top: 1px solid #222;">
          <p style="color: #444; font-size: 12px; margin: 0;">© 2025 ViralBook AI · <a href="https://www.viralbook-ai.com" style="color: #3b82f6; text-decoration: none;">www.viralbook-ai.com</a></p>
        </div>
      </div>
    `
  };
}

function emailDay4() {
  return {
    subject: '⚡ O método de 4 passos: da prateleira ao SaaS em 48h · Dia 4',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: white;">⚡ ViralBook AI · Dia 4</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #f0f0f0; margin-top: 0;">Os 4 Passos — Resumo Rápido</h2>
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div style="background: #111; padding: 16px 20px; border-radius: 12px; border: 1px solid #222;">
              <p style="margin: 0; font-weight: 800; color: #3b82f6;">Passo 1: DESCOBERTA</p>
              <p style="margin: 6px 0 0; color: #a0a0a0; font-size: 14px;">Usa o Radar do ViralBook AI para encontrar o bestseller certo — mais de 50k cópias, categoria de alta intenção, autor sem software.</p>
            </div>
            <div style="background: #111; padding: 16px 20px; border-radius: 12px; border: 1px solid #222;">
              <p style="margin: 0; font-weight: 800; color: #8b5cf6;">Passo 2: ANÁLISE</p>
              <p style="margin: 6px 0 0; color: #a0a0a0; font-size: 14px;">Lê os reviews de 3 estrelas na Amazon. Procura frases como "precisava de uma ferramenta". Isso é o teu briefing de produto.</p>
            </div>
            <div style="background: #111; padding: 16px 20px; border-radius: 12px; border: 1px solid #222;">
              <p style="margin: 0; font-weight: 800; color: #10b981;">Passo 3: CONCEÇÃO</p>
              <p style="margin: 6px 0 0; color: #a0a0a0; font-size: 14px;">Define o MVP com apenas as funcionalidades P0. Uma dor, uma solução. O ViralBook AI gera o Lean Canvas automaticamente.</p>
            </div>
            <div style="background: #111; padding: 16px 20px; border-radius: 12px; border: 1px solid #222;">
              <p style="margin: 0; font-weight: 800; color: #f59e0b;">Passo 4: VALIDAÇÃO</p>
              <p style="margin: 6px 0 0; color: #a0a0a0; font-size: 14px;">Landing page + 48 horas + 50 inscrições = luz verde. O ViralBook AI gera a tua landing page em segundos.</p>
            </div>
          </div>
          <p style="color: #a0a0a0; line-height: 1.7; margin-top: 24px;">Amanhã: os 3 erros que destroem 90% dos projetos antes do primeiro cliente.</p>
        </div>
        <div style="background: #111; padding: 24px 32px; text-align: center; border-top: 1px solid #222;">
          <p style="color: #444; font-size: 12px; margin: 0;">© 2025 ViralBook AI · <a href="https://www.viralbook-ai.com" style="color: #3b82f6; text-decoration: none;">www.viralbook-ai.com</a></p>
        </div>
      </div>
    `
  };
}

function emailDay5() {
  return {
    subject: '❌ Os 3 erros que destroem projetos antes do 1º cliente · Dia 5',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: white;">⚡ ViralBook AI · Dia 5</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #f0f0f0; margin-top: 0;">Os 3 Erros Fatais</h2>
          <div style="background: #1a0a0a; border-left: 3px solid #ef4444; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-weight: 700; color: #f0f0f0;">❌ Erro 1: Construir antes de vender</p>
            <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">6 meses de código → lançamento → ninguém compra. A sequência certa é: validar → vender → construir.</p>
          </div>
          <div style="background: #1a0a0a; border-left: 3px solid #ef4444; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-weight: 700; color: #f0f0f0;">❌ Erro 2: Resolver todas as dores do livro de uma vez</p>
            <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Um livro tem dezenas de dores. O teu MVP resolve UMA — com excelência. Mais tarde adicionas o resto.</p>
          </div>
          <div style="background: #1a0a0a; border-left: 3px solid #ef4444; padding: 16px 20px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0; font-weight: 700; color: #f0f0f0;">❌ Erro 3: Não falar com clientes antes de construir</p>
            <p style="margin: 8px 0 0; color: #a0a0a0; font-size: 14px;">Os subreddits e grupos de leitores do livro são o teu laboratório de pesquisa gratuito. Usa-os.</p>
          </div>
          <p style="color: #a0a0a0; line-height: 1.7; margin-top: 24px;">Amanhã envio-te algo especial — uma oferta exclusiva para leitores do eBook. 👀</p>
        </div>
        <div style="background: #111; padding: 24px 32px; text-align: center; border-top: 1px solid #222;">
          <p style="color: #444; font-size: 12px; margin: 0;">© 2025 ViralBook AI · <a href="https://www.viralbook-ai.com" style="color: #3b82f6; text-decoration: none;">www.viralbook-ai.com</a></p>
        </div>
      </div>
    `
  };
}

function emailDay6() {
  return {
    subject: '🎁 Oferta exclusiva para leitores do eBook (expira em 48h)',
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #f0f0f0; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #f59e0b, #ef4444); padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 22px; font-weight: 900; color: white;">🎁 Oferta Exclusiva — 48h</h1>
        </div>
        <div style="padding: 40px 32px;">
          <h2 style="font-size: 20px; font-weight: 800; color: #f0f0f0; margin-top: 0;">Já tens o conhecimento. Agora precisas da ferramenta.</h2>
          <p style="color: #a0a0a0; line-height: 1.7;">Nos últimos 5 dias aprendeste o método. O ViralBook AI é a plataforma que automatiza cada passo:</p>
          <ul style="color: #a0a0a0; line-height: 2; padding-left: 20px;">
            <li>📡 Radar Global — encontra bestsellers com potencial em segundos</li>
            <li>💡 Biblioteca de Ideias — gera conceitos de Micro SaaS automaticamente</li>
            <li>🎨 Lean Canvas — estrutura o teu negócio com IA</li>
            <li>🤝 8 Mentores Lendários — valida com Paul Graham, Naval, Jobs e mais</li>
            <li>🚀 Landing Pages — valida a tua ideia em horas, não semanas</li>
          </ul>
          <div style="background: #111; border: 1px solid #f59e0b; border-radius: 16px; padding: 24px; text-align: center; margin: 24px 0;">
            <p style="margin: 0; color: #a0a0a0; font-size: 13px; text-decoration: line-through;">Plano Pro Master — $19/mês</p>
            <p style="margin: 8px 0; font-size: 36px; font-weight: 900; color: #f0f0f0;">$13/mês</p>
            <p style="margin: 0; color: #f59e0b; font-weight: 700; font-size: 13px;">30% desconto exclusivo para leitores do eBook</p>
          </div>
          <div style="text-align: center; margin: 24px 0;">
            <a href="https://www.viralbook-ai.com#pricing" style="display: inline-block; background: linear-gradient(135deg, #f59e0b, #ef4444); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: 800; font-size: 16px;">
              🚀 Ativar Desconto de 30%
            </a>
          </div>
          <p style="color: #666; font-size: 13px; text-align: center;">Esta oferta expira em 48 horas. Garantia de reembolso de 30 dias.</p>
        </div>
        <div style="background: #111; padding: 24px 32px; text-align: center; border-top: 1px solid #222;">
          <p style="color: #444; font-size: 12px; margin: 0;">© 2025 ViralBook AI · <a href="https://www.viralbook-ai.com" style="color: #3b82f6; text-decoration: none;">www.viralbook-ai.com</a></p>
        </div>
      </div>
    `
  };
}

// ── Mapeamento dia → template ─────────────────────────────────────────────────
export const EMAIL_SEQUENCE: Record<number, () => { subject: string; html: string }> = {
  1: emailWelcome.bind(null, ''),
  2: emailDay2,
  3: emailDay3,
  4: emailDay4,
  5: emailDay5,
  6: emailDay6,
};

// ── Função principal: envia email de boas vindas + regista lead ───────────────
export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Guardar lead no Supabase
    const { error: dbError } = await supabase
      .from('ebook_leads')
      .upsert({ email, name: name || '', sequence_day: 1, subscribed_at: new Date().toISOString() }, { onConflict: 'email' });

    if (dbError) {
      console.error('[eBook] Erro ao guardar lead:', dbError);
    }

    // 2. Enviar email de boas-vindas imediatamente
    const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
    const template = emailWelcome(name || '');
    const { error: emailError } = await resend.emails.send({
      from: 'ViralBook AI <onboarding@resend.dev>',
      to: email,
      subject: template.subject,
      html: template.html,
    });

    if (emailError) {
      console.error('[eBook] Erro ao enviar email:', emailError);
      return NextResponse.json({ error: 'Erro ao enviar email.' }, { status: 500 });
    }

    console.log(`[eBook] Lead registado e email enviado para: ${email}`);
    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('[eBook] Erro crítico:', error);
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 });
  }
}
