import { defineStore } from 'pinia'
import type { ImageSize } from '~/composables/useNanobanana'

export interface GeneratedImage {
  id: string
  url: string
  prompt: string
  createdAt: Date
  size: ImageSize
  isVariation?: boolean
  parentImageId?: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  images?: GeneratedImage[]
  attachedImages?: string[] // Imagens anexadas pelo usuário (Data URLs)
  createdAt: Date
  isLoading?: boolean
  error?: string
}

export interface Project {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  thumbnail?: string // Primeira imagem gerada no projeto
}

export interface UserCredits {
  credits: number
  used: number
  total: number
}

interface ChatState {
  projects: Project[]
  currentProjectId: string | null
  credits: UserCredits
  settings: {
    defaultImageSize: ImageSize
    autoSave: boolean
  }
}

export const useChatStore = defineStore('chat', {
  state: (): ChatState => ({
    projects: [],
    currentProjectId: null,
    credits: {
      credits: 0,
      used: 0,
      total: 0
    },
    settings: {
      defaultImageSize: '1:1',
      autoSave: true
    }
  }),

  getters: {
    /**
     * Retorna o projeto atual
     */
    currentProject: (state): Project | null => {
      if (!state.currentProjectId) return null
      return state.projects.find(p => p.id === state.currentProjectId) || null
    },

    /**
     * Retorna as mensagens do projeto atual
     */
    currentMessages(): ChatMessage[] {
      return this.currentProject?.messages || []
    },

    /**
     * Retorna todas as imagens geradas no projeto atual
     */
    currentImages(): GeneratedImage[] {
      const messages = this.currentMessages
      return messages.flatMap(m => m.images || [])
    },

    /**
     * Retorna os projetos ordenados por data de atualização
     */
    sortedProjects: (state): Project[] => {
      return [...state.projects].sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    },

    /**
     * Verifica se o usuário tem créditos
     */
    hasCredits: (state): boolean => {
      return state.credits.credits > 0
    }
  },

  actions: {
    /**
     * Atualiza os créditos do usuário
     */
    setCredits(credits: UserCredits) {
      this.credits = credits
    },

    /**
     * Deduz créditos após geração
     */
    deductCredits(amount: number = 1) {
      this.credits.credits = Math.max(0, this.credits.credits - amount)
      this.credits.used += amount
    },

    /**
     * Cria um novo projeto
     */
    createProject(title?: string): Project {
      const now = new Date()
      const project: Project = {
        id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title || `Novo projeto`,
        messages: [],
        createdAt: now,
        updatedAt: now
      }

      this.projects.unshift(project)
      this.currentProjectId = project.id
      this.saveToLocalStorage()

      return project
    },

    /**
     * Seleciona um projeto existente
     */
    selectProject(projectId: string) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        this.currentProjectId = projectId
      }
    },

    /**
     * Deleta um projeto
     */
    deleteProject(projectId: string) {
      const index = this.projects.findIndex(p => p.id === projectId)
      if (index !== -1) {
        this.projects.splice(index, 1)
        
        // Se o projeto deletado era o atual, seleciona outro ou cria um novo
        if (this.currentProjectId === projectId) {
          this.currentProjectId = this.projects[0]?.id || null
          if (!this.currentProjectId) {
            this.createProject()
          }
        }
        
        this.saveToLocalStorage()
      }
    },

    /**
     * Renomeia um projeto
     */
    renameProject(projectId: string, newTitle: string) {
      const project = this.projects.find(p => p.id === projectId)
      if (project) {
        project.title = newTitle
        project.updatedAt = new Date()
        this.saveToLocalStorage()
      }
    },

    /**
     * Define a thumbnail do projeto (primeira imagem gerada)
     */
    setProjectThumbnail(projectId: string, thumbnailUrl: string) {
      const project = this.projects.find(p => p.id === projectId)
      if (project && !project.thumbnail) {
        project.thumbnail = thumbnailUrl
        this.saveToLocalStorage()
      }
    },

    /**
     * Adiciona uma mensagem do usuário
     */
    addUserMessage(content: string, attachedImages?: string[]): ChatMessage {
      if (!this.currentProjectId) {
        this.createProject()
      }

      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'user',
        content,
        attachedImages: attachedImages && attachedImages.length > 0 ? attachedImages : undefined,
        createdAt: new Date()
      }

      const project = this.projects.find(p => p.id === this.currentProjectId)
      if (project) {
        project.messages.push(message)
        project.updatedAt = new Date()
        
        // Atualiza o título se for a primeira mensagem
        if (project.messages.length === 1) {
          project.title = content.substring(0, 50) + (content.length > 50 ? '...' : '')
        }
        
        this.saveToLocalStorage()
      }

      return message
    },

    /**
     * Adiciona uma mensagem do assistente (com imagens)
     */
    addAssistantMessage(content: string, images?: GeneratedImage[], isLoading = false): ChatMessage {
      if (!this.currentProjectId) {
        this.createProject()
      }

      const message: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'assistant',
        content,
        images,
        createdAt: new Date(),
        isLoading
      }

      const project = this.projects.find(p => p.id === this.currentProjectId)
      if (project) {
        project.messages.push(message)
        project.updatedAt = new Date()
        this.saveToLocalStorage()
      }

      return message
    },

    /**
     * Atualiza uma mensagem existente
     */
    updateMessage(messageId: string, updates: Partial<ChatMessage>) {
      const project = this.projects.find(p => p.id === this.currentProjectId)
      if (project) {
        const message = project.messages.find(m => m.id === messageId)
        if (message) {
          Object.assign(message, updates)
          project.updatedAt = new Date()
          
          // Se a atualização inclui imagens e é a primeira imagem do projeto, define como thumbnail
          if (updates.images && updates.images.length > 0 && !project.thumbnail) {
            project.thumbnail = updates.images[0].url
          }
          
          this.saveToLocalStorage()
        }
      }
    },

    /**
     * Adiciona imagens a uma mensagem existente
     */
    addImagesToMessage(messageId: string, images: GeneratedImage[]) {
      const project = this.projects.find(p => p.id === this.currentProjectId)
      if (project) {
        const message = project.messages.find(m => m.id === messageId)
        if (message) {
          message.images = [...(message.images || []), ...images]
          message.isLoading = false
          project.updatedAt = new Date()
          
          // Define thumbnail se ainda não existir
          if (!project.thumbnail && images.length > 0) {
            project.thumbnail = images[0].url
          }
          
          this.saveToLocalStorage()
        }
      }
    },

    /**
     * Define erro em uma mensagem
     */
    setMessageError(messageId: string, error: string) {
      this.updateMessage(messageId, { error, isLoading: false })
    },

    /**
     * Atualiza as configurações
     */
    updateSettings(settings: Partial<ChatState['settings']>) {
      this.settings = { ...this.settings, ...settings }
      this.saveToLocalStorage()
    },

    /**
     * Salva o estado no localStorage
     * Remove dados de imagem para evitar exceder a cota
     */
    saveToLocalStorage() {
      if (typeof window !== 'undefined' && this.settings.autoSave) {
        try {
          // Cria uma cópia dos projetos sem os dados pesados de imagem
          const projectsToSave = this.projects.map(project => ({
            ...project,
            // Limita o thumbnail a URLs externas ou remove se for base64 muito grande
            thumbnail: project.thumbnail && project.thumbnail.length < 500 ? project.thumbnail : undefined,
            messages: project.messages.map(msg => ({
              ...msg,
              // Remove imagens anexadas (base64) para economizar espaço
              attachedImages: undefined,
              // Mantém apenas metadados das imagens geradas, não os dados
              images: msg.images?.map(img => ({
                ...img,
                // Mantém URL apenas se não for base64 muito grande
                url: img.url && img.url.length < 500 ? img.url : ''
              }))
            }))
          }))

          const dataToSave = {
            projects: projectsToSave,
            currentProjectId: this.currentProjectId,
            settings: this.settings
          }
          
          const dataString = JSON.stringify(dataToSave)
          
          // Verifica se os dados não são muito grandes (limite de ~4MB para segurança)
          if (dataString.length > 4 * 1024 * 1024) {
            console.warn('Dados muito grandes para localStorage, removendo projetos antigos...')
            // Remove projetos mais antigos até caber
            while (projectsToSave.length > 5 && JSON.stringify({ projects: projectsToSave, currentProjectId: this.currentProjectId, settings: this.settings }).length > 4 * 1024 * 1024) {
              projectsToSave.pop()
            }
          }
          
          localStorage.setItem('editoria_projects_data', JSON.stringify({
            projects: projectsToSave,
            currentProjectId: this.currentProjectId,
            settings: this.settings
          }))
        } catch (error) {
          if (error instanceof DOMException && error.name === 'QuotaExceededError') {
            console.warn('localStorage cheio, limpando dados antigos...')
            this.cleanupOldData()
          } else {
            console.error('Erro ao salvar no localStorage:', error)
          }
        }
      }
    },

    /**
     * Limpa dados antigos do localStorage quando a cota é excedida
     */
    cleanupOldData() {
      if (typeof window !== 'undefined') {
        try {
          // Remove o item atual
          localStorage.removeItem('editoria_projects_data')
          
          // Mantém apenas os 5 projetos mais recentes sem dados de imagem
          const recentProjects = this.projects.slice(0, 5).map(project => ({
            id: project.id,
            title: project.title,
            createdAt: project.createdAt,
            updatedAt: project.updatedAt,
            thumbnail: undefined,
            messages: project.messages.map(msg => ({
              id: msg.id,
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt,
              isLoading: msg.isLoading,
              error: msg.error,
              images: msg.images?.map(img => ({
                id: img.id,
                prompt: img.prompt,
                createdAt: img.createdAt,
                size: img.size,
                url: '', // Remove URL base64
                isVariation: img.isVariation,
                parentImageId: img.parentImageId
              })),
              attachedImages: undefined
            }))
          }))

          localStorage.setItem('editoria_projects_data', JSON.stringify({
            projects: recentProjects,
            currentProjectId: this.currentProjectId,
            settings: this.settings
          }))
          
          console.log('Dados antigos limpos com sucesso')
        } catch (e) {
          console.error('Erro ao limpar dados antigos:', e)
          // Última tentativa: limpa tudo
          localStorage.removeItem('editoria_projects_data')
        }
      }
    },

    /**
     * Carrega o estado do localStorage
     */
    loadFromLocalStorage() {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('editoria_projects_data')
        if (saved) {
          try {
            const data = JSON.parse(saved)
            this.projects = data.projects || []
            this.currentProjectId = data.currentProjectId
            this.settings = { ...this.settings, ...data.settings }
            
            // Converte strings de data para objetos Date
            this.projects.forEach(proj => {
              proj.createdAt = new Date(proj.createdAt)
              proj.updatedAt = new Date(proj.updatedAt)
              proj.messages.forEach(msg => {
                msg.createdAt = new Date(msg.createdAt)
                if (msg.images) {
                  msg.images.forEach(img => {
                    img.createdAt = new Date(img.createdAt)
                  })
                }
              })
            })
          } catch (e) {
            console.error('Erro ao carregar projetos:', e)
          }
        }

        // Se não há projeto, cria um novo
        if (this.projects.length === 0) {
          this.createProject()
        } else if (!this.currentProjectId) {
          this.currentProjectId = this.projects[0]?.id || null
        }
      }
    },

    /**
     * Limpa todos os dados
     */
    clearAllData() {
      this.projects = []
      this.currentProjectId = null
      this.createProject()
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('editoria_projects_data')
      }
    }
  }
})
