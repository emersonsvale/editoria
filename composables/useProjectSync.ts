/**
 * Sincronização de projetos e mensagens com o Supabase.
 * Usado quando o usuário está logado: criar projeto no DB e salvar mensagens (com upload de imagens).
 */

import type { Project } from '~/stores/chat'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isSupabaseProjectId(projectId: string): boolean {
  return UUID_REGEX.test(projectId)
}

interface ProjectFromApi {
  id: string
  title: string
  thumbnail_url: string | null
  created_at: string
  updated_at: string
}

function authHeaders(): Record<string, string> {
  let auth: ReturnType<typeof useSupabaseAuth> | null = null
  try {
    auth = useSupabaseAuth()
  } catch {
    return {}
  }
  const token = auth.accessToken?.value ?? null
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/**
 * Cria um projeto no Supabase e retorna no formato do store (para setProjectFromSupabase).
 */
export async function createProjectInSupabase(title?: string): Promise<Project> {
  const res = await $fetch<ProjectFromApi>('/api/projects', {
    method: 'POST',
    headers: authHeaders(),
    body: { title: title || 'Novo projeto' }
  })
  return {
    id: res.id,
    title: res.title ?? 'Novo projeto',
    thumbnail: res.thumbnail_url ?? undefined,
    messages: [],
    createdAt: new Date(res.created_at),
    updatedAt: new Date(res.updated_at)
  }
}

/** Limite do título do projeto na listagem (exibição e sync com Supabase). */
const PROJECT_TITLE_MAX_LENGTH = 50

/**
 * Atualiza o título do projeto no Supabase (ex.: após o primeiro prompt = nome do projeto).
 * Envia no máximo 50 caracteres, alinhado à exibição na listagem.
 */
export async function updateProjectTitleInSupabase(projectId: string, title: string): Promise<void> {
  if (!isSupabaseProjectId(projectId) || !title?.trim()) return
  const shortTitle = title.trim().slice(0, PROJECT_TITLE_MAX_LENGTH)
  await $fetch(`/api/projects/${projectId}`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: { title: shortTitle }
  })
}

interface MessagePayload {
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: Array<{
    id: string
    url: string
    prompt?: string
    createdAt?: Date | string
    size?: string
    isVariation?: boolean
    parentImageId?: string
  }>
}

/**
 * Salva uma mensagem no Supabase (faz upload de imagens em data URL para o Storage).
 */
export async function syncMessageToSupabase(projectId: string, message: MessagePayload): Promise<void> {
  if (!isSupabaseProjectId(projectId)) return
  const images = message.images?.map((img) => ({
    id: img.id,
    url: img.url,
    prompt: img.prompt ?? '',
    createdAt: img.createdAt instanceof Date ? img.createdAt.toISOString() : img.createdAt,
    size: img.size ?? '1:1',
    isVariation: img.isVariation,
    parentImageId: img.parentImageId
  }))
  await $fetch(`/api/projects/${projectId}/messages`, {
    method: 'POST',
    headers: authHeaders(),
    body: {
      role: message.role,
      content: message.content,
      images: images?.length ? images : undefined
    }
  })
}
