<template>
  <component :is="iconComponent" :size="computedSize" :class="$attrs.class" :stroke-width="strokeWidth" />
</template>

<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'
import { iconMap } from '~/utils/iconMap'

interface Props {
  name?: string
  size?: string | number
  strokeWidth?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  size: 24,
  strokeWidth: 2,
})

const iconComponent = computed(() => {
  if (!props.name) {
    return LucideIcons.AlertCircle
  }

  // Primeiro tenta usar o mapeamento
  let iconName = iconMap[props.name]
  
  // Se não encontrar no mapeamento, tenta converter o nome diretamente
  if (!iconName) {
    iconName = props.name
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('')
  }
  
  // Tenta encontrar o ícone no Lucide
  const Icon = (LucideIcons as any)[iconName] || (LucideIcons as any)[`${iconName}Icon`]

  if (!Icon) {
    console.warn(`Ícone "${props.name}" não encontrado no Lucide. Tentando: ${iconName}`)
    // Retorna um ícone padrão se não encontrar
    return LucideIcons.AlertCircle
  }

  return Icon
})

const computedSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size
  }
  // Se for string, tenta converter para número removendo 'px'
  if (typeof props.size === 'string') {
    const num = parseInt(props.size.replace('px', ''))
    return isNaN(num) ? 24 : num
  }
  return 24
})
</script>
