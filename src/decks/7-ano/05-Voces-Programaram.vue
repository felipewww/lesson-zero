<script setup lang="ts">
import { computed, onBeforeUnmount, reactive, watch } from 'vue'
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'
import { EXAMPLE_PROGRAM, robotProgram, type RobotCommand } from './robotProgram'

// Passo 1: os comandos da atividade viram blocos; passo 2: o robozinho executa o programa
const { step } = useSteps()
const RUN = 2

// Comandos registrados no slide anterior (ou o exemplo do roteiro, se ninguém registrou)
const commands = computed<RobotCommand[]>(() =>
  robotProgram.commands.length ? [...robotProgram.commands] : EXAMPLE_PROGRAM,
)
const usingExample = computed(() => !robotProgram.commands.length)

// "Avance" seguidos viram um bloco só: Avance 2 passos
const blocks = computed(() => {
  const out: { cmd: RobotCommand; count: number; first: number }[] = []
  commands.value.forEach((cmd, i) => {
    const last = out[out.length - 1]
    if (cmd === 'forward' && last?.cmd === 'forward') last.count++
    else out.push({ cmd, count: 1, first: i })
  })
  return out
})

function blockLabel(b: { cmd: RobotCommand; count: number }) {
  if (b.cmd === 'forward') return `Avance ${b.count} ${b.count === 1 ? 'passo' : 'passos'}`
  if (b.cmd === 'right') return 'Vire à direita'
  if (b.cmd === 'left') return 'Vire à esquerda'
  return 'Pegue o objeto'
}

// ---------- mundo: grade 5x5, robô começa embaixo olhando para cima ----------
const SIZE = 5
const START = { x: 1, y: 4, dir: 0 } // dir: 0 cima, 1 direita, 2 baixo, 3 esquerda
const OBJECT = { x: 2, y: 2 }
const DELTA = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

const robot = reactive({ ...START, turns: 0, bump: false })
const run = reactive({ at: -1, done: false, result: '' as '' | 'ok' | 'miss', holding: false })

const activeBlock = computed(() => {
  if (run.at < 0) return -1
  let idx = -1
  blocks.value.forEach((b, i) => {
    if (b.first <= run.at) idx = i
  })
  return idx
})

let timer: number | undefined

function reset() {
  clearTimeout(timer)
  Object.assign(robot, START, { turns: 0, bump: false })
  Object.assign(run, { at: -1, done: false, result: '', holding: false })
}

function exec(cmd: RobotCommand) {
  robot.bump = false
  if (cmd === 'forward') {
    const [dx, dy] = DELTA[robot.dir]
    const nx = robot.x + dx
    const ny = robot.y + dy
    if (nx < 0 || ny < 0 || nx >= SIZE || ny >= SIZE) robot.bump = true
    else Object.assign(robot, { x: nx, y: ny })
  } else if (cmd === 'right') {
    robot.dir = (robot.dir + 1) % 4
    robot.turns++
  } else if (cmd === 'left') {
    robot.dir = (robot.dir + 3) % 4
    robot.turns--
  } else {
    const hit = robot.x === OBJECT.x && robot.y === OBJECT.y
    run.holding = hit
    run.result = hit ? 'ok' : 'miss'
  }
}

function play() {
  reset()
  const list = commands.value
  const tick = (i: number) => {
    if (i >= list.length) {
      run.done = true
      if (!run.result) run.result = 'miss'
      return
    }
    run.at = i
    exec(list[i])
    timer = window.setTimeout(() => tick(i + 1), 750)
  }
  timer = window.setTimeout(() => tick(0), 600)
}

watch(
  () => step.value >= RUN,
  (running) => (running ? play() : reset()),
  { immediate: true },
)

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Slide>
    <div class="stage">
      <header class="head">
        <h1 v-reveal:blur class="title">Vocês acabaram de <em>programar</em>!</h1>
        <p class="formula">
          <span v-reveal:zoom="400" class="formula__word">PROGRAMAR</span>
          <span v-reveal:fade="600" class="formula__op">=</span>
          <span v-reveal:zoom="800" class="formula__word formula__word--a">INSTRUÇÕES</span>
          <span v-reveal:fade="1000" class="formula__op">+</span>
          <span v-reveal:zoom="1200" class="formula__word formula__word--b">LÓGICA</span>
        </p>
      </header>

      <div class="work">
        <div v-step class="code">
          <span class="code__label">{{ usingExample ? 'exemplo de programa' : 'o programa da turma' }}</span>
          <div class="blocks">
            <div
              v-for="(b, i) in blocks"
              :key="i"
              class="block"
              :class="[`is-${b.cmd}`, { 'is-active': activeBlock === i }]"
              :style="{ '--i': i }"
            >
              {{ blockLabel(b) }}
            </div>
          </div>
        </div>

        <div v-step:zoom="RUN" class="world">
          <div class="grid" :style="{ '--size': SIZE }">
            <span v-for="n in SIZE * SIZE" :key="n" class="cell" />
            <span
              class="object"
              :class="{ 'is-taken': run.holding }"
              :style="{ '--x': OBJECT.x, '--y': OBJECT.y }"
            >
              ⭐
            </span>
            <span
              class="robot"
              :class="{ 'is-bump': robot.bump }"
              :style="{ '--x': robot.x, '--y': robot.y, '--turn': `${robot.turns * 90}deg` }"
            >
              <svg viewBox="0 0 40 40" aria-hidden="true">
                <path d="M20 1 L26 9 H14 Z" class="robot__nose" />
                <rect x="6" y="9" width="28" height="26" rx="9" class="robot__body" />
                <circle cx="15" cy="20" r="3.2" class="robot__eye" />
                <circle cx="25" cy="20" r="3.2" class="robot__eye" />
              </svg>
            </span>
          </div>

          <p class="result" :class="`is-${run.result || 'idle'}`">
            <template v-if="run.result === 'ok'">Conseguiu! 🎉</template>
            <template v-else-if="run.result === 'miss'">Ops! O robô fez exatamente o que mandaram…</template>
            <template v-else>executando…</template>
          </p>

          <button class="replay" @mousedown.prevent @click="play">↻ rodar de novo</button>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 4.5vh, 56px);
}

