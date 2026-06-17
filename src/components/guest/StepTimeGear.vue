<script setup lang="ts">
import { Clock, Moon, Shield, ShieldCheck, Hand, ShieldHalf, Sunrise } from 'lucide-vue-next'
import type { GuestInfo } from '@/types'
import { protectionGearOptions } from '@/data/sizeCharts'

const props = defineProps<{
  modelValue: GuestInfo
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GuestInfo]
}>()

function update(patch: Partial<GuestInfo>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

function toggleGear(gear: string) {
  const current = [...props.modelValue.protectionGear]
  const idx = current.indexOf(gear)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(gear)
  }
  update({ protectionGear: current })
}

const iconMap: Record<string, any> = {
  Shield,
  ShieldCheck,
  Hand,
  ShieldHalf,
}

function formatTimeSlot(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`
}

const pickupHours = Array.from({ length: 12 }, (_, i) => i + 7)
const returnHours = Array.from({ length: 14 }, (_, i) => i + 9)

function selectReturnTime(hour: number) {
  const returnTime = formatTimeSlot(hour)
  update({ returnTime, nightReturn: hour >= 17 })
}
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
          <Sunrise :size="16" class="text-amber-400" />
        </div>
        取件时间
      </h3>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="h in pickupHours"
          :key="'p'+h"
          @click="update({ pickupTime: formatTimeSlot(h) })"
          class="py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95"
          :class="modelValue.pickupTime === formatTimeSlot(h)
            ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20'
            : 'frost-card text-slate-400 hover:border-white/15'"
        >{{ formatTimeSlot(h) }}</button>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Clock :size="16" class="text-violet-400" />
        </div>
        还件时间
      </h3>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="h in returnHours"
          :key="'r'+h"
          @click="selectReturnTime(h)"
          class="py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 relative"
          :class="[
            modelValue.returnTime === formatTimeSlot(h)
              ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20'
              : h >= 17
                ? 'frost-card text-orange-300/70 ring-1 ring-orange-500/20 hover:border-orange-500/30'
                : 'frost-card text-slate-400 hover:border-white/15'
          ]"
        >{{ formatTimeSlot(h) }}</button>
      </div>
      <Transition name="alert">
        <div v-if="modelValue.nightReturn"
          class="mt-3 flex items-center gap-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-300 text-sm rounded-xl px-4 py-3"
        >
          <Moon :size="16" />
          <span>17:00后归还为夜场归还，需加收 ¥50 服务费</span>
        </div>
      </Transition>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
          <Shield :size="16" class="text-emerald-400" />
        </div>
        护具搭配（可多选）
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="gear in protectionGearOptions"
          :key="gear.value"
          @click="toggleGear(gear.value)"
          class="flex items-center gap-3 p-4 rounded-xl transition-all duration-200 active:scale-95"
          :class="modelValue.protectionGear.includes(gear.value)
            ? 'frost-card-strong border-sky-500/40 ring-1 ring-sky-500/20'
            : 'frost-card hover:border-white/15'"
        >
          <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200"
            :class="modelValue.protectionGear.includes(gear.value)
              ? 'bg-gradient-to-br from-sky-400 to-indigo-500'
              : 'bg-white/5'"
          >
            <component
              :is="iconMap[gear.icon]"
              :size="18"
              :class="modelValue.protectionGear.includes(gear.value) ? 'text-white' : 'text-slate-500'"
            />
          </div>
          <span class="font-semibold text-sm"
            :class="modelValue.protectionGear.includes(gear.value) ? 'text-white' : 'text-slate-400'"
          >{{ gear.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert-enter-active {
  animation: alertIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.alert-leave-active {
  animation: alertIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}
@keyframes alertIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
