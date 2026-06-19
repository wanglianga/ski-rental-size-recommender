<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronLeft, Snowflake, Footprints, HardHat, Eye, Shield,
  CheckCircle, Clock, AlertTriangle, Package, RotateCcw, DollarSign, Hash,
  User, ArrowRightLeft, Moon, PackageX, Sparkles
} from 'lucide-vue-next'
import { useRentalStore } from '@/composables/useRentalStore'
import type { SizeRecommendation } from '@/types'
import { depositPrices, ridingStyleLabels, boardFlexLabels, bootFitLabels } from '@/data/sizeCharts'
import CounterAlternativeConfirm from '@/components/CounterAlternativeConfirm.vue'

const router = useRouter()
const { pendingOrders, confirmedOrders, allOrders, updateOrderStatus } = useRentalStore()

const selectedOrderId = ref<string | null>(null)
const exchangeCountdown = ref<Record<string, number>>({})
const now = ref(Date.now())
const showAltConfirm = ref(false)
const appliedSubstitutes = ref<Record<string, Record<string, string>>>({})

const selectedOrder = computed(() => {
  if (!selectedOrderId.value) return null
  return allOrders.value.find(o => o.orderId === selectedOrderId.value) ?? null
})

const hasOutOfStockWithAlternatives = computed(() => {
  if (!selectedOrder.value) return false
  return selectedOrder.value.recommendations.some(
    r => r.stockCount === 0 && r.substituteOptions && r.substituteOptions.length > 0
  )
})

function selectOrder(orderId: string) {
  selectedOrderId.value = orderId
}

function handleConfirmPickup() {
  if (!selectedOrder.value) return
  if (hasOutOfStockWithAlternatives.value) {
    showAltConfirm.value = true
  } else {
    confirmPickup(selectedOrder.value.orderId)
  }
}

function confirmPickup(orderId: string) {
  updateOrderStatus(orderId, 'picked_up')
  selectedOrderId.value = null
}

function onAltConfirm(selected: Record<string, string>) {
  if (!selectedOrder.value) return
  appliedSubstitutes.value[selectedOrder.value.orderId] = selected
  showAltConfirm.value = false
  confirmPickup(selectedOrder.value.orderId)
}

