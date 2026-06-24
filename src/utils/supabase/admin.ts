import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  })
}

export async function checkAdmin(supabase: any, userObj?: any) {
  try {
    const user = userObj || (await supabase.auth.getUser()).data.user;
    if (!user) return false;

    // Proteção dupla: pelo e-mail do dono ou checando o role na tabela profiles
    if (['moisesdematos@gmail.com', 'edsonquicuca92@gmail.com'].includes(user.email)) return true;

    // Usamos o admin client para evitar recursão de RLS na tabela profiles
    const adminSupabase = createAdminClient();
    const { data: profile, error } = await adminSupabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('[checkAdmin] Erro ao buscar profile:', error);
      return false;
    }

    return profile?.role === 'admin';
  } catch (err) {
    console.error('[checkAdmin] Erro crítico:', err);
    return false;
  }
}
