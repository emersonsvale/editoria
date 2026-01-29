<template>
  <header :class="[
    'sticky top-0 z-50 border-b',
    variant === 'transparent' 
      ? 'bg-white/80 dark:bg-background-dark/80 backdrop-blur-md' 
      : 'bg-white dark:bg-panel-dark',
    'border-slate-200 dark:border-slate-800',
    paddingClass
  ]">
    <div :class="containerClass">
      <div class="flex items-center gap-4">
        <slot name="logo">
          <div class="size-6 text-primary">
            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"></path>
            </svg>
          </div>
          <h2 class="text-lg font-bold leading-tight tracking-tight">{{ title }}</h2>
        </slot>
      </div>
      <div class="flex items-center gap-6">
        <slot name="nav" />
        <div class="flex items-center gap-3">
          <slot name="actions" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  variant?: 'default' | 'transparent'
  padding?: 'default' | 'large'
  containerMaxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'EditorIA',
  variant: 'default',
  padding: 'default',
  containerMaxWidth: 'max-w-[1440px]'
})

const paddingClass = computed(() => {
  return props.padding === 'large' 
    ? 'px-6 lg:px-10 py-3' 
    : 'px-6 py-3'
})

const containerClass = computed(() => {
  return `${props.containerMaxWidth} mx-auto flex items-center justify-between`
})
</script>
