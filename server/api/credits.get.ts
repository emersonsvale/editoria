/**
 * API Endpoint: GET /api/credits
 * Retorna os créditos do usuário atual
 * 
 * TODO: Implementar autenticação real
 */

export default defineEventHandler(async (event) => {
  // TODO: Aqui você vai buscar os créditos do usuário autenticado
  // const user = await getUserFromSession(event)
  // if (!user) throw createError({ statusCode: 401, statusMessage: 'Não autorizado' })
  // return { credits: user.credits }

  // Por enquanto, retorna créditos mockados para desenvolvimento
  return {
    credits: 100, // Créditos disponíveis
    used: 15,     // Créditos já usados
    total: 115    // Total de créditos adquiridos
  }
})
