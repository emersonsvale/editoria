<template>
  <div class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-200 min-h-screen">
    <LayoutHomeNav @open-auth="openAuthModal" />
    <AppSidebar @new-project="handleNewProject" @navigate="handleSidebarNavigate" />

    <!-- Modal flutuante: login, cadastro e recuperação de senha -->
    <AuthModal
      :is-open="showAuthModal"
      @close="showAuthModal = false"
    />

    <!-- Modal de confirmação de exclusão de projeto -->
    <UiConfirmModal
      :is-open="!!projectToDelete"
      title="Excluir projeto?"
      :message="deleteConfirmMessage"
      confirm-label="Excluir"
      cancel-label="Cancelar"
      variant="danger"
      :loading="deleteConfirmLoading"
      @confirm="confirmDeleteProject"
      @cancel="projectToDelete = null"
    />

    <main class="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <section class="text-center mb-16">
        <div class="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full border border-primary/30 mb-6 group cursor-pointer">
          <span class="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded">IA</span>
          <span class="text-xs font-medium text-primary">Geração de imagens com IA avançada!</span>
        </div>
        <h1 class="text-4xl md:text-5xl font-bold mb-4 tracking-tight flex items-center justify-center gap-3">
          Crie imagens incríveis com EditorIA
        </h1>
        <p class="text-slate-500 dark:text-slate-400 mb-10">Descreva sua ideia e a IA gera imagens impressionantes em segundos</p>
        <div class="max-w-2xl mx-auto relative group">
          <NuxtLink to="/editor" class="block" @click="handleCreationLink($event, '/editor')">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none hover:ring-2 ring-primary/20 transition-all cursor-pointer">
              <div class="flex items-center gap-3 text-slate-400 h-12">
                <Icon name="auto_awesome" :size="20" class="text-primary" />
                <span>Descreva a imagem que você quer criar...</span>
              </div>
              <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-400">Powered by EditorIA</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">Enter para criar</span>
                  <div class="bg-primary text-white p-2 rounded-xl flex items-center justify-center ml-2">
                    <Icon name="north" />
                  </div>
                </div>
              </div>
            </div>
          </NuxtLink>
          <div class="absolute -top-2 -right-2 w-5 h-5 bg-primary border-2 border-white rounded-full flex items-center justify-center">
            <Icon name="auto_awesome" :size="10" class="text-white" />
          </div>
        </div>
        <div class="flex flex-wrap justify-center gap-3 mt-8">
          <button 
            class="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-sm font-medium text-primary flex items-center gap-2 hover:bg-primary/20 transition-colors"
            @click="goTo('/editor')"
          >
            <Icon name="auto_awesome" :size="16" />
            Gerar imagem
          </button>
          <button 
            class="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-sm font-medium text-primary flex items-center gap-2 hover:bg-primary/20 transition-colors"
            @click="goTo('/carousel')"
          >
            <Icon name="view_carousel" :size="16" />
            Carrossel
          </button>
          <button 
            class="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2"
            @click="goToEditorWithSize('1:1')"
          >
            <Icon name="grid_view" :size="16" />
            Post 1:1
          </button>
          <button 
            class="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2"
            @click="goToEditorWithSize('9:16')"
          >
            <Icon name="crop_portrait" :size="16" />
            Story 9:16
          </button>
          <button 
            class="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2"
            @click="goToEditorWithSize('16:9')"
          >
            <Icon name="crop_landscape" :size="16" />
            Banner 16:9
          </button>
          <button 
            class="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2"
            @click="goToEditorWithSize('1:1')"
          >
            <Icon name="hexagon" :size="16" />
            Logo
          </button>
          <button 
            class="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors flex items-center gap-2"
            @click="goToEditorWithSize('1:1')"
          >
            <Icon name="brush" :size="16" />
            Arte
          </button>
        </div>
      </section>

      <!-- Meus Projetos (Supabase quando logado, localStorage quando não) -->
      <section v-if="displayProjects.length > 0 || userProjectsComposable.loading.value || userProjectsComposable.isAuthenticated.value" class="mb-16">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold">Meus Projetos</h2>
          <button 
            @click="handleNewProject"
            class="text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            <Icon name="add" :size="16" />
            Novo projeto
          </button>
        </div>
        <div v-if="userProjectsComposable.loading.value" class="cards-grid">
          <div v-for="i in 6" :key="i" class="aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
        </div>
        <div v-else class="cards-grid">
          <button
            type="button"
            class="card-item aspect-square group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
            @click="handleNewProject"
          >
            <div class="w-full h-full flex flex-col items-center justify-center bg-primary/10 dark:bg-primary/20 border-2 border-dashed border-primary/30 dark:border-primary/40 group-hover:scale-105 transition-transform duration-500">
              <Icon name="add" :size="40" class="text-primary mb-2" />
              <span class="text-xs text-slate-500 dark:text-slate-400">Novo projeto</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white rounded-2xl">
              <p class="text-sm font-bold">Novo projeto</p>
              <p class="text-xs text-white/70 mt-0.5">Começar do zero</p>
              <span class="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mt-2 w-fit">
                <Icon name="add" :size="12" class="inline mr-1" />
                Criar
              </span>
            </div>
          </button>
          <div 
            v-for="project in displayProjects" 
            :key="project.id"
            class="card-item aspect-square group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
            @click="openProjectClick(project)"
          >
            <img 
              v-if="project.thumbnail" 
              :alt="project.title" 
              :src="project.thumbnail" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div 
              v-else 
              class="w-full h-full flex flex-col items-center justify-center bg-primary/10 dark:bg-primary/20"
            >
              <Icon name="auto_awesome" :size="32" class="text-primary mb-2" />
              <span class="text-xs text-slate-400">Sem imagens</span>
            </div>
            <!-- Ícone de exclusão: visível no hover, evita abrir o projeto ao clicar -->
            <button
              type="button"
              class="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-500/90 hover:bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              :aria-label="`Excluir ${project.title}`"
              :disabled="userProjectsComposable.deletingId?.value === project.id"
              @click.stop="openDeleteConfirm(project)"
            >
              <Icon v-if="userProjectsComposable.deletingId?.value !== project.id" name="delete" :size="16" />
              <span v-else class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </button>
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white rounded-2xl">
              <p class="text-sm font-bold truncate">{{ project.title }}</p>
              <p class="text-xs text-white/70 mt-0.5">{{ formatDate(project.updatedAt) }}</p>
              <span class="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mt-2 w-fit">
                <Icon name="open_in_new" :size="12" class="inline mr-1" />
                Abrir
              </span>
            </div>
          </div>
        </div>
      </section>

      <section class="mb-16">
        <h2 class="text-xl font-bold mb-6">Comece com um template</h2>
        <div class="cards-grid">
          <NuxtLink to="/editor" class="card-item aspect-square relative overflow-hidden rounded-2xl bg-primary/10 dark:bg-primary/20 border-2 border-dashed border-primary/30 dark:border-primary/40 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors group" @click="handleCreationLink($event, '/editor')">
            <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
            <div class="relative w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
              <Icon name="auto_awesome" :size="24" />
            </div>
            <span class="relative text-sm font-semibold text-primary">Criar do zero</span>
          </NuxtLink>
          <div 
            v-for="template in creationTemplates" 
            :key="template.id"
            class="card-item aspect-square group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
            @click="goToEditorWithPrompt(template.prompt, template.size)"
          >
            <img 
              :alt="template.title" 
              :src="template.image"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white rounded-2xl">
              <p class="text-sm font-bold truncate">{{ template.title }}</p>
              <p class="text-xs text-white/70 mt-0.5">{{ template.size }}</p>
              <span class="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full mt-2 w-fit">
                <Icon name="auto_awesome" :size="12" class="inline mr-1" />
                Usar template
              </span>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h2 class="text-xl font-bold">Galeria de inspiração</h2>
          <div class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            <button 
              v-for="category in categories" 
              :key="category"
              class="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
              :class="selectedCategory === category 
                ? 'bg-primary/10 text-primary' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'"
              @click="filterByCategory(category)"
            >
              {{ category }}
            </button>
          </div>
        </div>
        
        <!-- Loading state -->
        <div v-if="isLoadingGallery" class="masonry-grid">
          <div 
            v-for="i in 6" 
            :key="i"
            class="masonry-item rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            :style="{ height: `${200 + Math.random() * 150}px` }"
          />
        </div>
        
        <!-- Gallery -->
        <div v-else class="masonry-grid">
          <div 
            v-for="item in inspirationGallery" 
            :key="item.id"
            class="masonry-item group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 cursor-pointer"
            @click="goToEditorWithInspiration(item)"
          >
            <img :alt="item.alt" class="w-full object-cover" :src="item.url" loading="lazy" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
              <p class="text-sm font-bold mb-1">{{ item.alt }}</p>
              <p class="text-xs text-white/70 mb-2">por {{ item.author }}</p>
              <div class="flex items-center justify-between">
                <span class="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Icon name="auto_awesome" :size="12" class="inline mr-1" />
                  Usar como inspiração
                </span>
                <span class="flex items-center gap-1 text-xs text-white/70">
                  <Icon name="favorite" :size="12" />
                  {{ item.likes }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Botão flutuante para criar -->
    <NuxtLink 
      to="/editor" 
      class="fixed bottom-6 right-6 px-5 py-3 rounded-full bg-primary text-white shadow-lg shadow-primary/30 flex items-center gap-2 z-50 hover:scale-105 hover:shadow-xl hover:opacity-90 transition-all font-medium"
      @click="handleCreationLink($event, '/editor')"
    >
      <Icon name="auto_awesome" :size="20" />
      <span>Criar imagem</span>
    </NuxtLink>

    <!-- Toggle de tema -->
    <button class="fixed bottom-6 left-6 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-500 dark:text-slate-400 z-50 hover:scale-110 transition-transform" @click="toggleTheme">
      <Icon name="dark_mode" class="dark:hidden" />
      <Icon name="light_mode" class="hidden dark:block" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { useChatStore } from '~/stores/chat'

useHead({
  title: 'EditorIA - Social Media Creator',
})

const chatStore = useChatStore()
const showAuthModal = ref(false)
const route = useRoute()
const router = useRouter()

const { goTo, shouldInterceptLink, isAuthenticated } = useRequireAuth(openAuthModal)
const userProjectsComposable = useUserProjects()

// Projetos exibidos: do Supabase quando logado, do localStorage quando não
const displayProjects = computed(() => {
  if (userProjectsComposable.isAuthenticated.value) {
    return userProjectsComposable.userProjects.value
  }
  return chatStore.sortedProjects
})

function openAuthModal() {
  showAuthModal.value = true
}

function handleCreationLink(e: MouseEvent, path: string) {
  if (shouldInterceptLink(path)) {
    e.preventDefault()
    openAuthModal()
  }
}

function handleSidebarNavigate(e: MouseEvent, path: string) {
  if (shouldInterceptLink(path)) {
    e.preventDefault()
    openAuthModal()
  }
}

// Abre o modal quando vier redirecionado (ex.: ?openAuth=1)
watch(
  () => route.query.openAuth,
  (openAuth) => {
    if (openAuth === '1') {
      openAuthModal()
      router.replace({ path: '/', query: {} })
    }
  },
  { immediate: true }
)

// Carrega projetos (Supabase se logado, localStorage se não) e galeria
onMounted(() => {
  chatStore.loadFromLocalStorage()
  fetchInspiration()
  if (userProjectsComposable.isAuthenticated.value) {
    userProjectsComposable.fetchUserProjects()
  }
})

watch(userProjectsComposable.isAuthenticated, (isAuth) => {
  if (isAuth) userProjectsComposable.fetchUserProjects()
})

const isDark = useDark()
const toggleTheme = () => {
  isDark.value = !isDark.value
}

const handleNewProject = async () => {
  if (!isAuthenticated.value) {
    openAuthModal()
    return
  }
  if (userProjectsComposable.isAuthenticated.value) {
    try {
      const project = await createProjectInSupabase()
      chatStore.setProjectFromSupabase(project)
    } catch (e) {
      console.error('Erro ao criar projeto:', e)
      chatStore.createProject()
    }
  } else {
    chatStore.createProject()
  }
  await navigateTo({ path: '/editor', query: { new: '1' } })
}

function openProjectClick(project: { id: string }) {
  if (!isAuthenticated.value) {
    openAuthModal()
    return
  }
  userProjectsComposable.loadProjectAndOpen(project.id)
}

const projectToDelete = ref<{ id: string; title: string } | null>(null)

const deleteConfirmMessage = computed(() => {
  const p = projectToDelete.value
  return p ? `Excluir o projeto "${p.title}"? Todas as imagens do projeto serão removidas.` : ''
})

const deleteConfirmLoading = computed(() => {
  const p = projectToDelete.value
  const deletingId = userProjectsComposable.deletingId?.value
  return !!(p && deletingId === p.id)
})

function openDeleteConfirm(project: { id: string; title: string }) {
  projectToDelete.value = project
}

async function confirmDeleteProject() {
  if (!projectToDelete.value) return
  const project = projectToDelete.value
  try {
    if (userProjectsComposable.isAuthenticated.value) {
      await userProjectsComposable.deleteProject(project.id)
    } else {
      chatStore.deleteProject(project.id)
    }
    projectToDelete.value = null
  } catch (err: unknown) {
    const msg = err && typeof err === 'object' && 'data' in err && typeof (err as any).data?.statusMessage === 'string'
      ? (err as any).data.statusMessage
      : 'Não foi possível excluir o projeto.'
    alert(msg)
  }
}

// Navega para o editor com tamanho de imagem pré-selecionado (cria novo projeto)
const goToEditorWithSize = async (size: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3' | '21:9') => {
  if (!isAuthenticated.value) {
    openAuthModal()
    return
  }
  if (userProjectsComposable.isAuthenticated.value) {
    try {
      const project = await createProjectInSupabase()
      chatStore.setProjectFromSupabase(project)
    } catch (e) {
      console.error('Erro ao criar projeto:', e)
      chatStore.createProject()
    }
  } else {
    chatStore.createProject()
  }
  chatStore.updateSettings({ defaultImageSize: size })
  await navigateTo({ path: '/editor', query: { new: '1' } })
}

// Templates de criação com prompts prontos
const creationTemplates = [
  {
    id: 'astronauta',
    title: 'Astronauta no espaço',
    image: '/editoria-img-1769655023521-0.png',
    prompt: 'Astronauta flutuando no espaço sideral com a Terra ao fundo, estilo fotorrealista, iluminação cinematográfica, detalhes do traje espacial, estrelas brilhantes',
    size: '1:1' as const
  },
  {
    id: 'cyberpunk',
    title: 'Cidade cyberpunk',
    image: '/editoria-img-1769655224741-0.png',
    prompt: 'Cidade cyberpunk futurista à noite com neons coloridos, arranha-céus gigantes, carros voadores, estilo Blade Runner, atmosfera chuvosa',
    size: '16:9' as const
  },
  {
    id: 'logo',
    title: 'Logo tech startup',
    image: '/editoria-img-1769655438832-0.png',
    prompt: 'Logo minimalista e moderno para startup de tecnologia, design clean, verde escuro estilo Supabase, fundo branco, vetorial',
    size: '1:1' as const
  },
  {
    id: 'fantasia',
    title: 'Castelo medieval',
    image: '/editoria-img-1769655502741-0.png',
    prompt: 'Castelo medieval majestoso no topo de uma montanha com dragão voando ao redor, pôr do sol épico, estilo fantasia, cores vibrantes',
    size: '4:3' as const
  }
]

// Galeria de inspiração - carregada do Unsplash
const inspirationGallery = ref<Array<{
  id: string
  url: string
  thumb: string
  alt: string
  author: string
  authorUsername: string
  likes: number
  prompt: string
  category?: string
}>>([])
const isLoadingGallery = ref(true)
const selectedCategory = ref('Todos')

const categories = ['Todos', 'Logos', 'Ilustrações', 'Arte digital', '3D']

// Busca imagens do Unsplash
const fetchInspiration = async (query?: string) => {
  isLoadingGallery.value = true
  try {
    const searchQuery = query || 'digital art illustration design abstract'
    const response = await $fetch<{ images: any[], source: string }>('/api/unsplash', {
      query: { query: searchQuery, per_page: 12 }
    })
    inspirationGallery.value = response.images
  } catch (err) {
    console.error('Erro ao carregar galeria:', err)
  } finally {
    isLoadingGallery.value = false
  }
}

// Filtra por categoria
const filterByCategory = (category: string) => {
  selectedCategory.value = category
  const queries: Record<string, string> = {
    'Todos': 'digital art illustration design',
    'Logos': 'logo design branding minimal',
    'Ilustrações': 'illustration artwork drawing',
    'Arte digital': 'digital art concept art',
    '3D': '3d render abstract design'
  }
  fetchInspiration(queries[category] || queries['Todos'])
}

// Navega para o editor com um prompt pré-definido (cria novo projeto)
const goToEditorWithPrompt = async (prompt: string, size: '1:1' | '16:9' | '9:16' | '4:3' | '3:4' | '3:2' | '2:3' | '21:9' = '1:1') => {
  if (!isAuthenticated.value) {
    openAuthModal()
    return
  }
  if (userProjectsComposable.isAuthenticated.value) {
    try {
      const project = await createProjectInSupabase()
      chatStore.setProjectFromSupabase(project)
    } catch (e) {
      console.error('Erro ao criar projeto:', e)
      chatStore.createProject()
    }
  } else {
    chatStore.createProject()
  }
  chatStore.updateSettings({ defaultImageSize: size })
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('editoria_initial_prompt', prompt)
  }
  await navigateTo({ path: '/editor', query: { new: '1' } })
}

