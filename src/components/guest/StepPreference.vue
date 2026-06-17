<script setup lang="ts">
import { Activity, Mountain, Trees, Construction } from 'lucide-vue-next'
import type { GuestInfo, Experience, SlopePreference } from '@/types'
import { experienceLabels, slopeLabels } from '@/data/sizeCharts'

const props = defineProps<{
  modelValue: GuestInfo
}>()

const emit = defineEmits<{
  'update:modelValue': [value: GuestInfo]
}>()

function update(patch: Partial<GuestInfo>) {
  emit('update:modelValue', { ...props.modelValue, ...patch })
}

const experienceOptions: { value: Experience; label: string; icon: any; desc: string; gradient: string }[] = [
  { value: 'beginner', label: experienceLabels.beginner, icon: Activity, desc: '第一次或刚开始学', gradient: 'from-emerald-400 to-teal-500' },
  { value: 'intermediate', label: experienceLabels.intermediate, icon: Mountain, desc: '能独立滑行和转弯', gradient: 'from-sky-400 to-blue-500' },
  { value: 'advanced', label: experienceLabels.advanced, icon: Trees, desc: '熟练控板、可挑战陡坡', gradient: 'from-orange-400 to-red-500' },
]

const slopeOptions: { value: SlopePreference; label: string; icon: any; desc: string }[] = [
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
        <div class="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
          <Activity :size="16" class="text-indigo-400" />
        </div>
        滑行经验
      </h3>
      <div class="space-y-3">
        <button
          v-for="(opt, idx) in experienceOptions"
          :key="opt.value"
          @click="update({ experience: opt.value })"
          class="w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98] fade-up"
          :class="[
            `stagger-${idx + 1}`,
            modelValue.experience === opt.value
              ? 'frost-card-strong border-sky-500/40 ring-1 ring-sky-500/20'
              : 'frost-card hover:border-white/15'
          ]"
        >
          <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200"
            :class="modelValue.experience === opt.value
              ? `bg-gradient-to-br ${opt.gradient} shadow-lg`
              : 'bg-white/5'"
          >
            <component :is="opt.icon" :size="22"
              :class="modelValue.experience === opt.value ? 'text-white' : 'text-slate-500'"
            />
          </div>
          <div class="text-left flex-1">
            <div class="font-bold text-base"
              :class="modelValue.experience === opt.value ? 'text-white' : 'text-slate-400'"
            >{{ opt.label }}</div>
            <div class="text-xs text-slate-500 mt-0.5">{{ opt.desc }}</div>
          </div>
          <div v-if="modelValue.experience === opt.value"
            class="w-6 h-6 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center justify-center flex-shrink-0"
          >
            <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7" /></svg>
          </div>
        </button>
      </div>
    </div>

    <div>
      <h3 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-violet-500/15 flex items-center justify-center">
          <Mountain :size="16" class="text-violet-400" />
        </div>
        雪道偏好
      </h3>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="(opt, idx) in slopeOptions"
          :key="opt.value"
          @click="update({ slopePreference: opt.value })"
          class="flex flex-col items-center gap-2.5 p-5 rounded-xl transition-all duration-200 active:scale-95 fade-up"
          :class="[
            `stagger-${idx + 1}`,
            modelValue.slopePreference === opt.value
              ? 'frost-card-strong border-sky-500/40 ring-1 ring-sky-500/20'
              : 'frost-card hover:border-white/15'
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
