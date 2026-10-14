<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import Icon, { type IconName } from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passo 1: tudo que acontece na escola
// Passo 2: zoom na matrícula — o fluxo animado
// Passo 3: a pergunta da última vaga
const { step } = useSteps()

const processes: { icon: IconName; text: string }[] = [
  { icon: 'user', text: 'Matrículas de alunos' },
  { icon: 'dollar', text: 'Mensalidades e pagamentos' },
  { icon: 'receipt', text: 'Emissão de notas fiscais' },
  { icon: 'alert', text: 'Relatórios de inadimplência' },
  { icon: 'clipboard-check', text: 'Fechamento das notas do bimestre' },
]

const flow: { icon: IconName; text: string }[] = [
  { icon: 'user', text: 'aluno' },
  { icon: 'file-text', text: 'cadastro' },
  { icon: 'search', text: 'validação' },
  { icon: 'graduation-cap', text: 'vaga disponível' },
  { icon: 'check', text: 'confirmação' },
]
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-flow': step >= 2, 'is-race': step >= 3 }">
      <header>
        <h1 v-reveal:blur class="title">Sua escola também precisa de <em>programação</em></h1>
        <p v-reveal="250" class="lead">Imagine tudo que acontece em uma escola:</p>
      </header>

      <ul v-step class="processes">
        <li
          v-for="(p, i) in processes"
          :key="p.text"
          class="process"
          :class="{ 'is-focus': i === 0 }"
          :style="{ '--i': i }"
        >
          <Icon :name="p.icon" class="process__icon" />
          <span>{{ p.text }}</span>
        </li>
      </ul>

      <div v-step:fade class="flow">
        <span class="flow__track" aria-hidden="true" />
        <span class="token token--a" aria-hidden="true">A</span>
        <span class="token token--b" aria-hidden="true">B</span>

        <div v-for="(node, i) in flow" :key="node.text" class="node" :class="{ 'node--seat': i === 3 }" :style="{ '--i': i }">
          <span class="node__icon">
            <Icon :name="node.icon" />
            <span v-if="i === 3" class="seat">1 vaga</span>
          </span>
          <span class="node__label">{{ node.text }}</span>
        </div>
      </div>

      <p v-step:zoom class="question">
        <span>Se duas pessoas tentarem a <em>última vaga</em> ao mesmo tempo, o que deveria acontecer?</span>
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
  gap: clamp(16px, 3.5vh, 48px);
}

.title {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.title em,
.question em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.lead {
  margin-top: 0.6em;
  font-size: calc(var(--text-base) * 1.1);
  color: var(--slide-muted);
}

/* ---------- processos da escola ---------- */
.processes {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: clamp(10px, 1.2vw, 20px);
}

.process {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.9em 1em;
  border-radius: 16px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  font-size: calc(var(--text-base) * 0.85);
  line-height: 1.25;
  text-wrap: balance;
  opacity: 0;
  translate: 0 16px;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out),
    filter 0.6s,
    border-color 0.5s,
    background 0.5s;
}

.process__icon {
  font-size: 1.4em;
  color: var(--slide-accent);
}

.processes[data-step-shown] .process {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(var(--i) * 110ms);
}

/* no passo 2 a matrícula ganha foco e o resto recua */
.is-flow .processes .process {
  opacity: 0.3;
  filter: blur(1px);
  transition-delay: 0ms;
}

.is-flow .processes .process.is-focus {
  opacity: 1;
  filter: none;
  border-color: var(--slide-accent);
  background: rgb(56 189 248 / 0.1);
}

/* ---------- fluxo da matrícula ---------- */
.flow {
  --icon: clamp(56px, 10vh, 110px);
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  padding-top: 8px;
}

.flow__track {
  position: absolute;
  left: 10%;
  right: 10%;
  top: calc(8px + var(--icon) / 2);
  height: 2px;
  background: repeating-linear-gradient(90deg, rgb(255 255 255 / 0.25) 0 8px, transparent 8px 16px);
  background-size: 32px 2px;
  animation: dash 1s linear infinite;
}

