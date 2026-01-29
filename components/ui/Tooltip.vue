<template>
  <div class="relative group">
    <slot />
    <div
      v-if="text"
      class="absolute left-full ml-3 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-md whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-[9999] shadow-xl top-1/2 -translate-y-1/2"
    >
      {{ text }}
      <div
        class="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45 -mr-1"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  text?: string
  position?: 'right' | 'left' | 'top' | 'bottom'
}

withDefaults(defineProps<Props>(), {
  text: '',
  position: 'right'
})
</script>
