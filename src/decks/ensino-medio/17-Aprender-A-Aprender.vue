<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1..3 = um desafio por vez; 4 = conclusão; 5 = frase de destaque
const { step } = useSteps()
const CONCLUSION = 4
const KEY = 5

/**
 * Os três desafios têm os MESMOS obstáculos, nas mesmas posições.
 * O que muda é quanto o personagem já conhece:
 *  u = desconhecido (para e se esforça) · k = já visto (passa rápido) · p = padrão reconhecido (nem para)
 */
type Kind = 'u' | 'k' | 'p'
const OBSTACLES = [16, 30, 44, 58, 72, 86] // posição em % da trilha
const START = 3
const END = 97
const MS_PER_PERCENT = 22
const PAUSE: Record<Kind, number> = { u: 820, k: 240, p: 0 }
const SCAN = 600 // no 3º desafio, os padrões "acendem" antes da corrida

const lanes: { label: string; text: string; kinds: Kind[]; level: number; delay: number }[] = [
  { label: '1º desafio', text: 'Aprender exige esforço e prática.', kinds: ['u', 'u', 'u', 'u', 'u', 'u'], level: 1, delay: 0 },
  {
    label: '2º desafio',
    text: 'Conhecimentos anteriores ajudam a compreender novos conceitos.',
    kinds: ['k', 'u', 'k', 'u', 'k', 'u'],
    level: 2,
    delay: 0,
  },
  { label: '3º desafio', text: 'Cada desafio desenvolve seu raciocínio.', kinds: ['p', 'p', 'p', 'p', 'p', 'p'], level: 3, delay: SCAN },
]

/** Linha do tempo de uma trilha: chegada e saída em cada obstáculo. */
function timeline(kinds: Kind[], delay: number) {
  let t = delay
  let x = START
  const stops = OBSTACLES.map((ox, i) => {
    t += (ox - x) * MS_PER_PERCENT
    x = ox
    const arrive = t
    t += PAUSE[kinds[i]]
    return { x: ox, arrive, leave: t }
  })
  t += (END - x) * MS_PER_PERCENT
  return { delay, stops, total: t }
}

const plans = lanes.map((l) => timeline(l.kinds, l.delay))
const elapsed = reactive(lanes.map(() => 0)) // ms decorridos em cada trilha

function positionAt(lane: number) {
  const { stops, total, delay } = plans[lane]
  const t = elapsed[lane]
  if (t <= delay) return START
  if (t >= total) return END
  let prevX = START
  let prevT = delay
  for (const s of stops) {
    if (t < s.arrive) return prevX + ((t - prevT) / (s.arrive - prevT)) * (s.x - prevX)
    if (t < s.leave) return s.x
    prevX = s.x
    prevT = s.leave
  }
  return prevX + ((t - prevT) / (total - prevT)) * (END - prevX)
}

function obstacleState(lane: number, i: number) {
  const s = plans[lane].stops[i]
  const t = elapsed[lane]
  if (t >= s.leave && t > 0) return 'is-cleared'
  if (t >= s.arrive) return 'is-active'
  return ''
}

const positions = computed(() => lanes.map((_, i) => positionAt(i)))
const runTime = (lane: number) => {
  const ms = Math.max(0, Math.min(elapsed[lane], plans[lane].total) - plans[lane].delay)
  return `${(ms / 1000).toFixed(1).replace('.', ',')}s`
}

