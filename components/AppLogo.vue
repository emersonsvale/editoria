<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="logoClasses"
    :title="title"
  >
    <span class="text-white font-bold italic" :class="textSizeClass">EI</span>
  </NuxtLink>
  <a
    v-else-if="href"
    :href="href"
    :class="logoClasses"
    :title="title"
  >
    <span class="text-white font-bold italic" :class="textSizeClass">EI</span>
  </a>
  <div
    v-else
    :class="logoClasses"
    :title="title"
  >
    <span class="text-white font-bold italic" :class="textSizeClass">EI</span>
  </div>
</template>

<script setup lang="ts">
/**
 * Logo oficial do EditorIA.
 * Marca "EI" em quadrado arredondado com cor primary — uso consistente em todo o app.
 */
type Size = 'xs' | 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    /** xs: nav (32px) | sm: toolbar (44px) | md: modal (40px) | lg: destaque (64px) */
    size?: Size
    /** Título acessível (tooltip/title) */
    title?: string
    /** Se preenchido, renderiza como NuxtLink para esta rota */
    to?: string
    /** Se preenchido (sem to), renderiza como <a> com este href */
    href?: string
  }>(),
  { size: 'sm', title: 'EditorIA' }
)

const logoClasses = computed(() => {
  const base = 'flex items-center justify-center bg-primary flex-shrink-0'
  const sizes: Record<Size, string> = {
    xs: 'w-8 h-8 rounded-lg',
    sm: 'w-11 h-11 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:scale-105 transition-all',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-16 h-16 rounded-2xl shadow-lg shadow-primary/30'
  }
  return `${base} ${sizes[props.size]}`
})

const textSizeClass = computed(() => {
  const sizes: Record<Size, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-xl'
  }
  return sizes[props.size]
})
</script>
