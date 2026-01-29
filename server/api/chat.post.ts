/**
 * API Endpoint: POST /api/chat
 * Chat conversacional com IA que pode responder texto e/ou gerar imagens
 * 
 * A IA entende o contexto e decide quando gerar imagens ou apenas responder
 */

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  images?: string[] // Data URLs de imagens
}

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
  const { message, history, attachedImages, imageSettings } = body as {
    message: string
    history?: ChatMessage[]
    attachedImages?: string[]
    imageSettings?: {
      aspectRatio?: string
      shouldGenerateImage?: boolean
    }
  }

  if (!message || typeof message !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Mensagem é obrigatória'
    })
  }

  try {
    // Monta o histórico de conversa para contexto
    const contents: Array<{
      role: string
      parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }>
    }> = []

    // System prompt para a IA entender seu papel
    const systemPrompt = `Você é um assistente criativo de design e geração de imagens chamado EditorIA.

IMPORTANTE - QUANDO GERAR IMAGENS:
- Quando o usuário descrever algo visual (ex: "astronauta flutuando no espaço"), GERE A IMAGEM imediatamente
- Quando o usuário confirmar algo (ex: "sim", "ok", "pode gerar"), GERE A IMAGEM que foi discutida
- Quando o usuário pedir proporção (ex: "1x1", "quadrado"), GERE A IMAGEM nessa proporção
- Quando houver qualquer intenção de criar/ver algo visual, GERE A IMAGEM

QUANDO NÃO GERAR IMAGENS:
- Quando o usuário fizer perguntas informativas (ex: "o que é design gráfico?")
- Quando pedir apenas ideias ou sugestões sem querer ver resultado visual ainda

REGRA CRÍTICA PARA MÚLTIPLAS IMAGENS:
- Quando o usuário enviar DUAS imagens, uma delas é a FOTO DO USUÁRIO (rosto/corpo) e a outra é a INSPIRAÇÃO de estilo/pose/ambiente
- SEMPRE use a foto do usuário como BASE - preserve o rosto e identidade da pessoa
- Use a imagem de inspiração apenas como REFERÊNCIA de estilo, pose, cenário ou composição
- NUNCA recrie apenas a imagem de inspiração ignorando a foto do usuário
- O resultado deve ser: O USUÁRIO na cena/estilo/pose da inspiração
- Se não souber qual é qual, pergunte: "Qual das imagens é sua foto e qual é a inspiração?"

FORMATO DAS RESPOSTAS:
- Se gerar imagem: Explique brevemente o que criou (1-2 frases) e pergunte se quer ajustes
- Se não gerar: Responda de forma útil e ofereça gerar se fizer sentido

Responda sempre em português brasileiro.
Seja conciso e direto - não descreva imagens que você vai gerar, apenas gere-as.`

    // Adiciona o system prompt
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    })
    contents.push({
      role: 'model',
      parts: [{ text: 'Entendido! Sou o EditorIA, seu assistente criativo. Como posso ajudar você hoje?' }]
    })

    // Encontra a última imagem gerada no histórico (para pedidos de ajuste)
    let lastGeneratedImage: string | null = null
    let hasImagesInHistory = false
    let lastAssistantMessage: string | null = null
    
    // Adiciona histórico de conversa (últimas 10 mensagens para contexto)
    if (history && Array.isArray(history)) {
      const recentHistory = history.slice(-10)
      for (const msg of recentHistory) {
        const parts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = []
        
        if (msg.content) {
          parts.push({ text: msg.content })
          // Guarda a última mensagem de texto do assistente
          if (msg.role === 'assistant') {
            lastAssistantMessage = msg.content
          }
        }
        
        // Adiciona imagens do histórico se houver
        if (msg.images && msg.images.length > 0) {
          hasImagesInHistory = true
          // Guarda a última imagem gerada pelo assistente
          if (msg.role === 'assistant') {
            lastGeneratedImage = msg.images[msg.images.length - 1]
          }
          
          for (const img of msg.images) {
            if (img.startsWith('data:')) {
              const base64Data = img.replace(/^data:image\/\w+;base64,/, '')
              const mimeType = img.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png'
              parts.push({
                inline_data: { mime_type: mimeType, data: base64Data }
              })
            }
          }
        }
        
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts
        })
      }
    }

    // Detecta se o usuário quer gerar imagem (precisa detectar antes de montar userParts)
    const wantsImage = detectImageIntent(message, attachedImages, hasImagesInHistory, lastAssistantMessage || undefined)
    
    // Log para debug
    console.log(`[Chat API] Message: "${message.substring(0, 50)}..." | wantsImage: ${wantsImage} | hasImagesInHistory: ${hasImagesInHistory}`)
    
    // Se quer gerar imagem e não tem imagens anexadas, mas tem imagem no histórico,
    // usa a última imagem gerada como referência para ajustes
    let effectiveAttachedImages = attachedImages || []
    if (wantsImage && effectiveAttachedImages.length === 0 && lastGeneratedImage) {
      effectiveAttachedImages = [lastGeneratedImage]
    }

    // Monta a mensagem atual do usuário
    const userParts: Array<{ text?: string; inline_data?: { mime_type: string; data: string } }> = []
    
    // Prepara a mensagem com instruções extras se há imagens
    let enhancedMessage = message
    
    // Sempre indicar que há fotos anexadas quando houver
    if (effectiveAttachedImages.length > 0) {
      const imageCount = effectiveAttachedImages.length
      const imageText = imageCount === 1 ? '1 foto anexada' : `${imageCount} fotos anexadas`
      enhancedMessage = `${message}\n\n[${imageText} para você analisar/usar na geração]`
    }
    
    // Detecta palavras que indicam inspiração/referência no texto do usuário
    const lowerMessage = message.toLowerCase()
    const hasInspirationKeyword = ['inspiração', 'inspiracao', 'inspirar', 'inspire', 'referência', 'referencia', 
      'estilo', 'como essa', 'como esta', 'igual a', 'parecido', 'baseado', 'no estilo'].some(k => lowerMessage.includes(k))
    const hasSelfKeyword = ['minha foto', 'meu rosto', 'minha cara', 'foto minha', 'eu na', 'me coloque', 'me coloca', 
      'comigo', 'minha imagem', 'meu cabelo', 'meus olhos'].some(k => lowerMessage.includes(k))
    
    // Se tem 2 imagens e o usuário menciona inspiração/sua foto, adiciona instrução clara
    if (effectiveAttachedImages.length === 2 && (hasInspirationKeyword || hasSelfKeyword)) {
      enhancedMessage = `${message}

[2 fotos anexadas para você usar na geração]

INSTRUÇÕES IMPORTANTES PARA ESTA GERAÇÃO:
- Você está recebendo 2 imagens: a primeira é minha FOTO PESSOAL, a segunda é a INSPIRAÇÃO de estilo/pose
- Use meu ROSTO e IDENTIDADE da primeira imagem
- Aplique o ESTILO, POSE e CENÁRIO da segunda imagem (inspiração)
- O resultado deve ser EU naquele estilo/cenário, NÃO uma recriação da inspiração`
    }
    
    // Adiciona texto
    userParts.push({ text: enhancedMessage })
    
    // Adiciona imagens anexadas pelo usuário (ou a última imagem gerada se for ajuste)
    if (effectiveAttachedImages.length > 0) {
      for (const img of effectiveAttachedImages) {
        if (img.startsWith('data:')) {
          const base64Data = img.replace(/^data:image\/\w+;base64,/, '')
          const mimeType = img.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png'
          userParts.push({
            inline_data: { mime_type: mimeType, data: base64Data }
          })
        }
      }
    }
    
    contents.push({
      role: 'user',
      parts: userParts
    })
    
    // Configuração de geração
    const generationConfig: Record<string, any> = {}
    
    if (wantsImage) {
      // Permite texto E imagem na resposta
      generationConfig.responseModalities = ['TEXT', 'IMAGE']
      
      if (imageSettings?.aspectRatio) {
        generationConfig.imageConfig = {
          aspectRatio: imageSettings.aspectRatio
        }
      }
    }

    // Chama a API do Gemini
    // Usa modelo diferente dependendo se vai gerar imagem ou não
    // - gemini-2.0-flash: para chat de texto (rápido e eficiente)
    // - gemini-2.5-flash-image: para geração de imagens (Nano Banana)
    const model = wantsImage ? 'gemini-2.5-flash-image' : 'gemini-2.0-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.geminiApiKey}`

    let response: any
    let lastError: any
    const maxRetries = 4
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const requestBody: Record<string, any> = {
          contents
        }
        
        if (Object.keys(generationConfig).length > 0) {
          requestBody.generationConfig = generationConfig
        }
        
        response = await $fetch<any>(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: requestBody
        })
        break
      } catch (err: any) {
        lastError = err
        const isRateLimit = err.status === 429 || err.statusCode === 429 || 
                           err.message?.includes('429') || err.message?.includes('Too Many')
        
        if (isRateLimit) {
          if (attempt < maxRetries - 1) {
            // Espera mais tempo: 3s, 6s, 12s (backoff exponencial)
            const waitTime = Math.pow(2, attempt + 1) * 1500
            console.log(`Rate limit hit, waiting ${waitTime}ms before retry ${attempt + 2}/${maxRetries}`)
            await new Promise(resolve => setTimeout(resolve, waitTime))
            continue
          }
        }
        throw err
      }
    }
    
    if (!response) {
      throw lastError || new Error('Falha ao obter resposta após múltiplas tentativas')
    }

    // Extrai a resposta (texto e/ou imagens)
    let responseText = ''
    const responseImages: Array<{ url: string; mimeType: string }> = []
    
    if (response.candidates && response.candidates.length > 0) {
      for (const candidate of response.candidates) {
        if (candidate.content && candidate.content.parts) {
          for (const part of candidate.content.parts) {
            if (part.text) {
              responseText += part.text
            }
            if (part.inlineData) {
              const base64 = part.inlineData.data
              const mimeType = part.inlineData.mimeType || 'image/png'
              responseImages.push({
                url: `data:${mimeType};base64,${base64}`,
                mimeType
              })
            }
          }
        }
      }
    }

    // Se não obteve resposta, erro
    if (!responseText && responseImages.length === 0) {
      throw createError({
        statusCode: 422,
        statusMessage: 'Não consegui processar sua mensagem. Tente novamente.'
      })
    }

    // Calcula créditos usados (apenas se gerou imagens)
    const creditsUsed = responseImages.length > 0 ? responseImages.length : 0

    return {
      success: true,
      text: responseText || (responseImages.length > 0 ? 'Aqui está a imagem que criei:' : ''),
      images: responseImages,
      creditsUsed
    }

  } catch (err: any) {
    let errorMessage = 'Erro ao processar mensagem'
    let statusCode = 500

    if (err.data?.error?.message) {
      errorMessage = err.data.error.message
    } else if (err.message) {
      errorMessage = err.message
    }

    if (err.status === 429 || err.statusCode === 429) {
      errorMessage = 'Muitas requisições. Aguarde alguns segundos e tente novamente.'
      statusCode = 429
    } else if (errorMessage.toLowerCase().includes('safety') || errorMessage.toLowerCase().includes('blocked')) {
      errorMessage = 'O conteúdo foi bloqueado por políticas de segurança. Tente reformular.'
      statusCode = 422
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

/**
 * Detecta se o usuário quer gerar uma imagem baseado no texto e contexto
 */
function detectImageIntent(
  message: string, 
  attachedImages?: string[], 
  hasImagesInHistory?: boolean,
  lastAssistantMessage?: string
): boolean {
  const lowerMessage = message.toLowerCase().trim()
  
  // Palavras-chave que indicam intenção de gerar/editar imagem
  const generateKeywords = [
    'gere', 'gerar', 'crie', 'criar', 'faça', 'fazer',
    'desenhe', 'desenhar', 'ilustre', 'ilustrar',
    'mostre', 'mostrar', 'visualize', 'visualizar',
    'produza', 'produzir', 'renderize', 'renderizar',
    'uma imagem', 'uma foto', 'uma ilustração', 'um desenho',
    'um logo', 'uma logo', 'um banner', 'uma arte',
    'imagem de', 'foto de', 'ilustração de', 'desenho de',
    'cria pra mim', 'faz pra mim', 'me faz', 'me cria',
    'quero uma imagem', 'quero ver', 'quero um',
    'pode criar', 'pode fazer', 'pode gerar',
    'transforma', 'transformar', 'converta', 'converter',
    'edita', 'editar', 'modifica', 'modificar', 'altera', 'alterar',
    'refaz', 'refazer', 'melhora', 'melhorar',
    'usando', 'use', 'aplique', 'aplicar', 'com base', 'baseado',
    'inspirado', 'inspiração', 'estilo de', 'no estilo',
    'recrie', 'recriar', 'reimagine', 'reimaginar'
  ]
  
  // Palavras-chave que indicam ajuste/correção de uma imagem existente
  const adjustmentKeywords = [
    'ajust', 'corrij', 'consert', 'arrum', // ajuste, corrija, conserte, arrume
    'mude', 'mudar', 'troque', 'trocar',
    'não gostei', 'não ficou', 'não está',
    'precisa', 'precisar', 'deveria', 'poderia',
    'mais', 'menos', 'muito', 'pouco', // mais claro, menos escuro
    'deixe', 'deixar', 'coloque', 'colocar',
    'tire', 'tirar', 'remova', 'remover',
    'adicione', 'adicionar', 'inclua', 'incluir',
    'de acordo', 'combinar', 'combinando', 'harmoniz'
  ]
  
  // Confirmações simples que indicam "sim, pode gerar"
  const confirmationKeywords = [
    'sim', 'ok', 'pode', 'vamos', 'bora', 'isso', 'essa', 'esse',
    'perfeito', 'ótimo', 'exato', 'exatamente', 'manda', 'vai',
    'por favor', 'pfvr', 'pf', 'pfv', 'please', 'yes',
    'a primeira', 'a segunda', 'a terceira', 'o primeiro', 'o segundo', 'o terceiro',
    'opção 1', 'opção 2', 'opção 3', 'opcao 1', 'opcao 2', 'opcao 3'
  ]
  
  // Proporções/formatos de imagem
  const aspectRatioKeywords = [
    '1x1', '1:1', 'quadrado', 'quadrada',
    '16x9', '16:9', 'widescreen', 'paisagem', 'horizontal',
    '9x16', '9:16', 'retrato', 'vertical', 'stories', 'story',
    '4x3', '4:3', '3x4', '3:4',
    'hd', 'fullhd', '4k',
    'instagram', 'feed', 'post', 'thumbnail'
  ]
  
  // Descrições visuais que implicam criação de imagem (sujeitos/cenas)
  const visualSubjectKeywords = [
    'astronauta', 'paisagem', 'retrato', 'animal', 'pessoa', 'homem', 'mulher',
    'cidade', 'floresta', 'montanha', 'praia', 'oceano', 'mar', 'céu', 'espaço',
    'gato', 'cachorro', 'pássaro', 'dragão', 'unicórnio', 'robô', 'alienígena',
    'carro', 'avião', 'nave', 'castelo', 'casa', 'edifício', 'torre',
    'flor', 'árvore', 'jardim', 'parque', 'rio', 'lago', 'cachoeira',
    'fantasia', 'ficção científica', 'medieval', 'futurista', 'cyberpunk', 'steampunk',
    'anime', 'cartoon', 'realista', 'abstrato', 'minimalista', 'arte',
    'logo', 'ícone', 'banner', 'poster', 'capa', 'avatar',
    'flutuando', 'voando', 'correndo', 'dançando', 'lutando', 'dormindo'
  ]
  
  const hasGenerateKeyword = generateKeywords.some(keyword => lowerMessage.includes(keyword))
  const hasAdjustmentKeyword = adjustmentKeywords.some(keyword => lowerMessage.includes(keyword))
  const hasConfirmation = confirmationKeywords.some(keyword => {
    // Para confirmações curtas, verifica se é a palavra inteira ou início de frase
    if (keyword.length <= 4) {
      return lowerMessage === keyword || 
             lowerMessage.startsWith(keyword + ' ') ||
             lowerMessage.startsWith(keyword + ',') ||
             lowerMessage.startsWith(keyword + '!')
    }
    return lowerMessage.includes(keyword)
  })
  const hasAspectRatio = aspectRatioKeywords.some(keyword => lowerMessage.includes(keyword))
  const hasVisualSubject = visualSubjectKeywords.some(keyword => lowerMessage.includes(keyword))
  
  // Se tem imagens anexadas, provavelmente quer fazer algo com elas
  if (attachedImages && attachedImages.length > 0) {
    // Se tem qualquer keyword de geração, gera imagem
    if (hasGenerateKeyword) return true
    
    // Se não tem keyword mas também não é uma pergunta pura de análise, gera imagem
    const pureAnalysisKeywords = ['o que é', 'o que tem', 'descreva', 'analise', 'explique', 'me diga sobre']
    const isPureAnalysis = pureAnalysisKeywords.some(q => lowerMessage.includes(q))
    
    // Se não é análise pura e tem imagem, provavelmente quer fazer algo com ela
    if (!isPureAnalysis) return true
  }
  
  // Se tem imagens no histórico E está pedindo ajuste/modificação, gera imagem
  if (hasImagesInHistory && hasAdjustmentKeyword) {
    return true
  }
  
  // Se tem imagens no histórico E dá uma confirmação simples, gera imagem
  // (ex: "sim", "ok", "pode gerar", "1x1 pfvr")
  if (hasImagesInHistory && (hasConfirmation || hasAspectRatio)) {
    return true
  }
  
  // Se a última mensagem do assistente ofereceu opções/variações e o usuário confirmou
  if (lastAssistantMessage) {
    const lowerLastMessage = lastAssistantMessage.toLowerCase()
    const offeringOptions = [
      'qual dessas', 'qual delas', 'gostaria de',
      'podemos', 'variações', 'variação', 'opções', 'opção',
      'te agrada', 'prefere', 'escolha', 'escolher',
      'gerar', 'criar', 'modificar', 'explorar'
    ]
    const wasOfferingOptions = offeringOptions.some(phrase => lowerLastMessage.includes(phrase))
    
    if (wasOfferingOptions && hasConfirmation) {
      return true
    }
  }
  
  // Se a mensagem parece uma descrição visual (contém sujeito visual + algo mais)
  // Ex: "astronauta flutuando no espaço", "gato dormindo em uma almofada"
  if (hasVisualSubject && lowerMessage.length > 10) {
    // Verifica se não é uma pergunta pura
    const questionPhrases = ['o que é', 'quem é', 'como é', 'onde', 'quando', 'por que', 'qual é']
    const isQuestion = questionPhrases.some(q => lowerMessage.includes(q)) || lowerMessage.endsWith('?')
    
    if (!isQuestion) {
      return true
    }
  }
  
  // Se pede proporção específica, provavelmente quer gerar/ajustar imagem
  if (hasAspectRatio) {
    return true
  }
  
  return hasGenerateKeyword
}
