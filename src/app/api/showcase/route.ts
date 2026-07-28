import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

// GET — Lista projetos aprovados com filtros
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') || 'all'
    const sort = searchParams.get('sort') || 'top'
    const limit = parseInt(searchParams.get('limit') || '24')

    const supabase = await createClient()

    let query = supabase
      .from('showcase_projects')
      .select(`
        id, title, tagline, description, url, screenshot_url,
        category, tags, upvotes_count, created_at, user_id,
        opportunity_id
      `)
      .eq('status', 'approved')
      .limit(limit)

    if (category !== 'all') {
      query = query.eq('category', category)
    }

    if (sort === 'top') {
      query = query.order('upvotes_count', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // Buscar emails dos autores
    const userIds = [...new Set((data || []).map((p: any) => p.user_id))]
    let authorMap: Record<string, string> = {}
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, email')
        .in('id', userIds)
      if (profiles) {
        profiles.forEach((p: any) => { authorMap[p.id] = p.email })
      }
    }

    // Se o utilizador estiver autenticado, busca os votos dele
    const { data: { session } } = await supabase.auth.getSession()
    let votedIds: string[] = []
    if (session) {
      const projectIds = (data || []).map((p: any) => p.id)
      if (projectIds.length > 0) {
        const { data: upvotes } = await supabase
          .from('showcase_upvotes')
          .select('project_id')
          .eq('user_id', session.user.id)
          .in('project_id', projectIds)
        votedIds = (upvotes || []).map((u: any) => u.project_id)
      }
    }

    const enriched = (data || []).map((p: any) => ({
      ...p,
      author_email: authorMap[p.user_id] || 'Anônimo',
      has_voted: votedIds.includes(p.id),
    }))

    return NextResponse.json({ projects: enriched })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST — Cria um novo projeto
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, tagline, description, url, screenshot_url, category, tags, opportunity_id } = body

    if (!title || !tagline || !url || !category) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta: title, tagline, url, category' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('showcase_projects')
      .insert([{
        user_id: session.user.id,
        title: title.trim(),
        tagline: tagline.trim(),
        description: description?.trim() || null,
        url: url.trim(),
        screenshot_url: screenshot_url?.trim() || null,
        category,
        tags: tags || [],
        opportunity_id: opportunity_id || null,
        status: 'approved',
      }])
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ project: data }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
