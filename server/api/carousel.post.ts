/**
 * API Endpoint: POST /api/carousel
 * Gera conteúdo para carrosséis de redes sociais usando o Gemini
 */

interface CarouselSlide {
  title: string
  content: string
  imagePrompt: string
}

interface InspirationImage {
  base64?: string
  mimeType: string
}

interface CarouselRequest {
  topic: string
  socialNetwork: 'instagram' | 'linkedin'
  numberOfSlides: number
  tone?: 'professional' | 'casual' | 'educational' | 'inspirational'
  language?: string
  inspirationImages?: InspirationImage[]
}

interface CarouselContent {
  slides: CarouselSlide[]
  caption: string
  hashtags: string[]
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<CarouselRequest>(event)

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API Key do Gemini não configurada no servidor'
    })
  }

  const { topic, socialNetwork, numberOfSlides, tone = 'professional', language = 'pt-BR', inspirationImages = [] } = body

  if (!topic || typeof topic !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tópico é obrigatório'
    })
  }

  if (!socialNetwork || !['instagram', 'linkedin'].includes(socialNetwork)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Rede social deve ser instagram ou linkedin'
    })
  }

  const slidesCount = Math.min(Math.max(numberOfSlides || 5, 3), 10)

  // Configurações específicas por rede social
  const socialConfig = {
    instagram: {
      maxHashtags: 30,
      captionMaxLength: 2200,
      hashtagStyle: 'popular e trending, misturando hashtags grandes e de nicho',
      contentStyle: 'visual, engajante e com chamadas para ação. Use emojis de forma estratégica.',
      slideStyle: 'textos curtos e impactantes, fáceis de ler em dispositivos móveis'
    },
    linkedin: {
      maxHashtags: 5,
      captionMaxLength: 3000,
      hashtagStyle: 'profissionais e relevantes para o setor',
      contentStyle: 'profissional, com insights valiosos e dados quando possível',
      slideStyle: 'conteúdo educativo e de valor profissional, com estatísticas e dicas práticas'
    }
  }

  const config_social = socialConfig[socialNetwork]

  // Mapeia o tom para descrições
  const toneDescriptions = {
    professional: 'profissional e confiável',
    casual: 'descontraído e acessível',
    educational: 'educativo e informativo',
    inspirational: 'inspirador e motivacional'
  }

  const toneDescription = toneDescriptions[tone] || toneDescriptions.professional

  // Verificar se há imagens de inspiração
  const hasInspirationImages = inspirationImages && inspirationImages.length > 0

  // Prompt para gerar o conteúdo do carrossel
  const prompt = `Você é um especialista em criação de conteúdo para redes sociais. 
Crie um carrossel de ${slidesCount} slides para ${socialNetwork === 'instagram' ? 'Instagram' : 'LinkedIn'} sobre o seguinte tema:

"${topic}"

${hasInspirationImages ? `
IMPORTANTE: O usuário enviou ${inspirationImages.length} imagem(ns) de inspiração/referência.
Analise as imagens de referência e use-as como base para criar os prompts de imagem (imagePrompt).
Os prompts de imagem devem manter a consistência visual, estilo, cores e elementos visuais das imagens de referência.
` : ''}

REGRAS IMPORTANTES:
- Tom: ${toneDescription}
- Idioma: ${language === 'pt-BR' ? 'Português do Brasil' : language}
- Estilo dos slides: ${config_social.slideStyle}
- Estilo do conteúdo: ${config_social.contentStyle}
- Hashtags: ${config_social.hashtagStyle} (máximo ${config_social.maxHashtags} hashtags)

ESTRUTURA DO CARROSSEL:
1. Slide 1: Capa chamativa com gancho para prender atenção
2. Slides 2-${slidesCount - 1}: Conteúdo principal desenvolvendo o tema
3. Slide ${slidesCount}: CTA (call to action) final

Para cada slide, forneça:
- title: Título curto e impactante (máximo 50 caracteres)
- content: Conteúdo do slide (máximo 150 caracteres para Instagram, 200 para LinkedIn)
- imagePrompt: Descrição detalhada para gerar uma imagem que complemente o conteúdo (em inglês, para geração de imagem com IA)${hasInspirationImages ? ' - MANTENHA CONSISTÊNCIA com as imagens de referência enviadas' : ''}

Também forneça:
- caption: Descrição para acompanhar o post (${config_social.captionMaxLength} caracteres máximo)
- hashtags: Lista de hashtags relevantes (sem o símbolo #)

RESPONDA APENAS EM JSON VÁLIDO, seguindo exatamente esta estrutura:
{
  "slides": [
    {
      "title": "string",
      "content": "string", 
      "imagePrompt": "string em inglês"
    }
  ],
  "caption": "string",
  "hashtags": ["string", "string"]
}

NÃO inclua markdown, código ou explicações. APENAS o JSON.`

  try {
    const model = config.geminiChatModel || 'gemini-2.0-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`

    // Construir as partes da requisição
    const parts: any[] = [{ text: prompt }]
    
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
              temperature: 0.7,
              topP: 0.9,
              maxOutputTokens: 4096
            }
          }
        })
        break
      } catch (err: any) {
        lastError = err
        console.error(`[Carousel API] Attempt ${attempt + 1} failed:`, err.message || err)
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
      throw lastError || new Error('Falha ao gerar conteúdo após múltiplas tentativas')
    }

    // Extrai o texto da resposta
    let textContent = ''
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0]
      if (candidate.content && candidate.content.parts) {
        for (const part of candidate.content.parts) {
          if (part.text) {
            textContent += part.text
          }
        }
      }
    }

    if (!textContent) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Nenhum conteúdo foi gerado. Tente reformular o tema.'
      })
    }

    // Tenta fazer o parse do JSON
    let carouselContent: CarouselContent
    try {
      // Encontra o primeiro { e o último } para extrair apenas o JSON
      const firstBrace = textContent.indexOf('{')
      const lastBrace = textContent.lastIndexOf('}')
      
      if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
        console.error('JSON não encontrado na resposta:', textContent)
        throw new Error('JSON não encontrado')
      }
      
      let jsonText = textContent.substring(firstBrace, lastBrace + 1)
      
      // Remove vírgulas extras antes de } ou ]
      jsonText = jsonText
        .replace(/,(\s*[}\]])/g, '$1')
      
      carouselContent = JSON.parse(jsonText)
    } catch (parseError: any) {
      console.error('Erro ao fazer parse do JSON:', parseError.message)
      console.error('Conteúdo recebido:', textContent.substring(0, 500))
      throw createError({
        statusCode: 422,
        statusMessage: 'Erro ao processar resposta da IA. Tente novamente.'
      })
    }

    // Valida a estrutura
    if (!carouselContent.slides || !Array.isArray(carouselContent.slides)) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Estrutura de slides inválida. Tente novamente.'
      })
    }

    return {
      success: true,
      content: carouselContent,
      socialNetwork,
      topic
    }

  } catch (err: any) {
    let errorMessage = 'Erro ao gerar carrossel'
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
