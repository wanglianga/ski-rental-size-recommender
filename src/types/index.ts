export type Gender = 'male' | 'female'
export type Experience = 'beginner' | 'intermediate' | 'advanced'
export type SlopePreference = 'beginner' | 'intermediate' | 'advanced' | 'park'
export type EquipmentCategory = 'snowboard' | 'boots' | 'helmet' | 'goggles' | 'protection'
export type OrderStatus = 'pending' | 'confirmed' | 'picked_up' | 'returned'
export type RiskLevel = 'none' | 'warning' | 'danger' | 'info'

export interface GuestInfo {
  height: number
  weight: number
  footLength: number
  age: number
  gender: Gender
  experience: Experience
  slopePreference: SlopePreference
  pickupTime: string
  returnTime: string
  nightReturn: boolean
  protectionGear: string[]
}

export interface SizeRecommendation {
  category: EquipmentCategory
  label: string
  icon: string
  recommendedSize: string
  alternativeSizes: string[]
  stockCount: number
  isLowStock: boolean
  reason: string
  riskLevel: RiskLevel
  riskMessage: string
}

export interface RentalOrder {
  orderId: string
  guestInfo: GuestInfo
  recommendations: SizeRecommendation[]
  pickupNumber: string
  depositAmount: number
  status: OrderStatus
  createdAt: string
}

export interface InventoryItem {
  category: EquipmentCategory
  size: string
  total: number
  available: number
}

export interface RiskAlert {
  level: RiskLevel
  title: string
  message: string
  icon: string
}
