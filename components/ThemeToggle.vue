<template>
  <button
    class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
    @click="toggleTheme"
  >
    <Icon v-if="isDark" name="light_mode" />
    <Icon v-else name="dark_mode" />
  </button>
</template>

<script setup lang="ts">
const isDark = useDark()
const toggleTheme = () => {
  isDark.value = !isDark.value
}
</script>
