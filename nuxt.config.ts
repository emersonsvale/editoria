// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  runtimeConfig: {
    // Variáveis PRIVADAS (apenas servidor) - NÃO expostas ao cliente
    geminiApiKey: '',
    creditsPerImage: 1,
    unsplashAccessKey: '',
    
    public: {
      // Variáveis públicas (expostas ao cliente)
      appName: 'EditorIA'
    }
  }
})