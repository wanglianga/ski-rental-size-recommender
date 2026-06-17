<script setup lang="ts">
import { Snowflake, Footprints, HardHat, Eye, Shield, PackageOpen, PackageX, AlertTriangle } from 'lucide-vue-next'
import type { SizeRecommendation } from '@/types'

defineProps<{
  recommendation: SizeRecommendation
}>()

const iconMap: Record<string, any> = {
  Snowflake,
  Footprints,
  HardHat,
  Eye,
  Shield,
}

function stockLabel(count: number, isLowStock: boolean): string {
  if (count === 0) return '无库存'
  if (isLowStock) return `仅剩 ${count} 件`
  return `库存 ${count} 件`
}

function stockColor(count: number, isLowStock: boolean): string {
  if (count === 0) return 'text-red-400'
  if (isLowStock) return 'text-orange-400'
  return 'text-emerald-400'
}

function cardAccent(riskLevel: string): string {
  if (riskLevel === 'danger') return 'ring-red-500/30'
  if (riskLevel === 'warning') return 'ring-orange-500/30'
  if (riskLevel === 'info') return 'ring-purple-500/30'
  return 'ring-white/5'
}

function iconBg(riskLevel: string, stockCount: number): string {
  if (stockCount === 0) return 'bg-red-500/15'
  if (riskLevel === 'danger') return 'bg-red-500/15'
  if (riskLevel === 'warning') return 'bg-orange-500/15'
  if (riskLevel === 'info') return 'bg-purple-500/15'
  return 'bg-sky-500/15'
}

function iconColor(riskLevel: string, stockCount: number): string {
  if (stockCount === 0) return 'text-red-400'
  if (riskLevel === 'danger') return 'text-red-400'
  if (riskLevel === 'warning') return 'text-orange-400'
  if (riskLevel === 'info') return 'text-purple-400'
  return 'text-sky-400'
}
</script>

<template>
  <div class="frost-card rounded-2xl p-5 ring-1 transition-all duration-200"
    :class="cardAccent(recommendation.riskLevel)"
  >
    <div class="flex items-start gap-4">
      <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        :class="iconBg(recommendation.riskLevel, recommendation.stockCount)"
      >
        <component
          :is="iconMap[recommendation.icon]"
          :size="24"
          :class="iconColor(recommendation.riskLevel, recommendation.stockCount)"
        />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between gap-2">
          <span class="font-bold text-white text-base">{{ recommendation.label }}</span>
          <span class="font-black text-xl aurora-text tracking-tight">{{ recommendation.recommendedSize }}</span>
        </div>

        <div class="flex items-center gap-2 mt-1.5">
          <span class="text-xs text-slate-500">{{ recommendation.reason }}</span>
        </div>

        <div class="flex items-center justify-between mt-3">
          <span class="text-xs font-semibold flex items-center gap-1.5" :class="stockColor(recommendation.stockCount, recommendation.isLowStock)">
            <component
              :is="recommendation.stockCount === 0 ? PackageX : recommendation.isLowStock ? PackageOpen : null"
              :size="13"
              class="inline"
            />
            {{ stockLabel(recommendation.stockCount, recommendation.isLowStock) }}
          </span>
          <div v-if="recommendation.alternativeSizes.length > 0" class="flex gap-1.5">
            <span class="text-xs text-slate-500">替换：</span>
            <span
              v-for="alt in recommendation.alternativeSizes.slice(0, 3)"
              :key="alt"
              class="text-xs bg-white/5 text-slate-300 px-2 py-0.5 rounded-md ring-1 ring-white/5"
            >{{ alt }}</span>
          </div>
        </div>

        <div v-if="recommendation.riskMessage"
          class="flex items-center gap-1.5 mt-3 text-xs px-3 py-2 rounded-lg ring-1"
          :class="{
            'bg-red-500/10 text-red-300 ring-red-500/20': recommendation.riskLevel === 'danger',
            'bg-orange-500/10 text-orange-300 ring-orange-500/20': recommendation.riskLevel === 'warning',
            'bg-purple-500/10 text-purple-300 ring-purple-500/20': recommendation.riskLevel === 'info',
          }"
        >
          <AlertTriangle :size="12" />
          {{ recommendation.riskMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
