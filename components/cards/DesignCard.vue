<template>
  <div class="masonry-item group relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
    <img 
      :alt="title" 
      :src="image" 
      class="w-full object-cover"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end text-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div 
            v-if="author.avatar"
            class="w-6 h-6 rounded-full bg-cover"
            :style="`background-image: url(${author.avatar})`"
          />
          <div 
            v-else
            :class="['w-6 h-6 rounded-full', author.avatarColor || 'bg-blue-500']"
          >
            <span v-if="author.initials" class="text-[10px] flex items-center justify-center h-full font-bold">
              {{ author.initials }}
            </span>
          </div>
          <span class="text-xs font-bold">{{ author.name }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="stats.views" class="flex items-center gap-1 text-[10px]">
            <Icon name="visibility" :size="14" /> {{ stats.views }}
          </span>
          <span v-if="stats.likes" class="flex items-center gap-1 text-[10px]">
            <Icon name="favorite" :size="14" /> {{ stats.likes }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Author {
  name: string
  avatar?: string
  avatarColor?: string
  initials?: string
}

interface Stats {
  views?: string | number
  likes?: string | number
}

interface Props {
  title: string
  image: string
  author: Author
  stats?: Stats
}

withDefaults(defineProps<Props>(), {
  stats: () => ({})
})
</script>
