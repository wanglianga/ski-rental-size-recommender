<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight, User, Mountain, Clock } from 'lucide-vue-next'
import { useRecommendation } from '@/composables/useRecommendation'
import StepBasicInfo from '@/components/guest/StepBasicInfo.vue'
import StepPreference from '@/components/guest/StepPreference.vue'
import StepTimeGear from '@/components/guest/StepTimeGear.vue'

const router = useRouter()
const { guestInfo, currentStep, totalSteps } = useRecommendation()

const stepMeta = [
  { title: '基本信息', icon: User, desc: '身高体重脚长', color: 'from-sky-400 to-cyan-400' },
  { title: '滑行偏好', icon: Mountain, desc: '经验与雪道', color: 'from-indigo-400 to-purple-400' },
  { title: '时间护具', icon: Clock, desc: '取还时间与护具', color: 'from-violet-400 to-fuchsia-400' },
]

const transitionName = ref('step-forward')

function canProceed(): boolean {
  if (currentStep.value === 0) {
    return guestInfo.value.height > 0 && guestInfo.value.weight > 0 && guestInfo.value.footLength > 0
  }
  if (currentStep.value === 1) {
    return !!guestInfo.value.experience && !!guestInfo.value.slopePreference
  }
  if (currentStep.value === 2) {
    return !!guestInfo.value.pickupTime && !!guestInfo.value.returnTime
  }
  return true
}

function nextStep() {
  if (currentStep.value < totalSteps - 1) {
    transitionName.value = 'step-forward'
    currentStep.value++
  } else {
    router.push('/guest/result')
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    transitionName.value = 'step-back'
    currentStep.value--
  } else {
    router.push('/')
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-slate-950 to-gray-950 flex flex-col relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl pointer-events-none z-0 transition-all duration-700"
      :class="[
        currentStep === 0 ? 'bg-sky-500/5' : currentStep === 1 ? 'bg-indigo-500/5' : 'bg-violet-500/5'
      ]"
    />

    <div class="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="prevStep" class="p-2.5 -ml-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
          <ChevronLeft :size="22" class="text-slate-400" />
        </button>
        <div class="text-center">
          <div class="text-white font-bold text-sm">步骤 {{ currentStep + 1 }} / {{ totalSteps }}</div>
          <div class="text-slate-500 text-xs">{{ stepMeta[currentStep].desc }}</div>
        </div>
        <div class="w-10" />
      </div>

      <div class="px-4 pb-3">
        <div class="flex gap-1.5">
          <div
            v-for="i in totalSteps"
            :key="i"
            class="h-1.5 flex-1 rounded-full transition-all duration-500 ease-out"
            :class="i - 1 < currentStep
              ? 'bg-gradient-to-r from-sky-400 to-indigo-400'
              : i - 1 === currentStep
                ? 'bg-gradient-to-r from-sky-400/60 to-indigo-400/60'
                : 'bg-white/5'"
          />
        </div>
      </div>
    </div>

    <div class="flex-1 px-4 py-6 overflow-y-auto relative z-10">
      <div class="flex items-center gap-3 mb-6 fade-up" :key="'header-'+currentStep">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg"
          :class="stepMeta[currentStep].color"
          style="box-shadow: 0 4px 20px rgba(56, 189, 248, 0.15)"
        >
          <component :is="stepMeta[currentStep].icon" :size="22" class="text-white" />
        </div>
        <div>
          <h2 class="text-white font-extrabold text-xl tracking-tight">{{ stepMeta[currentStep].title }}</h2>
          <p class="text-slate-500 text-xs">{{ stepMeta[currentStep].desc }}</p>
        </div>
      </div>

      <Transition :name="transitionName" mode="out-in">
        <StepBasicInfo v-if="currentStep === 0" v-model="guestInfo" key="basic" />
        <StepPreference v-else-if="currentStep === 1" v-model="guestInfo" key="pref" />
        <StepTimeGear v-else-if="currentStep === 2" v-model="guestInfo" key="time" />
      </Transition>
    </div>

    <div class="sticky bottom-0 z-20 bg-gray-950/80 backdrop-blur-xl border-t border-white/5 px-4 py-4 safe-area-bottom">
      <button
        @click="nextStep"
        :disabled="!canProceed()"
        class="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.97]"
        :class="canProceed()
          ? 'btn-primary'
          : 'bg-white/5 text-white/20 cursor-not-allowed'"
      >
        {{ currentStep === totalSteps - 1 ? '查看推荐结果' : '下一步' }}
        <ChevronRight v-if="currentStep < totalSteps - 1" :size="18" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.step-forward-enter-active {
  animation: stepIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-forward-leave-active {
  animation: stepOut 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-back-enter-active {
  animation: stepBackIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
.step-back-leave-active {
  animation: stepBackOut 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes stepIn {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes stepOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(-40px); }
}
@keyframes stepBackIn {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes stepBackOut {
  from { opacity: 1; transform: translateX(0); }
  to { opacity: 0; transform: translateX(40px); }
}
</style>
