<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  X, ArrowRightLeft, AlertTriangle, QrCode, CheckCircle2,
  Ruler, Maximize, HardDrive, Footprints, Package, Snowflake,
  ShieldAlert, ChevronDown, ChevronUp
} from 'lucide-vue-next'
import type { SizeRecommendation, SubstituteOption } from '@/types'
import { substituteTypeLabels } from '@/data/sizeCharts'

const props = defineProps<{
  visible: boolean
  recommendations: SizeRecommendation[]
  orderId: string
}>()

const emit = defineEmits<{
  close: []
  confirm: [selected: Record<string, string>]
}>()

const expandedCategory = ref<string | null>(null)
const selectedSubstitutes = ref<Record<string, string>>({})
const scanCodeInput = ref('')
const scanVerified = ref(false)

const CORRECT_SCAN_CODE = 'ALT-CONFIRM-2024'

watch(() => props.visible, (v) => {
  if (v) {
    expandedCategory.value = null
    selectedSubstitutes.value = {}
    scanCodeInput.value = ''
    scanVerified.value = false
  }
})

const outOfStockRecs = computed(() =>
  props.recommendations.filter(r => r.stockCount === 0 && r.substituteOptions && r.substituteOptions.length > 0)
)

const allSelected = computed(() =>
  outOfStockRecs.value.every(r => selectedSubstitutes.value[r.category])
)

const canConfirm = computed(() => allSelected.value && scanVerified.value)

function toggleCategory(cat: string) {
  expandedCategory.value = expandedCategory.value === cat ? null : cat
}

function selectSubstitute(category: string, subId: string) {
  selectedSubstitutes.value = { ...selectedSubstitutes.value, [category]: subId }
}

function verifyScan() {
  if (scanCodeInput.value.trim().toUpperCase() === CORRECT_SCAN_CODE) {
    scanVerified.value = true
  }
}

function handleConfirm() {
  if (!canConfirm.value) return
  emit('confirm', selectedSubstitutes.value)
}

const subTypeIcons: Record<string, any> = {
  adjacent_length: Ruler,
  wide_board: Maximize,
  flex_diff: HardDrive,
  boot_fit_diff: Footprints,
}

const subTypeColors: Record<string, string> = {
  adjacent_length: 'from-sky-500/20 to-blue-500/10 text-sky-300 ring-sky-500/20',
  wide_board: 'from-emerald-500/20 to-teal-500/10 text-emerald-300 ring-emerald-500/20',
  flex_diff: 'from-violet-500/20 to-purple-500/10 text-violet-300 ring-violet-500/20',
  boot_fit_diff: 'from-amber-500/20 to-orange-500/10 text-amber-300 ring-amber-500/20',
}

