import { ref, computed } from 'vue'
import type { GuestInfo, SizeRecommendation, RentalOrder, RiskAlert } from '@/types'
import { getStock, checkLowStock } from '@/data/inventory'
import {
  footLengthToBootSize,
  heightBoardChart,
  headCircumferenceToHelmetSize,
  heightToHeadCircumference,
  weightProtectionChart,
  depositPrices,
  nightReturnFee,
} from '@/data/sizeCharts'

export function useRecommendation() {
  const guestInfo = ref<GuestInfo>({
    height: 170,
    weight: 65,
    footLength: 255,
    age: 25,
    gender: 'male',
    experience: 'beginner',
    slopePreference: 'beginner',
    pickupTime: '',
    returnTime: '',
    nightReturn: false,
    protectionGear: [],
  })

  const currentStep = ref(0)
  const totalSteps = 3

  const recommendations = computed<SizeRecommendation[]>(() => {
    return [
      recommendSnowboard(guestInfo.value),
      recommendBoots(guestInfo.value),
      recommendHelmet(guestInfo.value),
      recommendGoggles(guestInfo.value),
      recommendProtection(guestInfo.value),
    ]
  })

  const riskAlerts = computed<RiskAlert[]>(() => {
    const alerts: RiskAlert[] = []
    const info = guestInfo.value

    if (info.age <= 12) {
      alerts.push({
        level: 'info',
        title: '儿童租赁',
        message: '儿童需监护人确认，已自动推荐儿童专用尺码',
        icon: 'Baby',
      })
    }

    const bootRec = recommendations.value.find(r => r.category === 'boots')
    if (bootRec && bootRec.riskLevel === 'warning') {
      alerts.push({
        level: 'warning',
        title: '雪鞋尺码偏差',
        message: bootRec.riskMessage,
        icon: 'AlertTriangle',
      })
    }

    const lowStockItems = recommendations.value.filter(r => r.isLowStock)
    if (lowStockItems.length > 0) {
      const items = lowStockItems.map(r => r.label).join('、')
      alerts.push({
        level: 'danger',
        title: '库存紧张',
        message: `${items} 库存不足，建议尽早取件或选择替换尺码`,
        icon: 'PackageOpen',
      })
    }

    const outOfStock = recommendations.value.filter(r => r.stockCount === 0)
    if (outOfStock.length > 0) {
      const items = outOfStock.map(r => r.label).join('、')
      alerts.push({
        level: 'danger',
        title: '部分缺货',
        message: `${items} 暂无库存，请选择替换尺码或等待归还`,
        icon: 'PackageX',
      })
    }

    if (info.nightReturn) {
      alerts.push({
        level: 'info',
        title: '夜场归还',
        message: `17:00后归还需加收夜场服务费 ¥${nightReturnFee}`,
        icon: 'Moon',
      })
    }

    return alerts
  })

  const depositAmount = computed(() => {
    let total = 0
    for (const rec of recommendations.value) {
      if (rec.stockCount > 0) {
        total += depositPrices[rec.category] ?? 0
      }
    }
    if (guestInfo.value.nightReturn) {
      total += nightReturnFee
    }
    return total
  })

  return {
    guestInfo,
    currentStep,
    totalSteps,
    recommendations,
    riskAlerts,
    depositAmount,
  }
}

function recommendSnowboard(info: GuestInfo): SizeRecommendation {
  let boardSize = '155cm'
  const match = heightBoardChart.find(
    c => info.height >= c.minHeight && info.height < c.maxHeight
  )
  if (match) boardSize = match.boardSize

  if (info.experience === 'advanced' && info.slopePreference === 'park') {
    const currentLen = parseInt(boardSize)
    boardSize = `${currentLen - 5}cm`
  }

  if (info.weight > 90) {
    const currentLen = parseInt(boardSize)
    if (heightBoardChart.some(c => c.boardSize === `${currentLen + 5}cm`)) {
      boardSize = `${currentLen + 5}cm`
    }
  }

  const stock = getStock('snowboard', boardSize)
  const isLowStock = checkLowStock('snowboard', boardSize)
  const currentLen = parseInt(boardSize)
  const altSizes = [`${currentLen - 5}cm`, `${currentLen + 5}cm`].filter(s =>
    getStock('snowboard', s) >= 0
  )

  let riskLevel: SizeRecommendation['riskLevel'] = 'none'
  let riskMessage = ''
  if (stock === 0) {
    riskLevel = 'danger'
    riskMessage = '该尺码雪板暂无库存'
  } else if (isLowStock) {
    riskLevel = 'warning'
    riskMessage = '该尺码雪板库存紧张，建议考虑替换尺码'
  }

  const reasons: string[] = []
  reasons.push(`身高 ${info.height}cm → 板长 ${boardSize}`)
  if (info.experience === 'advanced' && info.slopePreference === 'park') {
    reasons.push('公园滑行偏好，板长缩短5cm便于操控')
  }
  if (info.weight > 90) {
    reasons.push('体重较大，板长增加5cm增强稳定性')
  }

  return {
    category: 'snowboard',
    label: '雪板',
    icon: 'Snowflake',
    recommendedSize: boardSize,
    alternativeSizes: altSizes,
    stockCount: stock,
    isLowStock,
    reason: reasons.join('；'),
    riskLevel,
    riskMessage,
  }
}

