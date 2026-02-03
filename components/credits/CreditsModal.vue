<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        @click.self="$emit('close')"
      >
        <div class="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          <!-- Header -->
          <div class="p-6 bg-gradient-to-r from-violet-500 to-purple-600 text-white">
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-bold">Seus Créditos</h2>
              <button 
                class="p-2 hover:bg-white/20 rounded-lg transition-colors"
                @click="$emit('close')"
              >
                <Icon name="close" :size="20" />
              </button>
            </div>
            
            <!-- Créditos atuais -->
            <div class="mt-4 flex items-center gap-4">
              <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon name="bolt" :size="32" class="text-yellow-300" />
              </div>
              <div>
                <p class="text-4xl font-bold">{{ credits.credits }}</p>
                <p class="text-white/80 text-sm">créditos disponíveis</p>
              </div>
            </div>
          </div>

          <!-- Conteúdo -->
          <div class="p-6 space-y-4">
            <!-- Estatísticas -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ credits.used }}</p>
                <p class="text-xs text-slate-500">Créditos usados</p>
              </div>
              <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                <p class="text-2xl font-bold text-slate-900 dark:text-white">{{ credits.total }}</p>
                <p class="text-xs text-slate-500">Total adquirido</p>
              </div>
            </div>

            <!-- Pacotes de créditos -->
            <div class="space-y-3">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Adquirir mais créditos</p>
              
              <div class="grid gap-2">
                <button 
                  v-for="pack in creditPacks" 
                  :key="pack.name"
                  class="relative flex items-center justify-between p-4 rounded-xl transition-all group"
                  :class="pack.popular 
                    ? 'border-2 border-violet-500 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30' 
                    : 'border border-slate-200 dark:border-slate-700 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20'"
                >
                  <span 
                    v-if="pack.popular" 
                    class="absolute -top-2 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-full bg-violet-500 text-white shadow-sm"
                  >
                    Mais popular
                  </span>
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Icon name="bolt" :size="20" class="text-white" />
                    </div>
                    <div class="text-left">
                      <p class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ pack.name }}</p>
                      <p class="font-semibold text-slate-900 dark:text-white">{{ pack.credits }} créditos</p>
                      <p v-if="pack.bonus" class="text-xs text-green-500 font-medium">+{{ pack.bonus }} bônus</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-violet-600 dark:text-violet-400">R$ {{ pack.price.toFixed(2) }}</p>
                    <p class="text-xs text-slate-500">R$ {{ (pack.price / pack.credits).toFixed(2) }}/crédito</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
            <p class="text-xs text-center text-slate-500">
              Os créditos não expiram. Pagamento seguro via Stripe.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
interface UserCredits {
  credits: number
  used: number
  total: number
}

interface Props {
  isOpen: boolean
  credits: UserCredits
}

defineProps<Props>()

defineEmits<{
  (e: 'close'): void
}>()

// Preços comerciais (Gemini 3 Pro – custo R$ 0,72/cred). Quantidades ajustadas para margem positiva.
const creditPacks = [
  { name: 'Starter', credits: 30, price: 39.90, bonus: 0, popular: false },
  { name: 'Pro', credits: 100, price: 99.90, bonus: 0, popular: true },
  { name: 'Agency', credits: 300, price: 297.90, bonus: 0, popular: false }
]
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
