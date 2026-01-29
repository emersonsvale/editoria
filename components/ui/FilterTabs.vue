<template>
  <div class="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
    <button
      v-for="tab in tabs"
      :key="tab.value"
      :class="[
        'px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors',
        activeTab === tab.value
          ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
      ]"
      @click="$emit('update:activeTab', tab.value)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  label: string
  value: string
}

interface Props {
  tabs: Tab[]
  activeTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  activeTab: ''
})

defineEmits<{
  'update:activeTab': [value: string]
}>()
</script>
