<script setup lang="ts">
import { computed } from 'vue'
import {
  Ruler, HardDrive, Move3D, Footprints, XCircle, Info,
  ArrowDown, ArrowUp, Minus, Sparkles
} from 'lucide-vue-next'
import type { SizeRecommendation, RidingStyle } from '@/types'
import {
  boardFlexLabels, boardFlexDescriptions,
  bootFitLabels, bootFitDescriptions,
  boardWidthLabels, ridingStyleLabels
} from '@/data/sizeCharts'

const props = defineProps<{
  recommendation: SizeRecommendation
  ridingStyle?: RidingStyle
}>()

const calib = computed(() => props.recommendation.styleCalibration)
const notRec = computed(() => props.recommendation.notRecommendedSize)

const stanceLabels: Record<string, string> = {
  duck: '鸭子站位',
  forward: '前进站位',
  alpine: '高山站位',
}

function lengthAdjustLabel(adj: number): string {
  if (adj > 0) return `+${adj}cm`
  if (adj < 0) return `${adj}cm`
  return '标准'
}

function lengthAdjustIcon(adj: number) {
  if (adj > 0) return ArrowUp
  if (adj < 0) return ArrowDown
  return Minus
}

function lengthAdjustColor(adj: number): string {
  if (adj > 0) return 'text-orange-400'
  if (adj < 0) return 'text-emerald-400'
  return 'text-slate-400'
}

function illustrationSvg(type: string) {
  if (type === 'longer') {
    return `<svg viewBox="0 0 200 80" class="w-full h-14">
      <line x1="20" y1="40" x2="100" y2="40" stroke="#22d3ee" stroke-width="6" stroke-linecap="round"/>
      <text x="55" y="30" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="bold">推荐</text>
      <line x1="110" y1="40" x2="190" y2="40" stroke="#f87171" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 3"/>
      <text x="150" y="30" text-anchor="middle" fill="#f87171" font-size="10" font-weight="bold">太长</text>
      <path d="M 100 40 C 130 20, 150 20, 190 40" stroke="#f87171" stroke-width="2" fill="none" stroke-dasharray="2 2"/>
    </svg>`
  }
  if (type === 'shorter') {
    return `<svg viewBox="0 0 200 80" class="w-full h-14">
      <line x1="60" y1="40" x2="180" y2="40" stroke="#22d3ee" stroke-width="6" stroke-linecap="round"/>
      <text x="115" y="30" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="bold">推荐</text>
      <line x1="10" y1="40" x2="50" y2="40" stroke="#f87171" stroke-width="6" stroke-linecap="round" stroke-dasharray="4 3"/>
      <text x="30" y="30" text-anchor="middle" fill="#f87171" font-size="10" font-weight="bold">太短</text>
      <path d="M 60 40 C 40 55, 25 55, 10 40" stroke="#f87171" stroke-width="2" fill="none" stroke-dasharray="2 2"/>
    </svg>`
  }
  return `<svg viewBox="0 0 200 80" class="w-full h-14">
    <rect x="80" y="30" width="40" height="20" rx="3" fill="#22d3ee" fill-opacity="0.2" stroke="#22d3ee" stroke-width="2"/>
    <text x="100" y="22" text-anchor="middle" fill="#22d3ee" font-size="10" font-weight="bold">推荐硬度</text>
    <rect x="20" y="33" width="30" height="14" rx="2" fill="#f87171" fill-opacity="0.15" stroke="#f87171" stroke-width="2" stroke-dasharray="3 2"/>
    <text x="35" y="22" text-anchor="middle" fill="#f87171" font-size="9">过软</text>
    <path d="M 50 40 C 60 50, 70 50, 80 40" stroke="#f87171" stroke-width="2" fill="none" stroke-dasharray="2 2"/>
  </svg>`
}
</script>

