/**
 * Utilitários servidor: Supabase com service role (para verificar JWT e atualizar créditos)
 */
import { createClient } from '@supabase/supabase-js'
import type { H3Event } from 'h3'
import type { Database } from '~/types/database'

export function getSupabaseAdmin() {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const serviceKey = config.supabaseServiceRoleKey
  if (!url || !serviceKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase não configurado no servidor'
    })
  }
  return createClient<Database>(url, serviceKey, { auth: { persistSession: false } })
}

/**
 * Obtém o token JWT do header Authorization (Bearer) ou do cookie
 */
export function getAuthToken(event: H3Event): string | null {
  const authHeader = getHeader(event, 'authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7)
  }
  const cookie = getCookie(event, 'sb-access-token')
  return cookie ?? null
}

/**
 * Obtém o user_id do JWT usando o Supabase Admin (getUser)
 */
export async function getUserIdFromToken(event: H3Event): Promise<string | null> {
  const token = getAuthToken(event)
  if (!token) return null
  const admin = getSupabaseAdmin()
  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user) return null
  return user.id
}

/**
 * Deduz 1 crédito do usuário (atômico via RPC). Retorna true se conseguiu deduzir, false se sem créditos.
 */
export async function deductUserCredit(userId: string): Promise<boolean> {
  const admin = getSupabaseAdmin()
  const { data, error } = await admin.rpc('deduct_credit', { p_user_id: userId })
  return data === true && !error
}
