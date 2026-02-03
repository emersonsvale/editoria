/**
 * Projetos do usuário logado no Supabase.
 * Busca lista na home e carrega projeto completo ao abrir no editor.
 */
import type { Project, ChatMessage, GeneratedImage } from '~/stores/chat'
import type { ImageSize } from '~/composables/useNanobanana'

export interface ProjectSummary {
  id: string
  title: string
  thumbnail?: string
  updatedAt: Date
  createdAt: Date
}

function mapSupabaseImages(images: unknown): GeneratedImage[] {
  if (!Array.isArray(images)) return []
  return images.map((img: any) => ({
    id: img.id ?? String(Math.random()),
    url: img.url ?? '',
    prompt: img.prompt ?? '',
    createdAt: img.createdAt ? new Date(img.createdAt) : new Date(),
    size: (img.size ?? '1:1') as ImageSize,
    isVariation: img.isVariation,
    parentImageId: img.parentImageId
  }))
}

function mapSupabaseMessage(row: {
  id: string
  role: string
  content: string
  images: unknown
  created_at: string
}): ChatMessage {
  return {
    id: row.id,
    role: row.role as 'user' | 'assistant' | 'system',
    content: row.content ?? '',
    images: mapSupabaseImages(row.images),
    createdAt: new Date(row.created_at)
  }
}

export function useUserProjects() {
  let auth: ReturnType<typeof useSupabaseAuth> | null = null
  try {
    auth = useSupabaseAuth()
  } catch {
    auth = null
  }

  const supabase = auth ? useSupabase() : null
  const userProjects = ref<ProjectSummary[]>([])
  const loading = ref(false)
  const loadingProject = ref(false)
  const deletingId = ref<string | null>(null)

  function authHeaders(): Record<string, string> {
    const token = auth?.accessToken?.value ?? null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  async function fetchUserProjects() {
    if (!auth?.isAuthenticated.value || !supabase) {
      userProjects.value = []
      return
    }
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('id, title, thumbnail_url, created_at, updated_at')
        .order('updated_at', { ascending: false })

      if (error) throw error
      userProjects.value = (data ?? []).map((row) => ({
        id: row.id,
        title: row.title ?? 'Novo projeto',
        thumbnail: row.thumbnail_url ?? undefined,
        updatedAt: new Date(row.updated_at),
        createdAt: new Date(row.created_at)
      }))
    } catch (e) {
      console.error('Erro ao buscar projetos:', e)
      userProjects.value = []
    } finally {
      loading.value = false
    }
  }

  async function loadProjectAndOpen(projectId: string) {
    if (!auth?.isAuthenticated.value || !supabase) return
    loadingProject.value = true
    try {
      const { data: projectRow, error: projectError } = await supabase
        .from('projects')
        .select('id, title, thumbnail_url, created_at, updated_at')
        .eq('id', projectId)
        .single()

      if (projectError || !projectRow) throw new Error('Projeto não encontrado')

      const { data: messagesRows, error: messagesError } = await supabase
        .from('messages')
        .select('id, role, content, images, created_at')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true })

      if (messagesError) throw messagesError

      const messages: ChatMessage[] = (messagesRows ?? []).map(mapSupabaseMessage)

      const project: Project = {
        id: projectRow.id,
        title: projectRow.title ?? 'Novo projeto',
        thumbnail: projectRow.thumbnail_url ?? undefined,
        messages,
        createdAt: new Date(projectRow.created_at),
        updatedAt: new Date(projectRow.updated_at)
      }

      const chatStore = useChatStore()
      chatStore.setProjectFromSupabase(project)
      await navigateTo('/editor')
    } catch (e) {
      console.error('Erro ao carregar projeto:', e)
    } finally {
      loadingProject.value = false
    }
  }

  /**
   * Exclui um projeto (Supabase: projeto, mensagens e imagens no Storage).
   * Só funciona para usuário logado; projetos locais são removidos do store.
   */
  async function deleteProject(projectId: string): Promise<void> {
    if (!auth?.isAuthenticated.value) return
    deletingId.value = projectId
    try {
      await $fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: authHeaders()
      })
      userProjects.value = userProjects.value.filter((p) => p.id !== projectId)
    } catch (e) {
      console.error('Erro ao excluir projeto:', e)
      throw e
    } finally {
      deletingId.value = null
    }
  }

  return {
    userProjects,
    loading,
    loadingProject,
    deletingId,
    fetchUserProjects,
    loadProjectAndOpen,
    deleteProject,
    isAuthenticated: computed(() => auth?.isAuthenticated.value ?? false)
  }
}