.head {
  text-align: center;
}

.title {
  font-size: calc(var(--text-title) * 0.85);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.formula {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.3em 0.5em;
  margin-top: 0.6em;
  font-size: calc(var(--text-base) * 1.5);
  font-weight: 900;
  letter-spacing: 0.04em;
}

.formula__word {
  padding: 0.15em 0.55em;
  border-radius: 14px;
  background: rgb(255 255 255 / 0.08);
}

.formula__word--a {
  color: var(--slide-bg);
  background: var(--slide-accent);
}

.formula__word--b {
  color: var(--slide-bg);
  background: var(--slide-accent-2);
}

.formula__op {
  color: var(--slide-muted);
}

/* ---------- blocos + mundo ---------- */
.work {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(20px, 4vw, 80px);
}

@media (max-aspect-ratio: 1 / 1) {
  .work {
    grid-template-columns: 1fr;
  }
}

.code {
  font-size: var(--text-base);
}

.code__label {
  display: block;
  margin-bottom: 0.7em;
  font-size: 0.7em;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.blocks {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 0.8em;
  border-radius: 18px;
  background: rgb(0 0 0 / 0.22);
  max-height: 42vh;
  overflow: auto;
}

/* bloco estilo Scratch, com "dente" de encaixe em cima */
.block {
  --c: var(--slide-accent);
  position: relative;
  min-width: 11em;
  padding: 0.55em 1.1em;
  border-radius: 8px;
  font-weight: 700;
  color: var(--slide-bg);
  background: var(--c);
  box-shadow: inset 0 -4px 0 rgb(0 0 0 / 0.18);
  opacity: 0;
  translate: -24px 0;
  transition:
    opacity 0.45s var(--ease-out),
    translate 0.45s var(--ease-out),
    scale 0.25s var(--ease-out),
    box-shadow 0.25s;
}

.block::before {
  content: '';
  position: absolute;
  top: -5px;
  left: 1.2em;
  width: 1.6em;
  height: 6px;
  border-radius: 3px 3px 0 0;
  background: var(--c);
}

.block:first-child::before {
  display: none;
}

.block.is-left,
.block.is-right {
  --c: var(--slide-accent-2);
}

.block.is-grab {
  --c: var(--slide-accent-3);
}

.code[data-step-shown] .block {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(var(--i) * 140ms);
}

.code[data-step-shown] .block.is-active {
  scale: 1.06;
  box-shadow:
    inset 0 -4px 0 rgb(0 0 0 / 0.18),
    0 0 0 3px var(--slide-fg),
    0 10px 30px -8px var(--c);
  transition-delay: 0ms;
}

/* ---------- mundo ---------- */
.world {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8em;
  font-size: var(--text-base);
}

.grid {
  --cell: min(8.4vh, 6vw);
  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--size), var(--cell));
  grid-template-rows: repeat(var(--size), var(--cell));
  gap: 4px;
  padding: 4px;
  border-radius: 16px;
  background: rgb(0 0 0 / 0.25);
}

.cell {
  border-radius: 8px;
  background: rgb(255 255 255 / 0.05);
}

.object,
.robot {
  position: absolute;
  top: calc(4px + var(--y) * (var(--cell) + 4px));
  left: calc(4px + var(--x) * (var(--cell) + 4px));
  width: var(--cell);
  height: var(--cell);
  display: grid;
  place-items: center;
}

.object {
  font-size: calc(var(--cell) * 0.55);
  transition:
    scale 0.4s var(--ease-out),
    opacity 0.4s;
}

.object.is-taken {
  scale: 0;
  opacity: 0;
}

.robot {
  transition:
    top 0.55s var(--ease-out),
    left 0.55s var(--ease-out);
}

.robot svg {
  width: 82%;
  height: 82%;
  rotate: var(--turn);
  transition: rotate 0.45s var(--ease-out);
  filter: drop-shadow(0 6px 12px color-mix(in srgb, var(--slide-accent) 60%, transparent));
}

.robot.is-bump svg {
  animation: bump 0.4s;
}

@keyframes bump {
  25% { translate: -4px 0; }
  75% { translate: 4px 0; }
}

.robot__nose { fill: var(--slide-accent-2); }
.robot__body { fill: var(--slide-accent); }
.robot__eye { fill: var(--slide-bg); }

.result {
  min-height: 1.4em;
  font-size: 0.85em;
  font-weight: 700;
  text-align: center;
  color: var(--slide-muted);
}

.result.is-ok {
  color: var(--slide-accent);
}

.result.is-miss {
  color: var(--slide-accent-3);
}

.replay {
  padding: 0.35em 1em;
  border: 1px solid rgb(255 255 255 / 0.15);
  border-radius: 999px;
  font: inherit;
  font-size: 0.65em;
  color: var(--slide-muted);
  background: transparent;
  cursor: pointer;
}

.replay:hover {
  color: var(--slide-fg);
  border-color: var(--slide-accent);
}
</style>
