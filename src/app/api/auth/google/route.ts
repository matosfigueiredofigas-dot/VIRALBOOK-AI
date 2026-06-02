import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${new URL(request.url).origin}/api/auth/callback`,
    },
  })

  if (data.url) {
    return NextResponse.redirect(data.url, { status: 301 })
  }

  return NextResponse.redirect(new URL('/login?message=Erro ao conectar com Google', request.url), {
    status: 301,
  })
}
