<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, reactive, ref, watch, type Component } from 'vue'
import { stepsKey } from './steps'
import DeckBackground from './DeckBackground.vue'

/**
 * Exibe os slides ocupando 100% da largura e altura da janela, sobre um
 * fundo animado que se desloca conforme a apresentação avança.
 *
 * Cada slide pode ter passos (v-step / useSteps): avançar mostra o próximo
 * passo e só troca de slide quando acabam; voltar desfaz o último passo.
 *
 * Controles no canto inferior direito (somem quando o mouse fica parado).
 * Teclado:
 *  →  ↑  Espaço  PageDown   próximo passo / slide
 *  ←  ↓  PageUp  Backspace  passo / slide anterior
 *  Home / End               primeiro / último slide
 *  F                        tela cheia
 *
 * A URL guarda apresentação, slide e passo: #/<id>/<slide>/<passo>
 */
const props = defineProps<{ id: string; slides: Component[]; theme?: Record<string, string> }>()
const emit = defineEmits<{ home: [] }>()

const deckEl = ref<HTMLElement>()
const total = computed(() => props.slides.length)
const initial = readHash()
const index = ref(initial.slide)
const step = ref(initial.step)
const direction = ref<'next' | 'prev'>('next')
const isFullscreen = ref(false)
const idle = ref(false)

const current = computed(() => props.slides[index.value])

// ---------- passos ----------
const declared = reactive<Record<number, number>>({})
const scanned = ref(0)
const steps = computed(() => Math.max(scanned.value, declared[index.value] ?? 0))
let stepEls: { el: HTMLElement; n: number }[] = []
let pendingStep: number | 'end' = initial.step

provide(stepsKey, { index, step, declare: (slide, count) => (declared[slide] = count) })

/** Lê os v-step do slide atual; sem número, recebem o próximo da ordem. */
function scanSteps() {
  const root = deckEl.value?.querySelector<HTMLElement>(`[data-slide="${index.value}"]`)
  let counter = 0
  stepEls = []
  root?.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => {
    const explicit = Number.parseInt(el.dataset.step ?? '', 10)
    const n = Number.isNaN(explicit) ? counter + 1 : explicit
    counter = Math.max(counter, n)
    stepEls.push({ el, n })
  })
  scanned.value = counter
  step.value = pendingStep === 'end' ? steps.value : Math.min(pendingStep, steps.value)
  applySteps()
}

function applySteps() {
  for (const { el, n } of stepEls) el.toggleAttribute('data-step-shown', step.value >= n)
  if (!Number.isFinite(step.value)) return
  history.replaceState(null, '', `#/${props.id}/${index.value + 1}${step.value ? `/${step.value}` : ''}`)
}

const progress = computed(() => {
  const within = steps.value ? step.value / steps.value : 1
  return (index.value + within) / total.value
})
const bgProgress = computed(() => (total.value > 1 ? index.value / (total.value - 1) : 1))
const isFirst = computed(() => index.value === 0 && step.value === 0)
const isLast = computed(() => index.value === total.value - 1 && step.value >= steps.value)

// ---------- navegação ----------
function clamp(n: number) {
  return Math.min(Math.max(n, 0), total.value - 1)
}

function readHash() {
  const [, slide, stepPart] = window.location.hash.replace(/^#\/?/, '').split('/')
  const n = Number.parseInt(slide, 10)
  const s = Number.parseInt(stepPart, 10)
  return { slide: Number.isNaN(n) ? 0 : clamp(n - 1), step: Number.isNaN(s) ? 0 : Math.max(s, 0) }
}

/** Vai para o slide `n`, começando sem passos ('start') ou com todos ('end'). */
function go(n: number, at: number | 'start' | 'end' = 'start') {
  const target = clamp(n)
  pendingStep = at === 'start' ? 0 : at
  if (target === index.value) {
    step.value = at === 'end' ? steps.value : Math.min(pendingStep as number, steps.value)
    return
  }
  direction.value = target > index.value ? 'next' : 'prev'
  // Solta os elementos do slide que está saindo e já entrega o passo inicial
  // ao novo slide (Infinity = todos; scanSteps ajusta ao total real)
  stepEls = []
  step.value = pendingStep === 'end' ? Infinity : pendingStep
  index.value = target
}

function next() {
  if (step.value < steps.value) step.value++
  else if (index.value < total.value - 1) go(index.value + 1)
}

function prev() {
  if (step.value > 0) step.value--
  else if (index.value > 0) go(index.value - 1, 'end')
}

watch(index, scanSteps, { flush: 'post' })
watch(step, applySteps)

function toggleFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen()
  else document.documentElement.requestFullscreen()
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function onKey(e: KeyboardEvent) {
  if (e.altKey || e.ctrlKey || e.metaKey) return
  const el = e.target as HTMLElement
  if (el.closest('input, textarea, select, [contenteditable="true"]')) return
  // Espaço/Enter num botão focado já disparam o clique dele
  if ((e.key === ' ' || e.key === 'Enter') && el.closest('button, a')) return

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowUp':
    case 'PageDown':
    case ' ':
      next()
      break
    case 'ArrowLeft':
    case 'ArrowDown':
    case 'PageUp':
    case 'Backspace':
      prev()
      break
    case 'Home':
      go(0)
      break
    case 'End':
      go(total.value - 1, 'end')
      break
    case 'f':
    case 'F':
      toggleFullscreen()
      break
    default:
      return
  }
  e.preventDefault()
}

