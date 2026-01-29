/**
 * API Endpoint: POST /api/carousel-image
 * Gera uma imagem para um slide do carrossel usando o Gemini
 */

interface InspirationImage {
  base64?: string
  mimeType: string
}

interface CarouselImageRequest {
  imagePrompt: string
  slideTitle: string
  socialNetwork: 'instagram' | 'linkedin'
  slideIndex: number
  inspirationImages?: InspirationImage[]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<CarouselImageRequest>(event)

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API Key do Gemini não configurada no servidor'
    })
  }

  const { imagePrompt, slideTitle, socialNetwork, slideIndex, inspirationImages = [] } = body

  if (!imagePrompt || typeof imagePrompt !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt da imagem é obrigatório'
    })
  }

  // Estilo visual por rede social
  const styleConfig = {
    instagram: {
      aspectRatio: '1:1',
      style: 'Modern, vibrant, eye-catching design with bold colors. Instagram-ready aesthetic with clean typography space for overlay text.',
      suffix: 'Style: trendy, aesthetic, social media optimized. High contrast, visually striking.'
    },
    linkedin: {
      aspectRatio: '1:1',
      style: 'Professional, corporate design with clean lines and business-appropriate colors. Modern and sophisticated.',
      suffix: 'Style: professional, corporate, business-appropriate. Clean, modern, trustworthy appearance.'
    }
  }

  const config_style = styleConfig[socialNetwork] || styleConfig.instagram

  // Verificar se há imagens de inspiração
  const hasInspirationImages = inspirationImages && inspirationImages.length > 0

  // Prompt aprimorado para a imagem
  const enhancedPrompt = `Create a carousel slide image for social media.

Visual description: ${imagePrompt}

${hasInspirationImages ? `
VERY IMPORTANT: Reference images have been provided as visual inspiration.
Analyze the style, colors, composition, and visual elements of the reference images.
The generated image MUST maintain visual consistency with these references.
Match the overall aesthetic, color palette, and artistic style of the inspiration images.
` : ''}

Requirements:
- ${config_style.style}
- Leave space for text overlay with title: "${slideTitle}"
- The image should be a clean background or illustration that complements text
- NO text in the image itself - only visual elements
- ${config_style.suffix}
- Slide number: ${slideIndex + 1}

Important: Create a visually cohesive image that would work well in a carousel series.${hasInspirationImages ? ' MATCH the style of the provided reference images.' : ''}`

  try {
    const model = 'gemini-2.5-flash-image'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`

    // Construir as partes da requisição
    const parts: any[] = [{ text: enhancedPrompt }]
    
    // Adicionar imagens de inspiração se existirem
    if (hasInspirationImages) {
      for (const img of inspirationImages) {
        if (img.base64) {
          parts.push({
            inline_data: {
              mime_type: img.mimeType,
              data: img.base64
            }
          })
        }
      }
    }

    let response: any
    let lastError: any
    const maxRetries = 3

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        response = await $fetch<any>(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: {
            contents: [{ parts }],
            generationConfig: {
              responseModalities: ['TEXT', 'IMAGE'],
              imageConfig: {
                aspectRatio: config_style.aspectRatio
              }
            }
          }
        })
        break
      } catch (err: any) {
        lastError = err
        console.error(`[Carousel Image] Attempt ${attempt + 1} failed:`, err.message || err)
        if (err.status === 429 || err.statusCode === 429) {
          if (attempt < maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 2000))
            continue
          }
        }
        throw err
      }
    }

    if (!response) {
      throw lastError || new Error('Falha ao gerar imagem após múltiplas tentativas')
    }

    // Extrai a imagem da resposta
    let imageData: { url: string; mimeType: string } | null = null

    if (response.candidates && response.candidates.length > 0) {
      for (const candidate of response.candidates) {
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              const base64 = part.inlineData.data
              const mimeType = part.inlineData.mimeType || 'image/png'
              imageData = {
                url: `data:${mimeType};base64,${base64}`,
                mimeType
              }
              break
            }
          }
        }
        if (imageData) break
      }
    }

    if (!imageData) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Nenhuma imagem foi gerada. Tente novamente.'
      })
    }

    return {
      success: true,
      image: imageData,
      slideIndex,
      creditsUsed: Number(config.creditsPerImage)
    }

  } catch (err: any) {
    let errorMessage = 'Erro ao gerar imagem do slide'
    let statusCode = 500

    if (err.data?.error?.message) {
      errorMessage = err.data.error.message
    } else if (err.message) {
      errorMessage = err.message
    }

    if (err.status === 429 || err.statusCode === 429) {
      errorMessage = 'Muitas requisições. Aguarde alguns segundos e tente novamente.'
      statusCode = 429
    }

    if (err.statusCode) {
      throw err
    }

    throw createError({
      statusCode,
      statusMessage: errorMessage
    })
  }
})
