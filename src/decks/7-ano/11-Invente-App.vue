<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'

// Passos 1..3: cada pergunta aparece no "rascunho" do app
const { step } = useSteps()

const fields = [
  { label: 'Qual problema ele resolveria?', color: 'var(--slide-accent)' },
  { label: 'Para quem seria?', color: 'var(--slide-accent-2)' },
  { label: 'Como funcionaria?', color: 'var(--slide-accent-3)' },
]

// ---------- cronômetro de 1 minuto para a turma pensar ----------
const TOTAL = 60
const left = ref(TOTAL)
const running = ref(false)
let timer: number | undefined

function toggleTimer() {
  if (running.value || left.value === 0) return resetTimer()
  running.value = true
  timer = window.setInterval(() => {
    left.value--
    if (left.value <= 0) {
      clearInterval(timer)
      running.value = false
    }
  }, 1000)
}

function resetTimer() {
  clearInterval(timer)
  running.value = false
  left.value = TOTAL
}

const ring = computed(() => left.value / TOTAL)
const label = computed(() => `${Math.floor(left.value / 60)}:${String(left.value % 60).padStart(2, '0')}`)

onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="text">
        <p v-reveal:fade class="badge">desafio</p>
        <h1 v-reveal:blur="150" class="title">Se você pudesse criar <em>qualquer aplicativo</em>…</h1>
        <p v-reveal="400" class="question">O que ele faria?</p>

        <button
          v-reveal:zoom="700"
          class="timer"
          :class="{ 'is-running': running, 'is-over': left === 0 }"
          :style="{ '--p': ring }"
          @mousedown.prevent
          @click="toggleTimer"
        >
          <svg class="timer__ring" viewBox="0 0 44 44" aria-hidden="true">
            <circle cx="22" cy="22" r="19" class="timer__track" />
            <circle cx="22" cy="22" r="19" class="timer__fill" pathLength="1" />
          </svg>
          <span class="timer__text">
            <strong>{{ left === 0 ? 'Tempo!' : label }}</strong>
            <small>{{ running ? 'pensando…' : left === 0 ? 'clique para reiniciar' : '1 minuto para pensar' }}</small>
          </span>
        </button>
      </div>

      <div v-reveal:zoom="300" class="phone">
        <div class="phone__notch" />
        <div class="phone__screen">
          <div class="app-head">
            <span class="app-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M9.94 15.5A2 2 0 0 0 8.5 14.06l-6.14-1.58a.5.5 0 0 1 0-.96L8.5 9.94A2 2 0 0 0 9.94 8.5l1.58-6.14a.5.5 0 0 1 .96 0l1.58 6.14a2 2 0 0 0 1.44 1.44l6.14 1.58a.5.5 0 0 1 0 .96l-6.14 1.58a2 2 0 0 0-1.44 1.44l-1.58 6.14a.5.5 0 0 1-.96 0z"
                />
              </svg>
            </span>
            <span class="app-name">meu app</span>
          </div>

          <div
            v-for="(f, i) in fields"
            :key="f.label"
            v-step="i + 1"
            class="field"
            :class="{ 'is-current': step === i + 1 }"
            :style="{ '--c': f.color }"
          >
            <span class="field__n">{{ i + 1 }}</span>
            <span class="field__label">{{ f.label }}</span>
            <span class="field__input"><i class="caret" /></span>
          </div>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  align-items: center;
  gap: clamp(32px, 6vw, 140px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

.badge {
  display: inline-block;
  padding: 0.3em 0.9em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 0.8);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  rotate: -3deg;
}