<template>
  <div v-if="calib" class="frost-card-strong rounded-2xl p-5 ring-1 ring-cyan-500/15 space-y-5">
    <div class="flex items-center gap-2.5">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500/25 to-blue-500/25 flex items-center justify-center">
        <Sparkles :size="18" class="text-cyan-400" />
      </div>
      <div>
        <div class="text-white font-bold text-sm">滑行风格校准参数</div>
        <div v-if="ridingStyle" class="text-xs text-cyan-400/80 mt-0.5">
          已匹配「{{ ridingStyleLabels[ridingStyle] }}」风格
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="frost-card rounded-xl p-3.5 ring-1 ring-white/5">
        <div class="flex items-center gap-2 mb-2">
          <component :is="lengthAdjustIcon(calib.boardLengthAdjustment)" :size="14" :class="lengthAdjustColor(calib.boardLengthAdjustment)" />
          <span class="text-slate-400 text-xs font-medium">板长调整</span>
        </div>
        <div class="font-black text-xl aurora-text">{{ lengthAdjustLabel(calib.boardLengthAdjustment) }}</div>
        <div class="text-xs text-slate-500 mt-1">
          {{ calib.boardLengthAdjustment === 0 ? '标准长度，均衡性能' : calib.boardLengthAdjustment < 0 ? '更灵活，操控轻便' : '高速更稳，抓雪更好' }}
        </div>
      </div>

      <div class="frost-card rounded-xl p-3.5 ring-1 ring-white/5">
        <div class="flex items-center gap-2 mb-2">
          <HardDrive :size="14" class="text-violet-400" />
          <span class="text-slate-400 text-xs font-medium">板硬度</span>
        </div>
        <div class="font-black text-xl aurora-text">{{ boardFlexLabels[calib.boardFlex] }}</div>
        <div class="text-xs text-slate-500 mt-1">{{ boardFlexDescriptions[calib.boardFlex] }}</div>
      </div>

      <div class="frost-card rounded-xl p-3.5 ring-1 ring-white/5">
        <div class="flex items-center gap-2 mb-2">
          <Move3D :size="14" class="text-sky-400" />
          <span class="text-slate-400 text-xs font-medium">固定器角度</span>
        </div>
        <div class="font-bold text-base text-white">
          前 {{ calib.bindingAngles.front }}° / 后 {{ calib.bindingAngles.rear }}°
        </div>
        <div class="text-xs text-slate-500 mt-1">{{ stanceLabels[calib.bindingAngles.stance] }}</div>
      </div>

      <div class="frost-card rounded-xl p-3.5 ring-1 ring-white/5">
        <div class="flex items-center gap-2 mb-2">
          <Footprints :size="14" class="text-amber-400" />
          <span class="text-slate-400 text-xs font-medium">雪鞋包裹感</span>
        </div>
        <div class="font-black text-xl aurora-text">{{ bootFitLabels[calib.bootFit] }}</div>
        <div class="text-xs text-slate-500 mt-1">{{ bootFitDescriptions[calib.bootFit] }}</div>
      </div>
    </div>

    <div v-if="calib.boardWidth === 'wide'" class="flex items-center gap-2 bg-sky-500/8 text-sky-300 text-xs px-3 py-2 rounded-xl ring-1 ring-sky-500/20">
      <Info :size="12" />
      已匹配 {{ boardWidthLabels[calib.boardWidth] }}，大脚或粉雪更友好
    </div>

    <div v-if="notRec" class="border-t border-white/5 pt-4">
      <div class="flex items-center gap-2 mb-3">
        <XCircle :size="14" class="text-red-400" />
        <span class="text-slate-300 text-xs font-semibold">为什么不推荐「{{ notRec.size }}」</span>
      </div>
      <div class="bg-gradient-to-br from-red-500/8 to-orange-500/5 rounded-xl p-3 ring-1 ring-red-500/15">
        <div v-html="illustrationSvg(notRec.illustration)" />
        <p class="text-xs text-red-300/90 leading-relaxed mt-1">{{ notRec.reason }}</p>
      </div>
    </div>
  </div>
</template>
