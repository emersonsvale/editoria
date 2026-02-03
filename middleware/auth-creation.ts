/**
 * Middleware: redireciona usuário não logado que acessa rotas de criação.
 * No server não temos sessão Supabase; no client verificamos e redirecionamos.
 */
import { CREATION_PATHS } from '~/composables/useRequireAuth'

export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return

  const isCreationPath = CREATION_PATHS.some(
    (p) => to.path === p || to.path.startsWith(p + '/')
  )
  if (!isCreationPath) return

  let auth: ReturnType<typeof useSupabaseAuth> | null = null
  try {
    auth = useSupabaseAuth()
  } catch {
    return navigateTo({ path: '/', query: { openAuth: '1' } })
  }

  if (!auth.loading.value && !auth.isAuthenticated.value) {
    return navigateTo({ path: '/', query: { openAuth: '1' } })
  }
})
