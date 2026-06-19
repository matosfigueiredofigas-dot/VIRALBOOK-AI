import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'
  
  if (code) {
    const supabase = await createClient()
    const { data: authData } = await supabase.auth.exchangeCodeForSession(code)

    if (authData?.user) {
      try {
        const adminSupabase = createAdminClient()
        // Verificar se o perfil já existe
        const { data: profile } = await adminSupabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .single()
          
        // Se não existir, criar automaticamente
        if (!profile) {
          await adminSupabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: authData.user.email,
              role: 'user',
              is_premium: false
            })
        }
      } catch (e) {
        console.error('Erro ao sincronizar perfil do usuário no callback:', e)
      }
    }
  }

  return NextResponse.redirect(`${origin}${next}`)
}
