/**
 * Rotas que exigem login (páginas de criação)
 */
export const CREATION_PATHS = [
  '/editor',
  '/carousel',
  '/batch-export',
  '/media-manager',
  '/brand-kit'
] as const

export type CreationPath = (typeof CREATION_PATHS)[number]

export function isCreationPath(path: string): boolean {
  return CREATION_PATHS.some((p) => path === p || path.startsWith(p + '/'))
}

/**
 * Composable: navegar para uma rota só se logado; senão abrir modal ou redirecionar para home com openAuth=1
 * @param openModal - callback para abrir o modal de login (usado quando já está na home)
 */
export function useRequireAuth(openModal?: () => void) {
  const route = useRoute()
  let auth: ReturnType<typeof useSupabaseAuth> | null = null
  try {
    auth = useSupabaseAuth()
  } catch {
    auth = null
  }

  const isAuthenticated = computed(() => auth?.isAuthenticated.value ?? false)
  const isOnHome = computed(() => route.path === '/')

  function goTo(path: string) {
    const targetPath = path.startsWith('/') ? path : `/${path}`
    if (!isCreationPath(targetPath)) {
      return navigateTo(targetPath)
    }
    if (isAuthenticated.value) {
      return navigateTo(targetPath)
    }
    if (isOnHome.value && openModal) {
      openModal()
      return
    }
    return navigateTo({ path: '/', query: { openAuth: '1' } })
  }

  function shouldInterceptLink(to: string): boolean {
    return !isAuthenticated.value && isCreationPath(to)
  }

  return {
    isAuthenticated,
    isCreationPath,
    goTo,
    shouldInterceptLink
  }
}
