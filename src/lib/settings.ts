import { createAdminClient } from '@/utils/supabase/admin';

// Cache simples em memória para não sobrecarregar a base de dados
let settingsCache: Record<string, { value: string; expires: number }> = {};
const CACHE_TTL_MS = 1000 * 60 * 5; // 5 minutos

/**
 * Busca uma chave da base de dados. Se não existir, recorre ao process.env.
 * Utiliza cache de 5 minutos para performance.
 */
export async function getSetting(keyName: string): Promise<string> {
  const now = Date.now();
  
  // 1. Verifica a cache primeiro
  if (settingsCache[keyName] && settingsCache[keyName].expires > now) {
    return settingsCache[keyName].value;
  }

  // 2. Busca na base de dados usando privilégios de Admin
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('app_settings')
      .select('key_value')
      .eq('key_name', keyName)
      .maybeSingle();

    if (!error && data && data.key_value) {
      // Guarda na cache
      settingsCache[keyName] = { value: data.key_value, expires: now + CACHE_TTL_MS };
      return data.key_value;
    }
  } catch (err) {
    console.warn(`[Settings] Erro ao buscar ${keyName} da base de dados:`, err);
  }

  // 3. Fallback para as variáveis de ambiente do Vercel/local
  const envValue = process.env[keyName] || '';
  return envValue;
}

/**
 * Atualiza ou insere uma chave na base de dados e limpa a cache.
 */
export async function setSetting(keyName: string, keyValue: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('app_settings')
      .upsert({ 
        key_name: keyName, 
        key_value: keyValue,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key_name' });

    if (error) {
      console.error(`[Settings] Erro ao salvar ${keyName}:`, error);
      return false;
    }

    // Atualiza a cache imediatamente
    settingsCache[keyName] = { value: keyValue, expires: Date.now() + CACHE_TTL_MS };
    return true;
  } catch (err) {
    console.error(`[Settings] Erro crítico ao salvar ${keyName}:`, err);
    return false;
  }
}

/**
 * Limpa uma chave da base de dados e da cache.
 */
export async function deleteSetting(keyName: string): Promise<boolean> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('app_settings')
      .delete()
      .eq('key_name', keyName);

    if (error) {
      console.error(`[Settings] Erro ao apagar ${keyName}:`, error);
      return false;
    }

    delete settingsCache[keyName];
    return true;
  } catch (err) {
    console.error(`[Settings] Erro crítico ao apagar ${keyName}:`, err);
    return false;
  }
}