// Navega para o editor com a imagem de inspiração anexada (e prompt sugerido)
const goToEditorWithInspiration = async (item: { id: string; url: string; prompt?: string; alt?: string }) => {
  if (!isAuthenticated.value) {
    openAuthModal()
    return
  }
  if (userProjectsComposable.isAuthenticated.value) {
    try {
      const project = await createProjectInSupabase()
      chatStore.setProjectFromSupabase(project)
    } catch (e) {
      console.error('Erro ao criar projeto:', e)
      chatStore.createProject()
    }
  } else {
    chatStore.createProject()
  }
  if (typeof window !== 'undefined') {
    const attached = [{ url: item.url, role: 'inspiration' as const }]
    sessionStorage.setItem('editoria_initial_attached_image', JSON.stringify(attached))
    if (item.prompt) {
      sessionStorage.setItem('editoria_initial_prompt', item.prompt)
    }
  }
  await navigateTo({ path: '/editor', query: { new: '1' } })
}

// Formata a data de atualização
const formatDate = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Agora mesmo'
  if (minutes < 60) return `${minutes} min atrás`
  if (hours < 24) return `${hours}h atrás`
  if (days < 7) return `${days} dias atrás`
  
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
}
</script>

<style scoped>
/* Meus Projetos e Comece com template: cards quadrados com tamanho fixo (1:1) */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 140px);
  gap: 1rem;
  justify-content: start;
}

@media (min-width: 640px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, 160px);
  }
}

@media (min-width: 1024px) {
  .cards-grid {
    grid-template-columns: repeat(auto-fill, 180px);
  }
}

.card-item {
  min-width: 0;
  width: 100%;
}

/* Galeria de inspiração: masonry */
.masonry-grid {
  columns: 2;
  column-gap: 1rem;
}

@media (min-width: 768px) {
  .masonry-grid {
    columns: 3;
  }
}

@media (min-width: 1024px) {
  .masonry-grid {
    columns: 4;
  }
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}
</style>
