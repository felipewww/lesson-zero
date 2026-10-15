<script setup lang="ts">
import { onBeforeUnmount, reactive } from 'vue'
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos 1..4: um exemplo por vez (o atual fica em destaque)
const { step } = useSteps()

const examples: { text: string; icon: IconName; fx: string; color: string }[] = [
  { text: 'Fazer um personagem pular', icon: 'gamepad', fx: 'hop', color: 'var(--slide-accent)' },
  { text: 'Calcular uma nota da escola', icon: 'clipboard-check', fx: 'pop', color: 'var(--slide-accent-2)' },
  { text: 'Enviar uma mensagem', icon: 'message', fx: 'fly', color: 'var(--slide-accent-3)' },
  { text: 'Controlar um robô', icon: 'bot', fx: 'wave', color: 'var(--slide-accent)' },
]

// ---------- código JavaScript executado linha a linha (ordenação por trocas) ----------
const NUMBERS = [7, 2, 9, 4, 1, 5]
const MAX = Math.max(...NUMBERS)

// Linhas do código; os números de linha abaixo apontam para elas (1 = primeira)
const CODE = [
  '<span class="k">const</span> numeros = [<span class="n">7</span>, <span class="n">2</span>, <span class="n">9</span>, <span class="n">4</span>, <span class="n">1</span>, <span class="n">5</span>]',
  '',
  '<span class="k">for</span> (<span class="k">let</span> fim = numeros.length - <span class="n">1</span>; fim &gt; <span class="n">0</span>; fim--) {',
  '  <span class="k">for</span> (<span class="k">let</span> i = <span class="n">0</span>; i &lt; fim; i++) {',
  '    <span class="k">if</span> (numeros[i] &gt; numeros[i + <span class="n">1</span>]) {',
  '      <span class="c">// troca os dois de lugar</span>',
  '      <span class="k">const</span> guarda = numeros[i]',
  '      numeros[i] = numeros[i + <span class="n">1</span>]',
  '      numeros[i + <span class="n">1</span>] = guarda',
  '    }',
  '  }',
  '}',
  '',
  '<span class="f">console</span>.<span class="f">log</span>(numeros)',
]
// Ajuste geral de ritmo (1 = durações abaixo; a execução completa leva ~20s em 1x)
const PACE = 0.68
const L = { DECL: 1, OUTER: 3, INNER: 4, IF: 5, KEEP: 7, SET1: 8, SET2: 9, LOG: 14 }

// Roteiro da execução: cada passo acende uma linha e muda o estado
type Event = {
  line: number
  ms: number
  fim?: number
  i?: number
  guarda?: number | null
  compare?: boolean
  swap?: boolean
  done?: boolean
}
const events: Event[] = [{ line: L.DECL, ms: 700 }]
{
  const arr = [...NUMBERS]
  for (let fim = arr.length - 1; fim > 0; fim--) {
    events.push({ line: L.OUTER, ms: 450, fim })
    for (let i = 0; i < fim; i++) {
      events.push({ line: L.INNER, ms: 300, i, guarda: null })
      events.push({ line: L.IF, ms: 600, compare: true })
      if (arr[i] > arr[i + 1]) {
        events.push({ line: L.KEEP, ms: 400, guarda: arr[i] })
        events.push({ line: L.SET1, ms: 650, swap: true })
        events.push({ line: L.SET2, ms: 400 })
        ;[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]]
      }
    }
  }
  events.push({ line: L.LOG, ms: 600, done: true })
}

const run = reactive({
  status: 'idle' as 'idle' | 'running' | 'done',
  speed: 1,
  line: 0,
  order: NUMBERS.map((_, idx) => idx), // order[pos] = qual barra está na posição
  fim: null as number | null,
  i: null as number | null,
  guarda: null as number | null,
  comparing: false,
  started: false,
  sorted: false,
  output: '',
})

let timer: number | undefined

function reset() {
  clearTimeout(timer)
  Object.assign(run, {
    status: 'idle',
    line: 0,
    order: NUMBERS.map((_, idx) => idx),
    fim: null,
    i: null,
    guarda: null,
    comparing: false,
    started: false,
    sorted: false,
    output: '',
  })
}