function confirmReturn(orderId: string) {
  updateOrderStatus(orderId, 'returned')
  selectedOrderId.value = null
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function timeAgo(iso: string): string {
  const diff = Math.floor((now.value - new Date(iso).getTime()) / 60000)
  if (diff < 1) return '刚刚'
  if (diff < 60) return `${diff}分钟前`
  return `${Math.floor(diff / 60)}小时前`
}

const iconMap: Record<string, any> = { Snowflake, Footprints, HardHat, Eye, Shield }

function startExchangeTimer(orderId: string) {
  exchangeCountdown.value[orderId] = 600
}

const timer = setInterval(() => {
  now.value = Date.now()
  for (const key of Object.keys(exchangeCountdown.value)) {
    if (exchangeCountdown.value[key] > 0) {
      exchangeCountdown.value[key]--
    }
  }
}, 1000)

onMounted(() => { now.value = Date.now() })
onUnmounted(() => clearInterval(timer))

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

function statusLabel(status: string): string {
  const map: Record<string, string> = {
    pending: '待取件',
    confirmed: '已确认',
    picked_up: '已取件',
    returned: '已归还',
  }
  return map[status] ?? status
}

function statusStyle(status: string): string {
  const map: Record<string, string> = {
    pending: 'bg-sky-500/15 text-sky-400 ring-1 ring-sky-500/20',
    confirmed: 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20',
    picked_up: 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20',
    returned: 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/20',
  }
  return map[status] ?? 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/20'
}

function recBorderColor(rec: SizeRecommendation): string {
  if (rec.riskLevel === 'danger') return 'ring-red-500/25'
  if (rec.riskLevel === 'warning') return 'ring-orange-500/25'
  if (rec.riskLevel === 'info') return 'ring-purple-500/25'
  return 'ring-white/5'
}

function recIconBg(rec: SizeRecommendation): string {
  if (rec.stockCount === 0) return 'bg-red-500/15'
  return 'bg-sky-500/15'
}

function recIconColor(rec: SizeRecommendation): string {
  if (rec.stockCount === 0) return 'text-red-400'
  return 'text-sky-400'
}

function stockStyle(rec: SizeRecommendation): string {
  if (rec.stockCount === 0) return 'text-red-400'
  if (rec.isLowStock) return 'text-orange-400'
  return 'text-emerald-400'
}

function getAppliedSubstituteSize(orderId: string, category: string): string | null {
  const applied = appliedSubstitutes.value[orderId]
  if (!applied) return null
  const subId = applied[category]
  if (!subId) return null
  const order = allOrders.value.find(o => o.orderId === orderId)
  const rec = order?.recommendations.find(r => r.category === category)
  const sub = rec?.substituteOptions?.find(s => s.id === subId)
  return sub?.size ?? null
}
</script>

<template>
  <div class="min-h-screen bg-gray-950 flex">
    <div class="w-80 flex-shrink-0 bg-gray-900/80 border-r border-white/5 flex flex-col">
      <div class="p-4 border-b border-white/5">
        <div class="flex items-center gap-2 mb-4">
          <button @click="router.push('/')" class="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ChevronLeft :size="18" class="text-slate-400" />
          </button>
          <h1 class="text-white font-bold text-lg tracking-tight">柜台管理</h1>
        </div>
        <div class="flex gap-2">
          <div class="flex-1 frost-card rounded-xl p-3 text-center ring-1 ring-sky-500/15">
            <div class="text-sky-400 font-black text-2xl">{{ pendingOrders.length }}</div>
            <div class="text-sky-300/50 text-xs mt-0.5">待取件</div>
          </div>
          <div class="flex-1 frost-card rounded-xl p-3 text-center ring-1 ring-emerald-500/15">
            <div class="text-emerald-400 font-black text-2xl">{{ confirmedOrders.length }}</div>
            <div class="text-emerald-300/50 text-xs mt-0.5">已确认</div>
          </div>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-2 space-y-1.5">
        <div
          v-for="order in [...pendingOrders, ...confirmedOrders]"
          :key="order.orderId"
          @click="selectOrder(order.orderId)"
          class="p-3.5 rounded-xl cursor-pointer transition-all duration-150 ring-1"
          :class="selectedOrderId === order.orderId
            ? 'frost-card-strong ring-sky-500/30'
            : 'frost-card ring-white/5 hover:ring-white/10'"
        >
          <div class="flex items-center justify-between mb-1.5">
            <span class="font-black text-lg aurora-text">{{ order.pickupNumber }}</span>
            <span class="text-xs px-2 py-0.5 rounded-full font-medium" :class="statusStyle(order.status)">
              {{ statusLabel(order.status) }}
            </span>
          </div>
          <div class="flex items-center justify-between text-xs text-slate-500">
            <span class="flex items-center gap-1">
              <User :size="10" />
              {{ order.guestInfo.height }}cm / {{ order.guestInfo.weight }}kg
            </span>
            <span>{{ timeAgo(order.createdAt) }}</span>
          </div>
          <div v-if="order.recommendations.some(r => r.stockCount === 0)"
            class="flex items-center gap-1 mt-2 text-[10px] text-orange-400"
          >
            <PackageX :size="10" />
            部分首选尺码缺货，需替代确认
          </div>
        </div>

        <div v-if="allOrders.length === 0" class="text-center py-16 text-slate-600">
          <Package :size="36" class="mx-auto mb-3 opacity-30" />
          <p class="text-sm">暂无订单</p>
          <p class="text-xs mt-1 text-slate-700">等待游客提交租赁信息</p>
        </div>
      </div>
    </div>

    <div class="flex-1 flex flex-col overflow-hidden bg-gray-950">
      <div v-if="selectedOrder" class="flex-1 overflow-y-auto p-6">
        <div class="max-w-4xl mx-auto space-y-6">
          <div class="flex items-start justify-between">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="font-black text-4xl aurora-text tracking-tight">{{ selectedOrder.pickupNumber }}</span>
                <span class="text-xs px-2.5 py-1 rounded-full font-medium" :class="statusStyle(selectedOrder.status)">
                  {{ statusLabel(selectedOrder.status) }}
                </span>
              </div>
              <div class="text-slate-400 text-sm flex items-center gap-3 flex-wrap">
                <span>{{ selectedOrder.guestInfo.gender === 'male' ? '男' : '女' }}</span>
                <span class="text-slate-700">·</span>
                <span>{{ selectedOrder.guestInfo.age }}岁</span>
                <span class="text-slate-700">·</span>
                <span>{{ selectedOrder.guestInfo.height }}cm</span>
                <span class="text-slate-700">·</span>
                <span>{{ selectedOrder.guestInfo.weight }}kg</span>
                <span class="text-slate-700">·</span>
                <span>脚长 {{ selectedOrder.guestInfo.footLength }}mm</span>
              </div>
              <div class="text-slate-500 text-xs mt-1.5 flex items-center gap-3 flex-wrap">
                <span>取件 {{ selectedOrder.guestInfo.pickupTime }}</span>
                <span class="text-slate-700">·</span>
                <span>还件 {{ selectedOrder.guestInfo.returnTime }}</span>
                <span v-if="selectedOrder.guestInfo.nightReturn" class="flex items-center gap-1 text-orange-400 ml-1">
                  <Moon :size="12" /> 夜场
                </span>
                <span v-if="selectedOrder.guestInfo.ridingStyle" class="flex items-center gap-1 text-cyan-400">
                  <Sparkles :size="12" />
                  {{ ridingStyleLabels[selectedOrder.guestInfo.ridingStyle] }}
                </span>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-slate-600">下单时间</div>
              <div class="text-slate-300 text-sm font-medium">{{ formatTime(selectedOrder.createdAt) }}</div>
            </div>
          </div>

          <div v-if="hasOutOfStockWithAlternatives && selectedOrder.status === 'pending'"
            class="flex items-start gap-2.5 bg-orange-500/10 border border-orange-500/20 ring-1 ring-orange-500/10 text-orange-300 text-sm rounded-xl px-4 py-3.5"
          >
            <ArrowRightLeft :size="16" class="mt-0.5 flex-shrink-0 text-orange-400" />
            <div class="flex-1">
              <div class="font-semibold text-orange-200 text-xs mb-1">首选装备被租走</div>
              <div class="text-xs text-orange-300/80 leading-relaxed">点击「确认出件」将进入替代装备选择流程，请为游客选择相邻长度、加宽板或软硬差异的替代方案，扫码确认后再生成取件单。</div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="rec in selectedOrder.recommendations"
              :key="rec.category"
              class="frost-card rounded-2xl p-4 ring-1 transition-all"
              :class="recBorderColor(rec)"
            >
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl flex items-center justify-center"
                  :class="recIconBg(rec)"
                >
                  <component :is="iconMap[rec.icon]" :size="20" :class="recIconColor(rec)" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-white font-bold text-sm">{{ rec.label }}</div>
                  <div class="aurora-text font-black text-xl tracking-tight">
                    {{ getAppliedSubstituteSize(selectedOrder.orderId, rec.category) || rec.recommendedSize }}
                  </div>
                </div>
              </div>

              <div v-if="getAppliedSubstituteSize(selectedOrder.orderId, rec.category)"
                class="flex items-center gap-1.5 mb-2 text-[11px] text-emerald-400"
              >
                <CheckCircle :size="11" />
                替代方案：{{ rec.recommendedSize }} → {{ getAppliedSubstituteSize(selectedOrder.orderId, rec.category) }}
              </div>

              <div class="text-xs text-slate-500 mb-2">{{ rec.reason }}</div>

              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-semibold" :class="stockStyle(rec)">
                  {{ rec.stockCount === 0 ? '无库存（选替代）' : `库存 ${rec.stockCount}` }}
                </span>
                <span v-if="rec.isLowStock && rec.stockCount > 0" class="text-xs text-orange-400 flex items-center gap-0.5">
                  <AlertTriangle :size="10" /> 紧张
                </span>
              </div>

              <div v-if="rec.styleCalibration && rec.category === 'snowboard'"
                class="mb-2 p-2 rounded-lg bg-cyan-500/5 ring-1 ring-cyan-500/10"
              >
                <div class="text-[10px] text-cyan-400 font-semibold mb-1">风格校准</div>
                <div class="flex flex-wrap gap-1">
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                    {{ boardFlexLabels[rec.styleCalibration.boardFlex] }}
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                    前{{ rec.styleCalibration.bindingAngles.front }}°/后{{ rec.styleCalibration.bindingAngles.rear }}°
                  </span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                    {{ bootFitLabels[rec.styleCalibration.bootFit] }}
                  </span>
                </div>
              </div>

              <div v-if="rec.alternativeSizes.length > 0" class="mt-2">
                <div class="text-xs text-slate-500 mb-1.5">可替换尺码</div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="alt in rec.alternativeSizes"
                    :key="alt"
                    class="text-xs bg-white/5 text-slate-300 px-2.5 py-1 rounded-lg ring-1 ring-white/5 cursor-pointer hover:bg-sky-500/15 hover:text-sky-300 hover:ring-sky-500/20 transition-all"
                  >{{ alt }}</span>
                </div>
              </div>

              <div v-if="rec.substituteOptions && rec.substituteOptions.length > 0" class="mt-2">
                <div class="text-xs text-orange-400 font-semibold mb-1.5 flex items-center gap-1">
                  <ArrowRightLeft :size="10" />
                  推荐替代方案（{{ rec.substituteOptions.length }}个）
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="sub in rec.substituteOptions"
                    :key="sub.id"
                    class="text-xs bg-orange-500/8 text-orange-300 px-2.5 py-1 rounded-lg ring-1 ring-orange-500/15"
                  >{{ sub.size }}</span>
                </div>
              </div>

              <div v-if="rec.riskMessage"
                class="mt-2.5 text-xs px-2.5 py-2 rounded-lg ring-1"
                :class="{
                  'bg-red-500/8 text-red-300 ring-red-500/15': rec.riskLevel === 'danger',
                  'bg-orange-500/8 text-orange-300 ring-orange-500/15': rec.riskLevel === 'warning',
                  'bg-purple-500/8 text-purple-300 ring-purple-500/15': rec.riskLevel === 'info',
                }"
              >
                <AlertTriangle :size="10" class="inline mr-1" />
                {{ rec.riskMessage }}
              </div>
            </div>
          </div>

          <div class="frost-card-strong rounded-2xl p-5 ring-1 ring-white/5">
            <div class="flex items-center gap-2.5 mb-4">
              <div class="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                <DollarSign :size="16" class="text-emerald-400" />
              </div>
              <span class="text-white font-bold">押金明细</span>
            </div>
            <div class="space-y-2.5">
              <div
                v-for="rec in selectedOrder.recommendations"
                :key="'dep-' + rec.category"
                class="flex items-center justify-between text-sm"
              >
                <span class="text-slate-400">{{ rec.label }}</span>
                <span class="text-slate-300 font-medium">¥{{ depositPrices[rec.category] }}</span>
              </div>
              <div v-if="selectedOrder.guestInfo.nightReturn" class="flex items-center justify-between text-sm">
                <span class="text-orange-300 flex items-center gap-1.5"><Moon :size="14" /> 夜场服务费</span>
                <span class="text-orange-300 font-medium">¥50</span>
              </div>
              <div class="border-t border-white/5 pt-3 flex items-center justify-between">
                <span class="text-white font-bold">合计</span>
                <span class="font-black text-2xl aurora-text tracking-tight">¥{{ selectedOrder.depositAmount }}</span>
              </div>
            </div>
          </div>

          <div v-if="selectedOrder.guestInfo.age <= 12"
            class="flex items-center gap-2.5 bg-purple-500/10 border border-purple-500/20 ring-1 ring-purple-500/10 text-purple-300 text-sm rounded-xl px-4 py-3"
          >
            <AlertTriangle :size="16" />
            儿童租赁，需监护人签字确认
          </div>

          <div class="flex gap-3">
            <template v-if="selectedOrder.status === 'pending'">
              <button
                @click="handleConfirmPickup"
                class="flex-1 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
                :class="hasOutOfStockWithAlternatives
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/20'
                  : 'btn-primary'"
              >
                <component :is="hasOutOfStockWithAlternatives ? ArrowRightLeft : CheckCircle" :size="20" />
                {{ hasOutOfStockWithAlternatives ? '选择替代方案并出件' : '确认出件' }}
              </button>
              <button
                @click="startExchangeTimer(selectedOrder.orderId)"
                class="py-4 px-6 rounded-2xl font-bold text-sm frost-card ring-1 ring-orange-500/20 text-orange-300 hover:ring-orange-500/40 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <ArrowRightLeft :size="16" />
                换码
              </button>
            </template>
            <template v-else-if="selectedOrder.status === 'confirmed' || selectedOrder.status === 'picked_up'">
              <button
                @click="confirmReturn(selectedOrder.orderId)"
                class="flex-1 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 active:scale-[0.97] transition-transform"
              >
                <RotateCcw :size="20" />
                确认归还
              </button>
            </template>
          </div>

          <Transition name="exchange">
            <div v-if="exchangeCountdown[selectedOrder.orderId]"
              class="frost-card-strong rounded-2xl p-5 ring-1 ring-orange-500/20"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="text-orange-300 font-bold flex items-center gap-2">
                    <ArrowRightLeft :size="16" />
                    换码窗口
                  </div>
                  <div class="text-orange-400/60 text-xs mt-1">游客可在柜台更换尺码</div>
                </div>
                <div class="text-orange-400 font-black text-3xl tracking-tight">
                  {{ formatCountdown(exchangeCountdown[selectedOrder.orderId]) }}
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <div v-else class="flex-1 flex items-center justify-center">
        <div class="text-center text-slate-600">
          <Hash :size="56" class="mx-auto mb-5 opacity-20" />
          <p class="text-lg font-medium text-slate-500">选择左侧订单查看详情</p>
          <p class="text-sm mt-1.5 text-slate-700">或等待游客提交租赁信息</p>
        </div>
      </div>
    </div>

    <CounterAlternativeConfirm
      v-if="selectedOrder"
      :visible="showAltConfirm"
      :recommendations="selectedOrder.recommendations"
      :order-id="selectedOrder.orderId"
      @close="showAltConfirm = false"
      @confirm="onAltConfirm"
    />
  </div>
</template>

<style scoped>
.exchange-enter-active {
  animation: exchangeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.exchange-leave-active {
  animation: exchangeIn 0.2s ease reverse;
}
@keyframes exchangeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
