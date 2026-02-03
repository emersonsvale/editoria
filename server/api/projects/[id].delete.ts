/**
 * DELETE /api/projects/[id]
 * Exclui o projeto, todas as mensagens e todas as imagens do Storage do projeto.
 * Requer autenticação; só o dono do projeto pode excluir.
 */
import { getSupabaseAdmin, getUserIdFromToken } from '~/server/utils/supabase'

const BUCKET = 'generated-images'
const REMOVE_BATCH_SIZE = 1000

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromToken(event)
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado. Faça login para excluir projetos.'
    })
  }

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do projeto é obrigatório'
    })
  }

  const admin = getSupabaseAdmin()

  // 1) Verificar se o projeto existe e pertence ao usuário
  const { data: project, error: projectError } = await admin
    .from('projects')
    .select('id, user_id')
    .eq('id', id)
    .single()

  if (projectError || !project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Projeto não encontrado'
    })
  }

  if (project.user_id !== userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Você não pode excluir este projeto'
    })
  }

  // 2) Coletar e remover todos os arquivos do Storage do projeto (prefixo userId/projectId)
  const prefix = `${userId}/${id}`
  const pathsToRemove = await listAllStoragePaths(admin, BUCKET, prefix)
  if (pathsToRemove.length > 0) {
    for (let i = 0; i < pathsToRemove.length; i += REMOVE_BATCH_SIZE) {
      const batch = pathsToRemove.slice(i, i + REMOVE_BATCH_SIZE)
      await admin.storage.from(BUCKET).remove(batch)
    }
  }

  // 3) Excluir mensagens do projeto (cascade pode não existir)
  await admin.from('messages').delete().eq('project_id', id)

  // 4) Excluir o projeto
  const { error: deleteError } = await admin.from('projects').delete().eq('id', id)

  if (deleteError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao excluir projeto'
    })
  }

  return { success: true }
})

/**
 * Lista recursivamente todos os caminhos (arquivos) no Storage sob um prefixo.
 */
async function listAllStoragePaths(
  admin: ReturnType<typeof getSupabaseAdmin>,
  bucket: string,
  prefix: string
): Promise<string[]> {
  const paths: string[] = []
  const stack = [prefix]

  while (stack.length > 0) {
    const current = stack.pop()!
    const { data: items, error } = await admin.storage.from(bucket).list(current, { limit: 1000 })

    if (error) continue

    for (const item of items ?? []) {
      const fullPath = current ? `${current}/${item.name}` : item.name
      // Supabase retorna pastas sem .id; arquivos têm .id
      if (item.id != null) {
        paths.push(fullPath)
      } else {
        stack.push(fullPath)
      }
    }
  }

  return paths
}
