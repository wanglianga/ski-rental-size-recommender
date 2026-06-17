<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ChevronRight, MountainSnow, User, Tablet } from 'lucide-vue-next'
import SnowBackground from '@/components/SnowBackground.vue'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
    <SnowBackground />

    <div class="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-blue-950/40 to-slate-950/90 z-[1]" />
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-sky-500/8 via-indigo-500/5 to-transparent rounded-full blur-3xl z-[1]" />

    <div class="relative z-10 text-center mb-14">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-400/20 to-indigo-500/20 border border-white/10 mb-6" style="animation: float 4s ease-in-out infinite">
        <MountainSnow :size="40" class="text-sky-300" />
      </div>
      <h1 class="text-5xl font-black text-white mb-3 tracking-tight">雪具租赁</h1>
      <p class="aurora-text font-semibold text-lg tracking-wide">智能尺码推荐 · 快速取件</p>
      <div class="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500">
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-sky-500/60" />
          手冷也能操作
        </span>
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
          戴手套友好
        </span>
        <span class="flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-500/60" />
          排队快速
        </span>
      </div>
    </div>

    <div class="relative z-10 w-full max-w-sm space-y-4">
      <button
        @click="router.push('/guest')"
        class="group w-full flex items-center gap-5 p-5 rounded-2xl frost-card-strong transition-all duration-200 active:scale-[0.97] hover:border-sky-400/30"
        style="animation: glow-pulse 3s ease-in-out infinite"
      >
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/20 group-active:shadow-sky-500/40 transition-shadow">
          <User :size="30" class="text-white" />
        </div>
        <div class="text-left flex-1">
          <div class="text-white font-extrabold text-xl tracking-tight">我是游客</div>
          <div class="text-sky-300/60 text-sm mt-0.5">填写信息，获取尺码推荐</div>
        </div>
        <ChevronRight :size="22" class="text-sky-400/50 group-active:text-sky-300 transition-colors" />
      </button>

      <button
        @click="router.push('/counter')"
        class="group w-full flex items-center gap-5 p-5 rounded-2xl frost-card-strong transition-all duration-200 active:scale-[0.97] hover:border-emerald-400/30"
      >
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20 group-active:shadow-emerald-500/40 transition-shadow">
          <Tablet :size="30" class="text-white" />
        </div>
        <div class="text-left flex-1">
          <div class="text-white font-extrabold text-xl tracking-tight">柜台工作人员</div>
          <div class="text-emerald-300/60 text-sm mt-0.5">查看推荐、出件管理</div>
        </div>
        <ChevronRight :size="22" class="text-emerald-400/50 group-active:text-emerald-300 transition-colors" />
      </button>
    </div>

    <div class="relative z-10 mt-14 text-center">
      <p class="text-slate-600 text-xs">雪场现场 · 手冷戴手套也能顺利完成</p>
    </div>
  </div>
</template>
