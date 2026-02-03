<template>
  <aside class="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full shadow-sm z-40">
    <button 
      class="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white shadow-lg hover:opacity-90 transition-opacity"
      @click="$emit('new-project')"
      title="Novo Projeto"
    >
      <Icon name="add" />
    </button>
    <NuxtLink
      v-for="item in navigationItems"
      :key="item.name"
      :to="item.path"
      :class="[
        'w-10 h-10 flex items-center justify-center rounded-full transition-colors',
        isActive(item.path)
          ? 'bg-primary text-white shadow-lg' 
          : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      ]"
      :title="item.label || item.name"
      @click="(e: MouseEvent) => $emit('navigate', e, item.path)"
    >
      <Icon :name="item.icon" />
    </NuxtLink>
  </aside>
</template>

<script setup lang="ts">
import { useNavigation } from '~/composables/useNavigation'

const { navigationItems, isActive } = useNavigation()

defineEmits<{
  'new-project': []
  (e: 'navigate', event: MouseEvent, path: string): void
}>()
</script>
