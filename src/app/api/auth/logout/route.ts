import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  // Destrói a sessão do usuário ativo
  await supabase.auth.signOut()

  // Redireciona para a página de login
  return NextResponse.redirect(new URL('/login', request.url), {
    status: 302,
  })
}
