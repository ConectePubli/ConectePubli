/**
 * Aqui temos funções que manipulam o localStorage para salvar o ID dos participantes
 * de uma campanha no "carrinho". Mantemos essas funções simples e puras.
 */

function getCartKey(campaignId: string) {
  return `${campaignId}_shop`
}

/**
 * Retorna o array de IDs de participações salvos no localStorage.
 * Se não existir, retorna um array vazio.
 */
export function getCartItems(campaignId: string): string[] {
  if (typeof window === "undefined") return []
  const cartKey = getCartKey(campaignId)
  const stored = localStorage.getItem(cartKey)
  return stored ? JSON.parse(stored) : []
}

/**
 * Adiciona um ID de participação ao carrinho, se ainda não estiver lá.
 */
export function addToCart(campaignId: string, participationId: string): void {
  if (typeof window === "undefined") return
  const cartKey = getCartKey(campaignId)
  const current = getCartItems(campaignId)
  if (!current.includes(participationId)) {
    current.push(participationId)
    localStorage.setItem(cartKey, JSON.stringify(current))
  }
}

/**
 * Remove um ID de participação do carrinho, se existir.
 */
export function removeFromCart(campaignId: string, participationId: string): void {
  if (typeof window === "undefined") return
  const cartKey = getCartKey(campaignId)
  let current = getCartItems(campaignId)
  current = current.filter((id) => id !== participationId)
  localStorage.setItem(cartKey, JSON.stringify(current))
}

/**
 * Remove completamente o carrinho da campanha.
 */
export function clearCart(campaignId: string): void {
  if (typeof window === "undefined") return
  const cartKey = getCartKey(campaignId)
  localStorage.removeItem(cartKey)
}
