<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <Icon v-if="icon && !iconRight" :name="icon" :size="iconSize" />
    <slot />
    <Icon v-if="icon && iconRight" :name="icon" :size="iconSize" />
    <span v-if="badge" class="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{{ badge }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  iconRight?: boolean
  iconSize?: number
  badge?: string | number
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  iconRight: false,
  iconSize: 16,
  disabled: false,
  type: 'button',
  fullWidth: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'flex items-center justify-center gap-2 font-semibold transition-all rounded-full'
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700',
    outline: 'border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900',
    ghost: 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
    accent: 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800/50 text-orange-700 dark:text-orange-400'
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  }
  return [
    base,
    variants[props.variant],
    sizes[props.size],
    props.fullWidth ? 'w-full' : '',
    props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  ].filter(Boolean).join(' ')
})
</script>
