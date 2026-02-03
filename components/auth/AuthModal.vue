<template>
  <Teleport to="body">
    <Transition name="auth-modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="$emit('close')"
      >
        <!-- Overlay -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />

        <!-- Modal flutuante -->
        <div
          class="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
          role="dialog"
          aria-modal="true"
          :aria-label="modalTitle"
        >
          <!-- Header com abas -->
          <div class="flex border-b border-slate-200 dark:border-slate-700">
            <button
              type="button"
              class="flex-1 py-4 text-sm font-semibold transition-colors"
              :class="view === 'login'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-500 bg-violet-50/50 dark:bg-violet-900/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
              @click="view = 'login'"
            >
              Entrar
            </button>
            <button
              type="button"
              class="flex-1 py-4 text-sm font-semibold transition-colors"
              :class="view === 'cadastro'
                ? 'text-violet-600 dark:text-violet-400 border-b-2 border-violet-500 bg-violet-50/50 dark:bg-violet-900/10'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'"
              @click="view = 'cadastro'"
            >
              Cadastro
            </button>
            <button
              type="button"
              class="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Fechar"
              @click="$emit('close')"
            >
              <Icon name="close" :size="20" />
            </button>
          </div>

          <!-- Conteúdo -->
          <div class="p-6">
            <!-- Login -->
            <form
              v-if="view === 'login'"
              class="space-y-4"
              @submit.prevent="handleLogin"
            >
              <div>
                <label for="login-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-mail
                </label>
                <input
                  id="login-email"
                  v-model="loginForm.email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label for="login-senha" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Senha
                </label>
                <input
                  id="login-senha"
                  v-model="loginForm.senha"
                  :type="showLoginSenha ? 'text' : 'password'"
                  required
                  placeholder="••••••••"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  class="mt-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"
                  @click="showLoginSenha = !showLoginSenha"
                >
                  {{ showLoginSenha ? 'Ocultar' : 'Mostrar' }} senha
                </button>
              </div>
              <button
                type="button"
                class="text-sm text-violet-600 dark:text-violet-400 hover:underline"
                @click="view = 'recuperar'"
              >
                Esqueci minha senha
              </button>
              <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
              <button
                type="submit"
                :disabled="authLoading"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {{ authLoading ? 'Entrando...' : 'Entrar' }}
              </button>
            </form>

            <!-- Cadastro -->
            <form
              v-if="view === 'cadastro'"
              class="space-y-4"
              @submit.prevent="handleCadastro"
            >
              <div>
                <label for="cadastro-nome" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nome
                </label>
                <input
                  id="cadastro-nome"
                  v-model="cadastroForm.nome"
                  type="text"
                  required
                  placeholder="Seu nome"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label for="cadastro-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-mail
                </label>
                <input
                  id="cadastro-email"
                  v-model="cadastroForm.email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
              </div>
              <div>
                <label for="cadastro-senha" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Senha
                </label>
                <input
                  id="cadastro-senha"
                  v-model="cadastroForm.senha"
                  :type="showCadastroSenha ? 'text' : 'password'"
                  required
                  minlength="6"
                  placeholder="Mínimo 6 caracteres"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
                <button
                  type="button"
                  class="mt-1 text-xs text-violet-600 dark:text-violet-400 hover:underline"
                  @click="showCadastroSenha = !showCadastroSenha"
                >
                  {{ showCadastroSenha ? 'Ocultar' : 'Mostrar' }} senha
                </button>
              </div>
              <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
              <button
                type="submit"
                :disabled="authLoading"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {{ authLoading ? 'Criando conta...' : 'Criar conta' }}
              </button>
            </form>

            <!-- Recuperação de senha -->
            <form
              v-if="view === 'recuperar'"
              class="space-y-4"
              @submit.prevent="handleRecuperar"
            >
              <p class="text-sm text-slate-600 dark:text-slate-400">
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
              </p>
              <div>
                <label for="recuperar-email" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  E-mail
                </label>
                <input
                  id="recuperar-email"
                  v-model="recuperarForm.email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  class="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-colors"
                />
              </div>
              <button
                type="button"
                class="block text-sm text-slate-500 dark:text-slate-400 hover:underline mb-2"
                @click="view = 'login'"
              >
                Voltar para o login
              </button>
              <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400">{{ errorMessage }}</p>
              <button
                type="submit"
                :disabled="authLoading"
                class="w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold hover:opacity-95 transition-opacity disabled:opacity-50"
              >
                {{ authLoading ? 'Enviando...' : 'Enviar link' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
export type AuthView = 'login' | 'cadastro' | 'recuperar'

interface Props {
  isOpen: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const auth = useSupabaseAuth()
const view = ref<AuthView>('login')
const showLoginSenha = ref(false)
const showCadastroSenha = ref(false)
const errorMessage = ref('')
const authLoading = ref(false)

const loginForm = ref({ email: '', senha: '' })
const cadastroForm = ref({ nome: '', email: '', senha: '' })
const recuperarForm = ref({ email: '' })

const modalTitle = computed(() => {
  const t: Record<AuthView, string> = {
    login: 'Entrar na sua conta',
    cadastro: 'Criar conta',
    recuperar: 'Recuperar senha'
  }
  return t[view.value]
})

// Reset view and error when modal opens
watch(() => props.isOpen, (open) => {
  if (open) {
    view.value = 'login'
    errorMessage.value = ''
    loginForm.value = { email: '', senha: '' }
    cadastroForm.value = { nome: '', email: '', senha: '' }
    recuperarForm.value = { email: '' }
  }
})

function handleLogin() {
  errorMessage.value = ''
  authLoading.value = true
  auth.signIn(loginForm.value.email, loginForm.value.senha).then(({ error }) => {
    authLoading.value = false
    if (error) {
      errorMessage.value = error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message
      return
    }
    emit('close')
  })
}

function handleCadastro() {
  errorMessage.value = ''
  authLoading.value = true
  auth.signUp(cadastroForm.value.email, cadastroForm.value.senha, {
    displayName: cadastroForm.value.nome || undefined
  }).then(({ error }) => {
    authLoading.value = false
    if (error) {
      errorMessage.value = error.message === 'User already registered' ? 'Este e-mail já está cadastrado.' : error.message
      return
    }
    emit('close')
  })
}

function handleRecuperar() {
  errorMessage.value = ''
  authLoading.value = true
  auth.resetPassword(recuperarForm.value.email).then(({ error }) => {
    authLoading.value = false
    if (error) {
      errorMessage.value = error.message
      return
    }
    errorMessage.value = 'Link enviado! Verifique seu e-mail.'
  })
}
</script>

<style scoped>
.auth-modal-enter-active,
.auth-modal-leave-active {
  transition: opacity 0.25s ease;
}

.auth-modal-enter-from,
.auth-modal-leave-to {
  opacity: 0;
}

.auth-modal-enter-active .relative,
.auth-modal-leave-active .relative {
  transition: transform 0.25s ease;
}

.auth-modal-enter-from .relative,
.auth-modal-leave-to .relative {
  transform: scale(0.95) translateY(-8px);
}
</style>
