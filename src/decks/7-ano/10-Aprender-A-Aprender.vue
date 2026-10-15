<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1..3 = uma fase por vez; 4 = conclusão (mesmos obstáculos); 5 = frase de destaque
const { step } = useSteps()
const CONCLUSION = 4
const KEY = 5

/**
 * As três fases têm os MESMOS obstáculos, nas mesmas posições.
 * O que muda é o jogador:
 *  hit  = não conhece, bate e perde uma vida
 *  jump = já viu antes, pula depois de pensar um pouco
 *  fast = reconhece o padrão e pula sem parar
 */
type Kind = 'hit' | 'jump' | 'fast'
const OBSTACLES = [18, 32, 46, 60, 74, 88] // posição em % da pista
const START = 4
const END = 96
const MS_PER_PERCENT = 20
const PAUSE: Record<Kind, number> = { hit: 650, jump: 280, fast: 0 }
const LIVES = 3
const SCAN = 600 // na fase 3 os padrões acendem antes da corrida

const phases: { label: string; tip: string; kinds: Kind[]; result: string; tone: 'lose' | 'ok' | 'win'; delay: number }[] = [
  {
    label: 'Fase 1',
    tip: 'Tudo é novo. Você erra bastante.',
    kinds: ['hit', 'hit', 'hit', 'hit', 'hit', 'hit'],
    result: 'game over',
    tone: 'lose',
    delay: 0,
  },
  {
    label: 'Fase 2',
    tip: 'Alguns obstáculos você já conhece.',
    kinds: ['jump', 'hit', 'jump', 'jump', 'hit', 'jump'],
    result: 'passou!',
    tone: 'ok',
    delay: 0,
  },
  {
    label: 'Fase 3',
    tip: 'Você reconhece os padrões!',
    kinds: ['fast', 'fast', 'fast', 'fast', 'fast', 'fast'],
    result: 'perfeito!',
    tone: 'win',
    delay: SCAN,
  },
]

/** Linha do tempo de uma fase; acaba antes se as vidas terminarem. */
function timeline(kinds: Kind[], delay: number) {
  let t = delay
  let x = START
  let hits = 0
  const stops: { x: number; arrive: number; leave: number; kind: Kind }[] = []
  for (const [i, ox] of OBSTACLES.entries()) {
    t += (ox - x) * MS_PER_PERCENT
    x = ox
    const arrive = t
    t += PAUSE[kinds[i]]
    stops.push({ x: ox, arrive, leave: t, kind: kinds[i] })
    if (kinds[i] === 'hit' && ++hits === LIVES) return { delay, stops, total: t, endX: ox, over: true }
  }
  t += (END - x) * MS_PER_PERCENT
  return { delay, stops, total: t, endX: END, over: false }
}

const plans = phases.map((p) => timeline(p.kinds, p.delay))
const elapsed = reactive(phases.map(() => 0))

function positionAt(lane: number) {
  const { stops, total, delay, endX } = plans[lane]
  const t = elapsed[lane]
  if (t <= delay) return START
  if (t >= total) return endX
  let prevX = START
  let prevT = delay
  for (const s of stops) {
    if (t < s.arrive) return prevX + ((t - prevT) / (s.arrive - prevT)) * (s.x - prevX)
    if (t < s.leave) return s.x
    prevX = s.x
    prevT = s.leave
  }
  return prevX + ((t - prevT) / (total - prevT)) * (endX - prevX)
}

/** Pulando quando está perto de um obstáculo que ele conhece. */
function isJumping(lane: number) {
  const t = elapsed[lane]
  return plans[lane].stops.some((s) => s.kind !== 'hit' && t >= s.arrive - 140 && t <= s.leave + 140)
}

function obstacleState(lane: number, i: number) {
  const s = plans[lane].stops[i]
  const t = elapsed[lane]
  if (!s) return 'is-untouched' // fase acabou antes (game over)
  if (s.kind === 'hit' && t >= s.arrive) return t < s.leave ? 'is-hit' : 'is-bumped'
  if (t >= s.leave && t > 0) return 'is-cleared'
  return ''
}

function livesLeft(lane: number) {
  const t = elapsed[lane]
  return LIVES - plans[lane].stops.filter((s) => s.kind === 'hit' && t >= s.arrive).length
}