.title {
  margin-top: 0.5em;
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.title em {
  font-style: normal;
  padding-bottom: 0.06em;
  background: linear-gradient(110deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.question {
  margin-top: 0.5em;
  font-size: calc(var(--text-base) * 1.6);
  font-weight: 700;
  color: var(--slide-muted);
}

/* ---------- cronômetro ---------- */
.timer {
  display: inline-flex;
  align-items: center;
  gap: 0.9em;
  margin-top: 5vh;
  padding: 0.6em 1.4em 0.6em 0.6em;
  border-radius: 999px;
  border: 2px solid color-mix(in srgb, var(--slide-fg) 15%, transparent);
  background: color-mix(in srgb, var(--slide-fg) 5%, transparent);
  color: var(--slide-fg);
  font: inherit;
  font-size: var(--text-base);
  cursor: pointer;
  transition:
    border-color 0.3s,
    background 0.3s,
    scale 0.2s;
}

.timer:hover {
  border-color: var(--slide-accent);
}

.timer:active {
  scale: 0.97;
}

.timer.is-over {
  border-color: var(--slide-accent-3);
  background: color-mix(in srgb, var(--slide-accent-3) 15%, transparent);
  animation: ring 0.5s ease-in-out 3;
}

@keyframes ring {
  0%, 100% { rotate: 0deg; }
  25% { rotate: -4deg; }
  75% { rotate: 4deg; }
}

.timer__ring {
  width: 2.6em;
  height: 2.6em;
  rotate: -90deg;
}

.timer__track,
.timer__fill {
  fill: none;
  stroke-width: 5;
}

.timer__track {
  stroke: color-mix(in srgb, var(--slide-fg) 12%, transparent);
}

.timer__fill {
  stroke: var(--slide-accent);
  stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--p));
  transition: stroke-dashoffset 1s linear;
}

.timer__text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.timer__text strong {
  font-size: 1.3em;
  font-variant-numeric: tabular-nums;
}

.timer__text small {
  font-size: 0.7em;
  color: var(--slide-muted);
}

/* ---------- celular com o rascunho do app ---------- */
.phone {
  position: relative;
  justify-self: center;
  width: min(100%, clamp(300px, 31vw, 540px), 44vh);
  aspect-ratio: 9 / 17;
  padding: 14px;
  border-radius: 44px;
  background: color-mix(in srgb, var(--slide-fg) 10%, var(--slide-bg));
  border: 2px solid color-mix(in srgb, var(--slide-fg) 22%, transparent);
  box-shadow:
    0 40px 90px -30px color-mix(in srgb, var(--slide-accent) 60%, transparent),
    inset 0 0 0 6px var(--slide-bg);
  rotate: 3deg;
}

.phone__notch {
  position: absolute;
  top: 22px;
  left: 50%;
  width: 28%;
  height: 18px;
  translate: -50% 0;
  border-radius: 999px;
  background: var(--slide-bg);
  z-index: 1;
}

.phone__screen {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 1.8vh, 20px);
  padding: 52px clamp(14px, 1.4vw, 24px) 20px;
  border-radius: 32px;
  background: linear-gradient(170deg, color-mix(in srgb, var(--slide-accent) 14%, var(--slide-bg)), var(--slide-bg));
  overflow: hidden;
}

.app-head {
  display: flex;
  align-items: center;
  gap: 0.6em;
  font-size: calc(var(--text-base) * 0.9);
  font-weight: 800;
}

.app-icon {
  display: grid;
  place-items: center;
  width: 2em;
  height: 2em;
  border-radius: 0.6em;
  background: linear-gradient(135deg, var(--slide-accent), var(--slide-accent-2));
}

.app-icon svg {
  width: 60%;
  height: 60%;
  fill: var(--slide-bg);
}

.field {
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.6em;
  row-gap: 0.45em;
  align-items: center;
  padding: 0.8em 0.9em;
  border-radius: 16px;
  font-size: calc(var(--text-base) * 0.92);
  background: color-mix(in srgb, var(--slide-fg) 6%, transparent);
  border: 2px solid transparent;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s;
}

.field.is-current {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
}

.field__n {
  display: grid;
  place-items: center;
  width: 1.6em;
  height: 1.6em;
  border-radius: 50%;
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--c);
}

.field__label {
  font-weight: 700;
  line-height: 1.2;
}

.field__input {
  grid-column: 1 / -1;
  height: 1.9em;
  padding: 0 0.7em;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background: var(--slide-bg);
  border: 1px solid color-mix(in srgb, var(--slide-fg) 12%, transparent);
}

.caret {
  width: 2px;
  height: 1.1em;
  background: var(--c);
  opacity: 0;
}

.field.is-current .caret {
  opacity: 1;
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
