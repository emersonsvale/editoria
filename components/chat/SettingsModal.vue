<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')"
      >
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 class="text-xl font-bold">Configurações</h2>
            <button 
              class="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              @click="$emit('close')"
            >
              <Icon name="close" :size="20" />
            </button>
          </div>

          <!-- Conteúdo -->
          <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <!-- Créditos resumo -->
            <div class="p-4 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-200 dark:border-violet-800">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icon name="bolt" :size="20" class="text-white" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-white">{{ credits.credits }} créditos</p>
                    <p class="text-xs text-slate-500">disponíveis</p>
                  </div>
                </div>
                <button 
                  class="px-4 py-2 bg-violet-500 text-white text-sm rounded-lg hover:bg-violet-600 transition-colors font-medium"
                >
                  Comprar mais
                </button>
              </div>
            </div>

            <!-- Tamanho padrão de imagem -->
            <div>
              <label class="block text-sm font-medium mb-2">
                Tamanho padrão de imagem
              </label>
              <select
                v-model="localSettings.defaultImageSize"
                class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
              >
                <option value="1:1">Quadrado (1:1)</option>
                <option value="16:9">Paisagem (16:9)</option>
                <option value="9:16">Retrato (9:16)</option>
                <option value="4:3">Tradicional (4:3)</option>
                <option value="3:4">Retrato (3:4)</option>
                <option value="3:2">Foto Paisagem (3:2)</option>
                <option value="2:3">Foto Retrato (2:3)</option>
                <option value="21:9">Ultra-wide (21:9)</option>
              </select>
            </div>

            <!-- Auto save -->
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">Salvar automaticamente</p>
                <p class="text-xs text-slate-500">Salva conversas no navegador</p>
              </div>
              <button
                class="relative w-12 h-6 rounded-full transition-colors"
                :class="localSettings.autoSave ? 'bg-violet-500' : 'bg-slate-200 dark:bg-slate-700'"
                @click="localSettings.autoSave = !localSettings.autoSave"
              >
                <span 
                  class="absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow"
                  :class="localSettings.autoSave ? 'translate-x-7' : 'translate-x-1'"
                />
              </button>
            </div>

            <!-- Sobre -->
            <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <span class="text-white font-bold text-sm italic">EI</span>
                </div>
                <div>
                  <p class="font-semibold">EditorIA</p>
                  <p class="text-xs text-slate-500">Gerador de imagens com IA</p>
                </div>
              </div>
              <p class="text-xs text-slate-500">
                Powered by Google Gemini (Nano Banana). Cada imagem gerada consome 1 crédito.
              </p>
            </div>

            <!-- Limpar dados -->
            <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                class="w-full py-3 px-4 border border-red-200 dark:border-red-800 text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium"
                @click="handleClearData"
              >
                Limpar todos os projetos
              </button>
              <p class="text-xs text-slate-500 mt-2 text-center">
                Remove todos os projetos salvos no navegador
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <button
              class="px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              @click="$emit('close')"
            >
              Cancelar
            </button>
            <button
              class="px-6 py-2 text-sm bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
              @click="handleSave"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { ImageSize } from '~/composables/useNanobanana'

interface Settings {
  defaultImageSize: ImageSize
  autoSave: boolean
}

interface UserCredits {
  credits: number
  used: number
  total: number
}

interface Props {
  isOpen: boolean
  settings: Settings
  credits: UserCredits
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'save', settings: Settings): void
  (e: 'clear-data'): void
}>()

const localSettings = ref<Settings>({ ...props.settings })

// Sincroniza quando as props mudam
watch(() => props.settings, (val) => {
  localSettings.value = { ...val }
}, { deep: true })

const handleSave = () => {
  emit('save', localSettings.value)
  emit('close')
}

const handleClearData = () => {
  if (confirm('Tem certeza que deseja excluir todos os projetos? Esta ação não pode ser desfeita.')) {
    emit('clear-data')
    emit('close')
  }
}
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

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>