function apply(e: Event) {
  run.line = e.line
  run.comparing = !!e.compare
  if (e.line === L.DECL) run.started = true
  if (e.fim !== undefined) run.fim = e.fim
  if (e.i !== undefined) run.i = e.i
  if (e.guarda !== undefined) run.guarda = e.guarda
  if (e.swap && run.i !== null) {
    const o = [...run.order]
    ;[o[run.i], o[run.i + 1]] = [o[run.i + 1], o[run.i]]
    run.order = o
  }
  if (e.done) {
    Object.assign(run, { sorted: true, i: null, output: `[${run.order.map((bar) => NUMBERS[bar]).join(', ')}]` })
  }
}

function play() {
  reset()
  run.status = 'running'
  let k = 0
  const next = () => {
    if (k >= events.length) {
      run.status = 'done'
      return
    }
    const e = events[k++]
    apply(e)
    timer = window.setTimeout(next, (e.ms * PACE) / run.speed)
  }
  timer = window.setTimeout(next, 200)
}

function toggleSpeed() {
  run.speed = run.speed === 1 ? 2 : 1
}

const slotOf = (bar: number) => run.order.indexOf(bar)
const isCompared = (bar: number) =>
  run.comparing && run.i !== null && [run.i, run.i + 1].includes(slotOf(bar))

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="text">
        <h1 v-reveal:blur class="title">
          Programar é <em>ensinar</em> um computador a fazer alguma coisa.
        </h1>

        <p v-reveal:fade="400" class="label">por exemplo</p>
        <ul class="examples">
          <li
            v-for="(ex, i) in examples"
            :key="ex.text"
            v-step:left
            class="example"
            :class="[`fx-${ex.fx}`, { 'is-current': step === i + 1 }]"
            :style="{ '--c': ex.color }"
          >
            <span class="example__icon"><Icon :name="ex.icon" /></span>
            {{ ex.text }}
          </li>
        </ul>
      </div>

      <!-- um programa de verdade, executado linha a linha: organiza os números do menor para o maior -->
      <div v-reveal:zoom="300" class="editor">
        <div class="editor__bar">
          <i class="dot" /><i class="dot" /><i class="dot" />
          <span class="editor__file">organiza.js</span>
          <button class="editor__speed" title="Velocidade" @mousedown.prevent @click="toggleSpeed">{{ run.speed }}x</button>
          <button
            class="editor__play"
            :class="{ 'is-running': run.status === 'running' }"
            :disabled="run.status === 'running'"
            @mousedown.prevent
            @click="play"
          >
            <template v-if="run.status === 'running'">executando…</template>
            <template v-else-if="run.status === 'done'">↻ rodar de novo</template>
            <template v-else>▶ executar</template>
          </button>
        </div>

        <pre class="code"><code><span
          v-for="(html, n) in CODE"
          :key="n"
          class="code__line"
          :class="{ 'is-active': run.line === n + 1 }"
        ><span class="code__num">{{ n + 1 }}</span><span v-html="html || ' '" /></span></code></pre>

        <div class="vars">
          <span class="var"><b>fim</b> {{ run.fim ?? '–' }}</span>
          <span class="var"><b>i</b> {{ run.i ?? '–' }}</span>
          <span class="var" :class="{ 'is-set': run.guarda !== null }"><b>guarda</b> {{ run.guarda ?? '–' }}</span>
        </div>

        <div class="bars" :class="{ 'is-shown': run.started, 'is-sorted': run.sorted }" :style="{ '--n': NUMBERS.length }">
          <span
            v-for="(value, bar) in NUMBERS"
            :key="bar"
            class="bar"
            :class="{ 'is-comparing': isCompared(bar) }"
            :style="{ '--slot': slotOf(bar), '--h': value / MAX }"
          >
            <span class="bar__value">{{ value }}</span>
          </span>
          <span v-if="run.i !== null" class="pointer" :style="{ '--slot': run.i }">i</span>
          <span v-if="!run.started" class="bars__hint">aperte ▶ executar</span>
        </div>

        <div class="console">
          <span class="console__prompt">&gt;</span>
          <span class="console__out">{{ run.output }}</span>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  align-items: center;
  gap: clamp(24px, 4vw, 96px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

.title {
  font-size: calc(var(--text-title) * 0.85);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.label {
  margin-top: 5vh;
  font-size: calc(var(--text-base) * 0.75);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

/* ---------- exemplos ---------- */
.examples {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(10px, 1.4vw, 22px);
  margin-top: 1.2vh;
}

.example {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.75em 1em;
  border-radius: 18px;
  font-size: calc(var(--text-base) * 1.08);
  font-weight: 600;
  line-height: 1.2;
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.1);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s;
}

.example.is-current {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 12%, transparent);
}

.example__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.2em;
  height: 2.2em;
  border-radius: 0.7em;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 16%, transparent);
}