function recommendBoots(info: GuestInfo): SizeRecommendation {
  const bootSize = footLengthToBootSize(info.footLength)
  const stock = getStock('boots', bootSize)
  const isLowStock = checkLowStock('boots', bootSize)

  const currentNum = parseInt(bootSize)
  const altSizes = [`${currentNum - 1}`, `${currentNum + 1}`].filter(s => {
    const n = parseInt(s)
    return n >= 35 && n <= 46
  })

  let riskLevel: SizeRecommendation['riskLevel'] = 'none'
  let riskMessage = ''

  if (info.footLength % 10 < 3 || info.footLength % 10 > 7) {
    riskLevel = 'warning'
    riskMessage = '脚长处于两个尺码交界处，建议试穿确认'
  }
  if (stock === 0) {
    riskLevel = 'danger'
    riskMessage = '该尺码雪鞋暂无库存'
  } else if (isLowStock) {
    riskLevel = 'warning'
    riskMessage = riskMessage || '该尺码雪鞋库存紧张'
  }

  return {
    category: 'boots',
    label: '雪鞋',
    icon: 'Footprints',
    recommendedSize: bootSize,
    alternativeSizes: altSizes,
    stockCount: stock,
    isLowStock,
    reason: `脚长 ${info.footLength}mm → 鞋码 ${bootSize}`,
    riskLevel,
    riskMessage,
  }
}

function recommendHelmet(info: GuestInfo): SizeRecommendation {
  const headCm = heightToHeadCircumference(info.height)
  const helmetSize = headCircumferenceToHelmetSize(headCm)
  const stock = getStock('helmet', helmetSize)
  const isLowStock = checkLowStock('helmet', helmetSize)

  const altSizes = ['S(52-55cm)', 'M(55-58cm)', 'L(58-61cm)', 'XL(61-64cm)'].filter(
    s => s !== helmetSize
  )

  let riskLevel: SizeRecommendation['riskLevel'] = 'none'
  let riskMessage = ''
  if (stock === 0) {
    riskLevel = 'danger'
    riskMessage = '该尺码头盔暂无库存'
  } else if (isLowStock) {
    riskLevel = 'warning'
    riskMessage = '该尺码头盔库存紧张'
  }
  if (info.age <= 12) {
    riskMessage = riskMessage ? `${riskMessage}；儿童建议选择小一码确保贴合` : '儿童建议选择小一码确保贴合'
    if (riskLevel === 'none') riskLevel = 'info'
  }

  return {
    category: 'helmet',
    label: '头盔',
    icon: 'HardHat',
    recommendedSize: helmetSize,
    alternativeSizes: altSizes,
    stockCount: stock,
    isLowStock,
    reason: `预估头围 ${headCm}cm → ${helmetSize}`,
    riskLevel,
    riskMessage,
  }
}

function recommendGoggles(info: GuestInfo): SizeRecommendation {
  const size = info.age <= 12 ? '小框款(儿童)' : '标准款'
  const stock = getStock('goggles', size)
  const isLowStock = checkLowStock('goggles', size)

  const altSizes = info.age <= 12
    ? ['标准款']
    : ['OTG(近视款)', '小框款(儿童)']

  let riskLevel: SizeRecommendation['riskLevel'] = 'none'
  let riskMessage = ''
  if (stock === 0) {
    riskLevel = 'danger'
    riskMessage = '护目镜暂无库存'
  } else if (isLowStock) {
    riskLevel = 'warning'
    riskMessage = '护目镜库存紧张'
  }

  return {
    category: 'goggles',
    label: '护目镜',
    icon: 'Eye',
    recommendedSize: size,
    alternativeSizes: altSizes,
    stockCount: stock,
    isLowStock,
    reason: info.age <= 12 ? '儿童推荐小框款' : '标准款适合大部分成人',
    riskLevel,
    riskMessage,
  }
}

function recommendProtection(info: GuestInfo): SizeRecommendation {
  let size = 'M'
  const match = weightProtectionChart.find(
    c => info.weight >= c.minKg && info.weight < c.maxKg
  )
  if (match) size = match.size

  const stock = getStock('protection', size)
  const isLowStock = checkLowStock('protection', size)

  const allSizes = info.age <= 12
    ? ['儿童S', '儿童M', 'S']
    : ['S', 'M', 'L', 'XL']
  const altSizes = allSizes.filter(s => s !== size)

  let riskLevel: SizeRecommendation['riskLevel'] = 'none'
  let riskMessage = ''
  if (stock === 0) {
    riskLevel = 'danger'
    riskMessage = '护具暂无库存'
  } else if (isLowStock) {
    riskLevel = 'warning'
    riskMessage = '护具库存紧张'
  }

  return {
    category: 'protection',
    label: '护具',
    icon: 'Shield',
    recommendedSize: size,
    alternativeSizes: altSizes,
    stockCount: stock,
    isLowStock,
    reason: info.age <= 12
      ? `儿童体重 ${info.weight}kg → ${size}`
      : `体重 ${info.weight}kg → ${size}`,
    riskLevel,
    riskMessage,
  }
}