let idleTimer: number | undefined
function wake() {
  idle.value = false
  clearTimeout(idleTimer)
  idleTimer = window.setTimeout(() => (idle.value = true), 2500)
}

function onHashChange() {
  // Trocar de apresentação é com o App; aqui só navegação dentro desta
  if (window.location.hash.replace(/^#\/?/, '').split('/')[0] !== props.id) return
  const { slide, step } = readHash()
  go(slide, step)
}

onMounted(() => {
  nextTick(scanSteps)
  wake()
  window.addEventListener('keydown', onKey)
  window.addEventListener('mousemove', wake)
  window.addEventListener('hashchange', onHashChange)
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onBeforeUnmount(() => {
  clearTimeout(idleTimer)
  window.removeEventListener('keydown', onKey)
  window.removeEventListener('mousemove', wake)
  window.removeEventListener('hashchange', onHashChange)
  document.removeEventListener('fullscreenchange', onFullscreenChange)
})
</script>

<template>
  <main ref="deckEl" class="deck" :class="{ 'deck--idle': idle }" :style="theme">
    <DeckBackground :progress="bgProgress" />

    <Transition :name="`slide-${direction}`">
      <component :is="current" :key="index" :data-slide="index" class="deck__slide" />
    </Transition>

    <div class="deck__progress" :style="{ transform: `scaleX(${progress})` }" />

    <nav class="controls" @mouseenter="wake">
      <button class="controls__btn" :disabled="isFirst" title="Voltar (←)" @click="prev">
        <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <span class="controls__count">{{ index + 1 }}<small>/{{ total }}</small></span>
      <span
        v-if="steps"
        class="controls__steps"
        :title="`Animação ${step} de ${steps} — faltam ${steps - step}`"
      >
        <template v-if="steps <= 10">
          <i v-for="n in steps" :key="n" class="dot" :class="{ 'dot--on': n <= step }" />
        </template>
        <template v-else>{{ step }}<small>/{{ steps }}</small></template>
      </span>
      <button class="controls__btn" :disabled="isLast" title="Avançar (→)" @click="next">
        <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" /></svg>
      </button>
      <span class="controls__sep" />
      <button class="controls__btn" title="Escolher apresentação" @click="emit('home')">
        <svg viewBox="0 0 24 24">
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
        </svg>
      </button>
      <button class="controls__btn" :title="isFullscreen ? 'Sair da tela cheia (F)' : 'Tela cheia (F)'" @click="toggleFullscreen">
        <svg v-if="!isFullscreen" viewBox="0 0 24 24">
          <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
        </svg>
        <svg v-else viewBox="0 0 24 24">
          <path d="M8 3v3a2 2 0 0 1-2 2H3M16 3v3a2 2 0 0 0 2 2h3M8 21v-3a2 2 0 0 0-2-2H3M16 21v-3a2 2 0 0 1 2-2h3" />
        </svg>
      </button>
    </nav>
  </main>
</template>

<style scoped>
.deck {
  font-family: var(--slide-font);
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background: var(--slide-bg);
}

.deck--idle {
  cursor: none;
}

.deck__slide {
  position: absolute;
  inset: 0;
}

/* ---------- progresso ---------- */
.deck__progress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  transform-origin: left;
  background: linear-gradient(90deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  transition: transform 0.6s var(--ease-out);
}

/* ---------- controles ---------- */
.controls {
  position: absolute;
  right: 20px;
  bottom: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px;
  border-radius: 999px;
  background: rgb(15 23 42 / 0.55);
  border: 1px solid rgb(255 255 255 / 0.08);
  backdrop-filter: blur(12px);
  transition:
    opacity 0.4s ease,
    transform 0.4s var(--ease-out);
  z-index: 10;
}

.deck--idle .controls {
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
}

.controls__btn {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--slide-fg);
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
}

.controls__btn:hover:not(:disabled) {
  background: rgb(255 255 255 / 0.12);
  transform: scale(1.08);
}

.controls__btn:active:not(:disabled) {
  transform: scale(0.94);
}

.controls__btn:disabled {
  opacity: 0.3;
  cursor: default;
}

.controls__btn:focus-visible {
  outline: 2px solid var(--slide-accent);
  outline-offset: 2px;
}

.controls__btn svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.controls__count {
  min-width: 48px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: var(--slide-fg);
}

.controls__count small {
  font-size: 12px;
  font-weight: 400;
  color: var(--slide-muted);
}

.controls__steps {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 8px;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  color: var(--slide-accent);
}

.controls__steps small {
  color: var(--slide-muted);
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  border: 1.5px solid var(--slide-muted);
  transition:
    background 0.3s,
    border-color 0.3s,
    transform 0.3s var(--ease-out);
}

.dot--on {
  background: var(--slide-accent);
  border-color: var(--slide-accent);
  transform: scale(1.15);
}

.controls__sep {
  width: 1px;
  height: 20px;
  margin: 0 4px;
  background: rgb(255 255 255 / 0.12);
}

/* ---------- transição entre slides ---------- */
.slide-next-enter-active,
.slide-next-leave-active,
.slide-prev-enter-active,
.slide-prev-leave-active {
  transition:
    opacity 0.7s var(--ease-out),
    transform 0.7s var(--ease-out),
    filter 0.7s var(--ease-out);
}

.slide-next-enter-from,
.slide-prev-leave-to {
  opacity: 0;
  transform: translateX(8vw) scale(0.96);
  filter: blur(10px);
}

.slide-next-leave-to,
.slide-prev-enter-from {
  opacity: 0;
  transform: translateX(-8vw) scale(0.96);
  filter: blur(10px);
}
</style>
