<script setup lang="ts">
import { computed, onBeforeUnmount, reactive } from 'vue'
import Slide from '../../deck/Slide.vue'

/**
 * Lógica de verdade: corrigir a prova da turma inteira.
 * O código roda linha a linha quando o apresentador aperta ▶ (uma vez só),
 * marcando ✓/✗ nas folhas de resposta e preenchendo o boletim.
 */
const GABARITO = ['B', 'D', 'A', 'C', 'B']
const TURMA = [
  { nome: 'Ana', respostas: ['B', 'D', 'A', 'C', 'B'] },
  { nome: 'Bruno', respostas: ['B', 'A', 'A', 'C', 'D'] },
  { nome: 'Carla', respostas: ['B', 'D', 'C', 'C', 'B'] },
]

const CODE = [
  '<span class="k">const</span> gabarito = [<span class="s">\'B\'</span>, <span class="s">\'D\'</span>, <span class="s">\'A\'</span>, <span class="s">\'C\'</span>, <span class="s">\'B\'</span>]',
  '',
  '<span class="k">for</span> (<span class="k">const</span> aluno <span class="k">of</span> turma) {',
  '  <span class="k">let</span> acertos = <span class="n">0</span>',
  '  <span class="k">for</span> (<span class="k">let</span> q = <span class="n">0</span>; q &lt; gabarito.length; q++) {',
  '    <span class="k">if</span> (aluno.respostas[q] === gabarito[q]) {',
  '      acertos++',
  '    }',
  '  }',
  '  <span class="k">const</span> nota = (acertos / gabarito.length) * <span class="n">10</span>',
  '  <span class="f">salvarNoBoletim</span>(aluno.nome, nota)',
  '}',
]
const L = { GAB: 1, FOR: 3, ZERO: 4, LOOP: 5, IF: 6, INC: 7, NOTA: 10, SAVE: 11 }

// Roteiro da execução: cada evento acende uma linha e muda o estado
type Event = { line: number; ms: number; aluno?: number; q?: number | null; check?: boolean; inc?: boolean; nota?: boolean; save?: boolean }
const events: Event[] = [{ line: L.GAB, ms: 800 }]
TURMA.forEach((aluno, a) => {
  events.push({ line: L.FOR, ms: 600, aluno: a, q: null })
  events.push({ line: L.ZERO, ms: 450 })
  GABARITO.forEach((certa, q) => {
    events.push({ line: L.LOOP, ms: 260, q })
    events.push({ line: L.IF, ms: 420, check: true })
    if (aluno.respostas[q] === certa) events.push({ line: L.INC, ms: 300, inc: true })
  })
  events.push({ line: L.NOTA, ms: 650, nota: true, q: null })
  events.push({ line: L.SAVE, ms: 700, save: true })
})

const run = reactive({
  status: 'idle' as 'idle' | 'running' | 'done',
  speed: 1,
  line: 0,
  started: false,
  aluno: null as number | null,
  q: null as number | null,
  acertos: 0,
  nota: null as number | null,
  marks: TURMA.map(() => GABARITO.map(() => null as null | boolean)), // ✓ / ✗ por questão
  boletim: [] as { nome: string; nota: number }[],
})

let timer: number | undefined

function reset() {
  clearTimeout(timer)
  Object.assign(run, {
    status: 'idle',
    line: 0,
    started: false,
    aluno: null,
    q: null,
    acertos: 0,
    nota: null,
    marks: TURMA.map(() => GABARITO.map(() => null)),
    boletim: [],
  })
}

function apply(e: Event) {
  run.line = e.line
  if (e.line === L.GAB) run.started = true
  if (e.aluno !== undefined) run.aluno = e.aluno
  if (e.q !== undefined) run.q = e.q
  if (e.line === L.ZERO) {
    run.acertos = 0
    run.nota = null
  }
  if (e.check && run.aluno !== null && run.q !== null) {
    run.marks[run.aluno][run.q] = TURMA[run.aluno].respostas[run.q] === GABARITO[run.q]
  }
  if (e.inc) run.acertos++
  if (e.nota) run.nota = (run.acertos / GABARITO.length) * 10
  if (e.save && run.aluno !== null && run.nota !== null) {
    run.boletim.push({ nome: TURMA[run.aluno].nome, nota: run.nota })
  }
}

