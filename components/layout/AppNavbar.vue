<template>
  <nav class="fixed top-0 left-0 right-0 h-16 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-black/80 backdrop-blur-md z-50 px-6 flex items-center justify-between">
    <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span class="text-white text-xs font-bold">E</span>
      </div>
      <span class="font-bold text-xl tracking-tight">EditorIA</span>
    </NuxtLink>
    <div class="flex items-center gap-6">
      <div class="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
        <span>{{ language }}</span>
        <Icon name="expand_more" :size="18" />
      </div>
      <Icon name="notifications" :size="20" class="text-slate-400 hover:text-primary cursor-pointer" />
      <button class="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 hover:opacity-90 transition-opacity">
        <span>{{ upgradeText }}</span>
        <Icon name="bolt" :size="16" />
        <span v-if="upgradeBadge" class="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{{ upgradeBadge }}</span>
      </button>
      <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
        <img :alt="userName" :src="userAvatar" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
interface Props {
  language?: string
  upgradeText?: string
  upgradeBadge?: string | number
  userName?: string
  userAvatar?: string
}

withDefaults(defineProps<Props>(), {
  language: 'Português',
  upgradeText: 'Fazer upgrade',
  upgradeBadge: '50',
  userName: 'User profile',
  userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1y9jG__BCUpnwfvVeyV54zhsWET3r24juolo3peHd5qZfgtJNPdi5z9LCEOjwnSJ6IiqocSDNV8SmMjpwc53W1Wzojq-FLEVi_qehe-8wj9NkusXYYaCnYX3Cud8mxHstCo3bsKDZo6rjub6JuZ896d7_1Tv8FJoLn7GNLmpKc0OqR7XE2PKw2CcSs2ZhDqbRI5hr5MzwpQcavmkqw6ufgutQMPg2DOnO0kNlOtW-A3upJ3li06loDx2UjPsedwhiPPJATQC21a8'
})
</script>
