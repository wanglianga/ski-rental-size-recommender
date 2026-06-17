<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-vue-next'
import { useRecommendation } from '@/composables/useRecommendation'
import { useRentalStore } from '@/composables/useRentalStore'
import RecommendationCard from '@/components/guest/RecommendationCard.vue'
import RiskAlerts from '@/components/guest/RiskAlerts.vue'

const router = useRouter()
const { guestInfo, recommendations, riskAlerts, depositAmount } = useRecommendation()
const { createOrder } = useRentalStore()

function confirmOrder() {
  const order = createOrder({
    guestInfo: guestInfo.value,
    recommendations: recommendations.value,
    depositAmount: depositAmount.value,
  })
  router.push(`/guest/confirm?orderId=${order.orderId}`)
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-950 via-slate-950 to-gray-950 flex flex-col">
    <div class="sticky top-0 z-20 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
      <div class="flex items-center justify-between px-4 py-3">
        <button @click="router.back()" class="p-2.5 -ml-2 rounded-xl hover:bg-white/5 transition-colors active:scale-95">
          <ChevronLeft :size="22" class="text-slate-400" />
        </button>
        <div class="text-white font-bold text-sm">尺码推荐</div>
        <div class="w-10" />
      </div>
    </div>

    <div class="flex-1 px-4 py-6 overflow-y-auto space-y-5">
      <RiskAlerts :alerts="riskAlerts" />

      <div class="space-y-3">
        <RecommendationCard
          v-for="(rec, idx) in recommendations"
          :key="rec.category"
          :recommendation="rec"
          class="fade-up"
          :class="`stagger-${idx + 1}`"
        />
      </div>

      <div class="frost-card-strong rounded-2xl p-5 ring-1 ring-white/5">
        <div class="flex items-center justify-between">
          <span class="text-slate-400 text-sm font-medium">押金合计</span>
          <span class="font-black text-3xl aurora-text tracking-tight">¥{{ depositAmount }}</span>
        </div>
        <div class="text-xs text-slate-500 mt-1.5">
          归还时确认无损后全额退还
        </div>
      </div>

      <Transition name="alert">
        <div v-if="guestInfo.age <= 12"
          class="flex items-center gap-2.5 bg-purple-500/10 border border-purple-500/20 ring-1 ring-purple-500/10 text-purple-300 text-sm rounded-xl px-4 py-3"
        >
          <AlertCircle :size="16" />
          儿童租赁需监护人在柜台签字确认
        </div>
      </Transition>
    </div>

    <div class="sticky bottom-0 z-20 bg-gray-950/80 backdrop-blur-xl border-t border-white/5 px-4 py-4">
      <button
        @click="confirmOrder"
        class="w-full py-4 rounded-2xl font-bold text-base btn-primary flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
      >
        <CheckCircle :size="20" />
        确认推荐，生成取件码
      </button>
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
