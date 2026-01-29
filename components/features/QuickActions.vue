<template>
  <div class="flex flex-wrap justify-center gap-3">
    <Button
      v-for="action in actions"
      :key="action.id"
      :variant="action.active ? 'accent' : 'outline'"
      :icon="action.icon"
      :icon-size="16"
      @click="$emit('action-click', action)"
    >
      {{ action.label }}
    </Button>
  </div>
</template>

<script setup lang="ts">
interface QuickAction {
  id: string
  label: string
  icon: string
  active?: boolean
}

interface Props {
  actions: QuickAction[]
}

defineProps<Props>()

defineEmits<{
  'action-click': [action: QuickAction]
}>()
</script>
