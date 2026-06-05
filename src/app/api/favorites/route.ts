import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { opportunityId } = await request.json()
    const supabase = await createClient()

    // Verifica se o usuário está logado
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Insere na tabela criada pelo script SQL
    const { error } = await supabase
      .from('user_favorites')
      .insert([
        { user_id: session.user.id, opportunity_id: opportunityId }
      ])

    if (error) {
      // Se der erro de duplicate (já favoritou), retorna OK silenciosamente ou erro tratado
      if (error.code === '23505') {
        return NextResponse.json({ message: 'Já estava nos favoritos' })
      }
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { opportunityId } = await request.json()
    const supabase = await createClient()

    // Verifica se o usuário está logado
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('opportunity_id', opportunityId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
