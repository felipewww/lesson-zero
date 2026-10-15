<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1 = as palavras reservadas; 2 = no começo o código parece outra língua;
// 3 = com prática, ele vira leitura (decodifica e ganha "tradução")
const { step } = useSteps(3) // o passo 3 não tem elemento próprio: só decodifica o código
const WORDS = 1
const STRANGE = 2
const READ = 3

// Palavras reservadas mais comuns (JavaScript e Python): é esse o "vocabulário" a decorar
const KEYWORDS = [
  'if', 'else', 'for', 'while', 'do', 'break', 'continue', 'return',
  'function', 'const', 'let', 'var', 'class', 'new', 'this', 'super',
  'extends', 'import', 'export', 'from', 'as', 'default', 'switch', 'case',
  'try', 'catch', 'finally', 'throw', 'true', 'false', 'null', 'undefined',
  'typeof', 'instanceof', 'in', 'of', 'async', 'await', 'yield', 'static',
  'delete', 'void', 'def', 'elif', 'lambda', 'pass', 'raise', 'except',
  'with', 'and', 'or', 'not', 'is', 'None', 'global', 'assert',
  'interface', 'enum', 'public', 'private',
]
const USED = new Set(['const', 'if', 'else'])

// Contador 0 → 60 quando as palavras aparecem
const count = ref(0)
let countRaf = 0
watch(
  () => step.value >= WORDS,
  (on) => {
    cancelAnimationFrame(countRaf)
    if (!on) return (count.value = 0)
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1600, 1)
      count.value = Math.round(KEYWORDS.length * (1 - Math.pow(1 - t, 3)))
      if (t < 1) countRaf = requestAnimationFrame(tick)
    }
    countRaf = requestAnimationFrame(tick)
  },
  { immediate: true },
)

// ---------- o mesmo código: embaralhado (começo) → legível (com prática) ----------
type Token = { t: string; k?: 'k' | 'n' | 's' | 'f' }
const CODE: { tokens: Token[]; read: string }[] = [
  { tokens: [{ t: 'const', k: 'k' }, { t: ' nota = ' }, { t: '8', k: 'n' }], read: 'a nota é 8' },
  {
    tokens: [{ t: 'if', k: 'k' }, { t: ' (nota >= ' }, { t: '7', k: 'n' }, { t: ') {' }],
    read: 'se a nota for 7 ou mais…',
  },
  {
    tokens: [{ t: '  ' }, { t: 'console', k: 'f' }, { t: '.' }, { t: 'log', k: 'f' }, { t: '(' }, { t: '"aprovado!"', k: 's' }, { t: ')' }],
    read: 'mostre "aprovado!"',
  },
  { tokens: [{ t: '} ' }, { t: 'else', k: 'k' }, { t: ' {' }], read: 'senão…' },
  {
    tokens: [{ t: '  ' }, { t: 'console', k: 'f' }, { t: '.' }, { t: 'log', k: 'f' }, { t: '(' }, { t: '"recuperação"', k: 's' }, { t: ')' }],
    read: 'mostre "recuperação"',
  },
  { tokens: [{ t: '}' }], read: '' },
]
const TOTAL = CODE.reduce((n, l) => n + l.tokens.reduce((m, tk) => m + tk.t.length, 0), 0)
const GLYPHS = '#%&$@*!?<>/\\{}[]=+~^ΔΣΩ∂≠≈∞§¶'

const seed = ref(0) // muda para o "chiado" do texto embaralhado
const decoded = ref(0) // quantos caracteres já foram "entendidos"
let noiseTimer: number | undefined
let decodeRaf = 0

function glyph(i: number) {
  return GLYPHS[(i * 7 + seed.value * 13) % GLYPHS.length]
}

// Texto de cada token: real se já foi decodificado, senão um símbolo aleatório
const lines = computed(() => {
  let offset = 0
  return CODE.map((line) => ({
    read: line.read,
    tokens: line.tokens.map((tk) => {
      const text = [...tk.t].map((ch, j) => (ch === ' ' || offset + j < decoded.value ? ch : glyph(offset + j))).join('')
      offset += tk.t.length
      return { ...tk, text }
    }),
  }))
})

