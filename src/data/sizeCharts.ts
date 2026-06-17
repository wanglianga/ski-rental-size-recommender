interface FootLengthToSize {
  minMm: number
  maxMm: number
  euSize: string
  label: string
}

export const footLengthChart: FootLengthToSize[] = [
  { minMm: 220, maxMm: 225, euSize: '35', label: '35码 (220-225mm)' },
  { minMm: 225, maxMm: 230, euSize: '36', label: '36码 (225-230mm)' },
  { minMm: 230, maxMm: 235, euSize: '37', label: '37码 (230-235mm)' },
  { minMm: 235, maxMm: 240, euSize: '38', label: '38码 (235-240mm)' },
  { minMm: 240, maxMm: 245, euSize: '39', label: '39码 (240-245mm)' },
  { minMm: 245, maxMm: 250, euSize: '40', label: '40码 (245-250mm)' },
  { minMm: 250, maxMm: 255, euSize: '41', label: '41码 (250-255mm)' },
  { minMm: 255, maxMm: 260, euSize: '42', label: '42码 (255-260mm)' },
  { minMm: 260, maxMm: 265, euSize: '43', label: '43码 (260-265mm)' },
  { minMm: 265, maxMm: 270, euSize: '44', label: '44码 (265-270mm)' },
  { minMm: 270, maxMm: 275, euSize: '45', label: '45码 (270-275mm)' },
  { minMm: 275, maxMm: 285, euSize: '46', label: '46码 (275-285mm)' },
]

export function footLengthToBootSize(footLengthMm: number): string {
  const match = footLengthChart.find(
    c => footLengthMm >= c.minMm && footLengthMm < c.maxMm
  )
  return match?.euSize ?? '42'
}

export function bootSizeToFootLength(euSize: string): { min: number; max: number } | null {
  const match = footLengthChart.find(c => c.euSize === euSize)
  return match ? { min: match.minMm, max: match.maxMm } : null
}

interface HeightToBoard {
  minHeight: number
  maxHeight: number
  boardSize: string
}

export const heightBoardChart: HeightToBoard[] = [
  { minHeight: 140, maxHeight: 150, boardSize: '140cm' },
  { minHeight: 150, maxHeight: 158, boardSize: '145cm' },
  { minHeight: 158, maxHeight: 165, boardSize: '150cm' },
  { minHeight: 165, maxHeight: 170, boardSize: '155cm' },
  { minHeight: 170, maxHeight: 175, boardSize: '160cm' },
  { minHeight: 175, maxHeight: 180, boardSize: '165cm' },
  { minHeight: 180, maxHeight: 185, boardSize: '170cm' },
  { minHeight: 185, maxHeight: 190, boardSize: '175cm' },
  { minHeight: 190, maxHeight: 210, boardSize: '180cm' },
]

interface HeadCircumferenceToHelmet {
  minCm: number
  maxCm: number
  size: string
}

export const headCircumferenceChart: HeadCircumferenceToHelmet[] = [
  { minCm: 52, maxCm: 55, size: 'S(52-55cm)' },
  { minCm: 55, maxCm: 58, size: 'M(55-58cm)' },
  { minCm: 58, maxCm: 61, size: 'L(58-61cm)' },
  { minCm: 61, maxCm: 64, size: 'XL(61-64cm)' },
]

export function heightToHeadCircumference(heightCm: number): number {
  if (heightCm < 150) return 53
  if (heightCm < 165) return 56
  if (heightCm < 180) return 58
  return 60
}

export function headCircumferenceToHelmetSize(headCm: number): string {
  const match = headCircumferenceChart.find(
    c => headCm >= c.minCm && headCm < c.maxCm
  )
  return match?.size ?? 'M(55-58cm)'
}

interface WeightToProtection {
  minKg: number
  maxKg: number
  size: string
}

export const weightProtectionChart: WeightToProtection[] = [
  { minKg: 0, maxKg: 25, size: '儿童S' },
  { minKg: 25, maxKg: 40, size: '儿童M' },
  { minKg: 40, maxKg: 60, size: 'S' },
  { minKg: 60, maxKg: 80, size: 'M' },
  { minKg: 80, maxKg: 100, size: 'L' },
  { minKg: 100, maxKg: 200, size: 'XL' },
]

export const depositPrices: Record<string, number> = {
  snowboard: 500,
  boots: 300,
  helmet: 200,
  goggles: 150,
  protection: 300,
}

export const nightReturnFee = 50

export const experienceLabels: Record<string, string> = {
  beginner: '新手',
  intermediate: '进阶',
  advanced: '高手',
}

export const slopeLabels: Record<string, string> = {
  beginner: '初级道',
  intermediate: '中级道',
  advanced: '高级道',
  park: '公园',
}

export const protectionGearOptions = [
  { value: 'butt', label: '护臀', icon: 'Shield' },
  { value: 'knee', label: '护膝', icon: 'ShieldCheck' },
  { value: 'wrist', label: '护腕', icon: 'Hand' },
  { value: 'back', label: '背甲', icon: 'ShieldHalf' },
]
