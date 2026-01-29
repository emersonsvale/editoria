<template>
  <div 
    class="flex-shrink-0 w-64 group cursor-pointer"
    @click="$emit('click')"
  >
    <div class="w-full h-40 bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden mb-3 relative">
      <img 
        :alt="title" 
        :src="image" 
        class="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <p class="text-sm font-bold truncate">{{ title }}</p>
    <p class="text-[10px] text-slate-400 uppercase mt-1">{{ lastUpdated }}</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  image: string
  lastUpdated: string
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>
