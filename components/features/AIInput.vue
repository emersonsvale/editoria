<template>
  <div class="max-w-2xl mx-auto relative group">
    <TextArea
      :model-value="modelValue"
      :placeholder="placeholder"
      :show-actions="true"
      :show-badge="showBadge"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <template #actions-left>
        <button class="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg">
          <Icon name="attach_file" :size="20" />
        </button>
      </template>
      <template #actions-right>
        <Icon name="lightbulb" :size="20" class="text-slate-300 dark:text-slate-700" />
        <Icon name="language" :size="20" class="text-slate-300 dark:text-slate-700" />
        <Icon name="dashboard" :size="20" class="text-slate-300 dark:text-slate-700" />
        <button 
          class="bg-primary text-white p-2 rounded-xl flex items-center justify-center ml-2"
          @click="$emit('submit')"
        >
          <Icon name="north" />
        </button>
      </template>
    </TextArea>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string
  placeholder?: string
  showBadge?: boolean
}

withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Peça ao EditorIA para criar um logotipo de tirar o fôlego...',
  showBadge: true
})

defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()
</script>
