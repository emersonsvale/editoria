/**
 * API Endpoint: POST /api/generate
 * Gera imagens usando o Gemini (Nano Banana)
 *
 * A API Key fica no servidor, não é exposta ao cliente
 */

import { getUserIdFromToken, deductUserCredit } from '~/server/utils/supabase'

/** Aspect ratios aceitos pela API Gemini (evita 400 por valor inválido) */
const ALLOWED_ASPECT_RATIOS = ['1:1', '9:16', '16:9', '3:4', '4:3', '3:2', '2:3', '5:4', '4:5', '21:9'] as const

const MAX_PROMPT_LENGTH = 8000
const MAX_INPUT_IMAGES = 4

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  let body: Record<string, unknown>
  try {
    body = (await readBody(event)) as Record<string, unknown>
  } catch {
    throw createError({
      statusCode: 400,
      statusMessage: 'Corpo da requisição inválido ou ausente.'
    })
  }

  if (!body || typeof body !== 'object') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Corpo da requisição inválido.'
    })
  }

  const userId = await getUserIdFromToken(event)
  if (!userId) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado. Faça login para gerar imagens.'
    })
  }

  const deducted = await deductUserCredit(userId)
  if (!deducted) {
    throw createError({
      statusCode: 402,
      statusMessage: 'Créditos insuficientes. Adquira mais créditos para continuar.'
    })
  }

  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'API Key do Gemini não configurada no servidor'
    })
  }

  const { prompt: rawPrompt, aspectRatio, inputImages } = body

  if (rawPrompt === undefined || rawPrompt === null || typeof rawPrompt !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt é obrigatório'
    })
  }

  const prompt = (rawPrompt as string).trim()
  if (!prompt) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Prompt não pode estar vazio.'
    })
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: `Prompt muito longo. Use no máximo ${MAX_PROMPT_LENGTH} caracteres.`
    })
  }

  const safeAspectRatio = aspectRatio && typeof aspectRatio === 'string' && ALLOWED_ASPECT_RATIOS.includes(aspectRatio as any)
    ? aspectRatio
    : '1:1'

  try {
    const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = []
    parts.push({ text: prompt })

    if (inputImages && Array.isArray(inputImages) && inputImages.length > 0) {
      const imagesToUse = inputImages.slice(0, MAX_INPUT_IMAGES)
      for (const img of imagesToUse) {
        if (typeof img !== 'string' || !img) continue
        const base64Raw = img.startsWith('data:')
          ? img.replace(/^data:image\/\w+;base64,/, '')
          : img
        const base64Data = base64Raw.replace(/\s/g, '')
        if (!base64Data.length) continue

        let mimeType = 'image/png'
        if (img.startsWith('data:image/jpeg') || img.startsWith('data:image/jpg')) mimeType = 'image/jpeg'
        else if (img.startsWith('data:image/webp')) mimeType = 'image/webp'

        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        })
      }
    }

    const generationConfig: Record<string, any> = {
      responseModalities: ['TEXT', 'IMAGE']
    }
    generationConfig.imageConfig = { aspectRatio: safeAspectRatio }

    // Chama a API do Gemini com retry para rate limiting
    const model = config.geminiImageModel || 'gemini-2.5-flash-image'
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
        break
      } catch (err: any) {
        lastError = err
        const status = err.status ?? err.statusCode ?? err.data?.status
        const isRateLimit = status === 429
        const isBadRequest = status === 400

        if (isRateLimit && attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, (attempt + 1) * 2000))
          continue
        }
        if (isBadRequest && attempt < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1500))
          continue
        }
        throw err
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

    return {
      success: true,
      images,
      creditsUsed: Number(config.creditsPerImage)
    }

  } catch (err: any) {
    if (err.statusCode === 401 || err.statusCode === 402) throw err
    if (err.statusCode === 400 && err.data?.statusMessage && !err.data?.error) throw err

    let errorMessage = (err.data?.error?.message ?? err.message ?? 'Erro ao gerar imagem').toString()
    let statusCode = err.status ?? err.statusCode ?? 500
    const msg = errorMessage.toLowerCase()

    if (statusCode === 429 || msg.includes('quota') || msg.includes('rate')) {
      errorMessage = 'Muitas requisições. Aguarde alguns segundos e tente novamente.'
      statusCode = 429
    } else if (statusCode === 400 || msg.includes('invalid') || msg.includes('bad request')) {
      errorMessage = 'Requisição inválida para o gerador de imagens. Tente um prompt mais curto ou sem caracteres especiais e tente novamente.'
      statusCode = 400
    } else if (msg.includes('safety') || msg.includes('blocked')) {
      errorMessage = 'O conteúdo foi bloqueado por políticas de segurança. Tente um prompt diferente.'
      statusCode = 422
    }

    throw createError({
      statusCode: statusCode >= 400 && statusCode < 600 ? statusCode : 500,
      statusMessage: errorMessage
    })
  }
})