watch(
  () => (step.value >= READ ? 'read' : step.value >= STRANGE ? 'strange' : 'off'),
  (mode) => {
    clearInterval(noiseTimer)
    cancelAnimationFrame(decodeRaf)
    if (mode === 'strange') {
      decoded.value = 0
      noiseTimer = window.setInterval(() => seed.value++, 140)
    } else if (mode === 'read') {
      const start = performance.now()
      const from = decoded.value
      noiseTimer = window.setInterval(() => seed.value++, 90)
      const tick = (now: number) => {
        const t = Math.min((now - start) / 1800, 1)
        decoded.value = from + Math.round((TOTAL - from) * t)
        if (t < 1) decodeRaf = requestAnimationFrame(tick)
        else clearInterval(noiseTimer)
      }
      decodeRaf = requestAnimationFrame(tick)
    } else decoded.value = 0
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(countRaf)
  cancelAnimationFrame(decodeRaf)
  clearInterval(noiseTimer)
})
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-read': step >= READ }">
      <h1 v-reveal:blur class="title">Código é só uma questão de <em>sintaxe</em>.</h1>

      <div class="body">
        <!-- vocabulário -->
        <section v-step="WORDS" class="vocab">
          <p class="vocab__count">
            <span class="vocab__n">~{{ count }}</span>
            <span class="vocab__label">palavras reservadas<br />para aprender</span>
          </p>
          <div class="chips">
            <span
              v-for="(w, i) in KEYWORDS"
              :key="w"
              class="chip"
              :class="{ 'is-used': USED.has(w) }"
              :style="{ '--i': i }"
            >
              {{ w }}
            </span>
          </div>
        </section>

        <!-- o mesmo trecho: estranho no começo, leitura com a prática -->
        <section v-step="STRANGE" class="book">
          <header class="book__head">
            <span class="book__tag" :class="{ 'is-read': step >= READ }">
              {{ step >= READ ? 'com prática' : 'no começo' }}
            </span>
            <span class="book__hint">{{ step >= READ ? 'parece um livro' : 'parece outra língua' }}</span>
          </header>

          <ol class="code">
            <li v-for="(line, i) in lines" :key="i" class="code__line" :style="{ '--i': i }">
              <code
                ><span v-for="(tk, j) in line.tokens" :key="j" :class="tk.k">{{ tk.text }}</span></code
              >
              <span v-if="line.read" class="code__read">{{ line.read }}</span>
            </li>
          </ol>
        </section>
      </div>

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
  gap: clamp(20px, 4.5vh, 56px);
}

.title {
  font-size: var(--text-title);
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

.body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  align-items: start;
  gap: clamp(20px, 4vw, 80px);
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

@media (max-aspect-ratio: 1 / 1) {
  .body {
    grid-template-columns: 1fr;
  }
}

/* ---------- vocabulário ---------- */
.vocab__count {
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: var(--text-base);
}

.vocab__n {
  font-size: 2.6em;
  line-height: 1;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  background: linear-gradient(160deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.vocab__label {
  font-size: 0.8em;
  line-height: 1.25;
  color: var(--slide-muted);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
  margin-top: 1em;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.66);
}

.chip {
  padding: 0.25em 0.6em;
  border-radius: 6px;
  color: var(--slide-muted);
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.08);
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 0.4s var(--ease-out),
    scale 0.4s var(--ease-out),
    color 0.4s,
    background 0.4s,
    border-color 0.4s;
}

.vocab[data-step-shown] .chip {
  opacity: 1;
  scale: 1;
  transition-delay: calc(var(--i) * 22ms), calc(var(--i) * 22ms), 0s, 0s, 0s;
}

/* as palavras que aparecem no código acendem quando ele vira leitura */
.is-read .chip.is-used {
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  border-color: var(--slide-accent-2);
  scale: 1.12;
}

/* ---------- o "livro" de código ---------- */
.book {
  padding: clamp(14px, 1.8vw, 28px);
  border-radius: 22px;
  background: rgb(2 6 23 / 0.8);
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: 0 30px 70px -30px rgb(167 139 250 / 0.5);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.6s,
    box-shadow 0.6s;
}

.is-read .book {
  border-color: color-mix(in srgb, var(--slide-accent) 45%, transparent);
  box-shadow: 0 30px 70px -30px var(--slide-accent);
}

.book__head {
  display: flex;
  align-items: baseline;
  gap: 0.8em;
  margin-bottom: 0.9em;
  font-size: calc(var(--text-base) * 0.75);
}

.book__tag {
  padding: 0.2em 0.8em;
  border-radius: 999px;
  font-family: var(--slide-font-mono);
  font-size: 0.85em;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--slide-accent-3);
  background: rgb(244 114 182 / 0.12);
  transition:
    color 0.4s,
    background 0.4s;
}

.book__tag.is-read {
  color: #052e1b;
  background: #34d399;
}

.book__hint {
  color: var(--slide-muted);
}

.code {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.2em;
  font-size: calc(var(--text-base) * 0.82);
}

.code__line {
  display: flex;
  flex-direction: column;
}

.code code {
  white-space: pre;
  color: var(--slide-fg);
}

.code .k { color: var(--slide-accent-2); }
.code .f { color: var(--slide-accent); }
.code .n { color: #fbbf24; }
.code .s { color: #34d399; }

/* sem prática: o texto "chia" em cinza */
.stage:not(.is-read) .code code,
.stage:not(.is-read) .code code span {
  color: color-mix(in srgb, var(--slide-muted) 70%, transparent);
}

/* tradução em português embaixo de cada linha */
.code__read {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
  padding-left: 1.2em;
  font-family: var(--slide-font);
  font-size: 0.92em;
  font-style: italic;
  color: var(--slide-accent);
  transition:
    max-height 0.5s var(--ease-out),
    opacity 0.5s;
}

.code__read::before {
  content: '↳ ';
  color: var(--slide-muted);
}

.is-read .code__read {
  max-height: 2em;
  opacity: 1;
  transition-delay: calc(1.6s + var(--i) * 0.25s);
}
</style>
