<template>
  <aside 
    class="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex flex-col h-full"
    :class="{ 'hidden md:flex': !isOpen }"
  >
    <!-- Header -->
    <div class="p-4 border-b border-slate-200 dark:border-slate-800">
      <button
        class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary text-white rounded-xl hover:opacity-90 transition-opacity font-medium"
        @click="$emit('new-conversation')"
      >
        <Icon name="add" :size="20" />
        Nova conversa
      </button>
    </div>

    <!-- Lista de conversas -->
    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="conversations.length === 0" class="text-center py-8 text-slate-400 text-sm">
        Nenhuma conversa ainda
      </div>

      <div v-else class="space-y-1">
        <!-- Agrupar por data -->
        <div v-for="group in groupedConversations" :key="group.label">
          <p class="px-3 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
            {{ group.label }}
          </p>
          
          <button
            v-for="conv in group.conversations"
            :key="conv.id"
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors group"
            :class="{
              'bg-white dark:bg-slate-800 shadow-sm': conv.id === currentConversationId,
              'hover:bg-white dark:hover:bg-slate-800': conv.id !== currentConversationId
            }"
            @click="$emit('select', conv.id)"
          >
            <Icon 
              name="chat_bubble_outline" 
              :size="18" 
              class="flex-shrink-0"
              :class="{
                'text-primary': conv.id === currentConversationId,
                'text-slate-400': conv.id !== currentConversationId
              }"
            />
            <div class="flex-1 min-w-0">
              <p 
                class="text-sm truncate"
                :class="{
                  'font-medium': conv.id === currentConversationId
                }"
              >
                {{ conv.title }}
              </p>
              <p class="text-[10px] text-slate-400">
                {{ formatImageCount(conv) }}
              </p>
            </div>
            
            <!-- Menu de ações -->
            <div class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <button
                class="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                title="Renomear"
                @click.stop="handleRename(conv)"
              >
                <Icon name="edit" :size="14" class="text-slate-400" />
              </button>
              <button
                class="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                title="Excluir"
                @click.stop="handleDelete(conv)"
              >
                <Icon name="delete" :size="14" class="text-red-400" />
              </button>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Footer com configurações -->
    <div class="p-4 border-t border-slate-200 dark:border-slate-800">
      <button
        class="w-full flex items-center gap-3 px-3 py-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors text-sm text-slate-600 dark:text-slate-400"
        @click="$emit('open-settings')"
      >
        <Icon name="settings" :size="18" />
        Configurações
      </button>
      
      <div class="mt-3 flex items-center justify-between px-3">
        <span class="text-xs text-slate-400">Tema</span>
        <button
          class="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
          @click="toggleTheme"
        >
          <Icon name="dark_mode" :size="18" class="dark:hidden text-slate-500" />
          <Icon name="light_mode" :size="18" class="hidden dark:block text-slate-400" />
        </button>
      </div>
    </div>
  </aside>

  <!-- Modal de renomear -->
  <Teleport to="body">
    <div 
      v-if="showRenameModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showRenameModal = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 class="text-lg font-bold mb-4">Renomear conversa</h3>
        <input
          v-model="renameValue"
          type="text"
          class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
          placeholder="Nome da conversa"
          @keydown.enter="confirmRename"
        />
        <div class="flex justify-end gap-3 mt-4">
          <button
            class="px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            @click="showRenameModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
            @click="confirmRename"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Modal de confirmar exclusão -->
  <Teleport to="body">
    <div 
      v-if="showDeleteModal" 
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showDeleteModal = false"
    >
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <h3 class="text-lg font-bold mb-2">Excluir conversa?</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm mb-4">
          Esta ação não pode ser desfeita. Todas as imagens geradas nesta conversa serão perdidas.
        </p>
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            @click="showDeleteModal = false"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            @click="confirmDelete"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import type { Conversation } from '~/stores/chat'

interface Props {
  conversations: Conversation[]
  currentConversationId: string | null
  isOpen?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: true
})

const emit = defineEmits<{
  (e: 'new-conversation'): void
  (e: 'select', id: string): void
  (e: 'rename', id: string, title: string): void
  (e: 'delete', id: string): void
  (e: 'open-settings'): void
}>()

const isDark = useDark()
const toggleTheme = () => {
  isDark.value = !isDark.value
}

// Estado dos modais
const showRenameModal = ref(false)
const showDeleteModal = ref(false)
const selectedConversation = ref<Conversation | null>(null)
const renameValue = ref('')

// Agrupa conversas por data
const groupedConversations = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  const groups: { label: string; conversations: Conversation[] }[] = [
    { label: 'Hoje', conversations: [] },
    { label: 'Ontem', conversations: [] },
    { label: 'Últimos 7 dias', conversations: [] },
    { label: 'Anteriores', conversations: [] }
  ]

  const sorted = [...props.conversations].sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  )

  sorted.forEach(conv => {
    const convDate = new Date(conv.updatedAt)
    
    if (convDate >= today) {
      groups[0].conversations.push(conv)
    } else if (convDate >= yesterday) {
      groups[1].conversations.push(conv)
    } else if (convDate >= lastWeek) {
      groups[2].conversations.push(conv)
    } else {
      groups[3].conversations.push(conv)
    }
  })

  return groups.filter(g => g.conversations.length > 0)
})

const formatImageCount = (conv: Conversation) => {
  const imageCount = conv.messages.reduce((acc, msg) => acc + (msg.images?.length || 0), 0)
  if (imageCount === 0) return 'Sem imagens'
  if (imageCount === 1) return '1 imagem'
  return `${imageCount} imagens`
}

const handleRename = (conv: Conversation) => {
  selectedConversation.value = conv
  renameValue.value = conv.title
  showRenameModal.value = true
}

const confirmRename = () => {
  if (selectedConversation.value && renameValue.value.trim()) {
    emit('rename', selectedConversation.value.id, renameValue.value.trim())
    showRenameModal.value = false
    selectedConversation.value = null
    renameValue.value = ''
  }
}

const handleDelete = (conv: Conversation) => {
  selectedConversation.value = conv
  showDeleteModal.value = true
}

const confirmDelete = () => {
  if (selectedConversation.value) {
    emit('delete', selectedConversation.value.id)
    showDeleteModal.value = false
    selectedConversation.value = null
  }
}
</script>
