<template>
  <div 
    class="flex gap-4 py-6 px-4"
    :class="{
      'bg-slate-50 dark:bg-slate-800/50': message.role === 'assistant',
      'justify-end': message.role === 'user'
    }"
  >
    <!-- Avatar -->
    <div 
      v-if="message.role === 'assistant'"
      class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-primary text-white"
    >
      <Icon name="auto_awesome" :size="18" />
    </div>

    <!-- Conteúdo da mensagem -->
    <div 
      class="flex flex-col gap-3 max-w-3xl"
      :class="{
        'items-end': message.role === 'user'
      }"
    >
      <!-- Texto da mensagem -->
      <div 
        class="rounded-2xl px-4 py-3"
        :class="{
          'bg-primary text-white': message.role === 'user',
          'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700': message.role === 'assistant'
        }"
      >
        <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
      </div>

      <!-- Loading indicator -->
      <div v-if="message.isLoading" class="flex items-center gap-2 text-slate-500">
        <div class="flex gap-1">
          <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></span>
          <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></span>
          <span class="w-2 h-2 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></span>
        </div>
        <span class="text-xs">Gerando imagem...</span>
      </div>

      <!-- Erro -->
      <div v-if="message.error" class="flex items-center gap-2 text-red-500 text-sm">
        <Icon name="error" :size="16" />
        <span>{{ message.error }}</span>
        <button 
          class="text-xs underline hover:no-underline"
          @click="$emit('retry', message)"
        >
          Tentar novamente
        </button>
      </div>

      <!-- Grid de imagens -->
      <div 
        v-if="message.images && message.images.length > 0" 
        class="grid gap-3"
        :class="gridClass"
      >
        <div 
          v-for="image in message.images" 
          :key="image.id"
          class="relative group rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 aspect-square cursor-pointer"
          @click="$emit('image-click', image)"
        >
          <img 
            :src="image.url" 
            :alt="image.prompt"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          <!-- Overlay com ações -->
          <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button 
              class="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Baixar"
              @click.stop="$emit('download', image)"
            >
              <Icon name="download" :size="18" class="text-white" />
            </button>
            <button 
              class="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Gerar variações"
              @click.stop="$emit('variation', image)"
            >
              <Icon name="auto_awesome" :size="18" class="text-white" />
            </button>
            <button 
              class="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              title="Copiar link"
              @click.stop="$emit('copy', image)"
            >
              <Icon name="content_copy" :size="18" class="text-white" />
            </button>
          </div>
        </div>
      </div>

      <!-- Timestamp -->
      <span class="text-[10px] text-slate-400 uppercase">
        {{ formatTime(message.createdAt) }}
      </span>
    </div>

    <!-- Avatar do usuário -->
    <div 
      v-if="message.role === 'user'"
      class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
    >
      <Icon name="person" :size="18" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage, GeneratedImage } from '~/stores/chat'

interface Props {
  message: ChatMessage
}

const props = defineProps<Props>()

defineEmits<{
  (e: 'image-click', image: GeneratedImage): void
  (e: 'download', image: GeneratedImage): void
  (e: 'variation', image: GeneratedImage): void
  (e: 'copy', image: GeneratedImage): void
  (e: 'retry', message: ChatMessage): void
}>()

const gridClass = computed(() => {
  const count = props.message.images?.length || 0
  if (count === 1) return 'grid-cols-1 max-w-md'
  if (count === 2) return 'grid-cols-2 max-w-lg'
  if (count === 3) return 'grid-cols-3 max-w-xl'
  return 'grid-cols-2 md:grid-cols-4 max-w-2xl'
})

const formatTime = (date: Date) => {
  const d = new Date(date)
  return d.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}
</script>

<style scoped>
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

.animate-bounce {
  animation: bounce 0.6s infinite;
}
</style>