.example__icon :deep(.icon) {
  width: 1.3em;
  height: 1.3em;
}

/* cada ícone faz a sua "ação" enquanto o exemplo está em destaque */
.example.is-current.fx-hop .example__icon :deep(.icon) { animation: hop 0.9s ease-in-out infinite; }
.example.is-current.fx-pop .example__icon :deep(.icon) { animation: pop 1.2s ease-in-out infinite; }
.example.is-current.fx-fly .example__icon :deep(.icon) { animation: fly 1.6s ease-in-out infinite; }
.example.is-current.fx-wave .example__icon :deep(.icon) { animation: wave 1.4s ease-in-out infinite; }

@keyframes hop {
  0%, 100% { translate: 0 0; }
  40% { translate: 0 -30%; }
}

@keyframes pop {
  0%, 100% { scale: 1; }
  50% { scale: 1.25; }
}

@keyframes fly {
  0% { translate: 0 0; opacity: 1; }
  60% { translate: 60% -60%; opacity: 0; }
  61% { translate: -60% 60%; opacity: 0; }
  100% { translate: 0 0; opacity: 1; }
}

@keyframes wave {
  0%, 100% { rotate: 0deg; }
  25% { rotate: -14deg; }
  75% { rotate: 14deg; }
}

/* ---------- editor: código executado linha a linha ---------- */
.editor {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.5vh, 18px);
  padding-bottom: clamp(12px, 1.6vh, 20px);
  border-radius: 22px;
  overflow: hidden;
  font-size: var(--text-base);
  background: color-mix(in srgb, var(--slide-bg) 85%, #000);
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: 0 40px 80px -30px color-mix(in srgb, var(--slide-accent) 60%, transparent);
}

.editor__bar {
  display: flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.6em 0.8em 0.6em 1em;
  font-size: 0.7em;
  background: rgb(255 255 255 / 0.05);
}

.dot {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background: var(--slide-accent-3);
}

.dot:nth-child(2) { background: var(--slide-accent-2); }
.dot:nth-child(3) { background: var(--slide-accent); }

.editor__file {
  margin-left: 0.8em;
  margin-right: auto;
  color: var(--slide-muted);
  font-family: var(--slide-font-mono);
}

.editor__speed,
.editor__play {
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition:
    background 0.3s,
    color 0.3s,
    scale 0.2s var(--ease-out);
}

.editor__speed {
  padding: 0.35em 0.8em;
  color: var(--slide-muted);
  background: rgb(255 255 255 / 0.08);
}

.editor__play {
  padding: 0.35em 1.1em;
  color: var(--slide-bg);
  background: var(--slide-accent);
  box-shadow: 0 0 20px -6px var(--slide-accent);
}

.editor__play:hover:not(:disabled),
.editor__speed:hover {
  scale: 1.06;
}

.editor__play.is-running {
  cursor: default;
  color: var(--slide-accent);
  background: color-mix(in srgb, var(--slide-accent) 18%, transparent);
  box-shadow: none;
}

.code {
  margin: 0 clamp(10px, 1.2vw, 20px);
  font-size: 0.68em;
  line-height: 1.5;
  white-space: pre;
  overflow: hidden;
}

