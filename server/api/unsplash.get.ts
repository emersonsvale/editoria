/**
 * API Endpoint: GET /api/unsplash
 * Busca imagens do Unsplash para a galeria de inspiração
 */

interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
  user: {
    name: string
    username: string
  }
  likes: number
  width: number
  height: number
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  
  const searchQuery = (query.query as string) || 'digital art, illustration, design'
  const perPage = parseInt(query.per_page as string) || 12
  const page = parseInt(query.page as string) || 1

  // Se não tiver API key configurada, retorna imagens placeholder
  if (!config.unsplashAccessKey) {
    console.warn('UNSPLASH_ACCESS_KEY não configurada, usando imagens placeholder')
    return {
      success: true,
      images: getPlaceholderImages(),
      source: 'placeholder'
    }
  }

  try {
    const response = await $fetch<{ results: UnsplashPhoto[] }>(
      'https://api.unsplash.com/search/photos',
      {
        headers: {
          'Authorization': `Client-ID ${config.unsplashAccessKey}`
        },
        query: {
          query: searchQuery,
          per_page: perPage,
          page: page,
          orientation: 'squarish'
        }
      }
    )

    const images = response.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular,
      thumb: photo.urls.small,
      alt: photo.alt_description || photo.description || 'Imagem do Unsplash',
      author: photo.user.name,
      authorUsername: photo.user.username,
      likes: photo.likes,
      width: photo.width,
      height: photo.height,
      // Gera um prompt baseado na descrição da imagem
      prompt: generatePromptFromDescription(photo.alt_description || photo.description)
    }))

    return {
      success: true,
      images,
      source: 'unsplash'
    }

  } catch (err: any) {
    console.error('Erro ao buscar imagens do Unsplash:', err.message)
    
    // Retorna imagens placeholder em caso de erro
    return {
      success: true,
      images: getPlaceholderImages(),
      source: 'placeholder',
      error: err.message
    }
  }
})

/**
 * Gera um prompt criativo baseado na descrição da imagem
 */
function generatePromptFromDescription(description: string | null): string {
  if (!description) {
    return 'Crie uma imagem artística inspirada neste estilo visual'
  }
  
  // Limpa e formata a descrição como um prompt
  const cleanDescription = description
    .replace(/^a\s+/i, '')
    .replace(/\s+/g, ' ')
    .trim()
  
  return `Crie uma imagem similar: ${cleanDescription}, estilo artístico, alta qualidade`
}

/**
 * Retorna imagens placeholder quando a API não está disponível
 */
function getPlaceholderImages() {
  const categories = [
    { title: 'Arte abstrata', prompt: 'Arte abstrata com formas geométricas fluidas, cores vibrantes em gradiente', category: 'Arte digital' },
    { title: 'Paisagem fantasia', prompt: 'Paisagem de fantasia com montanhas flutuantes, céu roxo e aurora boreal', category: 'Ilustrações' },
    { title: 'Logo moderno', prompt: 'Logo minimalista moderno com formas geométricas, estilo flat design', category: 'Logos' },
    { title: 'Retrato estilizado', prompt: 'Retrato artístico com iluminação neon, estilo cyberpunk', category: 'Arte digital' },
    { title: 'Natureza surreal', prompt: 'Natureza surreal com árvores bioluminescentes em floresta mágica', category: 'Ilustrações' },
    { title: 'Render 3D', prompt: 'Objeto abstrato 3D com materiais metálicos e vidro, iluminação de estúdio', category: '3D' },
  ]

  return categories.map((cat, index) => ({
    id: `placeholder-${index}`,
    url: '/editoria-img-1769655023521-0.png',
    thumb: '/editoria-img-1769655023521-0.png',
    alt: cat.title,
    author: 'EditorIA',
    authorUsername: 'editoria',
    likes: Math.floor(Math.random() * 500) + 50,
    width: 1024,
    height: 1024,
    prompt: cat.prompt,
    category: cat.category
  }))
}
