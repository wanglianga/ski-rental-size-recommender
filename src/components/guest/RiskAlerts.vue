<script setup lang="ts">
import { AlertTriangle, PackageOpen, PackageX, Moon, Baby } from 'lucide-vue-next'
import type { RiskAlert } from '@/types'

defineProps<{
  alerts: RiskAlert[]
}>()

const iconMap: Record<string, any> = {
  AlertTriangle,
  PackageOpen,
  PackageX,
  Moon,
  Baby,
}

function alertClass(level: string): string {
  if (level === 'danger') return 'bg-red-500/8 border-red-500/20 ring-red-500/10'
  if (level === 'warning') return 'bg-orange-500/8 border-orange-500/20 ring-orange-500/10'
  return 'bg-sky-500/8 border-sky-500/20 ring-sky-500/10'
}

function iconClass(level: string): string {
  if (level === 'danger') return 'text-red-400'
  if (level === 'warning') return 'text-orange-400'
  return 'text-sky-400'
}

function titleClass(level: string): string {
  if (level === 'danger') return 'text-red-300'
  if (level === 'warning') return 'text-orange-300'
  return 'text-sky-300'
}

function msgClass(level: string): string {
  if (level === 'danger') return 'text-red-400/80'
  if (level === 'warning') return 'text-orange-400/80'
  return 'text-sky-400/80'
}
</script>

<template>
  <div v-if="alerts.length > 0" class="space-y-2.5">
    <div
      v-for="(alert, idx) in alerts"
      :key="idx"
      class="flex items-start gap-3 px-4 py-3.5 rounded-xl border ring-1 fade-up"
      :class="[`stagger-${idx + 1}`, alertClass(alert.level)]"
    >
      <component
        :is="iconMap[alert.icon]"
        :size="18"
        :class="iconClass(alert.level)"
        class="flex-shrink-0 mt-0.5"
      />
      <div>
        <div class="font-bold text-sm" :class="titleClass(alert.level)">{{ alert.title }}</div>
        <div class="text-xs mt-0.5" :class="msgClass(alert.level)">{{ alert.message }}</div>
      </div>
    </div>
  </div>
</template>
