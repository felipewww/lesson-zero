<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos 1..4: cada regra SE → ENTÃO; 5: jogada que dá errado (fim de jogo);
// 6: jogada que dá certo (pula os inimigos e chega na bandeira)
const { step } = useSteps(6) // o passo 6 não tem elemento próprio: só troca a jogada
const PLAY = 5
const WIN = 6

const rules = [
  { id: 'coin', when: 'pegar uma moeda', then: 'ganha 10 pontos', color: 'var(--slide-accent-2)' },
  { id: 'enemy', when: 'encostar no inimigo', then: 'perde uma vida', color: 'var(--slide-accent-3)' },
  { id: 'over', when: 'ficar sem vidas', then: 'fim de jogo', color: 'var(--slide-accent-3)' },
  { id: 'win', when: 'chegar na bandeira', then: 'vence!', color: 'var(--slide-accent)' },
] as const

// ---------- mini-jogo: o personagem corre pela fase e as regras disparam ----------
type Item = { x: number; kind: 'coin' | 'enemy' }
const ITEMS: Item[] = [
  { x: 18, kind: 'coin' },
  { x: 30, kind: 'coin' },
  { x: 44, kind: 'enemy' },
  { x: 58, kind: 'coin' },
  { x: 72, kind: 'enemy' },
  { x: 86, kind: 'coin' },
]
const FLAG_X = 94
const RUN_MS = 7000 // de x=4 até a bandeira
const OVER_MS = 2200 // tempo mostrando "fim de jogo" / "você venceu" antes de recomeçar
const JUMP_RANGE = 6 // na jogada certa, pula quando está a menos de 6% de um inimigo
const START_LIVES = 2

const heroX = ref(4)
const score = ref(0)
const lives = ref(START_LIVES)
const taken = ref<boolean[]>(ITEMS.map(() => false))
const firing = ref<string | null>(null) // regra que acabou de disparar (acende na lista)
const hurt = ref(false)
const over = ref(false)
const won = ref(false)
const winning = computed(() => step.value >= WIN) // jogada 2: o jogador já sabe pular os inimigos
const jumping = computed(
  () => winning.value && !won.value && ITEMS.some((it) => it.kind === 'enemy' && Math.abs(heroX.value - it.x) < JUMP_RANGE),
)

let raf = 0
let start = 0
let fireTimer: number | undefined

function reset() {
  heroX.value = 4
  score.value = 0
  lives.value = START_LIVES
  taken.value = ITEMS.map(() => false)
  over.value = false
  won.value = false
  hurt.value = false
}

function fire(rule: string) {
  firing.value = rule
  clearTimeout(fireTimer)
  fireTimer = window.setTimeout(() => (firing.value = null), 900)
}

function tick(now: number) {
  const t = now - start
  if (over.value || won.value) {
    if (t > OVER_MS) {
      reset()
      start = now
    }
  } else {
    heroX.value = 4 + Math.min(t / RUN_MS, 1) * (FLAG_X - 4)
    ITEMS.forEach((item, i) => {
      if (taken.value[i] || heroX.value < item.x) return
      taken.value[i] = true
      if (item.kind === 'enemy' && winning.value) return // pulou por cima: nada acontece
      if (item.kind === 'coin') {
        score.value += 10
        fire('coin')
      } else {
        lives.value -= 1
        hurt.value = true
        window.setTimeout(() => (hurt.value = false), 600)
        fire('enemy')
        if (lives.value <= 0) {
          over.value = true
          start = now
          window.setTimeout(() => fire('over'), 300)
        }
      }
    })
    if (heroX.value >= FLAG_X) {
      won.value = true
      start = now
      fire('win')
    }
  }
  raf = requestAnimationFrame(tick)
}

