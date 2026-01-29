<template>
  <div class="relative group">
    <div :class="containerClasses">
      <textarea
        :value="modelValue"
        :placeholder="placeholder"
        :rows="rows"
        :class="textareaClasses"
        @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <div v-if="showActions" class="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 dark:border-slate-800/50">
        <div class="flex items-center gap-2">
          <slot name="actions-left" />
        </div>
        <div class="flex items-center gap-2">
          <slot name="actions-right" />
        </div>
      </div>
    </div>
    <div v-if="showBadge" class="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
      <Icon name="check" :size="10" class="text-white" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  rows?: number
  showActions?: boolean
  showBadge?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Type something...',
  rows: 3,
  showActions: false,
  showBadge: false
})

defineEmits<{
  'update:modelValue': [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const containerClasses = computed(() => {
  return 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none focus-within:ring-2 ring-primary/10 transition-all'
})

const textareaClasses = computed(() => {
  return 'w-full bg-transparent border-none focus:ring-0 text-slate-700 dark:text-slate-200 resize-none'
})
</script>
