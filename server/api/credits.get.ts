/**
 * API Endpoint: GET /api/credits
 * Retorna os créditos do usuário autenticado (Supabase)
 * Cliente deve enviar Authorization: Bearer <access_token>
 */
import { getUserIdFromToken, getSupabaseAdmin } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromToken(event)
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado. Faça login.'
    })
  }

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('user_credits')
    .select('credits, used, total')
    .eq('user_id', userId)
    .single()

  if (error || !data) {
    return {
      credits: 0,
      used: 0,
      total: 0
    }
  }

  return {
    credits: data.credits,
    used: data.used,
    total: data.total
  }
})
