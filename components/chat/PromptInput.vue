<template>
  <div class="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
    <div class="max-w-4xl mx-auto">
      <!-- Opções de tamanho de imagem -->
      <div class="flex items-center gap-2 mb-3 overflow-x-auto pb-2 custom-scrollbar">
        <span class="text-xs text-slate-500 flex-shrink-0">Tamanho:</span>
        <button
          v-for="size in imageSizes"
          :key="size.value"
          class="px-3 py-1 text-xs rounded-full border transition-colors flex-shrink-0"
          :class="{
            'bg-primary text-white border-primary': selectedSize === size.value,
            'border-slate-200 dark:border-slate-700 hover:border-primary hover:text-primary': selectedSize !== size.value
          }"
          @click="selectedSize = size.value"
        >
          {{ size.label }}
        </button>
      </div>

      <!-- Input principal -->
      <div class="relative">
        <div class="bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
          <textarea
            ref="textareaRef"
            v-model="prompt"
            class="w-full bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 resize-none p-4 pr-14 min-h-[56px] max-h-[200px]"
            :placeholder="disabled ? 'Você precisa de créditos para gerar imagens...' : 'Descreva a imagem que você quer criar...'"
            rows="1"
            :disabled="isLoading || disabled"
            @keydown="handleKeydown"
            @input="autoResize"
          />
          
          <!-- Botões de ação -->
          <div class="flex items-center justify-between px-4 pb-3">
            <div class="flex items-center gap-2">
              <!-- Upload de imagem para edição -->
              <button 
                class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-all"
                title="Enviar imagem para editar"
                :disabled="isLoading || disabled"
                @click="triggerImageUpload"
              >
                <Icon name="add_photo_alternate" :size="20" />
              </button>
              <input 
                ref="fileInputRef"
                type="file" 
                accept="image/*"
                class="hidden"
                @change="handleImageUpload"
              />

              <!-- Indicador de custo -->
              <div class="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg">
                <Icon name="bolt" :size="14" class="text-yellow-500" />
                <span class="text-xs font-medium text-primary">1 crédito</span>
              </div>
            </div>

            <button
              class="p-3 rounded-xl transition-all flex items-center justify-center"
              :class="{
                'bg-primary text-white hover:opacity-90': !isLoading && !disabled && prompt.trim(),
                'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed': isLoading || disabled || !prompt.trim()
              }"
              :disabled="isLoading || disabled || !prompt.trim()"
              @click="handleSubmit"
            >
              <Icon v-if="!isLoading" name="arrow_upward" :size="20" />
              <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </button>
          </div>
        </div>
      </div>

      <!-- Imagem anexada para edição -->
      <div v-if="attachedImage" class="mt-3 flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <img :src="attachedImage" class="w-12 h-12 object-cover rounded" />
        <div class="flex-1 min-w-0">
          <p class="text-xs text-slate-600 dark:text-slate-400 truncate">Imagem para editar</p>
          <p class="text-[10px] text-slate-400">A IA irá modificar esta imagem</p>
        </div>
        <button 
          class="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
          @click="attachedImage = null"
        >
          <Icon name="close" :size="16" class="text-slate-400" />
        </button>
      </div>

      <!-- Dicas -->
      <div class="mt-3 flex flex-wrap gap-2">
        <button
          v-for="suggestion in suggestions"
          :key="suggestion"
          class="text-xs px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-600 dark:text-slate-400"
          @click="prompt = suggestion"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ImageSize } from '~/composables/useNanobanana'

interface Props {
  isLoading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
  disabled: false
})

const emit = defineEmits<{
  (e: 'submit', data: { prompt: string; imageSize: ImageSize; imageUrl?: string }): void
}>()

const prompt = ref('')
const selectedSize = ref<ImageSize>('1:1')
const attachedImage = ref<string | null>(null)
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const imageSizes: { value: ImageSize; label: string }[] = [
  { value: '1:1', label: 'Quadrado' },
  { value: '16:9', label: 'Paisagem' },
  { value: '9:16', label: 'Retrato' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
]

const suggestions = [
  'Um gato astronauta flutuando no espaço',
  'Paisagem cyberpunk com neon',
  'Logo minimalista para tech startup',
  'Ilustração de fantasia medieval'
]

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 200)}px`
  }
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    handleSubmit()
  }
}

const handleSubmit = () => {
  if (!prompt.value.trim() || props.isLoading || props.disabled) return

  emit('submit', {
    prompt: prompt.value.trim(),
    imageSize: selectedSize.value,
    imageUrl: attachedImage.value || undefined
  })

  prompt.value = ''
  attachedImage.value = null
  
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
}

const triggerImageUpload = () => {
  fileInputRef.value?.click()
}

const handleImageUpload = (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      attachedImage.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
  
  // Limpa o input para permitir selecionar o mesmo arquivo novamente
  target.value = ''
}
</script>

<style scoped>
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

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: #475569;
}
</style>
