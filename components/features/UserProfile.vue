<template>
  <div class="flex items-center gap-3 px-2">
    <div 
      v-if="avatar"
      class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700"
    >
      <img :alt="name" :src="avatar" />
    </div>
    <div 
      v-else
      :class="['w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold', avatarColor || 'bg-primary']"
    >
      {{ computedInitials }}
    </div>
    <div class="flex-1 overflow-hidden">
      <p class="text-sm font-bold truncate">{{ name }}</p>
      <p v-if="plan" class="text-[10px] text-slate-500 dark:text-slate-400 truncate">{{ plan }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  name: string
  avatar?: string
  avatarColor?: string
  initials?: string
  plan?: string
}

const props = withDefaults(defineProps<Props>(), {
  initials: 'JD'
})

const computedInitials = computed(() => {
  if (props.initials) return props.initials
  return props.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>
