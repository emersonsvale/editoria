/**
 * Plugin client: inicializa a sessão Supabase Auth ao carregar a app
 * Se Supabase não estiver configurado (.env), não quebra a app
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public
  if (!config.supabaseUrl || !config.supabaseAnonKey) return
  try {
    const auth = useSupabaseAuth()
    auth.init()
  } catch {
    // Supabase não configurado ou erro ao iniciar
  }
})
