import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/utils/supabase/admin'
import { getSetting } from '@/lib/settings'

// ─────────────────────────────────────────────────────────────────────────────
// Hotmart Webhook Handler
// Docs: https://developers.hotmart.com/docs/en/webhook/
//
// Eventos tratados:
//   PURCHASE_APPROVED  → ativa is_premium = true
//   PURCHASE_CANCELED  → desativa is_premium = false
//   PURCHASE_REFUNDED  → desativa is_premium = false
//   PURCHASE_CHARGEBACK→ desativa is_premium = false
// ─────────────────────────────────────────────────────────────────────────────



// Eventos que ATIVAM acesso premium
const APPROVE_EVENTS = ['PURCHASE_APPROVED', 'PURCHASE_COMPLETE']

// Eventos que REVOGAM acesso premium
const REVOKE_EVENTS  = ['PURCHASE_CANCELED', 'PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_EXPIRED']

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()

    // ── 1. Verificar token de autenticação da Hotmart ──────────────────────
    // A Hotmart envia o token no header "hottok"
    const hottok = req.headers.get('hottok') || ''
    const hotmartToken = await getSetting('HOTMART_WEBHOOK_TOKEN')

    if (hotmartToken && hottok !== hotmartToken) {
      console.error('[Hotmart Webhook] Token inválido.')
      return NextResponse.json({ error: 'Token inválido.' }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)

    // ── 2. Extrair evento e dados do comprador ─────────────────────────────
    // Estrutura do payload da Hotmart:
    // { event: "PURCHASE_APPROVED", data: { buyer: { email }, purchase: { status } } }
    const eventName: string = payload?.event || ''
    const email: string     = payload?.data?.buyer?.email || ''
    const status: string    = payload?.data?.purchase?.status || ''

    console.log(`[Hotmart Webhook] Evento: ${eventName} | Email: ${email} | Status: ${status}`)

    if (!email) {
      console.error('[Hotmart Webhook] Email não encontrado no payload.')
      return NextResponse.json({ error: 'Email não informado.' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // ── 3. Ativar premium ──────────────────────────────────────────────────
    if (APPROVE_EVENTS.includes(eventName)) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('email', email)
        .select()

      if (error) {
        console.error('[Hotmart Webhook] Erro ao ativar premium:', error)
        return NextResponse.json({ error: 'Erro ao atualizar banco de dados.' }, { status: 500 })
      }

      console.log(`[Hotmart Webhook] ✅ Premium ATIVADO para: ${email}`, data)
    }

    // ── 4. Revogar premium ─────────────────────────────────────────────────
    else if (REVOKE_EVENTS.includes(eventName)) {
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_premium: false })
        .eq('email', email)
        .select()

      if (error) {
        console.error('[Hotmart Webhook] Erro ao revogar premium:', error)
        return NextResponse.json({ error: 'Erro ao atualizar banco de dados.' }, { status: 500 })
      }

      console.log(`[Hotmart Webhook] 🚫 Premium REVOGADO para: ${email}`, data)
    }

    else {
      // Evento não tratado — responder 200 para a Hotmart não retentar
      console.log(`[Hotmart Webhook] Evento ignorado: ${eventName}`)
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('[Hotmart Webhook] Erro crítico:', error)
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 })
  }
}
