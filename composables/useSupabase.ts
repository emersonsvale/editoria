/**
 * Cliente Supabase no browser
 * Usa as chaves públicas do runtimeConfig. Retorna null se não configurado.
 */
import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

let client: ReturnType<typeof createClient<Database>> | null = null

export function useSupabase() {
  const config = useRuntimeConfig().public
  const url = config.supabaseUrl
  const anonKey = config.supabaseAnonKey

  if (!url || !anonKey) {
    if (import.meta.dev) {
      console.warn('Supabase não configurado: defina NUXT_PUBLIC_SUPABASE_URL e NUXT_PUBLIC_SUPABASE_ANON_KEY no .env')
    }
    throw new Error('Supabase URL e Anon Key devem estar configurados (NUXT_PUBLIC_SUPABASE_URL e NUXT_PUBLIC_SUPABASE_ANON_KEY)')
  }

  if (!client) {
    client = createClient<Database>(url, anonKey)
  }
  return client
}
