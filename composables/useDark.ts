export const useDark = () => {
  const isDark = useState('dark', () => false)

  // Inicializa o estado no servidor também
  if (process.server) {
    return isDark
  }

  // No cliente, configura o tema
  const html = document.documentElement
  
  // Verifica o tema salvo ou preferência do sistema
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      isDark.value = true
      html.classList.add('dark')
    } else if (savedTheme === 'light') {
      isDark.value = false
      html.classList.remove('dark')
    } else {
      // Usa preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
      if (prefersDark) {
        html.classList.add('dark')
      } else {
        html.classList.remove('dark')
      }
    }
  })

  // Observa mudanças no estado e atualiza o DOM
  watch(isDark, (value) => {
    if (value) {
      html.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      html.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, { immediate: false })

  return isDark
}