const positions = computed(() => phases.map((_, i) => positionAt(i)))
const done = (lane: number) => elapsed[lane] >= plans[lane].total
const clock = (lane: number) => {
  const ms = Math.max(0, Math.min(elapsed[lane], plans[lane].total) - plans[lane].delay)
  return `${(ms / 1000).toFixed(1).replace('.', ',')}s`
}

// ---------- cada fase corre quando o passo dela chega ----------
const rafs: number[] = []
function run(lane: number) {
  cancelAnimationFrame(rafs[lane])
  const start = performance.now()
  const tick = (now: number) => {
    elapsed[lane] = Math.min(now - start, plans[lane].total)
    if (elapsed[lane] < plans[lane].total) rafs[lane] = requestAnimationFrame(tick)
  }
  rafs[lane] = requestAnimationFrame(tick)
}

watch(
  step,
  (s, old) => {
    phases.forEach((_, i) => {
      const n = i + 1
      if (s < n) {
        cancelAnimationFrame(rafs[i])
        elapsed[i] = 0
      } else if (s === n && old === n - 1) run(i) // avançou até esta fase: joga
      else if (elapsed[i] === 0 || old === undefined) elapsed[i] = plans[i].total // pulou direto: já concluída
    })
  },
  { immediate: true },
)

onBeforeUnmount(() => rafs.forEach(cancelAnimationFrame))
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-open': step >= 1, 'is-key': step >= KEY }">
      <header class="head">
        <p v-reveal:fade class="kicker">a habilidade mais importante</p>
        <h1 class="hero">
          <span v-reveal:blur="200">Aprender</span>
          <span v-reveal:zoom="500" class="hero__a">a</span>
          <span class="hero__grad">aprender</span>
        </h1>
        <p class="sub">Seu cérebro <em>melhora com a prática</em>.</p>
      </header>

      <div class="lanes">
        <div
          v-for="(phase, li) in phases"
          :key="phase.label"
          v-step="li + 1"
          class="lane"
          :class="[`lane--${phase.tone}`, { 'is-current': step === li + 1, 'is-done': done(li) }]"
        >
          <div class="hud">
            <span class="hud__label">{{ phase.label }}</span>
            <span class="hud__tip">{{ phase.tip }}</span>
            <span class="hud__lives">
              <svg v-for="n in LIVES" :key="n" class="heart" :class="{ 'is-lost': n > livesLeft(li) }" viewBox="0 0 24 24">
                <path
                  d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
                />
              </svg>
            </span>
          </div>

          <div class="track">
            <span class="track__floor" />
            <span
              v-for="(x, oi) in OBSTACLES"
              :key="x"
              class="block"
              :class="[`block--${phase.kinds[oi]}`, obstacleState(li, oi), { 'is-scanned': elapsed[li] > 0 }]"
              :style="{ left: `${x}%`, '--oi': oi }"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 21H2Z" /></svg>
            </span>
            <span
              class="player"
              :class="{ 'is-jumping': isJumping(li), 'is-over': plans[li].over && done(li) }"
              :style="{ left: `${positions[li]}%` }"
            >
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <rect class="player__antenna" x="18" y="2" width="4" height="7" rx="2" />
                <rect class="player__body" x="5" y="8" width="30" height="27" rx="11" />
                <rect class="player__visor" x="10" y="14" width="20" height="10" rx="5" />
                <circle class="player__eye" cx="15.5" cy="19" r="2.2" />
                <circle class="player__eye" cx="24.5" cy="19" r="2.2" />
              </svg>
            </span>
          </div>

          <div class="score">
            <span class="hud__time">{{ clock(li) }}</span>
            <span class="result">{{ phase.result }}</span>
          </div>
        </div>
      </div>

      <p v-step="CONCLUSION" class="conclusion">
        <span>Os obstáculos são os <strong>mesmos</strong>. Quem melhorou foi <em>você</em>!</span>
      </p>

      <p v-step:blur="KEY" class="key">
        <span class="key__a">Aprender também é uma <em>habilidade</em>.</span>
        <span class="key__b">E precisa ser <mark>treinada</mark>.</span>
      </p>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(16px, 4vh, 48px);
}

