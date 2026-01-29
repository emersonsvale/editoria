<template>
  <div 
    class="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-900/20 px-3 py-1 rounded-full border border-orange-100 dark:border-orange-800/30 group cursor-pointer"
    @click="$emit('click')"
  >
    <Badge variant="accent" size="sm">{{ badgeText }}</Badge>
    <span class="text-xs font-medium text-orange-800 dark:text-orange-300">{{ message }}</span>
    <span class="text-xs font-bold text-orange-800 dark:text-orange-300 group-hover:underline">{{ actionText }} →</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  badgeText?: string
  message?: string
  actionText?: string
}

withDefaults(defineProps<Props>(), {
  badgeText: 'NEW',
  message: 'Faça o upgrade agora para 365 dias de Nano Banana Pro ilimitado!',
  actionText: 'Atualizar'
})

defineEmits<{
  click: []
}>()
</script>
