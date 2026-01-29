<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <Icon v-if="showIcon" :name="icon" :size="16" />
        <p class="text-sm font-semibold">{{ label }}</p>
      </div>
      <p class="text-primary text-sm font-bold">{{ value }}%</p>
    </div>
    <div class="h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <div 
        class="h-full bg-primary transition-all duration-300" 
        :style="`width: ${value}%`"
      />
    </div>
    <p v-if="description" class="text-xs font-medium italic text-slate-500 dark:text-slate-400">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: number
  label?: string
  description?: string
  showIcon?: boolean
  icon?: string
}

withDefaults(defineProps<Props>(), {
  label: '',
  description: '',
  showIcon: false,
  icon: 'refresh'
})
</script>