function getSelectedSub(rec: SizeRecommendation): SubstituteOption | undefined {
  const id = selectedSubstitutes.value[rec.category]
  return rec.substituteOptions?.find(s => s.id === id)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="emit('close')" />

        <div class="relative w-full max-w-2xl max-h-[90vh] overflow-hidden frost-card-strong rounded-3xl ring-1 ring-white/10 shadow-2xl flex flex-col">
          <div class="flex items-center justify-between p-5 border-b border-white/5">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/25 to-red-500/25 flex items-center justify-center">
                <ArrowRightLeft :size="20" class="text-orange-400" />
              </div>
              <div>
                <div class="text-white font-bold text-base">替代装备确认</div>
                <div class="text-slate-500 text-xs mt-0.5">首选尺码缺货，请选择替代方案并扫码确认</div>
              </div>
            </div>
            <button @click="emit('close')" class="p-2 rounded-xl hover:bg-white/5 transition-colors">
              <X :size="18" class="text-slate-400" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 space-y-4">
            <div v-for="rec in outOfStockRecs" :key="rec.category"
              class="rounded-2xl ring-1 ring-white/5 overflow-hidden"
              :class="expandedCategory === rec.category ? 'bg-white/[0.03]' : 'bg-white/[0.015]'"
            >
              <button @click="toggleCategory(rec.category)"
                class="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                    <component :is="rec.icon === 'Snowflake' ? Snowflake : Footprints" :size="18" class="text-red-400" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-white font-semibold text-sm">{{ rec.label }}</span>
                      <span class="text-xs px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 ring-1 ring-red-500/20">
                        {{ rec.recommendedSize }} 无货
                      </span>
                    </div>
                    <div v-if="selectedSubstitutes[rec.category]" class="flex items-center gap-1.5 mt-1">
                      <CheckCircle2 :size="12" class="text-emerald-400" />
                      <span class="text-emerald-400 text-xs">已选：{{ getSelectedSub(rec)?.size }}</span>
                    </div>
                    <div v-else class="text-slate-500 text-xs mt-1">点击展开选择替代方案</div>
                  </div>
                </div>
                <component :is="expandedCategory === rec.category ? ChevronUp : ChevronDown"
                  :size="18" class="text-slate-500" />
              </button>

              <Transition name="expand">
                <div v-if="expandedCategory === rec.category" class="border-t border-white/5 p-4 space-y-3">
                  <div
                    v-for="sub in rec.substituteOptions"
                    :key="sub.id"
                    @click="selectSubstitute(rec.category, sub.id)"
                    class="rounded-xl p-3.5 cursor-pointer transition-all duration-150 ring-1"
                    :class="selectedSubstitutes[rec.category] === sub.id
                      ? 'bg-sky-500/10 ring-sky-500/30'
                      : 'bg-white/[0.02] ring-white/5 hover:ring-white/10 hover:bg-white/[0.035]'"
                  >
                    <div class="flex items-start gap-3">
                      <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ring-1"
                        :class="subTypeColors[sub.type]"
                      >
                        <component :is="subTypeIcons[sub.type] || Package" :size="16" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between gap-2">
                          <div class="flex items-center gap-2">
                            <span class="text-white font-bold text-sm">{{ sub.size }}</span>
                            <span class="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-slate-400 ring-1 ring-white/5">
                              {{ sub.label }}
                            </span>
                          </div>
                          <span class="text-xs font-semibold"
                            :class="sub.stockCount <= 2 ? 'text-orange-400' : 'text-emerald-400'"
                          >
                            库存 {{ sub.stockCount }}
                          </span>
                        </div>
                        <div class="text-xs text-slate-400 mt-1">{{ sub.description }}</div>

                        <div v-if="sub.suitableSnowConditions.length > 0" class="flex items-center gap-1.5 mt-2">
                          <Snowflake :size="10" class="text-sky-400/70" />
                          <span class="text-[10px] text-slate-500">适合雪况：</span>
                          <span v-for="c in sub.suitableSnowConditions" :key="c"
                            class="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300/80"
                          >{{ c }}</span>
                        </div>

                        <div v-if="sub.risks.length > 0" class="mt-2.5">
                          <div class="flex items-center gap-1.5 mb-1.5">
                            <ShieldAlert :size="11" class="text-orange-400" />
                            <span class="text-[10px] font-semibold text-orange-400">需要试穿风险</span>
                          </div>
                          <div class="flex flex-wrap gap-1">
                            <span v-for="r in sub.risks" :key="r"
                              class="text-[10px] px-2 py-1 rounded-md bg-orange-500/8 text-orange-300/90 ring-1 ring-orange-500/15"
                            >{{ r }}</span>
                          </div>
                        </div>
                      </div>
                      <div v-if="selectedSubstitutes[rec.category] === sub.id"
                        class="w-5 h-5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400 flex items-center justify-center flex-shrink-0 mt-1"
                      >
                        <svg class="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <path d="M5 12l5 5L20 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>

            <div v-if="outOfStockRecs.length === 0" class="text-center py-10 text-slate-500">
              <Package :size="40" class="mx-auto mb-3 opacity-30" />
              <p class="text-sm">暂无可替代装备</p>
            </div>
          </div>

          <div class="border-t border-white/5 p-5 space-y-4">
            <div class="frost-card rounded-2xl p-4 ring-1"
              :class="scanVerified ? 'ring-emerald-500/25 bg-emerald-500/5' : 'ring-white/5'"
            >
              <div class="flex items-center gap-2 mb-3">
                <div class="w-8 h-8 rounded-lg flex items-center justify-center"
                  :class="scanVerified ? 'bg-emerald-500/20' : 'bg-cyan-500/15'"
                >
                  <QrCode :size="16" :class="scanVerified ? 'text-emerald-400' : 'text-cyan-400'" />
                </div>
                <div class="flex-1">
                  <div class="text-white font-semibold text-sm">柜员扫码确认</div>
                  <div class="text-xs"
                    :class="scanVerified ? 'text-emerald-400' : 'text-slate-500'"
                  >
                    {{ scanVerified ? '已验证授权，可安全出件' : '请扫描授权码确认替代方案适合当天雪况' }}
                  </div>
                </div>
                <CheckCircle2 v-if="scanVerified" :size="20" class="text-emerald-400" />
              </div>
              <div v-if="!scanVerified" class="flex gap-2">
                <input v-model="scanCodeInput"
                  type="text"
                  placeholder="输入授权码（测试用：ALT-CONFIRM-2024）"
                  class="flex-1 bg-white/5 text-white text-sm rounded-xl px-4 py-3 ring-1 ring-white/10 focus:ring-cyan-500/40 focus:outline-none placeholder:text-slate-600"
                  @keyup.enter="verifyScan"
                />
                <button @click="verifyScan"
                  class="px-5 py-3 rounded-xl bg-cyan-500/15 text-cyan-300 text-sm font-semibold ring-1 ring-cyan-500/25 hover:bg-cyan-500/20 transition-colors active:scale-[0.97]"
                >
                  验证
                </button>
              </div>
            </div>

            <div v-if="!allSelected"
              class="flex items-center gap-2 text-orange-400 text-xs"
            >
              <AlertTriangle :size="14" />
              请为所有缺货装备选择替代方案
            </div>

            <div class="flex gap-3">
              <button @click="emit('close')"
                class="flex-1 py-3.5 rounded-2xl font-bold text-sm frost-card ring-1 ring-white/5 text-slate-300 hover:border-white/15 transition-all active:scale-[0.97]"
              >
                取消
              </button>
              <button @click="handleConfirm"
                :disabled="!canConfirm"
                class="flex-1 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                :class="canConfirm
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow-lg shadow-sky-500/20'
                  : 'bg-white/5 text-slate-600 cursor-not-allowed'"
              >
                <CheckCircle2 :size="18" />
                确认替代方案，生成取件单
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(12px) scale(0.98);
  opacity: 0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.2s ease;
  overflow: hidden;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}
.expand-enter-to,
.expand-leave-from {
  max-height: 1000px;
  opacity: 1;
}
</style>
