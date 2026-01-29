<template>
  <div 
    class="flex-shrink-0 w-64 h-48 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors group"
    @click="$emit('click')"
  >
    <div class="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:border-primary mb-3">
      <Icon name="add" />
    </div>
    <span class="text-sm font-semibold text-slate-500 dark:text-slate-400">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label?: string
}

withDefaults(defineProps<Props>(), {
  label: 'Novo projeto'
})

defineEmits<{
  click: []
}>()
</script>
