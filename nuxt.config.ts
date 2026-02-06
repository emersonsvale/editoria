// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  runtimeConfig: {
    // Variáveis PRIVADAS (apenas servidor) - NÃO expostas ao cliente
    geminiApiKey: '',
    /** Modelo para chat/texto (ex: gemini-2.0-flash, gemini-2.5-flash) */
    geminiChatModel: 'gemini-2.0-flash',
    /** Modelo para geração de imagens (ex: gemini-2.5-flash-image, gemini-3-pro-image-preview) */
    geminiImageModel: 'gemini-2.5-flash-image',
    creditsPerImage: 1,
    unsplashAccessKey: '',
    supabaseServiceRoleKey: '',
    
    public: {
      // Variáveis públicas (expostas ao cliente)
      appName: 'EditorIA',
      supabaseUrl: '',
      supabaseAnonKey: ''
    }
  }
})