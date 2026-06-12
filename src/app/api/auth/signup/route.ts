import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return NextResponse.redirect(new URL(`/login?message=${error.message}`, request.url), {
      status: 302,
    })
  }

  return NextResponse.redirect(new URL('/login?message=Verifique seu e-mail para confirmar o cadastro.', request.url), {
    status: 302,
  })
}
