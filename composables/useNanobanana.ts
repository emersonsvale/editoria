/**
 * Composable para geração de imagens com IA (Nano Banana / Gemini)
 * 
 * Este composable chama a API interna do servidor (/api/generate)
 * que por sua vez chama o Gemini com a API Key privada.
 * 
 * O usuário não tem acesso à API Key - modelo SaaS com créditos.
 */

export type ImageSize = '1:1' | '9:16' | '16:9' | '3:4' | '4:3' | '3:2' | '2:3' | '5:4' | '4:5' | '21:9'

export interface GeneratedImage {
  url: string
  mimeType: string
}

export interface GenerateResponse {
  success: boolean
  images: GeneratedImage[]
  creditsUsed: number
}

export interface ChatResponse {
  success: boolean
  text: string
  images: GeneratedImage[]
  creditsUsed: number
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  images?: string[]
}

export interface UserCredits {
  credits: number
  used: number
  total: number
}

export const useNanobanana = () => {
  // Estado
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Gera imagens usando a API interna
   */
  const generateImage = async (options: {
    prompt: string
    aspectRatio?: ImageSize
    inputImages?: string[]
  }): Promise<GeneratedImage[]> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<GenerateResponse>('/api/generate', {
        method: 'POST',
        body: {
          prompt: options.prompt,
          aspectRatio: options.aspectRatio || '1:1',
          inputImages: options.inputImages
        }
      })

      if (!response.success || !response.images.length) {
        throw new Error('Nenhuma imagem foi gerada')
      }

      return response.images

    } catch (err: any) {
      // Trata erros da API
      let errorMessage = 'Erro ao gerar imagem'

      if (err.data?.statusMessage) {
        errorMessage = err.data.statusMessage
      } else if (err.statusMessage) {
        errorMessage = err.statusMessage
      } else if (err.message) {
        errorMessage = err.message
      }

      // Mensagens amigáveis para erros comuns
      if (err.statusCode === 402) {
        errorMessage = 'Créditos insuficientes. Adquira mais créditos para continuar.'
      } else if (err.statusCode === 401) {
        errorMessage = 'Faça login para gerar imagens.'
      }

      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Gera imagem a partir de texto (text-to-image)
   */
  const textToImage = async (
    prompt: string, 
    options?: { aspectRatio?: ImageSize }
  ): Promise<GeneratedImage[]> => {
    return generateImage({
      prompt,
      aspectRatio: options?.aspectRatio
    })
  }

  /**
   * Edita uma imagem existente com base em um prompt
   */
  const editImage = async (
    prompt: string,
    inputImages: string[],
    options?: { aspectRatio?: ImageSize }
  ): Promise<GeneratedImage[]> => {
    return generateImage({
      prompt,
      inputImages,
      aspectRatio: options?.aspectRatio
    })
  }

  /**
   * Gera variações de uma imagem
   */
  const generateVariation = async (
    imageUrl: string,
    prompt?: string,
    options?: { aspectRatio?: ImageSize }
  ): Promise<GeneratedImage[]> => {
    const variationPrompt = prompt || 'Create a variation of this image with similar style and composition'
    
    return generateImage({
      prompt: variationPrompt,
      inputImages: [imageUrl],
      aspectRatio: options?.aspectRatio
    })
  }

  /**
   * Chat conversacional com a IA
   * A IA pode responder com texto, imagens ou ambos
   */
  const chat = async (options: {
    message: string
    history?: ChatMessage[]
    attachedImages?: string[]
    imageSettings?: {
      aspectRatio?: ImageSize
    }
  }): Promise<ChatResponse> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await $fetch<ChatResponse>('/api/chat', {
        method: 'POST',
        body: {
          message: options.message,
          history: options.history,
          attachedImages: options.attachedImages,
          imageSettings: options.imageSettings
        }
      })

      if (!response.success) {
        throw new Error('Falha ao processar mensagem')
      }

      return response

    } catch (err: any) {
      let errorMessage = 'Erro ao processar mensagem'

      if (err.data?.statusMessage) {
        errorMessage = err.data.statusMessage
      } else if (err.statusMessage) {
        errorMessage = err.statusMessage
      } else if (err.message) {
        errorMessage = err.message
      }

      error.value = errorMessage
      throw new Error(errorMessage)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Busca os créditos do usuário atual
   */
  const getCredits = async (): Promise<UserCredits> => {
    try {
      return await $fetch<UserCredits>('/api/credits')
    } catch (err) {
      console.error('Erro ao buscar créditos:', err)
      return { credits: 0, used: 0, total: 0 }
    }
  }

  return {
    // Estado
    isLoading: readonly(isLoading),
    error: readonly(error),

    // Métodos
    generateImage,
    textToImage,
    editImage,
    generateVariation,
    chat,
    getCredits
  }
}
