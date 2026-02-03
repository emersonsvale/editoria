<template>
  <div v-if="authReady" class="min-h-screen">
    <NuxtPage />
  </div>
  <div
    v-else
    class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark"
  >
    <p class="text-slate-500 dark:text-slate-400">Carregando...</p>
  </div>
</template>

<script setup lang="ts">
import { CREATION_PATHS } from '~/composables/useRequireAuth'

let auth: ReturnType<typeof useSupabaseAuth> | null = null
try {
  auth = useSupabaseAuth()
} catch {
  auth = null
}

const route = useRoute()
const authReady = ref(false)
const isCreationPath = computed(() =>
  CREATION_PATHS.some((p) => route.path === p || route.path.startsWith(p + '/'))
)

function resolveAuth() {
  if (!isCreationPath.value) {
    authReady.value = true
    return
  }
  if (!auth) {
    navigateTo({ path: '/', query: { openAuth: '1' } })
    return
  }
  if (!auth.loading.value) {
    if (!auth.isAuthenticated.value) {
      navigateTo({ path: '/', query: { openAuth: '1' } })
      return
    }
    authReady.value = true
    return
  }
  const unwatch = watch(
    () => auth!.loading.value,
    (loading) => {
      if (!loading) {
        if (!auth!.isAuthenticated.value) {
          navigateTo({ path: '/', query: { openAuth: '1' } })
          return
        }
        authReady.value = true
        unwatch()
      }
    },
    { immediate: true }
  )
}

onMounted(() => {
  resolveAuth()
})

watch(
  () => route.path,
  () => {
    if (!isCreationPath.value) {
      authReady.value = true
      return
    }
    authReady.value = false
    resolveAuth()
  }
)
</script>
