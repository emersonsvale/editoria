<template>
  <Teleport to="body">
    <Transition name="settings-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div
          class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="settings-modal-title"
        >
          <!-- Header com ícone -->
          <div class="p-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div class="flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                  <Icon name="settings" :size="26" class="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 id="settings-modal-title" class="text-xl font-bold text-slate-900 dark:text-white">
                    Configurações
                  </h2>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Preferências do editor
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="p-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                aria-label="Fechar"
                @click="$emit('close')"
              >
                <Icon name="close" :size="20" />
              </button>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            <!-- Créditos resumo -->
            <section class="p-4 rounded-xl border border-violet-200 dark:border-violet-800/50 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
              <div class="flex items-center justify-between gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Icon name="bolt" :size="20" class="text-white" />
                  </div>
                  <div>
                    <p class="font-semibold text-slate-900 dark:text-white">{{ credits.credits }} créditos</p>
                    <p class="text-xs text-slate-500 dark:text-slate-400">disponíveis</p>
                  </div>
                </div>
                <button
                  type="button"
                  class="px-4 py-2 rounded-xl text-sm font-medium bg-violet-500 text-white hover:bg-violet-600 transition-colors flex-shrink-0"
                  @click="$emit('close'); $emit('open-credits')"
                >
                  Comprar mais
                </button>
              </div>
            </section>

            <!-- Tamanho padrão de imagem -->
            <section>
              <label for="settings-size" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tamanho padrão de imagem
              </label>
              <select
                id="settings-size"
                v-model="localSettings.defaultImageSize"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors appearance-none cursor-pointer"
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
            </section>

            <!-- Auto save -->
            <section class="flex items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-white">Salvar automaticamente</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Salva conversas no navegador</p>
              </div>
              <button
                type="button"
                role="switch"
                :aria-checked="localSettings.autoSave"
                class="relative w-12 h-6 rounded-full transition-colors flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                :class="localSettings.autoSave ? 'bg-violet-500' : 'bg-slate-200 dark:bg-slate-700'"
                @click="localSettings.autoSave = !localSettings.autoSave"
              >
                <span
                  class="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
                  :class="localSettings.autoSave ? 'left-1 translate-x-6' : 'left-1 translate-x-0'"
                />
              </button>
            </section>

            <!-- Sobre -->
            <section class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span class="text-white font-bold text-sm italic">EI</span>
                </div>
                <div class="min-w-0">
                  <p class="font-semibold text-slate-900 dark:text-white">EditorIA</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">Gerador de imagens com IA</p>
                </div>
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400">
                Powered by Google Gemini (Nano Banana).
              </p>
            </section>

            <!-- Limpar dados -->
            <section class="pt-2">
              <button
                type="button"
                class="w-full py-3 px-4 rounded-xl border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                @click="handleClearData"
              >
                <Icon name="delete" :size="18" />
                Limpar todos os projetos
              </button>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                Remove todos os projetos salvos no navegador. Não afeta sua conta.
              </p>
            </section>
          </div>

          <!-- Footer -->
          <div class="flex justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              @click="$emit('close')"
            >
              Cancelar
            </button>
            <button
              type="button"
              class="px-6 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:opacity-95 transition-opacity"
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
  (e: 'open-credits'): void
}>()

const localSettings = ref<Settings>({ ...props.settings })

watch(
  () => props.settings,
  (val) => {
    localSettings.value = { ...val }
  },
  { deep: true }
)

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
.settings-modal-enter-active,
.settings-modal-leave-active {
  transition: opacity 0.2s ease;
}
.settings-modal-enter-from,
.settings-modal-leave-to {
  opacity: 0;
}
.settings-modal-enter-active .relative,
.settings-modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.settings-modal-enter-from .relative,
.settings-modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
