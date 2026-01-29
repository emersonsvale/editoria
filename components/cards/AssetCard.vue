<template>
  <div 
    class="group relative rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-primary hover:shadow-lg transition-all cursor-pointer"
    @click="$emit('click')"
  >
    <div class="aspect-square bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
      <img 
        v-if="image"
        :alt="name" 
        :src="image" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <Icon :name="icon" :size="48" class="text-slate-400" />
      </div>
      <div class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="flex gap-1">
          <button class="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-white dark:hover:bg-slate-800">
            <Icon name="download" :size="16" />
          </button>
          <button class="p-1.5 bg-white/90 dark:bg-slate-800/90 rounded-lg hover:bg-white dark:hover:bg-slate-800">
            <Icon name="share" :size="16" />
          </button>
        </div>
      </div>
    </div>
    <div class="p-3">
      <p class="text-sm font-bold truncate">{{ name }}</p>
      <p v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  image?: string
  icon?: string
  subtitle?: string
}

withDefaults(defineProps<Props>(), {
  icon: 'image'
})

defineEmits<{
  click: []
}>()
</script>