function play() {
  reset()
  run.status = 'running'
  let k = 0
  const next = () => {
    if (k >= events.length) {
      Object.assign(run, { status: 'done', line: 0, aluno: null, q: null })
      return
    }
    const e = events[k++]
    apply(e)
    timer = window.setTimeout(next, e.ms / run.speed)
  }
  timer = window.setTimeout(next, 200)
}

function toggleSpeed() {
  run.speed = run.speed === 1 ? 2 : 1
}

const fmt = (n: number) => n.toFixed(1).replace('.', ',').replace(',0', '')
const nomeAtual = computed(() => (run.aluno === null ? '–' : `'${TURMA[run.aluno].nome}'`))

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Slide>
    <div class="layout">
      <header class="head">
        <h1 v-reveal:blur class="title">Lógica é transformar uma <em>regra</em> em passos.</h1>
        <p v-reveal="250" class="subtitle">Corrigir a prova da turma inteira, questão por questão.</p>
      </header>

      <!-- editor -->
      <div v-reveal:zoom="350" class="editor">
        <div class="editor__bar">
          <i class="dot" /><i class="dot" /><i class="dot" />
          <span class="editor__file">corrige-provas.js</span>
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
          <span class="var"><b>aluno</b> {{ nomeAtual }}</span>
          <span class="var"><b>q</b> {{ run.q ?? '–' }}</span>
          <span class="var" :class="{ 'is-set': run.acertos > 0 }"><b>acertos</b> {{ run.acertos }}</span>
          <span class="var" :class="{ 'is-set': run.nota !== null }"><b>nota</b> {{ run.nota === null ? '–' : fmt(run.nota) }}</span>
        </div>
      </div>

      <!-- folhas de resposta + boletim -->
      <div v-reveal:zoom="500" class="sheets" :class="{ 'is-started': run.started }">
        <div class="row row--key">
          <span class="row__name">gabarito</span>
          <span v-for="(r, q) in GABARITO" :key="q" class="cell cell--key" :class="{ 'is-q': run.q === q }">{{ r }}</span>
          <span class="row__grade" />
        </div>

        <div
          v-for="(aluno, a) in TURMA"
          :key="aluno.nome"
          class="row"
          :class="{ 'is-current': run.aluno === a }"
        >
          <span class="row__name">{{ aluno.nome }}</span>
          <span
            v-for="(r, q) in aluno.respostas"
            :key="q"
            class="cell"
            :class="{
              'is-right': run.marks[a][q] === true,
              'is-wrong': run.marks[a][q] === false,
              'is-q': run.aluno === a && run.q === q,
            }"
          >
            {{ r }}
          </span>
          <span class="row__grade">
            <template v-if="run.boletim.find((b) => b.nome === aluno.nome)">
              {{ fmt(run.boletim.find((b) => b.nome === aluno.nome)!.nota) }}
            </template>
          </span>
        </div>

        <!-- boletim: o "banco de dados" do slide 2 -->
        <div class="report">
          <span class="report__title">boletim</span>
          <span v-if="!run.boletim.length" class="report__empty">
            {{ run.started ? 'aguardando notas…' : 'aperte ▶ executar' }}
          </span>
          <TransitionGroup name="row-in" tag="ul" class="report__list">
            <li v-for="b in run.boletim" :key="b.nome" :class="b.nota >= 7 ? 'is-ok' : 'is-low'">
              <span>{{ b.nome }}</span>
              <strong>{{ fmt(b.nota) }}</strong>
            </li>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
  grid-template-rows: auto 1fr;
  column-gap: clamp(20px, 3vw, 60px);
  row-gap: clamp(16px, 3.5vh, 44px);
  align-content: center;
  align-items: start;
}

.head {
  grid-column: 1 / -1;
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}

.title {
  font-size: calc(var(--text-title) * 0.85);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.subtitle {
  margin-top: 0.5em;
  font-size: calc(var(--text-base) * 1.05);
  color: var(--slide-muted);
}

/* ---------- editor ---------- */
.editor {
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.4vh, 16px);
  padding-bottom: clamp(12px, 1.6vh, 20px);
  border-radius: 20px;
  overflow: hidden;
  font-size: var(--text-base);
  background: rgb(2 6 23 / 0.85);
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: 0 30px 70px -30px rgb(56 189 248 / 0.45);
}

