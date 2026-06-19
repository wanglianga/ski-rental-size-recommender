import { ref, computed } from 'vue'
import type { GuestInfo, SizeRecommendation, RentalOrder, RiskAlert, RidingStyle, SubstituteOption } from '@/types'
import { getStock, checkLowStock, getSubstituteBoards, getSubstituteBoots } from '@/data/inventory'
import {
  footLengthToBootSize,
  heightBoardChart,
  headCircumferenceToHelmetSize,
  heightToHeadCircumference,
  weightProtectionChart,
  depositPrices,
  nightReturnFee,
  ridingStyleCalibrationMap,
  boardFlexLabels,
  bootFitLabels,
  substituteTypeLabels,
  snowConditionLabels,
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
    ridingStyle: undefined,
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

    if (info.ridingStyle && !['first_time', 'carving', 'park', 'advanced_slope'].includes(info.ridingStyle)) {
      alerts.push({
        level: 'info',
        title: '滑行风格已校准',
        message: '已根据您的滑行风格调整板长、硬度和固定器角度',
        icon: 'Sparkles',
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

function ridingStyleFromInfo(info: GuestInfo): RidingStyle {
  if (info.ridingStyle) return info.ridingStyle
  if (info.experience === 'beginner') return 'first_time'
  if (info.slopePreference === 'park') return 'park'
  if (info.slopePreference === 'advanced' || info.experience === 'advanced') return 'advanced_slope'
  return 'carving'
}

function recommendSnowboard(info: GuestInfo): SizeRecommendation {
  const style = ridingStyleFromInfo(info)
  const calib = ridingStyleCalibrationMap[style]

  let baseSize = '155cm'
  const match = heightBoardChart.find(
    c => info.height >= c.minHeight && info.height < c.maxHeight
  )
  if (match) baseSize = match.boardSize

  const baseLen = parseInt(baseSize)
  const adjustedLen = baseLen + calib.boardLengthAdjustment
  let boardSize = `${adjustedLen}cm`

  if (calib.boardWidth === 'wide') {
    const wideSize = `${boardSize}-wide`
    if (getStock('snowboard', wideSize) > 0) {
      boardSize = wideSize
    }
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
  reasons.push(`身高 ${info.height}cm → 基础板长 ${baseSize}`)
  if (calib.boardLengthAdjustment !== 0) {
    const dir = calib.boardLengthAdjustment > 0 ? '增加' : '缩短'
    reasons.push(`${dir} ${Math.abs(calib.boardLengthAdjustment)}cm（${style === 'park' ? '公园道具操控灵活' : style === 'advanced_slope' ? '高级道高速稳定' : style === 'first_time' ? '新手更容易操控' : '标准刻雪长度'}）`)
  }
  reasons.push(`硬度：${boardFlexLabels[calib.boardFlex]}`)
  if (calib.boardWidth === 'wide') reasons.push('加宽板：大脚/粉雪友好')

  const substituteOptions: SubstituteOption[] = []
  if (stock === 0) {
    const subs = getSubstituteBoards(`${baseLen}cm`)
    subs.forEach((s, idx) => {
      substituteOptions.push({
        id: `board-sub-${idx}`,
        type: s.type,
        label: substituteTypeLabels[s.type],
        size: s.size,
        description: s.type === 'wide_board'
          ? '加宽板，脚大不易出界，粉雪浮力更好'
          : s.type === 'flex_diff'
          ? s.size.includes('soft') ? '软板，容错率高但高速易颤' : '硬板，高速稳定但操控要求高'
          : s.size.includes('wide') ? '加宽板，粉雪和大脚友好' : '相邻长度，性能接近原推荐',
        risks: s.type === 'flex_diff'
          ? s.size.includes('soft') ? ['高速刻雪可能发颤', '陡坡抓雪力不足'] : ['新手不易操控', '容错率较低']
          : s.type === 'adjacent_length'
          ? ['板长差异可能影响操控感', '需适应新的平衡点']
          : ['雪板更重', '需要更大的立刃角度'],
        stockCount: getStock('snowboard', s.size),
        suitableSnowConditions: snowConditionLabels[s.type] ?? [],
      })
    })
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
    styleCalibration: {
      boardLengthAdjustment: calib.boardLengthAdjustment,
      boardFlex: calib.boardFlex,
      bindingAngles: calib.bindingAngles,
      bootFit: calib.bootFit,
      boardWidth: calib.boardWidth,
    },
    notRecommendedSize: {
      size: calib.notRecommended.size,
      reason: calib.notRecommended.reason,
      illustration: calib.notRecommended.illustration,
    },
    substituteOptions: substituteOptions.length > 0 ? substituteOptions : undefined,
  }
}

function recommendBoots(info: GuestInfo): SizeRecommendation {
  const style = ridingStyleFromInfo(info)
  const calib = ridingStyleCalibrationMap[style]

  const bootSize = footLengthToBootSize(info.footLength)
  let finalSize = bootSize

  if (calib.bootFit === 'comfort') {
    const comfortSize = `${bootSize}-comfort`
    if (getStock('boots', comfortSize) > 0) finalSize = comfortSize
  } else if (calib.bootFit === 'performance') {
    const perfSize = `${bootSize}-performance`
    if (getStock('boots', perfSize) > 0) finalSize = perfSize
  }

  const stock = getStock('boots', finalSize)
  const isLowStock = checkLowStock('boots', finalSize)

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

  const substituteOptions: SubstituteOption[] = []
  if (stock === 0) {
    const subs = getSubstituteBoots(bootSize)
    subs.forEach((s, idx) => {
      substituteOptions.push({
        id: `boot-sub-${idx}`,
        type: s.type,
        label: substituteTypeLabels[s.type],
        size: s.size,
        description: s.type === 'boot_fit_diff'
          ? s.size.includes('comfort') ? '舒适款：鞋仓宽松，全天滑行不累脚' : '性能款：紧致包裹，力传导直接'
          : '相邻尺码：建议现场试穿确认包裹感',
        risks: s.type === 'adjacent_length'
          ? ['尺码不合脚可能导致磨脚', '影响发力和操控']
          : ['包裹感变化需要适应', '长时间滑行可能疲劳'],
        stockCount: getStock('boots', s.size),
        suitableSnowConditions: snowConditionLabels[s.type] ?? [],
      })
    })
  }

  return {
    category: 'boots',
    label: '雪鞋',
    icon: 'Footprints',
    recommendedSize: finalSize,
    alternativeSizes: altSizes,
    stockCount: stock,
    isLowStock,
    reason: `脚长 ${info.footLength}mm → 鞋码 ${bootSize}（${bootFitLabels[calib.bootFit]}）`,
    riskLevel,
    riskMessage,
    substituteOptions: substituteOptions.length > 0 ? substituteOptions : undefined,
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
