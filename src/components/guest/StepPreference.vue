<script setup lang="ts">
import { Activity, Mountain, Trees, Construction, Sparkles } from 'lucide-vue-next'
import type { GuestInfo, RidingStyle } from '@/types'
import { experienceLabels, slopeLabels, ridingStyleLabels, ridingStyleDescriptions } from '@/data/sizeCharts'

const props = defineProps<{
  modelValue: GuestInfo
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GuestInfo]
}>()

function update(patch: Partial<GuestInfo>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

function selectRidingStyle(style: RidingStyle) {
  let experience: GuestInfo['experience'] = 'intermediate'
  let slopePreference: GuestInfo['slopePreference'] = 'intermediate'

  switch (style) {
    case 'first_time':
      experience = 'beginner'
      slopePreference = 'beginner'
      break
    case 'carving':
      experience = 'intermediate'
      slopePreference = 'intermediate'
      break
    case 'park':
      experience = 'intermediate'
      slopePreference = 'park'
      break
    case 'advanced_slope':
      experience = 'advanced'
      slopePreference = 'advanced'
      break
  }

  emit('update:modelValue', {
    ...props.modelValue,
    ridingStyle: style,
    experience,
    slopePreference,
  })
}

const ridingStyleOptions: {
  value: RidingStyle
  label: string
  icon: any
  desc: string
  gradient: string
  color: string
}[] = [
  {
    value: 'first_time',
    label: ridingStyleLabels.first_time,
    icon: Activity,
    desc: ridingStyleDescriptions.first_time,
    gradient: 'from-emerald-400 to-teal-500',
    color: 'emerald',
  },
  {
    value: 'carving',
    label: ridingStyleLabels.carving,
    icon: Mountain,
    desc: ridingStyleDescriptions.carving,
    gradient: 'from-sky-400 to-blue-500',
    color: 'sky',
  },
  {
    value: 'park',
    label: ridingStyleLabels.park,
    icon: Construction,
    desc: ridingStyleDescriptions.park,
    gradient: 'from-violet-400 to-purple-500',
    color: 'violet',
  },
  {
    value: 'advanced_slope',
    label: ridingStyleLabels.advanced_slope,
    icon: Trees,
    desc: ridingStyleDescriptions.advanced_slope,
    gradient: 'from-orange-400 to-red-500',
    color: 'orange',
  },
]

const experienceOptions: { value: GuestInfo['experience']; label: string; icon: any; desc: string; gradient: string }[] = [
  { value: 'beginner', label: experienceLabels.beginner, icon: Activity, desc: '第一次或刚开始学', gradient: 'from-emerald-400 to-teal-500' },
  { value: 'intermediate', label: experienceLabels.intermediate, icon: Mountain, desc: '能独立滑行和转弯', gradient: 'from-sky-400 to-blue-500' },
  { value: 'advanced', label: experienceLabels.advanced, icon: Trees, desc: '熟练控板、可挑战陡坡', gradient: 'from-orange-400 to-red-500' },
]

const slopeOptions: { value: GuestInfo['slopePreference']; label: string; icon: any; desc: string }[] = [
  { value: 'beginner', label: slopeLabels.beginner, icon: Mountain, desc: '缓坡练习' },
  { value: 'intermediate', label: slopeLabels.intermediate, icon: Trees, desc: '中等坡度' },
  { value: 'advanced', label: slopeLabels.advanced, icon: Mountain, desc: '陡坡挑战' },
  { value: 'park', label: slopeLabels.park, icon: Construction, desc: '道具公园' },
]
</script>

<template>
  <div class="space-y-8">
    <div>
      <h3 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
          <Sparkles :size="16" class="text-cyan-400" />
        </div>
        滑行风格校准
        <span class="text-xs text-slate-500 font-normal ml-1">（智能匹配装备参数）</span>
      </h3>
      <div class="space-y-3">
        <button
          v-for="(opt, idx) in ridingStyleOptions"
          :key="opt.value"
          @click="selectRidingStyle(opt.value)"
          class="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98] fade-up"
          :class="[
            `stagger-${idx + 1}`,
            modelValue.ridingStyle === opt.value
              ? 'frost-card-strong border-sky-500/40 ring-1 ring-sky-500/20'
              : 'frost-card hover:border-white/15'
          ]"
        >
          <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
            :class="modelValue.ridingStyle === opt.value
              ? `bg-gradient-to-br ${opt.gradient} shadow-lg`
              : 'bg-white/5'"
          >
            <component :is="opt.icon" :size="22"
              :class="modelValue.ridingStyle === opt.value ? 'text-white' : 'text-slate-500'"
            />
          </div>
          <div class="text-left flex-1">
            <div class="font-bold text-base"
              :class="modelValue.ridingStyle === opt.value ? 'text-white' : 'text-slate-400'"
            >{{ opt.label }}</div>
            <div class="text-xs text-slate-500 mt-0.5">{{ opt.desc }}</div>
          </div>
          <div v-if="modelValue.ridingStyle === opt.value"
            class="w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7" /></svg>
          </div>
        </button>
      </div>
      <p v-if="modelValue.ridingStyle" class="mt-3 text-xs text-slate-500 flex items-center gap-1.5">
        <Sparkles :size="12" class="text-cyan-400" />
        已根据您的风格自动调整板长、硬度、固定器角度
      </p>
    </div>

    <div class="border-t border-white/5 pt-6">
      <h3 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <Activity :size="16" class="text-indigo-400" />
        </div>
        滑行经验
        <span class="text-xs text-slate-500 font-normal ml-1">（可选，风格校准已自动填写）</span>
      </h3>
      <div class="space-y-3">
        <button
          v-for="(opt, idx) in experienceOptions"
          :key="opt.value"
          @click="update({ experience: opt.value })"
          class="w-full flex items-center gap-4 p-3.5 rounded-xl transition-all duration-200 active:scale-[0.98] fade-up"
          :class="[
            `stagger-${idx + 1}`,
            modelValue.experience === opt.value
              ? 'frost-card-strong border-sky-500/40 ring-1 ring-sky-500/20'
              : 'frost-card hover:border-white/15 opacity-70'
          ]"
        >
          <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            :class="modelValue.experience === opt.value
              ? `bg-gradient-to-br ${opt.gradient} shadow-lg`
              : 'bg-white/5'"
          >
            <component :is="opt.icon" :size="18"
              :class="modelValue.experience === opt.value ? 'text-white' : 'text-slate-500'"
            />
          </div>
          <div class="text-left flex-1">
            <div class="font-bold text-sm"
              :class="modelValue.experience === opt.value ? 'text-white' : 'text-slate-400'"
            >{{ opt.label }}</div>
            <div class="text-xs text-slate-500 mt-0.5">{{ opt.desc }}</div>
          </div>
        </button>
      </div>
    </div>

    <div class="border-t border-white/5 pt-6">
      <h3 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Mountain :size="16" class="text-violet-400" />
        </div>
        雪道偏好
        <span class="text-xs text-slate-500 font-normal ml-1">（可选，风格校准已自动填写）</span>
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="(opt, idx) in slopeOptions"
          :key="opt.value"
          @click="update({ slopePreference: opt.value })"
          class="flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-200 active:scale-95 fade-up"
          :class="[
            `stagger-${idx + 1}`,
            modelValue.slopePreference === opt.value
              ? 'frost-card-strong border-sky-500/40 ring-1 ring-sky-500/20'
              : 'frost-card hover:border-white/15 opacity-70'
          ]"
        >
          <div class="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            :class="modelValue.slopePreference === opt.value
              ? 'bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-500/20'
              : 'bg-white/5'"
          >
            <component :is="opt.icon" :size="20"
              :class="modelValue.slopePreference === opt.value ? 'text-white' : 'text-slate-500'"
            />
          </div>
          <span class="font-bold text-sm"
            :class="modelValue.slopePreference === opt.value ? 'text-white' : 'text-slate-400'"
          >{{ opt.label }}</span>
          <span class="text-xs text-slate-500">{{ opt.desc }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
