/**
 * Auth com Supabase: login, cadastro, recuperação de senha e estado da sessão
 * Estado compartilhado via useState para plugin e componentes verem a mesma sessão
 */
import type { User, Session, AuthError } from '@supabase/supabase-js'

export function useSupabaseAuth() {
  const supabase = useSupabase()
  const user = useState<User | null>('supabase-user', () => null)
  const session = useState<Session | null>('supabase-session', () => null)
  const loading = useState('supabase-auth-loading', () => true)

  async function init() {
    const { data: { session: s } } = await supabase.auth.getSession()
    session.value = s
    user.value = s?.user ?? null
    loading.value = false

    supabase.auth.onAuthStateChange((_event, s) => {
      session.value = s
      user.value = s?.user ?? null
    })
  }

  async function signIn(email: string, password: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signUp(
    email: string,
    password: string,
    options?: { displayName?: string }
  ): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: options?.displayName ? { display_name: options.displayName } : undefined
      }
    })
    return { error }
  }

  async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=reset`
    })
    return { error }
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut()
    user.value = null
    session.value = null
  }

  const isAuthenticated = computed(() => !!user.value)
  const accessToken = computed(() => session.value?.access_token ?? null)

  return {
    supabase,
    user,
    session,
    loading,
    isAuthenticated,
    accessToken,
    init,
    signIn,
    signUp,
    resetPassword,
    signOut
  }
}
