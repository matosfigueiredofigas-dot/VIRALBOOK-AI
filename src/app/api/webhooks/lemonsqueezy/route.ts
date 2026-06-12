import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { createAdminClient } from '@/utils/supabase/admin'

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-signature') || ''
    const webhookSecret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || ''

    // 1. Verificar assinatura se a chave secreta estiver configurada
    if (webhookSecret && signature) {
      const hmac = crypto.createHmac('sha256', webhookSecret)
      const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8')
      const signatureBuffer = Buffer.from(signature, 'utf8')

      if (signatureBuffer.length !== digest.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
        console.error('[Lemon Squeezy Webhook] Assinatura inválida.')
        return NextResponse.json({ error: 'Assinatura inválida.' }, { status: 401 })
      }
    }

    const payload = JSON.parse(rawBody)
    const eventName = payload.meta?.event_name

    console.log(`[Lemon Squeezy Webhook] Evento recebido: ${eventName}`)

    // 2. Processar apenas criação de pedidos
    if (eventName === 'order_created') {
      const attributes = payload.data?.attributes
      const email = attributes?.user_email
      
      if (!email) {
        console.error('[Lemon Squeezy Webhook] Email não encontrado no payload.')
        return NextResponse.json({ error: 'Email não informado.' }, { status: 400 })
      }

      console.log(`[Lemon Squeezy Webhook] Processando pagamento aprovado para o email: ${email}`)

      // 3. Atualizar o plano do usuário para VIP (is_premium = true)
      const supabase = createAdminClient()
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ is_premium: true })
        .eq('email', email)
        .select()

      if (error) {
        console.error('[Lemon Squeezy Webhook] Erro ao atualizar perfil no Supabase:', error)
        return NextResponse.json({ error: 'Erro ao atualizar banco de dados.' }, { status: 500 })
      }

      console.log(`[Lemon Squeezy Webhook] Sucesso! Perfil atualizado para VIP:`, data)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[Lemon Squeezy Webhook] Erro crítico no processamento:', error)
    return NextResponse.json({ error: error.message || 'Erro interno.' }, { status: 500 })
  }
}
