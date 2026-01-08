/**
 * Formats a number for display in the UI (French locale).
 * Handles decimals with commas and removes unnecessary trailing zeros.
 * 
 * @param quantity The number to format
 * @returns The formatted string
 */
export function formatQuantity(quantity: number | null | undefined): string {
  if (quantity === null || quantity === undefined) {
    return ''
  }

  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(quantity)
}