@keyframes dash {
  to {
    background-position: 32px 0;
  }
}

.node {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  opacity: 0;
  scale: 0.8;
  transition:
    opacity 0.5s var(--ease-out),
    scale 0.5s var(--ease-out);
}

.flow[data-step-shown] .node {
  opacity: 1;
  scale: 1;
  transition-delay: calc(var(--i) * 140ms);
}

.node__icon {
  position: relative;
  display: grid;
  place-items: center;
  width: var(--icon);
  height: var(--icon);
  border-radius: 30%;
  font-size: calc(var(--icon) * 0.45);
  color: var(--slide-accent);
  background: rgb(15 23 42 / 0.92);
  border: 1px solid rgb(56 189 248 / 0.4);
  transition:
    color 0.4s,
    border-color 0.4s,
    box-shadow 0.4s;
}

.node__label {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.75);
  color: var(--slide-muted);
  text-align: center;
}

.seat {
  position: absolute;
  top: -0.9em;
  right: -1.8em;
  padding: 0.2em 0.6em;
  border-radius: 999px;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.55);
  font-weight: 700;
  white-space: nowrap;
  color: #1c1300;
  background: #fbbf24;
  opacity: 0;
  scale: 0.6;
  transition:
    opacity 0.4s,
    scale 0.4s var(--ease-out);
}

/* tokens: um aluno percorre o fluxo inteiro em loop */
.token {
  position: absolute;
  z-index: 1;
  top: calc(8px + var(--icon) / 2);
  left: 10%;
  display: grid;
  place-items: center;
  width: 1.6em;
  height: 1.6em;
  translate: -50% -50%;
  border-radius: 50%;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.8);
  font-weight: 700;
  color: #020617;
  opacity: 0;
}

.token--a {
  background: var(--slide-accent);
  box-shadow: 0 0 16px var(--slide-accent);
}

.token--b {
  background: var(--slide-accent-3);
  box-shadow: 0 0 16px var(--slide-accent-3);
}

.flow[data-step-shown] .token--a {
  animation: walk 4.5s var(--ease-out) 0.9s infinite;
}

@keyframes walk {
  0% { left: 10%; opacity: 0; }
  8% { opacity: 1; }
  85% { left: 90%; opacity: 1; }
  100% { left: 90%; opacity: 0; }
}

/* passo 3: dois alunos correm para a última vaga e param nela */
.is-race .flow .token--a,
.is-race .flow .token--b {
  animation: race 1.4s var(--ease-out) forwards;
}

.is-race .flow .token--a {
  --dy: -0.85em;
}

.is-race .flow .token--b {
  --dy: 0.85em;
  animation-delay: 0.08s;
}

@keyframes race {
  from { left: 10%; opacity: 0; translate: -50% -50%; }
  20% { opacity: 1; }
  to { left: calc(70% - var(--icon) * 0.95); opacity: 1; translate: -50% calc(-50% + var(--dy)); }
}

.is-race .node--seat .node__icon {
  color: #fbbf24;
  border-color: #fbbf24;
  box-shadow: 0 0 40px -4px #fbbf24;
  animation: clash 1.2s ease-in-out 1.4s infinite;
}

.is-race .seat {
  opacity: 1;
  scale: 1;
}

.is-race .node:nth-child(n + 8) {
  opacity: 0.35;
}

@keyframes clash {
  50% { box-shadow: 0 0 60px 4px #fbbf24; }
}

/* ---------- pergunta da última vaga ---------- */
.question {
  text-align: center;
  font-size: calc(var(--text-title) * 0.68);
  line-height: 1.15;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.question span {
  text-wrap: balance;
}

@media (max-aspect-ratio: 1 / 1) {
  .node__label {
    font-size: calc(var(--text-base) * 0.5);
  }
}
</style>
