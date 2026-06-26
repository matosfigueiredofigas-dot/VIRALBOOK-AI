import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/utils/supabase/admin'

export async function GET(request: Request) {
  console.log('[Auth Callback] Handler started. URL:', request.url)
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/dashboard'
  
  console.log('[Auth Callback] Params parsed. code:', code ? 'exists' : 'missing', 'next:', next, 'origin:', origin)

  if (code) {
    try {
      const supabase = await createClient()
      console.log('[Auth Callback] Supabase client created.')
      const { data: authData, error: authError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (authError) {
        console.error('[Auth Callback] exchangeCodeForSession error:', authError)
      } else {
        console.log('[Auth Callback] exchangeCodeForSession success. User ID:', authData?.user?.id)
      }

      if (authData?.user) {
        try {
          const adminSupabase = createAdminClient()
          // Verificar se o perfil já existe
          const { data: profile, error: profileError } = await adminSupabase
            .from('profiles')
            .select('id')
            .eq('id', authData.user.id)
            .single()
            
          if (profileError) {
            console.log('[Auth Callback] Profile query returned error (might not exist):', profileError.message)
          } else {
            console.log('[Auth Callback] Profile exists. ID:', profile?.id)
          }

          // Se não existir, criar automaticamente
          if (!profile) {
            console.log('[Auth Callback] Profile not found. Creating one...')
            const { error: insertError } = await adminSupabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                email: authData.user.email,
                role: 'user',
                is_premium: false
              })
            if (insertError) {
              console.error('[Auth Callback] Error creating profile:', insertError)
            } else {
              console.log('[Auth Callback] Profile created successfully.')
            }
          }
        } catch (e) {
          console.error('Erro ao sincronizar perfil do usuário no callback:', e)
        }
      }
    } catch (err) {
      console.error('[Auth Callback] Outer try-catch error:', err)
    }
  }

  const redirectUrl = `${origin}${next}`
  console.log('[Auth Callback] Redirecting to:', redirectUrl)
  return NextResponse.redirect(redirectUrl)
}
