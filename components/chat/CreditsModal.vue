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

            <!-- Info de custo -->
            <div class="p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-200 dark:border-violet-800">
              <div class="flex items-center gap-2 mb-2">
                <Icon name="info" :size="18" class="text-violet-500" />
                <p class="text-sm font-medium text-violet-700 dark:text-violet-300">Custo por geração</p>
              </div>
              <p class="text-xs text-slate-600 dark:text-slate-400">
                Cada imagem gerada consome <span class="font-semibold text-violet-600 dark:text-violet-400">1 crédito</span>.
                Variações e edições também consomem créditos.
              </p>
            </div>

            <!-- Pacotes de créditos -->
            <div class="space-y-3">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">Adquirir mais créditos</p>
              
              <div class="grid gap-2">
                <button 
                  v-for="pack in creditPacks" 
                  :key="pack.credits"
                  class="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all group"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                      <Icon name="bolt" :size="20" class="text-white" />
                    </div>
                    <div class="text-left">
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

// Pacotes de créditos disponíveis
const creditPacks = [
  { credits: 50, price: 9.90, bonus: 0 },
  { credits: 150, price: 24.90, bonus: 10 },
  { credits: 500, price: 69.90, bonus: 50 },
  { credits: 1000, price: 119.90, bonus: 150 }
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
