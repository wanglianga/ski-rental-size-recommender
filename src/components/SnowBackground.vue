<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement>()
let animationId = 0
let particles: { x: number; y: number; r: number; speed: number; drift: number; opacity: number }[] = []

function init() {
  const el = canvas.value
  if (!el) return
  const ctx = el.getContext('2d')
  if (!ctx) return

  const resize = () => {
    el.width = window.innerWidth
    el.height = window.innerHeight
  }
  resize()
  window.addEventListener('resize', resize)

  const count = Math.min(60, Math.floor(window.innerWidth / 15))
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * el.width,
    y: Math.random() * el.height,
    r: Math.random() * 2 + 0.5,
    speed: Math.random() * 0.6 + 0.2,
    drift: Math.random() * 0.4 - 0.2,
    opacity: Math.random() * 0.5 + 0.15,
  }))

  function draw() {
    ctx.clearRect(0, 0, el.width, el.height)
    for (const p of particles) {
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(200, 220, 255, ${p.opacity})`
      ctx.fill()
      p.y += p.speed
      p.x += p.drift + Math.sin(p.y * 0.01) * 0.3
      if (p.y > el.height + 10) {
        p.y = -10
        p.x = Math.random() * el.width
      }
      if (p.x > el.width + 10) p.x = -10
      if (p.x < -10) p.x = el.width + 10
    }
    animationId = requestAnimationFrame(draw)
  }
  draw()

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', resize)
  })
}

onMounted(init)
</script>

<template>
  <canvas
    ref="canvas"
    class="fixed inset-0 pointer-events-none z-0"
    aria-hidden="true"
  />
</template>