.editor__bar {
  display: flex;
  align-items: center;
  gap: 0.45em;
  padding: 0.6em 0.8em 0.6em 1em;
  font-size: 0.68em;
  background: rgb(255 255 255 / 0.05);
}

.dot {
  width: 0.8em;
  height: 0.8em;
  border-radius: 50%;
  background: var(--slide-accent-3);
}

.dot:nth-child(2) { background: #fbbf24; }
.dot:nth-child(3) { background: #34d399; }

.editor__file {
  margin-left: 0.8em;
  margin-right: auto;
  font-family: var(--slide-font-mono);
  color: var(--slide-muted);
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
  margin: 0 clamp(10px, 1.2vw, 18px);
  font-size: 0.66em;
  line-height: 1.55;
  white-space: pre;
  overflow: hidden;
}

.code__line {
  display: block;
  border-radius: 6px;
  border-left: 3px solid transparent;
  transition:
    background 0.15s,
    border-color 0.15s;
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

.code :deep(.k) { color: var(--slide-accent-2); }
.code :deep(.f) { color: var(--slide-accent); }
.code :deep(.n) { color: #fbbf24; }
.code :deep(.s) { color: #34d399; }

.vars {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45em;
  margin: 0 clamp(14px, 1.6vw, 24px);
  font-family: var(--slide-font-mono);
  font-size: 0.6em;
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
  background: #fbbf24;
}

.var.is-set b {
  color: color-mix(in srgb, var(--slide-bg) 70%, transparent);
}

/* ---------- folhas de resposta ---------- */
.sheets {
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  font-size: var(--text-base);
}

.row {
  display: grid;
  grid-template-columns: 4.4em repeat(5, 2.4em) 2.6em;
  justify-content: start;
  align-items: center;
  gap: 0.4em;
  padding: 0.45em 0.6em;
  border-radius: 14px;
  border: 1px solid transparent;
  transition:
    background 0.3s,
    border-color 0.3s;
}

.row.is-current {
  background: rgb(255 255 255 / 0.05);
  border-color: color-mix(in srgb, var(--slide-accent) 45%, transparent);
}

.row--key {
  border-bottom: 1px dashed rgb(255 255 255 / 0.15);
  border-radius: 14px 14px 0 0;
}

.row__name {
  font-size: 0.75em;
  font-weight: 700;
  color: var(--slide-muted);
}

.row--key .row__name {
  font-family: var(--slide-font-mono);
  font-size: 0.6em;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.row__grade {
  font-weight: 800;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.cell {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1;
  border-radius: 10px;
  font-family: var(--slide-font-mono);
  font-size: 0.85em;
  font-weight: 700;
  color: var(--slide-fg);
  background: rgb(255 255 255 / 0.06);
  border: 2px solid transparent;
  transition:
    background 0.25s,
    border-color 0.25s,
    color 0.25s,
    scale 0.25s var(--ease-out);
}

.cell--key {
  color: var(--slide-accent);
  background: color-mix(in srgb, var(--slide-accent) 10%, transparent);
}

.cell.is-q {
  border-color: var(--slide-fg);
  scale: 1.08;
}

.cell.is-right {
  color: #052e1b;
  background: #34d399;
}

.cell.is-wrong {
  color: #fff;
  background: var(--slide-accent-3);
}

/* ---------- boletim ---------- */
.report {
  margin-top: 0.6em;
  padding: 0.7em 0.9em;
  border-radius: 16px;
  border: 1px dashed color-mix(in srgb, var(--slide-accent-3) 50%, transparent);
  background: color-mix(in srgb, var(--slide-accent-3) 6%, transparent);
  font-size: 0.8em;
}

.report__title {
  font-family: var(--slide-font-mono);
  font-size: 0.75em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--slide-accent-3);
}

.report__empty {
  display: block;
  margin-top: 0.4em;
  color: var(--slide-muted);
}

.report__list {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.4em;
}

.report__list li {
  display: flex;
  gap: 0.6em;
  padding: 0.3em 0.8em;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.06);
}

.report__list li.is-ok strong { color: #34d399; }
.report__list li.is-low strong { color: var(--slide-accent-3); }

.row-in-enter-active {
  transition:
    opacity 0.4s var(--ease-out),
    translate 0.4s var(--ease-out);
}

.row-in-enter-from {
  opacity: 0;
  translate: 0 10px;
}
</style>
