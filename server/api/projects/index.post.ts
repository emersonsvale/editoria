/**
 * POST /api/projects
 * Cria um novo projeto no Supabase para o usuário autenticado.
 */
import { getSupabaseAdmin, getUserIdFromToken } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromToken(event)
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado. Faça login para criar projetos.'
    })
  }

  const body = await readBody(event).catch(() => ({}))
  const title = (body?.title as string)?.trim() || 'Novo projeto'

  const admin = getSupabaseAdmin()
  const { data, error } = await admin
    .from('projects')
    .insert({
      user_id: userId,
      title: title.slice(0, 255)
    })
    .select('id, title, thumbnail_url, created_at, updated_at')
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao criar projeto'
    })
  }

  return {
    id: data.id,
    title: data.title ?? title,
    thumbnail_url: data.thumbnail_url ?? null,
    created_at: data.created_at,
    updated_at: data.updated_at
  }
})
