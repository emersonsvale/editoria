<template>
  <div class="relative w-full">
    <Icon 
      name="search" 
      :size="18" 
      class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
    />
    <input
      :value="modelValue"
      :placeholder="placeholder"
      :type="type"
      :class="inputClasses"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  type?: string
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search...',
  type: 'text',
  size: 'md'
})

defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputClasses = computed(() => {
  const base = 'w-full pl-10 pr-4 bg-background-light dark:bg-slate-800 border-none rounded-lg focus:ring-2 focus:ring-primary transition-all'
  const sizes = {
    sm: 'py-1.5 text-sm',
    md: 'py-2 text-sm',
    lg: 'py-3 text-base'
  }
  return `${base} ${sizes[props.size]}`
})
</script>