watch(
  () => (step.value >= WIN ? 'win' : step.value >= PLAY ? 'lose' : 'off'),
  (mode) => {
    const playing = mode !== 'off'
    cancelAnimationFrame(raf)
    reset()
    if (playing) {
      start = performance.now()
      raf = requestAnimationFrame(tick)
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  clearTimeout(fireTimer)
})
</script>

<template>
  <Slide>
    <div class="layout" :class="{ 'is-playing': step >= PLAY }">
      <header class="head">
        <p v-reveal:fade class="kicker">essa é a lógica de um jogo!</p>
        <h1 v-reveal:blur="150" class="title">
          <span class="chip chip--if">SE</span> acontecer isso <span class="arrow">→</span>
          <span class="chip chip--then">ENTÃO</span> faça aquilo.
        </h1>
      </header>

      <ul class="rules">
        <li
          v-for="r in rules"
          :key="r.id"
          v-step:left
          class="rule"
          :class="{ 'is-firing': firing === r.id }"
          :style="{ '--c': r.color }"
        >
          <span class="rule__if">SE</span>
          <span class="rule__when">{{ r.when }}</span>
          <span class="rule__arrow">→</span>
          <span class="rule__then">{{ r.then }}</span>
        </li>
      </ul>

      <div v-step:zoom="PLAY" class="game" :class="{ 'is-over': over, 'is-won': won }" aria-hidden="true">
        <div class="hud">
          <span class="hud__score">★ {{ score }} pts</span>
          <span class="hud__try" :class="winning ? 'is-good' : 'is-bad'">
            {{ winning ? 'jogada 2 · dando certo' : 'jogada 1 · dando errado' }}
          </span>
          <span class="hud__lives">
            <Icon v-for="n in START_LIVES" :key="n" name="heart" :class="{ 'is-lost': n > lives }" />
          </span>
        </div>

        <div class="track">
          <span class="track__floor" />
          <template v-for="(item, i) in ITEMS" :key="i">
            <span v-if="item.kind === 'coin'" class="coin" :class="{ 'is-taken': taken[i] }" :style="{ left: `${item.x}%` }" />
            <span v-else class="enemy" :class="{ 'is-hit': taken[i] }" :style="{ left: `${item.x}%` }">
              <i class="eye" /><i class="eye" />
            </span>
          </template>
          <span class="flag" :style="{ left: `${FLAG_X}%` }"><i class="flag__cloth" /></span>
          <span class="hero" :class="{ 'is-hurt': hurt, 'is-jumping': jumping }" :style="{ left: `${heroX}%` }">
            <i class="eye" /><i class="eye" />
          </span>
        </div>

        <div class="over">FIM DE JOGO</div>
        <div class="over over--win">VOCÊ VENCEU!</div>
      </div>

    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1.1fr;
  grid-template-rows: auto 1fr;
  column-gap: clamp(24px, 4vw, 80px);
  row-gap: clamp(16px, 4vh, 48px);
  align-content: center;
  align-items: center;
}

.head {
  grid-column: 1 / -1;
}

.kicker {
  font-size: calc(var(--text-base) * 0.8);
  font-weight: 600;
  color: var(--slide-accent-2);
}

.title {
  margin-top: 0.3em;
  font-size: calc(var(--text-title) * 0.92);
  line-height: 1.25;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.chip {
  display: inline-block;
  padding: 0 0.3em;
  border-radius: 0.25em;
  color: var(--slide-bg);
}

.chip--if {
  background: var(--slide-accent);
}

.chip--then {
  background: var(--slide-accent-2);
}

.arrow {
  color: var(--slide-muted);
}

/* ---------- regras SE → ENTÃO ---------- */
.rules {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(10px, 2vh, 22px);
}

.rule {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5em;
  padding: 0.7em 1em;
  border-radius: 18px;
  font-size: var(--text-base);
  background: rgb(255 255 255 / 0.04);
  border: 2px solid rgb(255 255 255 / 0.08);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.3s,
    background 0.3s,
    box-shadow 0.3s,
    scale 0.3s var(--ease-out);
}

.rule__if {
  padding: 0.1em 0.5em;
  border-radius: 0.4em;
  font-size: 0.75em;
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--slide-accent);
}

.rule__arrow {
  color: var(--slide-muted);
}

.rule__then {
  font-weight: 700;
  color: var(--c);
}

.rule.is-firing {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 16%, transparent);
  box-shadow: 0 0 30px -8px var(--c);
  scale: 1.03;
}

/* ---------- mini-jogo ---------- */
.game {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: clamp(24px, 6vh, 72px);
  padding: clamp(14px, 1.8vw, 28px);
  border-radius: 28px;
  overflow: hidden;
  background: linear-gradient(180deg, color-mix(in srgb, var(--slide-accent) 18%, var(--slide-bg)), var(--slide-bg));
  border: 2px solid color-mix(in srgb, var(--slide-accent) 35%, transparent);
  box-shadow: 0 30px 70px -30px var(--slide-accent);
}

.hud {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: var(--text-base);
  font-weight: 800;
}

.hud__score {
  color: var(--slide-accent-2);
  font-variant-numeric: tabular-nums;
}

