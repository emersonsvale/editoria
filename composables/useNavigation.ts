import { computed } from 'vue'
import { useRoute } from 'vue-router'

export interface NavigationItem {
  name: string
  icon: string
  path: string
  label?: string
}

export const useNavigation = () => {
  const route = useRoute()

  const navigationItems: NavigationItem[] = [
    { name: 'home', icon: 'home', path: '/', label: 'Home' },
    { name: 'media', icon: 'folder', path: '/media-manager', label: 'Media Manager' },
    { name: 'brand-kit', icon: 'auto_awesome', path: '/brand-kit', label: 'Brand Kit' },
    { name: 'editor', icon: 'edit', path: '/editor', label: 'Editor' },
    { name: 'export', icon: 'download', path: '/batch-export', label: 'Batch Export' }
  ]

  const isActive = (path: string) => {
    return route.path === path
  }

  const getActiveItem = computed(() => {
    return navigationItems.find(item => isActive(item.path)) || navigationItems[0]
  })

  return {
    navigationItems,
    isActive,
    getActiveItem
  }
}
