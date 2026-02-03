<template>
  <div class="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
    <div class="text-center">
      <p class="text-slate-600 dark:text-slate-400">Redirecionando...</p>
      <p v-if="error" class="mt-2 text-sm text-red-600 dark:text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Callback de auth Supabase (confirmação de e-mail, recuperação de senha, etc.)
 * Supabase redireciona aqui com hash #access_token=...
 */
const route = useRoute()
const router = useRouter()
const error = ref('')

onMounted(async () => {
  try {
    const auth = useSupabaseAuth()
    await auth.supabase.auth.getSession()
    const next = (route.query.next as string) || '/'
    await router.replace(next)
  } catch (e) {
    error.value = 'Não foi possível completar a autenticação.'
  }
})
</script>
