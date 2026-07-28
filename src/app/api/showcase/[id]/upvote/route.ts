import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// POST — Toggle upvote
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    // Verifica se já votou
    const { data: existing } = await supabase
      .from('showcase_upvotes')
      .select('id')
      .eq('project_id', id)
      .eq('user_id', userId)
      .single()

    if (existing) {
      // Remove voto
      await supabase.from('showcase_upvotes').delete().eq('id', existing.id)
      await supabase.rpc('decrement_showcase_upvote', { project_id: id })
      return NextResponse.json({ voted: false })
    } else {
      // Adiciona voto
      await supabase.from('showcase_upvotes').insert([{ project_id: id, user_id: userId }])
      await supabase.rpc('increment_showcase_upvote', { project_id: id })
      return NextResponse.json({ voted: true })
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