/* ---------- título: enorme no passo 0, encolhe quando o jogo começa ---------- */
.head {
  text-align: center;
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.kicker {
  font-size: calc(var(--text-base) * 0.75);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 0 0.28em;
  margin-top: 0.15em;
  font-size: calc(var(--text-hero) * 1.15);
  line-height: 1.05;
  font-weight: 900;
  letter-spacing: -0.03em;
  text-transform: uppercase;
  transition: font-size 0.8s var(--ease-out);
}

.is-open .hero {
  font-size: var(--text-title);
}

.hero__a {
  font-weight: 300;
  color: var(--slide-muted);
}

.hero__grad {
  padding-bottom: 0.08em;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3), var(--slide-accent));
  background-size: 300% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    reveal-blur 0.9s var(--ease-out) 800ms backwards,
    shimmer 6s linear infinite;
}

@keyframes shimmer {
  to {
    background-position: 300% 0;
  }
}

/* frase de apoio: aparece quando o jogo começa */
.sub {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  font-size: calc(var(--text-base) * 1.2);
  font-weight: 600;
  color: var(--slide-muted);
  transition:
    max-height 0.8s var(--ease-out),
    opacity 0.6s 0.3s,
    margin 0.8s var(--ease-out);
}

.sub em {
  font-style: normal;
  color: var(--slide-accent-2);
}

.is-open .sub {
  max-height: 3em;
  opacity: 1;
  margin-top: 0.3em;
}

/* ---------- conclusão (passo 4) ---------- */
.conclusion {
  text-align: center;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    filter 0.8s var(--ease-out);
  font-size: calc(var(--text-base) * 1.3);
  font-weight: 700;
}

.conclusion > span {
  text-wrap: balance;
}

.conclusion strong {
  color: var(--slide-accent-3);
}

.conclusion em {
  font-style: normal;
  color: var(--slide-accent-2);
}

/* ---------- as três fases ---------- */
.lanes {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2.6vh, 32px);
  max-height: 0;
  transition:
    max-height 0.8s var(--ease-out),
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.is-open .lanes {
  max-height: 80vh;
}

.lane {
  display: grid;
  grid-template-columns: minmax(0, 0.75fr) minmax(0, 2fr) 7em;
  align-items: center;
  gap: clamp(12px, 2vw, 32px);
  padding: clamp(10px, 1.8vh, 22px) clamp(14px, 2vw, 32px);
  border-radius: 22px;
  background: color-mix(in srgb, var(--slide-fg) 4%, transparent);
  border: 2px solid color-mix(in srgb, var(--slide-fg) 8%, transparent);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s;
}

.lane.is-current {
  border-color: color-mix(in srgb, var(--slide-accent) 45%, transparent);
  background: color-mix(in srgb, var(--slide-accent) 7%, transparent);
}

.hud {
  display: flex;
  flex-direction: column;
  gap: 0.35em;
}

.hud__label {
  font-size: calc(var(--text-base) * 1.05);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.hud__tip {
  font-size: calc(var(--text-base) * 0.8);
  line-height: 1.25;
  color: var(--slide-muted);
  text-wrap: balance;
}

.hud__lives {
  display: flex;
  gap: 0.25em;
}

.heart {
  width: 1.05em;
  height: 1.05em;
  fill: var(--slide-accent-3);
  transition:
    fill 0.3s,
    scale 0.3s var(--ease-out),
    opacity 0.3s;
}

.heart.is-lost {
  fill: color-mix(in srgb, var(--slide-fg) 15%, transparent);
  scale: 0.8;
}

.hud__time {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.9);
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: var(--slide-muted);
}

.lane.is-done .hud__time {
  color: var(--slide-fg);
  font-weight: 700;
}

/* ---------- pista ---------- */
.track {
  position: relative;
  height: clamp(72px, 13vh, 140px);
}

.track__floor {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 18%;
  height: 4px;
  border-radius: 4px;
  background: repeating-linear-gradient(
    90deg,
    color-mix(in srgb, var(--slide-fg) 25%, transparent) 0 14px,
    transparent 14px 22px
  );
}

