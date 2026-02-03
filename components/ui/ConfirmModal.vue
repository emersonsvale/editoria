<template>
  <Teleport to="body">
    <Transition name="confirm-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <div
          class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="titleId"
          :aria-describedby="descId"
        >
          <!-- Ícone + Título -->
          <div class="p-6 pb-2">
            <div
              class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
              :class="iconBgClass"
            >
              <Icon :name="iconName" :size="28" :class="iconColorClass" />
            </div>
            <h2 :id="titleId" class="text-xl font-bold text-slate-900 dark:text-white">
              {{ title }}
            </h2>
          </div>

          <!-- Mensagem -->
          <div class="px-6 py-3">
            <p :id="descId" class="text-slate-600 dark:text-slate-400">
              {{ message }}
            </p>
          </div>

          <!-- Ações -->
          <div class="p-6 pt-4 flex gap-3 justify-end">
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              :disabled="loading"
              @click="handleCancel"
            >
              {{ cancelLabel }}
            </button>
            <button
              type="button"
              class="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-60"
              :class="confirmButtonClass"
              :disabled="loading"
              @click="handleConfirm"
            >
              <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle" />
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
    loading?: boolean
  }>(),
  {
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    variant: 'primary',
    loading: false
  }
)

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const titleId = `confirm-modal-title-${Math.random().toString(36).slice(2)}`
const descId = `confirm-modal-desc-${Math.random().toString(36).slice(2)}`

const iconName = computed(() => (props.variant === 'danger' ? 'delete' : 'info'))
const iconBgClass = computed(() =>
  props.variant === 'danger'
    ? 'bg-red-100 dark:bg-red-900/30'
    : 'bg-primary/10'
)
const iconColorClass = computed(() =>
  props.variant === 'danger'
    ? 'text-red-600 dark:text-red-400'
    : 'text-primary'
)
const confirmButtonClass = computed(() =>
  props.variant === 'danger'
    ? 'bg-red-500 hover:bg-red-600'
    : 'bg-primary hover:opacity-90'
)

function handleConfirm() {
  if (!props.loading) emit('confirm')
}

function handleCancel() {
  if (!props.loading) emit('cancel')
}
</script>

<style scoped>
.confirm-modal-enter-active,
.confirm-modal-leave-active {
  transition: opacity 0.2s ease;
}
.confirm-modal-enter-from,
.confirm-modal-leave-to {
  opacity: 0;
}
.confirm-modal-enter-active .relative,
.confirm-modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.confirm-modal-enter-from .relative,
.confirm-modal-leave-to .relative {
  transform: scale(0.95);
}
</style>
