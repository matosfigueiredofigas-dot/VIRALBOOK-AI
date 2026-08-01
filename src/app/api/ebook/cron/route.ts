import { Resend } from 'resend';
import { createAdminClient } from '@/utils/supabase/admin';
import { NextResponse } from 'next/server';
import { EMAIL_SEQUENCE } from '../subscribe/route';

// ── Cron job: enviado automaticamente pelo Vercel Cron a cada dia ─────────────
// Configurar em vercel.json:
// { "crons": [{ "path": "/api/ebook/cron", "schedule": "0 10 * * *" }] }


export async function GET(req: Request) {
  // Verificar autenticação do cron
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 });
  }

  // Inicialização lazy — só instancia quando a rota é chamada (não no build)
  const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder');
  const supabase = createAdminClient();

  // Buscar leads que ainda têm emails por enviar (sequence_day <= 6)
  const { data: leads, error } = await supabase
    .from('ebook_leads')
    .select('*')
    .lte('sequence_day', 6)
    .eq('active', true);

  if (error) {
    console.error('[eBook Cron] Erro ao buscar leads:', error);
    return NextResponse.json({ error: 'Erro na base de dados.' }, { status: 500 });
  }

  if (!leads || leads.length === 0) {
    return NextResponse.json({ message: 'Nenhum lead para processar.' });
  }

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    const day = lead.sequence_day;
    const template = EMAIL_SEQUENCE[day];

    if (!template) {
      // Sequência completa — desativar o lead
      await supabase
        .from('ebook_leads')
        .update({ active: false })
        .eq('email', lead.email);
      continue;
    }

    const { subject, html } = template();

    const { error: emailError } = await resend.emails.send({
      from: 'ViralBook AI <onboarding@resend.dev>',
      to: lead.email,
      subject,
      html,
    });

    if (emailError) {
      console.error(`[eBook Cron] Erro ao enviar email para ${lead.email}:`, emailError);
      failed++;
    } else {
      // Avançar para o próximo dia da sequência
      await supabase
        .from('ebook_leads')
        .update({ sequence_day: day + 1 })
        .eq('email', lead.email);
      sent++;
    }
  }

  console.log(`[eBook Cron] Enviados: ${sent} | Falhas: ${failed}`);
  return NextResponse.json({ sent, failed, total: leads.length });
}