// ---------- execução: cada trilha corre quando o passo dela chega ----------
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
    lanes.forEach((_, i) => {
      const n = i + 1
      if (s < n) {
        cancelAnimationFrame(rafs[i])
        elapsed[i] = 0
      } else if (s === n && old === n - 1) run(i) // avançou até esta trilha: corre
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
        <p v-reveal:fade class="kicker">a habilidade mais importante do futuro</p>
        <h1 class="hero">
          <span v-reveal:blur="200">Aprender</span>
          <span v-reveal:zoom="500" class="hero__a">a</span>
          <span class="hero__grad">aprender</span>
        </h1>
        <p class="lead">
          <span>Quanto mais você aprende, mais preparado seu cérebro fica para aprender <em>coisas novas</em>.</span>
        </p>
      </header>

      <div class="lanes">
        <div
          v-for="(lane, li) in lanes"
          :key="lane.label"
          v-step="li + 1"
          class="lane"
          :class="[`lane--${li + 1}`, { 'is-current': step === li + 1 }]"
          :style="{ '--lvl': lane.level }"
        >
          <div class="lane__info">
            <span class="lane__label">{{ lane.label }}</span>
            <span class="lane__text">{{ lane.text }}</span>
          </div>

          <div class="track">
            <span class="track__line" />
            <span class="track__done" :style="{ width: `${positions[li] - START}%`, left: `${START}%` }" />
            <span
              v-for="(x, oi) in OBSTACLES"
              :key="x"
              class="obstacle"
              :class="[`obstacle--${lane.kinds[oi]}`, obstacleState(li, oi), { 'is-scanned': elapsed[li] > 0 }]"
              :style="{ left: `${x}%`, '--oi': oi }"
            >
              <Icon v-if="obstacleState(li, oi) === 'is-cleared' || lane.kinds[oi] !== 'u'" name="check" />
              <template v-else>?</template>
            </span>
            <span class="runner" :style="{ left: `${positions[li]}%` }">
              <Icon :name="lane.level === 3 ? 'brain' : 'user'" />
            </span>
          </div>

          <span class="lane__time" :class="{ 'is-final': elapsed[li] >= plans[li].total }">{{ runTime(li) }}</span>
        </div>

        <p v-step="CONCLUSION" class="conclusion">
          <span class="conclusion__same">mesmos obstáculos</span>
          <span class="conclusion__text">
            Quanto mais você <em>exercita</em> essa capacidade, mais facilidade tende a ter para aprender.
          </span>
        </p>
      </div>

      <p v-step:blur="KEY" class="key">
        <span class="key__a">Aprender também é uma <em>habilidade</em>.</span>
        <span class="key__b">E, como qualquer habilidade, precisa ser <mark>treinada</mark>.</span>
      </p>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 5vh, 64px);
}

.head {
  text-align: center;
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.75);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.hero {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 0 0.28em;
  margin-top: 0.2em;
  font-size: calc(var(--text-hero) * 1.15);
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
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

/* ---------- frase de apoio (passo 1) ---------- */
.lead {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  font-size: calc(var(--text-base) * 1.05);
  color: var(--slide-muted);
  transition:
    max-height 0.8s var(--ease-out),
    opacity 0.6s 0.3s,
    margin 0.8s var(--ease-out);
}

.lead > span {
  text-wrap: balance;
}

.lead em {
  font-style: normal;
  color: var(--slide-fg);
  font-weight: 700;
}

.is-open .lead {
  max-height: 4em;
  opacity: 1;
  margin-top: 0.5em;
}

/* ---------- as três trilhas ---------- */
.lanes {
  display: flex;
  flex-direction: column;
  gap: clamp(12px, 2.6vh, 36px);
  max-height: 0;
  transition:
    max-height 0.8s var(--ease-out),
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.is-open .lanes {
  max-height: 75vh;
}

.lane {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 2.2fr) 4em;
  align-items: center;
  gap: clamp(12px, 2vw, 36px);
  padding: clamp(14px, 2.2vh, 32px) clamp(16px, 2vw, 36px);
  border-radius: 24px;
  background: rgb(255 255 255 / 0.03);
  border: 1px solid rgb(255 255 255 / 0.06);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s;
}

.lane.is-current {
  border-color: rgb(255 255 255 / 0.18);
  background: rgb(255 255 255 / 0.06);
}

.lane__info {
  display: flex;
  flex-direction: column;
  gap: 0.2em;
}

.lane__label {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.lane--2 .lane__label { color: var(--slide-accent-2); }
.lane--3 .lane__label { color: var(--slide-accent-3); }

.lane__text {
  font-size: var(--text-base);
  line-height: 1.25;
  text-wrap: balance;
}

/* trilha */
.track {
  position: relative;
  height: clamp(56px, 9vh, 110px);
}

.track__line,
.track__done {
  position: absolute;
  top: 50%;
  height: 2px;
  translate: 0 -50%;
}

.track__line {
  left: 3%;
  right: 3%;
  background: repeating-linear-gradient(90deg, rgb(255 255 255 / 0.18) 0 8px, transparent 8px 14px);
}

.track__done {
  background: linear-gradient(90deg, var(--slide-accent), var(--slide-accent-2));
  box-shadow: 0 0 12px var(--slide-accent);
}

.obstacle {
  --size: clamp(32px, 5.6vh, 64px);
  position: absolute;
  top: 50%;
  width: var(--size);
  height: var(--size);
  translate: -50% -50%;
  display: grid;
  place-items: center;
  border-radius: 10px;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--size) * 0.5);
  font-weight: 700;
  transition:
    background 0.3s,
    border-color 0.3s,
    color 0.3s,
    box-shadow 0.3s,
    scale 0.3s var(--ease-out);
}

