import type { InventoryItem } from '@/types'

export const inventoryData: InventoryItem[] = [
  { category: 'snowboard', size: '140cm', total: 8, available: 6 },
  { category: 'snowboard', size: '145cm', total: 10, available: 7 },
  { category: 'snowboard', size: '150cm', total: 12, available: 9 },
  { category: 'snowboard', size: '155cm', total: 15, available: 11 },
  { category: 'snowboard', size: '160cm', total: 15, available: 8 },
  { category: 'snowboard', size: '165cm', total: 12, available: 5 },
  { category: 'snowboard', size: '170cm', total: 10, available: 2 },
  { category: 'snowboard', size: '175cm', total: 8, available: 1 },
  { category: 'snowboard', size: '180cm', total: 5, available: 0 },

  { category: 'boots', size: '36', total: 8, available: 5 },
  { category: 'boots', size: '37', total: 10, available: 7 },
  { category: 'boots', size: '38', total: 12, available: 9 },
  { category: 'boots', size: '39', total: 15, available: 12 },
  { category: 'boots', size: '40', total: 18, available: 14 },
  { category: 'boots', size: '41', total: 18, available: 10 },
  { category: 'boots', size: '42', total: 15, available: 6 },
  { category: 'boots', size: '43', total: 12, available: 2 },
  { category: 'boots', size: '44', total: 8, available: 1 },
  { category: 'boots', size: '45', total: 5, available: 0 },
  { category: 'boots', size: '46', total: 3, available: 0 },

  { category: 'helmet', size: 'S(52-55cm)', total: 10, available: 8 },
  { category: 'helmet', size: 'M(55-58cm)', total: 20, available: 15 },
  { category: 'helmet', size: 'L(58-61cm)', total: 15, available: 10 },
  { category: 'helmet', size: 'XL(61-64cm)', total: 5, available: 2 },

  { category: 'goggles', size: '标准款', total: 25, available: 20 },
  { category: 'goggles', size: 'OTG(近视款)', total: 10, available: 7 },
  { category: 'goggles', size: '小框款(儿童)', total: 8, available: 6 },

  { category: 'protection', size: 'S', total: 10, available: 8 },
  { category: 'protection', size: 'M', total: 15, available: 12 },
  { category: 'protection', size: 'L', total: 15, available: 9 },
  { category: 'protection', size: 'XL', total: 8, available: 3 },
  { category: 'protection', size: '儿童S', total: 5, available: 4 },
  { category: 'protection', size: '儿童M', total: 5, available: 3 },
]

export function getStock(category: InventoryItem['category'], size: string): number {
  const item = inventoryData.find(i => i.category === category && i.size === size)
  return item?.available ?? 0
}

export function checkLowStock(category: InventoryItem['category'], size: string): boolean {
  const item = inventoryData.find(i => i.category === category && i.size === size)
  return item ? item.available <= 2 : true
}

export function decreaseStock(category: InventoryItem['category'], size: string, count: number = 1): void {
  const item = inventoryData.find(i => i.category === category && i.size === size)
  if (item) {
    item.available = Math.max(0, item.available - count)
  }
}
