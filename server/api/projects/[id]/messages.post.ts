/**
 * POST /api/projects/[id]/messages
 * Salva uma mensagem no Supabase. Se images contiver data URLs, faz upload para o Storage e salva as URLs.
 */
import { getSupabaseAdmin, getUserIdFromToken } from '~/server/utils/supabase'

const BUCKET = 'generated-images'

interface ImageInput {
  id: string
  url: string
  prompt?: string
  createdAt?: string
  size?: string
  isVariation?: boolean
  parentImageId?: string
}

function sanitizePathSegment(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64)
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; mime: string } {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) throw new Error('URL não é um data URL válido')
  const mime = match[1].trim()
  const base64 = match[2]
  return { buffer: Buffer.from(base64, 'base64'), mime }
}

export default defineEventHandler(async (event) => {
  const userId = await getUserIdFromToken(event)
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado. Faça login para salvar mensagens.'
    })
  }

  const projectId = getRouterParam(event, 'id')
  if (!projectId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID do projeto é obrigatório'
    })
  }

  const body = await readBody(event).catch(() => ({}))
  const { role, content, images: imagesInput } = body as {
    role: 'user' | 'assistant' | 'system'
    content: string
    images?: ImageInput[]
  }

  if (!role || !['user', 'assistant', 'system'].includes(role)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'role inválido (user, assistant ou system)'
    })
  }

  const admin = getSupabaseAdmin()
  const config = useRuntimeConfig()
  const baseUrl = (config.public.supabaseUrl as string)?.replace(/\/$/, '')

  // Verificar se o projeto existe e pertence ao usuário
  const { data: project, error: projectError } = await admin
    .from('projects')
    .select('id, thumbnail_url')
    .eq('id', projectId)
    .eq('user_id', userId)
    .single()

  if (projectError || !project) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Projeto não encontrado'
    })
  }

  // Processar imagens: upload data URLs para o Storage e obter URLs públicas
  let imagesJson: ImageInput[] = []
  if (imagesInput && Array.isArray(imagesInput) && imagesInput.length > 0) {
    const prefix = `${userId}/${projectId}`
    imagesJson = await Promise.all(
      imagesInput.map(async (img, index) => {
        let url = img.url ?? ''
        if (url.startsWith('data:')) {
          try {
            const { buffer, mime } = dataUrlToBuffer(url)
            const ext = mime.includes('jpeg') || mime.includes('jpg') ? 'jpg' : 'png'
            const safeId = sanitizePathSegment(img.id || `img-${index}`)
            const path = `${prefix}/${safeId}.${ext}`
            const { error } = await admin.storage.from(BUCKET).upload(path, buffer, {
              contentType: mime,
              upsert: true
            })
            if (error) {
              console.error('[messages] upload error:', error)
              return { ...img, url }
            }
            url = `${baseUrl}/storage/v1/object/public/${BUCKET}/${path}`
          } catch (e) {
            console.error('[messages] dataUrlToBuffer error:', e)
          }
        }
        return {
          id: img.id,
          url,
          prompt: img.prompt ?? '',
          createdAt: img.createdAt ?? new Date().toISOString(),
          size: img.size ?? '1:1',
          isVariation: img.isVariation,
          parentImageId: img.parentImageId
        }
      })
    )
  }

  const { data: message, error: insertError } = await admin
    .from('messages')
    .insert({
      project_id: projectId,
      role,
      content: content ?? '',
      images: imagesJson.length > 0 ? imagesJson : null
    })
    .select('id, project_id, role, content, images, created_at')
    .single()

  if (insertError) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Erro ao salvar mensagem'
    })
  }

  // Se for mensagem do assistente com imagens e o projeto ainda não tem thumbnail, atualizar
  if (
    role === 'assistant' &&
    imagesJson.length > 0 &&
    !project.thumbnail_url
  ) {
    await admin
      .from('projects')
      .update({
        thumbnail_url: imagesJson[0].url,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
  }

  // Atualizar updated_at do projeto
  await admin
    .from('projects')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', projectId)

  return message
})
