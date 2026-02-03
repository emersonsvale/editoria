<template>
  <nav class="fixed top-0 left-0 right-0 h-16 border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md z-50 px-6 flex items-center justify-between">
    <NuxtLink to="/" class="flex items-center gap-2 hover:opacity-90 transition-opacity">
      <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
        <span class="text-white text-xs font-bold">E</span>
      </div>
      <span class="font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100">EditorIA</span>
    </NuxtLink>

    <div class="flex items-center gap-4">
      <NuxtLink
        to="/editor"
        class="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
        @click="(e) => { if (requireAuth?.shouldInterceptLink('/editor')) { e.preventDefault(); $emit('open-auth') } }"
      >
        <Icon name="auto_awesome" :size="18" />
        Criar
      </NuxtLink>

      <!-- Logado: créditos + avatar + menu -->
      <template v-if="auth?.isAuthenticated.value">
        <button
          type="button"
          class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors cursor-pointer"
          title="Seus créditos"
          @click="showCreditsModal = true"
        >
          <Icon name="bolt" :size="16" class="text-primary" />
          <span class="text-sm font-semibold text-primary">{{ credits.credits }}</span>
          <span class="text-xs text-slate-500 dark:text-slate-400">créditos</span>
        </button>

        <div class="relative" ref="menuRef">
          <button
            type="button"
            class="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-haspopup="true"
            :aria-expanded="menuOpen"
            @click="menuOpen = !menuOpen"
          >
            <div
              v-if="userAvatar"
              class="w-9 h-9 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-600 ring-2 ring-transparent hover:ring-primary/30"
            >
              <img :alt="userName" :src="userAvatar" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold bg-primary"
            >
              {{ userInitials }}
            </div>
            <span class="hidden sm:block max-w-[120px] truncate text-sm font-medium text-slate-700 dark:text-slate-300">
              {{ userName }}
            </span>
            <Icon name="expand_more" :size="18" class="text-slate-500 dark:text-slate-400" />
          </button>

          <Transition name="dropdown">
            <div
              v-if="menuOpen"
              class="absolute right-0 top-full mt-2 w-56 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50"
              role="menu"
            >
              <div class="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{{ userName }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400 truncate">{{ userEmail }}</p>
                <button
                  type="button"
                  class="text-xs text-primary mt-1 font-medium hover:underline text-left w-full"
                  @click="openCreditsAndCloseMenu"
                >
                  {{ credits.credits }} créditos — Ver detalhes
                </button>
              </div>
              <NuxtLink
                to="/editor"
                class="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                role="menuitem"
                @click="menuOpen = false"
              >
                <Icon name="auto_awesome" :size="16" />
                Criar imagem
              </NuxtLink>
              <button
                type="button"
                class="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                role="menuitem"
                @click="handleSignOut"
              >
                <Icon name="logout" :size="16" />
                Sair
              </button>
            </div>
          </Transition>
        </div>
      </template>

      <!-- Não logado: botão Entrar -->
      <template v-else>
        <button
          type="button"
          class="px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white shadow-lg shadow-primary/25 hover:opacity-90 hover:scale-[1.02] transition-all flex items-center gap-2"
          @click="$emit('open-auth')"
        >
          <Icon name="person" :size="18" />
          Entrar
        </button>
      </template>
    </div>

    <!-- Modal de créditos (reutilizado na home e no editor) -->
    <CreditsModal
      :is-open="showCreditsModal"
      :credits="credits"
      @close="showCreditsModal = false"
    />
  </nav>
</template>

<script setup lang="ts">
import CreditsModal from '~/components/credits/CreditsModal.vue'

defineEmits<{
  (e: 'open-auth'): void
}>()

const showCreditsModal = ref(false)

function openCreditsAndCloseMenu() {
  menuOpen.value = false
  showCreditsModal.value = true
}

let auth: ReturnType<typeof useSupabaseAuth> | null = null
let requireAuth: ReturnType<typeof useRequireAuth> | null = null
try {
  auth = useSupabaseAuth()
  requireAuth = useRequireAuth()
} catch {
  auth = null
  requireAuth = null
}

const chatStore = useChatStore()
const nanobanana = useNanobanana()
const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const credits = computed(() => chatStore.credits)

const user = computed(() => auth?.user.value ?? null)
const userName = computed(() => {
  const u = user.value
  if (!u) return 'Usuário'
  const meta = u.user_metadata
  if (meta?.display_name) return meta.display_name
  if (meta?.name) return meta.name
  if (u.email) return u.email.split('@')[0]
  return 'Usuário'
})
const userEmail = computed(() => user.value?.email ?? '')
const userInitials = computed(() => {
  const name = userName.value
  return name
    .split(/\s+/)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
})
const userAvatar = computed(() => {
  const u = user.value
  return u?.user_metadata?.avatar_url ?? u?.user_metadata?.picture ?? null
})

async function fetchCredits() {
  if (!auth?.isAuthenticated.value) return
  try {
    const data = await nanobanana.getCredits()
    chatStore.setCredits(data)
  } catch {
    // ignora erro (ex.: sem token)
  }
}

function handleSignOut() {
  menuOpen.value = false
  auth?.signOut()
}

function onDocumentClick(e: MouseEvent) {
  if (menuRef.value && !menuRef.value.contains(e.target as Node)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  if (auth?.isAuthenticated.value) fetchCredits()
  if (typeof document !== 'undefined') {
    document.addEventListener('click', onDocumentClick)
  }
})

onUnmounted(() => {
  if (typeof document !== 'undefined') {
    document.removeEventListener('click', onDocumentClick)
  }
})

watch(() => auth?.isAuthenticated.value, (isAuth) => {
  if (isAuth) fetchCredits()
})
</script>

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
