/**
 * API Endpoint: POST /api/generate
 * Gera imagens usando o Gemini (Nano Banana)
 * 
 * A API Key fica no servidor, não é exposta ao cliente
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  // Valida se a API Key está configurada
  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API Key do Gemini não configurada no servidor'
    })
  }

  // Valida o body
  const { prompt, aspectRatio, inputImages } = body

  if (!prompt || typeof prompt !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt é obrigatório'
    })
  }

  // TODO: Aqui você vai validar o usuário e verificar créditos
  // const user = await getUserFromSession(event)
  // if (!user) throw createError({ statusCode: 401, statusMessage: 'Não autorizado' })
  // if (user.credits < config.creditsPerImage) throw createError({ statusCode: 402, statusMessage: 'Créditos insuficientes' })

  try {
    // Monta as partes do conteúdo
    const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = []

    // Adiciona o prompt de texto
    parts.push({ text: prompt })

    // Adiciona imagens de entrada se houver (para edição)
    if (inputImages && Array.isArray(inputImages) && inputImages.length > 0) {
      for (const img of inputImages) {
        // Se for Data URL, extrai o base64
        const base64Data = img.startsWith('data:') 
          ? img.replace(/^data:image\/\w+;base64,/, '') 
          : img
        const mimeType = img.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png'
        
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        })
      }
    }

    // Monta a configuração de geração
    const generationConfig: Record<string, any> = {
      responseModalities: ['TEXT', 'IMAGE']
    }

    if (aspectRatio) {
      generationConfig.imageConfig = {
        aspectRatio
      }
    }

    // Chama a API do Gemini com retry para rate limiting
    const model = 'gemini-2.5-flash-image'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`

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
            generationConfig
          }
        })
        break // Sucesso, sai do loop
      } catch (err: any) {
        lastError = err
        // Se for rate limit (429), espera e tenta novamente
        if (err.status === 429 || err.statusCode === 429) {
          if (attempt < maxRetries - 1) {
            // Espera 2, 4, 6 segundos (backoff)
            await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 2000))
            continue
          }
        }
        throw err // Outro erro, não tenta novamente
      }
    }
    
    if (!response) {
      throw lastError || new Error('Falha ao gerar imagem após múltiplas tentativas')
    }

    // Extrai as imagens da resposta
    const images: Array<{ url: string; mimeType: string }> = []
    
    if (response.candidates && response.candidates.length > 0) {
      for (const candidate of response.candidates) {
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.inlineData) {
              const base64 = part.inlineData.data
              const mimeType = part.inlineData.mimeType || 'image/png'
              
              images.push({
                url: `data:${mimeType};base64,${base64}`,
                mimeType
              })
            }
          }
        }
      }
    }

    if (images.length === 0) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Nenhuma imagem foi gerada. Tente reformular seu prompt.'
      })
    }

    // TODO: Deduz créditos do usuário após sucesso
    // await deductCredits(user.id, config.creditsPerImage)

    return {
      success: true,
      images,
      creditsUsed: Number(config.creditsPerImage)
    }

  } catch (err: any) {
    // Trata erros específicos da API do Gemini
    let errorMessage = 'Erro ao gerar imagem'
    let statusCode = 500

    if (err.data?.error?.message) {
      errorMessage = err.data.error.message
    } else if (err.message) {
      errorMessage = err.message
    }

    // Verifica se é erro de rate limit (429)
    if (err.status === 429 || err.statusCode === 429 || errorMessage.toLowerCase().includes('quota') || errorMessage.toLowerCase().includes('rate')) {
      errorMessage = 'Muitas requisições. Aguarde alguns segundos e tente novamente.'
      statusCode = 429
    }
    // Verifica se é erro de conteúdo bloqueado
    else if (errorMessage.toLowerCase().includes('safety') || errorMessage.toLowerCase().includes('blocked')) {
      errorMessage = 'O conteúdo foi bloqueado por políticas de segurança. Tente um prompt diferente.'
      statusCode = 422
    }

    // Se já é um erro do Nuxt, repassa
    if (err.statusCode) {
      throw err
    }

    throw createError({
      statusCode,
      statusMessage: errorMessage
    })
  }
})