.code__line {
  display: block;
  border-radius: 6px;
  border-left: 3px solid transparent;
  transition:
    background 0.2s,
    border-color 0.2s;
}

.code__line.is-active {
  background: color-mix(in srgb, var(--slide-accent) 18%, transparent);
  border-left-color: var(--slide-accent);
}

.code__num {
  display: inline-block;
  width: 2.2em;
  padding-right: 0.8em;
  text-align: right;
  color: color-mix(in srgb, var(--slide-muted) 55%, transparent);
  user-select: none;
}

.code :deep(.k) { color: var(--slide-accent-3); }
.code :deep(.f) { color: var(--slide-accent); }
.code :deep(.n) { color: var(--slide-accent-2); }
.code :deep(.c) { color: var(--slide-muted); font-style: italic; }

/* variáveis mudando durante a execução */
.vars {
  display: flex;
  gap: 0.5em;
  margin: 0 clamp(14px, 1.6vw, 26px);
  font-family: var(--slide-font-mono);
  font-size: 0.62em;
}

.var {
  padding: 0.25em 0.7em;
  border-radius: 8px;
  color: var(--slide-fg);
  background: rgb(255 255 255 / 0.06);
}

.var b {
  margin-right: 0.4em;
  font-weight: 400;
  color: var(--slide-muted);
}

.var.is-set {
  color: var(--slide-bg);
  background: var(--slide-accent-2);
}

.var.is-set b {
  color: color-mix(in srgb, var(--slide-bg) 70%, transparent);
}

/* barras: a altura é o valor; a posição muda quando o código troca dois números */
.bars {
  --gap: 0.5em;
  position: relative;
  height: clamp(90px, 17vh, 180px);
  margin: 0 clamp(14px, 1.6vw, 26px) 1.1em;
}

.bar {
  --w: calc((100% - (var(--n) - 1) * var(--gap)) / var(--n));
  position: absolute;
  bottom: 0;
  left: calc(var(--slot) * (var(--w) + var(--gap)));
  width: var(--w);
  height: calc(18% + var(--h) * 82%);
  display: flex;
  justify-content: center;
  padding-top: 0.3em;
  border-radius: 12px 12px 6px 6px;
  font-weight: 800;
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  opacity: 0;
  translate: 0 20px;
  transition:
    left 0.4s var(--ease-out),
    background 0.2s,
    box-shadow 0.2s,
    opacity 0.4s,
    translate 0.4s var(--ease-out);
}

.bars.is-shown .bar {
  opacity: 1;
  translate: 0 0;
}

.bar.is-comparing {
  background: var(--slide-accent-3);
  box-shadow: 0 0 24px -4px var(--slide-accent-3);
}

.bars.is-sorted .bar {
  background: var(--slide-accent);
  box-shadow: 0 0 20px -6px var(--slide-accent);
}

/* setinha "i" embaixo da posição comparada */
.pointer {
  --w: calc((100% - (var(--n) - 1) * var(--gap)) / var(--n));
  position: absolute;
  top: 100%;
  left: calc(var(--slot) * (var(--w) + var(--gap)) + var(--w) / 2);
  translate: -50% 0.2em;
  font-family: var(--slide-font-mono);
  font-size: 0.65em;
  font-weight: 700;
  color: var(--slide-accent-3);
  transition: left 0.3s var(--ease-out);
}

.pointer::before {
  content: '▲ ';
}

.bars__hint {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75em;
  color: var(--slide-muted);
  border: 1px dashed rgb(255 255 255 / 0.12);
  border-radius: 12px;
}

.console {
  display: flex;
  gap: 0.6em;
  margin: 0 clamp(14px, 1.6vw, 26px);
  padding: 0.45em 0.9em;
  border-radius: 12px;
  min-height: 2.2em;
  font-family: var(--slide-font-mono);
  font-size: 0.72em;
  background: rgb(0 0 0 / 0.3);
}

.console__prompt {
  color: var(--slide-muted);
}

.console__out {
  color: var(--slide-accent);
  font-weight: 700;
}
</style>
