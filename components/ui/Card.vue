<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'outlined' | 'elevated' | 'dashed'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  hover: false
})

const cardClasses = computed(() => {
  const base = 'rounded-2xl'
  const variants = {
    default: 'bg-white dark:bg-slate-900',
    outlined: 'bg-transparent border-2 border-slate-200 dark:border-slate-800',
    elevated: 'bg-white dark:bg-slate-900 shadow-lg',
    dashed: 'bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800'
  }
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }
  const hoverClass = props.hover ? 'hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors cursor-pointer' : ''
  return `${base} ${variants[props.variant]} ${paddings[props.padding]} ${hoverClass}`
})
</script>
