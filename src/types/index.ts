export type Gender = 'male' | 'female'
export type Experience = 'beginner' | 'intermediate' | 'advanced'
export type SlopePreference = 'beginner' | 'intermediate' | 'advanced' | 'park'
export type RidingStyle = 'first_time' | 'carving' | 'park' | 'advanced_slope'
export type BoardFlex = 'soft' | 'medium' | 'stiff'
export type BootFit = 'comfort' | 'standard' | 'performance'
export type BoardWidth = 'standard' | 'wide'
export type EquipmentCategory = 'snowboard' | 'boots' | 'helmet' | 'goggles' | 'protection'
export type OrderStatus = 'pending' | 'confirmed' | 'picked_up' | 'returned'
export type RiskLevel = 'none' | 'warning' | 'danger' | 'info'
export type SubstituteType = 'adjacent_length' | 'wide_board' | 'flex_diff' | 'boot_fit_diff'

export interface GuestInfo {
  height: number
  weight: number
  footLength: number
  age: number
  gender: Gender
  experience: Experience
  slopePreference: SlopePreference
  ridingStyle?: RidingStyle
  pickupTime: string
  returnTime: string
  nightReturn: boolean
  protectionGear: string[]
}

export interface BindingAngles {
  front: number
  rear: number
  stance: 'duck' | 'forward' | 'alpine'
}

export interface StyleCalibration {
  boardLengthAdjustment: number
  boardFlex: BoardFlex
  bindingAngles: BindingAngles
  bootFit: BootFit
  boardWidth: BoardWidth
}

export interface NotRecommendedSize {
  size: string
  reason: string
  illustration: string
}

export interface SubstituteOption {
  id: string
  type: SubstituteType
  label: string
  size: string
  description: string
  risks: string[]
  stockCount: number
  suitableSnowConditions: string[]
}

export interface CounterAlternativeState {
  needsAlternative: boolean
  primaryOutOfStock: string[]
  selectedSubstitutes: Record<string, string>
  cashierScanned: boolean
  scanCode: string
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
  styleCalibration?: StyleCalibration
  notRecommendedSize?: NotRecommendedSize
  substituteOptions?: SubstituteOption[]
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
