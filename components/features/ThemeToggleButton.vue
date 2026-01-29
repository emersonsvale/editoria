<template>
  <button 
    class="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-slate-500 dark:text-slate-400 z-50 hover:scale-110 transition-transform"
    @click="toggleTheme"
  >
    <Icon name="dark_mode" class="dark:hidden" />
    <Icon name="light_mode" class="hidden dark:block" />
  </button>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>
