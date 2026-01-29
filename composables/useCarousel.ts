/**
 * Composable para criação de carrosséis para redes sociais
 */

export type SocialNetwork = 'instagram' | 'linkedin'
export type CarouselTone = 'professional' | 'casual' | 'educational' | 'inspirational'

export interface CarouselSlide {
  id: string
  title: string
  content: string
  imagePrompt: string
  image?: string // URL da imagem gerada (base64)
  isGeneratingImage?: boolean
}

export interface Carousel {
  id: string
  topic: string
  socialNetwork: SocialNetwork
  tone: CarouselTone
  slides: CarouselSlide[]
  caption: string
  hashtags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface InspirationImage {
  base64?: string
  mimeType: string
}

export interface CarouselGenerateOptions {
  topic: string
  socialNetwork: SocialNetwork
  numberOfSlides?: number
  tone?: CarouselTone
  inspirationImages?: InspirationImage[]
}

export const useCarousel = () => {
  // Estado global usando useState do Nuxt para persistir entre navegações
  const isLoading = useState('carousel-loading', () => false)
  const isGeneratingImages = useState('carousel-generating-images', () => false)
  const error = useState<string | null>('carousel-error', () => null)
  const currentCarousel = useState<Carousel | null>('carousel-current', () => null)
  const generationProgress = useState('carousel-progress', () => 0)

  // Armazenar as imagens de inspiração para usar na geração de imagens
  const inspirationImagesStore = useState<InspirationImage[]>('carousel-inspiration-images', () => [])

  /**
   * Gera o conteúdo do carrossel (textos, hashtags, etc)
   */
  const generateCarouselContent = async (options: CarouselGenerateOptions): Promise<Carousel> => {
    isLoading.value = true
    error.value = null
    generationProgress.value = 0

    // Armazenar imagens de inspiração para uso posterior
    inspirationImagesStore.value = options.inspirationImages || []

    try {
      const response = await $fetch<{
        success: boolean
        content: {
          slides: Array<{ title: string; content: string; imagePrompt: string }>
          caption: string
          hashtags: string[]
        }
        socialNetwork: SocialNetwork
        topic: string
      }>('/api/carousel', {
        method: 'POST',
        body: {
          topic: options.topic,
          socialNetwork: options.socialNetwork,
          numberOfSlides: options.numberOfSlides || 5,
          tone: options.tone || 'professional',
          inspirationImages: options.inspirationImages
        }
      })

      if (!response.success || !response.content) {
        throw new Error('Falha ao gerar conteúdo do carrossel')
      }

      // Cria o carrossel com IDs únicos para cada slide
      const carousel: Carousel = {
        id: `carousel-${Date.now()}`,
        topic: options.topic,
        socialNetwork: options.socialNetwork,
        tone: options.tone || 'professional',
        slides: response.content.slides.map((slide, index) => ({
          id: `slide-${Date.now()}-${index}`,
          title: slide.title,
          content: slide.content,
          imagePrompt: slide.imagePrompt
        })),
        caption: response.content.caption,
        hashtags: response.content.hashtags,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      currentCarousel.value = carousel
      generationProgress.value = 100

      return carousel

    } catch (err: any) {
      let errorMessage = 'Erro ao gerar carrossel'

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
   * Gera a imagem de um slide específico
   */
  const generateSlideImage = async (slideIndex: number): Promise<string> => {
    if (!currentCarousel.value) {
      throw new Error('Nenhum carrossel ativo')
    }

    const slide = currentCarousel.value.slides[slideIndex]
    if (!slide) {
      throw new Error('Slide não encontrado')
    }

    // Marca o slide como gerando
    slide.isGeneratingImage = true

    try {
      const response = await $fetch<{
        success: boolean
        image: { url: string; mimeType: string }
        slideIndex: number
        creditsUsed: number
      }>('/api/carousel-image', {
        method: 'POST',
        body: {
          imagePrompt: slide.imagePrompt,
          slideTitle: slide.title,
          socialNetwork: currentCarousel.value.socialNetwork,
          slideIndex,
          inspirationImages: inspirationImagesStore.value
        }
      })

      if (!response.success || !response.image) {
        throw new Error('Falha ao gerar imagem')
      }

      // Atualiza o slide com a imagem
      slide.image = response.image.url
      currentCarousel.value.updatedAt = new Date()

      return response.image.url

    } catch (err: any) {
      let errorMessage = 'Erro ao gerar imagem do slide'

      if (err.data?.statusMessage) {
        errorMessage = err.data.statusMessage
      } else if (err.message) {
        errorMessage = err.message
      }

      throw new Error(errorMessage)
    } finally {
      slide.isGeneratingImage = false
    }
  }

  /**
   * Gera todas as imagens do carrossel
   */
  const generateAllImages = async (options?: { sequential?: boolean }): Promise<void> => {
    if (!currentCarousel.value) {
      throw new Error('Nenhum carrossel ativo')
    }

    isGeneratingImages.value = true
    generationProgress.value = 0

    const slides = currentCarousel.value.slides
    const total = slides.length

    try {
      if (options?.sequential) {
        // Gera sequencialmente (mais lento, mas evita rate limiting)
        for (let i = 0; i < slides.length; i++) {
          if (!slides[i].image) {
            await generateSlideImage(i)
            generationProgress.value = Math.round(((i + 1) / total) * 100)
            // Pequeno delay entre requisições para evitar rate limiting
            if (i < slides.length - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
        }
      } else {
        // Gera em paralelo (mais rápido, mas pode dar rate limiting)
        // Limita a 2 requisições simultâneas
        const batchSize = 2
        for (let i = 0; i < slides.length; i += batchSize) {
          const batch = slides.slice(i, i + batchSize)
          const promises = batch.map((slide, batchIndex) => {
            if (!slide.image) {
              return generateSlideImage(i + batchIndex)
            }
            return Promise.resolve(slide.image)
          })
          await Promise.all(promises)
          generationProgress.value = Math.round(((i + batch.length) / total) * 100)
        }
      }
    } finally {
      isGeneratingImages.value = false
      generationProgress.value = 100
    }
  }

  /**
   * Atualiza o conteúdo de um slide
   */
  const updateSlide = (slideIndex: number, updates: Partial<Pick<CarouselSlide, 'title' | 'content' | 'imagePrompt'>>) => {
    if (!currentCarousel.value) return

    const slide = currentCarousel.value.slides[slideIndex]
    if (slide) {
      if (updates.title !== undefined) slide.title = updates.title
      if (updates.content !== undefined) slide.content = updates.content
      if (updates.imagePrompt !== undefined) slide.imagePrompt = updates.imagePrompt
      currentCarousel.value.updatedAt = new Date()
    }
  }

  /**
   * Atualiza a caption do carrossel
   */
  const updateCaption = (caption: string) => {
    if (currentCarousel.value) {
      currentCarousel.value.caption = caption
      currentCarousel.value.updatedAt = new Date()
    }
  }

  /**
   * Atualiza as hashtags do carrossel
   */
  const updateHashtags = (hashtags: string[]) => {
    if (currentCarousel.value) {
      currentCarousel.value.hashtags = hashtags
      currentCarousel.value.updatedAt = new Date()
    }
  }

  /**
   * Adiciona um novo slide
   */
  const addSlide = (afterIndex?: number) => {
    if (!currentCarousel.value) return

    const newSlide: CarouselSlide = {
      id: `slide-${Date.now()}`,
      title: 'Novo slide',
      content: 'Conteúdo do slide',
      imagePrompt: 'A clean, modern background image'
    }

    const index = afterIndex !== undefined ? afterIndex + 1 : currentCarousel.value.slides.length
    currentCarousel.value.slides.splice(index, 0, newSlide)
    currentCarousel.value.updatedAt = new Date()
  }

  /**
   * Remove um slide
   */
  const removeSlide = (slideIndex: number) => {
    if (!currentCarousel.value || currentCarousel.value.slides.length <= 1) return

    currentCarousel.value.slides.splice(slideIndex, 1)
    currentCarousel.value.updatedAt = new Date()
  }

  /**
   * Reordena os slides
   */
  const reorderSlides = (fromIndex: number, toIndex: number) => {
    if (!currentCarousel.value) return

    const slides = currentCarousel.value.slides
    const [movedSlide] = slides.splice(fromIndex, 1)
    slides.splice(toIndex, 0, movedSlide)
    currentCarousel.value.updatedAt = new Date()
  }

  /**
   * Regenera a imagem de um slide
   */
  const regenerateSlideImage = async (slideIndex: number): Promise<string> => {
    if (!currentCarousel.value) {
      throw new Error('Nenhum carrossel ativo')
    }

    // Remove a imagem atual antes de regenerar
    const slide = currentCarousel.value.slides[slideIndex]
    if (slide) {
      slide.image = undefined
    }

    return generateSlideImage(slideIndex)
  }

  /**
   * Exporta o carrossel como objeto
   */
  const exportCarousel = (): Carousel | null => {
    return currentCarousel.value
  }

  /**
   * Limpa o carrossel atual
   */
  const clearCarousel = () => {
    currentCarousel.value = null
    error.value = null
    generationProgress.value = 0
  }

  /**
   * Copia a caption e hashtags para a área de transferência
   */
  const copyCaptionToClipboard = async (): Promise<void> => {
    if (!currentCarousel.value) return

    const { caption, hashtags } = currentCarousel.value
    const hashtagsText = hashtags.map(h => `#${h}`).join(' ')
    const fullText = `${caption}\n\n${hashtagsText}`

    await navigator.clipboard.writeText(fullText)
  }

  return {
    // Estado (reativo)
    isLoading,
    isGeneratingImages,
    error,
    currentCarousel,
    generationProgress,

    // Métodos
    generateCarouselContent,
    generateSlideImage,
    generateAllImages,
    updateSlide,
    updateCaption,
    updateHashtags,
    addSlide,
    removeSlide,
    reorderSlides,
    regenerateSlideImage,
    exportCarousel,
    clearCarousel,
    copyCaptionToClipboard
  }
}
