<script setup lang="ts">
import { Ruler, Weight, Footprints, User, Baby } from 'lucide-vue-next'
import type { GuestInfo } from '@/types'
import { footLengthChart } from '@/data/sizeCharts'

const props = defineProps<{
  modelValue: GuestInfo
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GuestInfo]
}>()

function update(patch: Partial<GuestInfo>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

const showFootChart = defineModel<boolean>('showFootChart', { default: false })

function heightPercent(): number {
  return ((props.modelValue.height - 100) / 110) * 100
}
function weightPercent(): number {
  return ((props.modelValue.weight - 15) / 135) * 100
}
function footPercent(): number {
  return ((props.modelValue.footLength - 200) / 100) * 100
}
function agePercent(): number {
  return ((props.modelValue.age - 3) / 77) * 100
}
</script>

<template>
  <div class="space-y-7">
    <div class="frost-card rounded-2xl p-5">
      <label class="flex items-center justify-between mb-4">
        <span class="flex items-center gap-2.5 text-sm font-semibold text-slate-300">
          <div class="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
            <Ruler :size="16" class="text-sky-400" />
          </div>
          身高
        </span>
        <span class="aurora-text font-black text-2xl tracking-tight">{{ modelValue.height }} <span class="text-sm font-medium">cm</span></span>
      </label>
      <input
        type="range"
        :min="100"
        :max="210"
        :value="modelValue.height"
        @input="update({ height: Number(($event.target as HTMLInputElement).value) })"
        class="w-full"
      />
      <div class="flex justify-between text-xs text-slate-600 mt-2">
        <span>100cm</span>
        <div class="flex-1 mx-3 h-px bg-white/5 relative">
          <div class="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-sky-400/40"
            :style="{ left: heightPercent() + '%' }" />
        </div>
        <span>210cm</span>
      </div>
    </div>

    <div class="frost-card rounded-2xl p-5">
      <label class="flex items-center justify-between mb-4">
        <span class="flex items-center gap-2.5 text-sm font-semibold text-slate-300">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
            <Weight :size="16" class="text-indigo-400" />
          </div>
          体重
        </span>
        <span class="aurora-text font-black text-2xl tracking-tight">{{ modelValue.weight }} <span class="text-sm font-medium">kg</span></span>
      </label>
      <input
        type="range"
        :min="15"
        :max="150"
        :value="modelValue.weight"
        @input="update({ weight: Number(($event.target as HTMLInputElement).value) })"
        class="w-full"
      />
      <div class="flex justify-between text-xs text-slate-600 mt-2">
        <span>15kg</span>
        <div class="flex-1 mx-3 h-px bg-white/5 relative">
          <div class="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-400/40"
            :style="{ left: weightPercent() + '%' }" />
        </div>
        <span>150kg</span>
      </div>
    </div>

    <div class="frost-card rounded-2xl p-5">
      <label class="flex items-center justify-between mb-4">
        <span class="flex items-center gap-2.5 text-sm font-semibold text-slate-300">
          <div class="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
            <Footprints :size="16" class="text-cyan-400" />
          </div>
          脚长
        </span>
        <span class="aurora-text font-black text-2xl tracking-tight">{{ modelValue.footLength }} <span class="text-sm font-medium">mm</span></span>
      </label>
      <input
        type="range"
        :min="200"
        :max="300"
        :step="1"
        :value="modelValue.footLength"
        @input="update({ footLength: Number(($event.target as HTMLInputElement).value) })"
        class="w-full"
      />
      <div class="flex justify-between text-xs text-slate-600 mt-2">
        <span>200mm</span>
        <div class="flex-1 mx-3 h-px bg-white/5 relative">
          <div class="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-cyan-400/40"
            :style="{ left: footPercent() + '%' }" />
        </div>
        <span>300mm</span>
      </div>
      <button
        @click="showFootChart = !showFootChart"
        class="text-xs text-sky-400 hover:text-sky-300 mt-3 underline underline-offset-2 transition-colors"
      >
        {{ showFootChart ? '收起尺码对照表' : '📏 查看脚长↔鞋码对照表' }}
      </button>
      <Transition name="chart">
        <div v-if="showFootChart" class="mt-3 frost-card rounded-xl p-3 text-xs">
          <div class="grid grid-cols-2 gap-1">
            <div v-for="row in footLengthChart" :key="row.euSize"
              class="flex justify-between px-2 py-1.5 rounded-lg transition-colors"
              :class="modelValue.footLength >= row.minMm && modelValue.footLength < row.maxMm
                ? 'bg-sky-500/20 text-sky-300 font-bold ring-1 ring-sky-500/30'
                : 'text-slate-400'"
            >
              <span>{{ row.euSize }}码</span>
              <span>{{ row.minMm }}-{{ row.maxMm }}mm</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <div class="frost-card rounded-2xl p-5">
      <label class="flex items-center gap-2.5 text-sm font-semibold text-slate-300 mb-4">
        <div class="w-8 h-8 rounded-lg bg-pink-500/15 flex items-center justify-center">
          <User :size="16" class="text-pink-400" />
        </div>
        性别
      </label>
      <div class="grid grid-cols-2 gap-3">
        <button
          @click="update({ gender: 'male' })"
          class="py-4 rounded-xl text-base font-semibold transition-all duration-200 active:scale-95"
          :class="modelValue.gender === 'male'
            ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25'
            : 'frost-card text-slate-400 hover:border-white/15'"
        >♂ 男</button>
        <button
          @click="update({ gender: 'female' })"
          class="py-4 rounded-xl text-base font-semibold transition-all duration-200 active:scale-95"
          :class="modelValue.gender === 'female'
            ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/25'
            : 'frost-card text-slate-400 hover:border-white/15'"
        >♀ 女</button>
      </div>
    </div>

    <div class="frost-card rounded-2xl p-5">
      <label class="flex items-center justify-between mb-4">
        <span class="flex items-center gap-2.5 text-sm font-semibold text-slate-300">
          <div class="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Baby :size="16" class="text-amber-400" />
          </div>
          年龄
        </span>
        <span class="aurora-text font-black text-2xl tracking-tight">{{ modelValue.age }} <span class="text-sm font-medium">岁</span></span>
      </label>
      <input
        type="range"
        :min="3"
        :max="80"
        :value="modelValue.age"
        @input="update({ age: Number(($event.target as HTMLInputElement).value) })"
        class="w-full"
      />
      <div class="flex justify-between text-xs text-slate-600 mt-2">
        <span>3岁</span>
        <div class="flex-1 mx-3 h-px bg-white/5 relative">
          <div class="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-amber-400/40"
            :style="{ left: agePercent() + '%' }" />
        </div>
        <span>80岁</span>
      </div>
      <Transition name="chart">
        <div v-if="modelValue.age <= 12"
          class="mt-3 flex items-center gap-2.5 bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm rounded-xl px-4 py-3"
        >
          <Baby :size="16" />
          <span>儿童尺码将自动推荐，需监护人确认</span>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.chart-enter-active {
  animation: fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.chart-leave-active {
  animation: fadeUp 0.2s cubic-bezier(0.16, 1, 0.3, 1) reverse;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
