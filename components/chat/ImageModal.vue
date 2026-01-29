<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')"
      >
        <!-- Botão fechar -->
        <button 
          class="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          @click="$emit('close')"
        >
          <Icon name="close" :size="24" />
        </button>

        <!-- Navegação -->
        <button 
          v-if="hasPrevious"
          class="absolute left-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          @click="$emit('previous')"
        >
          <Icon name="chevron_left" :size="32" />
        </button>

        <button 
          v-if="hasNext"
          class="absolute right-4 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          @click="$emit('next')"
        >
          <Icon name="chevron_right" :size="32" />
        </button>

        <!-- Conteúdo principal -->
        <div class="max-w-5xl w-full flex flex-col items-center gap-6">
          <!-- Imagem -->
          <div class="relative">
            <img 
              :src="image?.url" 
              :alt="image?.prompt"
              class="max-h-[70vh] max-w-full object-contain rounded-lg shadow-2xl"
            />
          </div>

          <!-- Info e ações -->
          <div class="bg-white/10 backdrop-blur-md rounded-2xl p-4 w-full max-w-2xl">
            <p class="text-white text-sm mb-4 line-clamp-3">{{ image?.prompt }}</p>
            
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-white/60 text-xs">
                <span>{{ image?.size }}</span>
                <span>•</span>
                <span>{{ formatDate(image?.createdAt) }}</span>
              </div>

              <div class="flex items-center gap-2">
                <button 
                  class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
                  @click="$emit('variation', image)"
                >
                  <Icon name="auto_awesome" :size="16" />
                  Variações
                </button>
                <button 
                  class="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white text-sm"
                  @click="handleCopy"
                >
                  <Icon name="content_copy" :size="16" />
                  {{ copied ? 'Copiado!' : 'Copiar link' }}
                </button>
                <button 
                  class="flex items-center gap-2 px-4 py-2 bg-primary hover:opacity-90 rounded-lg transition-opacity text-white text-sm"
                  @click="handleDownload"
                >
                  <Icon name="download" :size="16" />
                  Baixar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { GeneratedImage } from '~/stores/chat'

interface Props {
  isOpen: boolean
  image: GeneratedImage | null
  hasPrevious?: boolean
  hasNext?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  hasPrevious: false,
  hasNext: false
})

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'previous'): void
  (e: 'next'): void
  (e: 'variation', image: GeneratedImage): void
}>()

const copied = ref(false)

const formatDate = (date?: Date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const handleCopy = async () => {
  if (!props.image?.url) return
  
  try {
    await navigator.clipboard.writeText(props.image.url)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (err) {
    console.error('Erro ao copiar:', err)
  }
}

const handleDownload = () => {
  if (!props.image?.url) return
  
  const link = document.createElement('a')
  link.href = props.image.url
  link.download = `editoria-${props.image.id}.png`
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Navegação por teclado
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.isOpen) return
  
  if (e.key === 'Escape') {
    emit('close')
  } else if (e.key === 'ArrowLeft' && props.hasPrevious) {
    emit('previous')
  } else if (e.key === 'ArrowRight' && props.hasNext) {
    emit('next')
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from img,
.modal-leave-to img {
  transform: scale(0.9);
}
</style>
