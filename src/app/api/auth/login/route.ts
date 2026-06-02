import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = String(formData.get('email'))
  const password = String(formData.get('password'))
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return NextResponse.redirect(new URL(`/login?message=E-mail ou senha incorretos`, request.url), {
      status: 301,
    })
  }

  return NextResponse.redirect(new URL('/dashboard', request.url), {
    status: 301,
  })
}