/* desconhecido: vermelho com "?" — para e se esforça */
.obstacle--u {
  color: #fca5a5;
  background: rgb(239 68 68 / 0.14);
  border: 1px solid rgb(239 68 68 / 0.5);
}

.obstacle--u.is-active {
  animation: struggle 0.32s ease-in-out infinite;
  box-shadow: 0 0 22px -4px rgb(239 68 68 / 0.9);
}

@keyframes struggle {
  0%, 100% { rotate: 0deg; }
  25% { rotate: -8deg; }
  75% { rotate: 8deg; }
}

/* já visto: neutro com check apagado — passa rápido */
.obstacle--k {
  color: rgb(167 139 250 / 0.7);
  background: rgb(167 139 250 / 0.1);
  border: 1px dashed rgb(167 139 250 / 0.5);
}

/* padrão: acende em sequência antes da corrida — nem precisa parar */
.obstacle--p {
  color: rgb(255 255 255 / 0.35);
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.15);
}

.obstacle--p.is-scanned {
  color: var(--slide-accent-3);
  border-color: var(--slide-accent-3);
  background: rgb(244 114 182 / 0.12);
  box-shadow: 0 0 18px -6px var(--slide-accent-3);
  transition-delay: calc(var(--oi) * 80ms);
}

.obstacle.is-cleared {
  color: #052e1b;
  background: #34d399;
  border-color: #34d399;
  box-shadow: 0 0 16px -6px #34d399;
  scale: 0.85;
  transition-delay: 0ms;
}

.obstacle :deep(.icon) {
  width: 1.1em;
  height: 1.1em;
  stroke-width: 2.5;
}

/* personagem: o brilho cresce a cada desafio (a capacidade evoluiu) */
.runner {
  position: absolute;
  top: 50%;
  translate: -50% -50%;
  display: grid;
  place-items: center;
  width: calc(clamp(38px, 6.2vh, 70px) + var(--lvl) * 4px);
  height: calc(clamp(38px, 6.2vh, 70px) + var(--lvl) * 4px);
  border-radius: 50%;
  color: var(--slide-fg);
  background: var(--slide-bg);
  border: 2px solid var(--slide-accent);
  box-shadow: 0 0 calc(var(--lvl) * 14px) calc(var(--lvl) * 2px - 4px) var(--slide-accent);
  z-index: 1;
}

.lane--2 .runner { border-color: var(--slide-accent-2); box-shadow: 0 0 28px 0 var(--slide-accent-2); }
.lane--3 .runner { border-color: var(--slide-accent-3); box-shadow: 0 0 44px 4px var(--slide-accent-3); }

.runner :deep(.icon) {
  width: 55%;
  height: 55%;
}

.lane__time {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 1.1);
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: var(--slide-muted);
  transition: color 0.4s;
}

.lane__time.is-final {
  color: var(--slide-fg);
  font-weight: 700;
}

/* ---------- conclusão (passo 4) ---------- */
.conclusion {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.6em 1.2em;
  margin-top: 1vh;
  text-align: center;
}

.conclusion__same {
  padding: 0.35em 0.9em;
  border-radius: 999px;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.6);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #fca5a5;
  border: 1px solid rgb(239 68 68 / 0.4);
}

.conclusion__text {
  font-size: calc(var(--text-base) * 1.15);
  font-weight: 700;
  text-wrap: balance;
}

.conclusion em,
.key em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- frase de destaque (passo 5) ---------- */
.stage {
  position: relative;
}

.head {
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.is-key .head,
.is-key .lanes {
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
  gap: 0.4em;
  padding: 0 6vw;
  text-align: center;
  pointer-events: none;
}

.key__a {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

.key__b {
  font-size: calc(var(--text-title) * 0.6);
  line-height: 1.2;
  font-weight: 700;
  color: var(--slide-muted);
  text-wrap: balance;
}

.key mark {
  padding: 0 0.1em;
  color: var(--slide-fg);
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3)) no-repeat left
    85% / 0% 0.3em;
  transition: background-size 0.9s var(--ease-out);
}

.key[data-step-shown] mark {
  background-size: 100% 0.3em;
  transition-delay: 800ms;
}

@media (max-aspect-ratio: 1 / 1) {
  .lane {
    grid-template-columns: 1fr 4em;
  }

  .lane__info {
    grid-column: 1 / -1;
  }
}
</style>
