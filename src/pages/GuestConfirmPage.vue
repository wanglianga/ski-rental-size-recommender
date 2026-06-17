<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle, Clock, Home, AlertTriangle } from 'lucide-vue-next'
import { useRentalStore } from '@/composables/useRentalStore'
import type { RentalOrder } from '@/types'

const route = useRoute()
const router = useRouter()
const { getOrder } = useRentalStore()

const order = ref<RentalOrder | null>(null)
const countdown = ref(300)
const showContent = ref(false)

onMounted(() => {
  const orderId = route.query.orderId as string
  if (orderId) {
    order.value = getOrder(orderId) ?? null
  }
  setTimeout(() => { showContent.value = true }, 100)
  const timer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(timer)
    }
  }, 1000)
  onUnmounted(() => clearInterval(timer))
})

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const equipmentRows = [
  { key: 'snowboard', label: '雪板' },
  { key: 'boots', label: '雪鞋' },
  { key: 'helmet', label: '头盔' },
  { key: 'goggles', label: '护目镜' },
  { key: 'protection', label: '护具' },
] as const
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-slate-950 to-gray-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

    <div v-if="order" class="w-full max-w-sm text-center space-y-6 relative z-10">
      <Transition name="pop">
        <div v-if="showContent" class="flex justify-center">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400/20 to-teal-500/20 ring-2 ring-emerald-500/30 flex items-center justify-center"
            style="animation: float 3s ease-in-out infinite"
          >
            <CheckCircle :size="44" class="text-emerald-400" />
          </div>
        </div>
      </Transition>

      <Transition name="pop">
        <div v-if="showContent">
          <h2 class="text-white font-black text-2xl mb-2 tracking-tight">取件码</h2>
          <div class="aurora-text font-black text-7xl tracking-[0.2em] my-4"
            style="animation: count-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: 0.2s"
          >
            {{ order.pickupNumber }}
          </div>
          <p class="text-slate-400 text-sm">请前往柜台出示取件码</p>
        </div>
      </Transition>

      <Transition name="slide-up">
        <div v-if="showContent" class="frost-card rounded-2xl p-5 ring-1 ring-white/5 space-y-3 text-left">
          <div v-for="row in equipmentRows" :key="row.key"
            class="flex items-center justify-between text-sm"
          >
            <span class="text-slate-500">{{ row.label }}</span>
            <span class="text-white font-semibold">{{ order.recommendations.find(r => r.category === row.key)?.recommendedSize }}</span>
          </div>
          <div class="border-t border-white/5 pt-3 flex items-center justify-between">
            <span class="text-slate-400 text-sm">押金</span>
            <span class="font-black text-xl aurora-text">¥{{ order.depositAmount }}</span>
          </div>
        </div>
      </Transition>

      <Transition name="slide-up">
        <div v-if="showContent" class="flex items-center justify-center gap-2 text-xs"
          :class="countdown > 60 ? 'text-slate-500' : 'text-orange-400'"
        >
          <Clock :size="14" />
          <span>取件有效期：{{ formatCountdown(countdown) }}</span>
        </div>
      </Transition>

      <Transition name="slide-up">
        <div v-if="showContent && countdown <= 60 && countdown > 0"
          class="flex items-center gap-2 justify-center text-orange-300 text-xs"
        >
          <AlertTriangle :size="14" />
          取件码即将过期，请尽快前往柜台
        </div>
      </Transition>

      <Transition name="slide-up">
        <button v-if="showContent"
          @click="router.push('/')"
          class="w-full py-4 rounded-2xl font-bold text-base frost-card ring-1 ring-white/5 text-slate-300 hover:border-white/15 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
        >
          <Home :size="18" />
          返回首页
        </button>
      </Transition>
    </div>

    <div v-else class="text-center text-slate-500">
      <p>未找到订单信息</p>
      <button @click="router.push('/')" class="mt-4 text-sky-400 text-sm underline underline-offset-2">返回首页</button>
    </div>
  </div>
</template>

<style scoped>
.pop-enter-active {
  animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}
.pop-leave-active {
  animation: popIn 0.2s ease reverse;
}
.slide-up-enter-active {
  animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: 0.3s;
}
.slide-up-leave-active {
  animation: slideUp 0.2s ease reverse;
}
@keyframes popIn {
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