.hud__try {
  padding: 0.2em 0.8em;
  border-radius: 999px;
  font-size: 0.7em;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.hud__try.is-bad {
  color: var(--slide-accent-3);
  background: color-mix(in srgb, var(--slide-accent-3) 15%, transparent);
}

.hud__try.is-good {
  color: var(--slide-accent);
  background: color-mix(in srgb, var(--slide-accent) 15%, transparent);
}

.hud__lives {
  display: flex;
  gap: 0.3em;
  color: var(--slide-accent-3);
}

.hud__lives :deep(.icon) {
  width: 1.3em;
  height: 1.3em;
  fill: currentColor;
  transition:
    opacity 0.3s,
    scale 0.3s var(--ease-out);
}

.hud__lives :deep(.icon.is-lost) {
  fill: none;
  opacity: 0.35;
  scale: 0.8;
}

.track {
  --u: clamp(34px, 7vh, 78px);
  position: relative;
  height: calc(var(--u) * 2.4);
}

.track__floor {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 6px;
  border-radius: 3px;
  background: color-mix(in srgb, var(--slide-accent) 50%, var(--slide-bg));
}

.coin,
.enemy,
.hero {
  position: absolute;
  bottom: 6px;
  translate: -50% 0;
}

.coin {
  bottom: calc(var(--u) * 0.9);
  width: calc(var(--u) * 0.6);
  height: calc(var(--u) * 0.6);
  border-radius: 50%;
  background: var(--slide-accent-2);
  box-shadow: 0 0 14px -2px var(--slide-accent-2);
  animation: spin 1.6s linear infinite;
  transition:
    opacity 0.3s,
    translate 0.4s var(--ease-out);
}

@keyframes spin {
  50% { scale: 0.3 1; }
}

.coin.is-taken {
  opacity: 0;
  translate: -50% -20px;
}

.enemy {
  width: var(--u);
  height: var(--u);
  border-radius: 45% 45% 20% 20%;
  background: var(--slide-accent-3);
  display: flex;
  justify-content: center;
  gap: calc(var(--u) * 0.16);
  padding-top: calc(var(--u) * 0.28);
  transition: opacity 0.4s;
}

.enemy.is-hit {
  opacity: 0.35;
}

.hero {
  width: calc(var(--u) * 1.05);
  height: calc(var(--u) * 1.2);
  border-radius: 40%;
  background: var(--slide-accent);
  display: flex;
  justify-content: center;
  gap: calc(var(--u) * 0.18);
  padding-top: calc(var(--u) * 0.32);
  z-index: 1;
  animation: run 0.4s ease-in-out infinite alternate;
}

@keyframes run {
  to { bottom: 12px; }
}

/* pulo por cima do inimigo (jogada 2) */
.hero {
  transition: translate 0.25s var(--ease-out);
}

.hero.is-jumping {
  translate: -50% calc(var(--u) * -1.4);
}

.flag {
  position: absolute;
  bottom: 6px;
  width: 4px;
  height: calc(var(--u) * 1.9);
  border-radius: 2px;
  background: var(--slide-fg);
}

.flag__cloth {
  position: absolute;
  top: 0;
  left: 4px;
  width: calc(var(--u) * 0.8);
  height: calc(var(--u) * 0.55);
  background: var(--slide-accent);
  clip-path: polygon(0 0, 100% 50%, 0 100%);
  transform-origin: left center;
  animation: wave 1s ease-in-out infinite alternate;
}

@keyframes wave {
  to { scale: 0.85 1.08; }
}

.hero.is-hurt {
  animation: hurt 0.12s steps(2) 5;
}

@keyframes hurt {
  50% { opacity: 0.2; }
}

.eye {
  display: block;
  width: calc(var(--u) * 0.24);
  height: calc(var(--u) * 0.24);
  border-radius: 50%;
  background: #fff;
  box-shadow: inset -2px -1px 0 2px var(--slide-bg);
}

.over {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(var(--text-title) * 0.8);
  font-weight: 900;
  letter-spacing: 0.04em;
  color: var(--slide-accent-3);
  background: color-mix(in srgb, var(--slide-bg) 75%, transparent);
  opacity: 0;
  scale: 1.2;
  transition:
    opacity 0.4s,
    scale 0.5s var(--ease-out);
  pointer-events: none;
}

.over--win {
  color: var(--slide-accent);
}

.game.is-over .over:not(.over--win),
.game.is-won .over--win {
  opacity: 1;
  scale: 1;
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}
</style>
