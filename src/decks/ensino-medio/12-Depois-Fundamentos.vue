<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passo 1: intermediário.  Passo 2: avançado.
const base = ['Lógica', 'JS / TS', 'HTML / CSS', 'SQL', 'APIs', 'Git', 'React / Vue']

const intermediate = [
  { label: 'Frameworks', detail: 'NestJS, Django ou Spring Boot' },
  { label: 'Arquitetura de código', detail: 'SOLID, MVC e Clean Code' },
  { label: 'Testes automatizados' },
  { label: 'Docker', detail: 'containers' },
  { label: 'Cloud', detail: 'AWS ou GCP' },
  { label: 'CI/CD' },
]

const advanced: { label: string; detail?: string }[] = [
  { label: 'Mensageria, filas e eventos' },
  { label: 'Arquitetura e sistemas distribuídos' },
  { label: 'Segurança' },
  { label: 'Bancos de dados a fundo', detail: 'índices, réplicas, NoSQL' },
  { label: 'Infraestrutura como código e Kubernetes' },
  { label: 'Observabilidade' },
  { label: 'IA aplicada', detail: 'LLMs, RAG' },
]

const { step } = useSteps()

// Duração aproximada de cada nível (média de mercado; cada pessoa tem seu ritmo)
const time = ['primeiros meses', '1 a 3 anos', '5+ anos']
</script>

<template>
  <Slide>
    <div class="stage">
      <header>
        <p v-reveal:fade class="kicker">um caminho possível · backend &amp; cloud</p>
        <h1 v-reveal:blur="150" class="title">E depois dos <em>fundamentos</em>?</h1>
      </header>

      <div class="levels">
        <section v-reveal="300" class="level level--base">
          <span class="level__name"><Icon name="check" /> base</span>
          <ul class="chips">
            <li v-for="b in base" :key="b">{{ b }}</li>
          </ul>
        </section>

        <section v-step="1" class="level level--mid">
          <span class="level__name">intermediário</span>
          <ul class="items">
            <li v-for="(item, i) in intermediate" :key="item.label" :style="{ '--i': i }">
              <strong>{{ item.label }}</strong>
              <small v-if="item.detail">{{ item.detail }}</small>
            </li>
          </ul>
        </section>

        <section v-step="2" class="level level--top">
          <span class="level__name">avançado / especializado</span>
          <ul class="items">
            <li v-for="(item, i) in advanced" :key="item.label" :style="{ '--i': i }">
              <strong>{{ item.label }}</strong>
              <small v-if="item.detail">{{ item.detail }}</small>
            </li>
          </ul>
        </section>

        <!-- linha do tempo embaixo das colunas -->
        <div class="time">
          <span class="time__track" :style="{ '--p': Math.min(step + 1, 3) / 3 }" />
          <span
            v-for="(t, i) in time"
            :key="t"
            class="time__label"
            :class="{ 'is-shown': step >= i, 'is-long': i === 2 }"
          >
            <Icon name="clock" /> {{ t }}
          </span>
        </div>
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
  gap: clamp(20px, 4vh, 48px);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.title {
  margin-top: 0.3em;
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

/* ---------- três colunas alinhadas + linha do tempo ---------- */
.levels {
  display: grid;
  grid-template-columns: 0.75fr 1fr 1.25fr;
  grid-template-rows: 1fr auto;
  column-gap: clamp(12px, 1.6vw, 28px);
  row-gap: clamp(10px, 1.8vh, 20px);
  font-size: calc(var(--text-base) * 0.82);
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.level {
  --c: var(--slide-muted);
  display: flex;
  flex-direction: column;
  gap: 0.9em;
  padding: clamp(14px, 1.6vw, 28px);
  border-radius: 20px;
  border: 1px solid color-mix(in srgb, var(--c) 30%, transparent);
  background: color-mix(in srgb, var(--c) 7%, rgb(10 15 30 / 0.55));
  transition:
    opacity 0.7s var(--ease-out),
    transform 0.8s var(--ease-out);
}

.level--mid { --c: var(--slide-accent); }
.level--top { --c: var(--slide-accent-2); }

.level__name {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-family: var(--slide-font-mono);
  font-size: 0.78em;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c);
}

.level--base .level__name { color: #34d399; }

.chips {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.45em;
}

.chips li {
  padding: 0.3em 0.75em;
  border-radius: 999px;
  color: var(--slide-muted);
  background: rgb(255 255 255 / 0.06);
}

.items {
  list-style: none;
  display: grid;
  gap: 0.5em;
}

/* avançado em duas colunas para não ficar comprido */
.level--top .items {
  grid-template-columns: 1fr 1fr;
}

.items li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.55em 0.8em;
  border-radius: 12px;
  border-left: 3px solid var(--c);
  background: rgb(10 15 30 / 0.6);
  line-height: 1.25;
}

.items strong {
  font-weight: 700;
  color: var(--slide-fg);
}

.items small {
  font-size: 0.82em;
  color: var(--slide-muted);
}

/* os itens entram em sequência quando a coluna aparece */
.level[data-step] .items li {
  opacity: 0;
  translate: 0 10px;
  transition:
    opacity 0.45s var(--ease-out),
    translate 0.45s var(--ease-out);
}

.level[data-step-shown] .items li {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(250ms + var(--i) * 90ms);
}

/* linha do tempo */
.time {
  grid-column: 1 / -1;
  position: relative;
  display: grid;
  grid-template-columns: 0.75fr 1fr 1.25fr;
  column-gap: inherit;
  padding-top: 0.9em;
}

.time__track {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  width: calc(var(--p) * 100%);
  border-radius: 2px;
  background: linear-gradient(90deg, #34d399, var(--slide-accent), var(--slide-accent-2));
  transition: width 0.8s var(--ease-out);
}

.time__label {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-weight: 700;
  color: var(--slide-muted);
  opacity: 0;
  transition: opacity 0.5s 0.4s;
}

.time__label.is-shown {
  opacity: 1;
}

.time__label.is-long {
  color: var(--slide-accent-2);
}

/* ---------- tela vertical: colunas empilhadas ---------- */
@media (max-aspect-ratio: 1 / 1) {
  .levels {
    grid-template-columns: 1fr;
  }

  .time {
    display: none;
  }
}
</style>