/* obstáculos: triângulos "espinho" em cima do chão */
.block {
  --size: clamp(28px, 5.4vh, 60px);
  position: absolute;
  bottom: calc(18% + 4px);
  width: var(--size);
  height: var(--size);
  translate: -50% 0;
  transition:
    scale 0.3s var(--ease-out),
    filter 0.3s;
}

.block svg {
  width: 100%;
  height: 100%;
  fill: color-mix(in srgb, var(--slide-accent-3) 75%, var(--slide-bg));
  stroke: var(--slide-accent-3);
  stroke-width: 1.5;
  stroke-linejoin: round;
  transition:
    fill 0.3s,
    stroke 0.3s;
}

.block.is-hit {
  animation: shake 0.22s ease-in-out infinite;
  filter: drop-shadow(0 0 12px var(--slide-accent-3));
}

@keyframes shake {
  0%, 100% { rotate: 0deg; }
  25% { rotate: -10deg; }
  75% { rotate: 10deg; }
}

.block.is-bumped {
  scale: 0.85;
}

/* fase 3: os padrões acendem em sequência antes da corrida */
.block--fast.is-scanned svg,
.block--jump.is-cleared svg,
.block--fast.is-cleared svg {
  fill: color-mix(in srgb, var(--slide-accent-2) 35%, var(--slide-bg));
  stroke: var(--slide-accent-2);
}

.block--fast.is-scanned {
  filter: drop-shadow(0 0 10px var(--slide-accent-2));
  transition-delay: calc(var(--oi) * 80ms);
}

/* personagem */
.player {
  --size: clamp(42px, 7.6vh, 84px);
  position: absolute;
  bottom: calc(18% + 4px);
  width: var(--size);
  height: var(--size);
  translate: -50% 0;
  transition: translate 0.14s ease-out;
  z-index: 1;
}

.player.is-jumping {
  translate: -50% -95%;
}

.player svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.player__body,
.player__antenna {
  fill: var(--slide-accent);
}

.player__visor {
  fill: var(--slide-bg);
}

.player__eye {
  fill: var(--slide-accent-2);
}

.lane--win .player {
  filter: drop-shadow(0 0 14px var(--slide-accent));
}

.player.is-over {
  translate: -50% 0;
  rotate: -18deg;
  transform-origin: 50% 100%;
  filter: grayscale(1);
  opacity: 0.75;
  transition:
    rotate 0.5s var(--ease-out),
    opacity 0.5s;
}

/* resultado da fase */
.score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4em;
}

.result {
  padding: 0.2em 0.8em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 0.75);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 0.3s,
    scale 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.lane--lose .result {
  color: var(--slide-bg);
  background: var(--slide-accent-3);
}

.lane--ok .result {
  color: var(--slide-bg);
  background: var(--slide-accent-2);
}

.lane--win .result {
  color: var(--slide-bg);
  background: var(--slide-accent);
  box-shadow: 0 0 24px -4px var(--slide-accent);
}

.lane.is-done .result {
  opacity: 1;
  scale: 1;
}

/* ---------- frase de destaque ---------- */
.is-key .head,
.is-key .lanes,
.is-key .conclusion {
  filter: blur(8px);
  opacity: 0.12;
}

.key {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35em;
  padding: 0 6vw;
  text-align: center;
  pointer-events: none;
}

.key__a {
  font-size: var(--text-title);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.key__b {
  font-size: calc(var(--text-title) * 0.7);
  line-height: 1.2;
  font-weight: 700;
  color: var(--slide-muted);
}

.key em {
  font-style: normal;
  padding-bottom: 0.08em;
  background: linear-gradient(110deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.key mark {
  padding: 0 0.1em;
  color: var(--slide-fg);
  background: linear-gradient(90deg, var(--slide-accent-2), var(--slide-accent-3)) no-repeat left 88% / 0% 0.3em;
  transition: background-size 0.9s var(--ease-out);
}

.key[data-step-shown] mark {
  background-size: 100% 0.3em;
  transition-delay: 800ms;
}

@media (max-aspect-ratio: 1 / 1) {
  .lane {
    grid-template-columns: 1fr auto;
  }

  .hud {
    flex-direction: row;
    align-items: center;
    gap: 0.8em;
  }

  .track {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}
</style>
