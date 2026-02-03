/**
 * PATCH /api/projects/[id]
 * Atualiza o projeto (ex.: título). Requer autenticação; só o dono pode atualizar.
 */
import { getSupabaseAdmin, getUserIdFromToken } from '~/server/utils/supabase'

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromToken(event)
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado. Faça login para editar projetos.'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do projeto é obrigatório'
    })
  }

  const body = await readBody(event).catch(() => ({}))
  const title = typeof body?.title === 'string' ? body.title.trim() : undefined
  if (title === undefined || title === '') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Título é obrigatório'
    })
  }

  const admin = getSupabaseAdmin()
  const { data: project, error: fetchError } = await admin
    .from('projects')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (fetchError || !project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Projeto não encontrado'
    })
  }

  if (project.user_id !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Você não pode editar este projeto'
    })
  }

  // Título limitado a 50 caracteres (alinhado à exibição na listagem)
  const shortTitle = title.slice(0, 50)

  const { data: updated, error: updateError } = await admin
    .from('projects')
    .update({
      title: shortTitle,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select('id, title, updated_at')
    .single()

  if (updateError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao atualizar projeto'
    })
  }

  return {
    id: updated.id,
    title: updated.title ?? title,
    updated_at: updated.updated_at
  }
})
