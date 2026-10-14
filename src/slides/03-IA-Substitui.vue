<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import Icon from '../components/Icon.vue'
import { useSteps } from '../deck/steps'

// Passo 1: a pergunta sobe e aparece o que a IA já faz
// Passo 2: a provocação final
const { step } = useSteps()

const generated = [
  'src/app.ts',
  'src/auth/login.ts',
  'src/pages/Tarefas.vue',
  'src/api/tarefas.ts',
  'database/schema.sql',
]
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-open': step >= 1 }">
      <header class="head">
        <h1 v-reveal:blur class="question">A IA vai substituir os programadores?</h1>
        <p v-reveal="400" class="hands">
          <Icon name="hand" class="hands__icon" />
          levante a mão se você acha que sim
        </p>
      </header>

      <div class="row">
        <p v-step="1" class="claim">
          A IA já consegue <strong>escrever código</strong> e até
          <strong>construir aplicações completas.</strong>
        </p>

        <div v-step:left="1" class="ai">
          <div class="ai__prompt">
            <Icon name="sparkles" class="ai__spark" />
            crie um app de tarefas com login
          </div>
          <ul class="ai__files">
            <li v-for="(file, i) in generated" :key="file" :style="{ '--i': i }">
              <Icon name="check" class="ai__check" />{{ file }}
            </li>
          </ul>
          <div class="ai__done">aplicação pronta em 42s</div>
        </div>
      </div>

      <p v-step:zoom="2" class="twist">
        Então, por que as empresas <em>ainda precisam</em> de programadores?
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
  gap: clamp(24px, 5vh, 72px);
}

/* ---------- pergunta: começa enorme no centro e encolhe no passo 1 ---------- */
.head {
  text-align: center;
  transition: transform 0.8s var(--ease-out);
}

.question {
  font-size: var(--text-hero);
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
  transition: font-size 0.8s var(--ease-out);
}

.is-open .question {
  font-size: var(--text-title);
}

.hands {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  margin-top: 1.4em;
  padding: 0.5em 1.1em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 0.8);
  color: var(--slide-fg);
  background: rgb(255 255 255 / 0.06);
  border: 1px solid rgb(255 255 255 / 0.12);
  transition:
    opacity 0.5s,
    margin 0.8s var(--ease-out);
}

.hands__icon {
  font-size: 1.4em;
  color: #fbbf24;
  transform-origin: 70% 90%;
  animation: wave 2.4s ease-in-out infinite;
}

@keyframes wave {
  0%, 60%, 100% { rotate: 0deg; }
  10%, 30% { rotate: 14deg; }
  20%, 40% { rotate: -8deg; }
}

.is-open .hands {
  opacity: 0;
  height: 0;
  margin: 0;
  padding-block: 0;
  overflow: hidden;
}

/* ---------- o que a IA já faz ---------- */
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(24px, 5vw, 120px);
  max-height: 0;
  transition: max-height 0.8s var(--ease-out);
}

.is-open .row {
  max-height: 60vh;
}

.claim {
  font-size: calc(var(--text-base) * 1.5);
  line-height: 1.3;
  color: var(--slide-muted);
}

.claim strong {
  color: var(--slide-fg);
}

.ai {
  padding: clamp(16px, 2vw, 36px);
  border-radius: 20px;
  background: rgb(2 6 23 / 0.8);
  border: 1px solid rgb(255 255 255 / 0.1);
  box-shadow: 0 30px 80px -30px rgb(167 139 250 / 0.6);
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.62);
}

.ai__prompt {
  display: flex;
  align-items: center;
  gap: 0.7em;
  padding: 0.8em 1em;
  border-radius: 12px;
  background: rgb(255 255 255 / 0.06);
  color: var(--slide-fg);
}

.ai__spark {
  font-size: 1.3em;
  color: var(--slide-accent-2);
}

.ai__files {
  list-style: none;
  margin: 1em 0;
  display: grid;
  gap: 0.45em;
  color: var(--slide-muted);
}

.ai__files li {
  display: flex;
  align-items: center;
  gap: 0.6em;
  opacity: 0;
  translate: 0 8px;
  transition:
    opacity 0.4s,
    translate 0.4s var(--ease-out);
}

.ai__check {
  color: #34d399;
}

.ai__done {
  display: inline-block;
  padding: 0.35em 0.8em;
  border-radius: 999px;
  color: #052e1b;
  background: #34d399;
  font-weight: 700;
  opacity: 0;
  scale: 0.8;
  transition:
    opacity 0.4s,
    scale 0.5s var(--ease-out);
}

/* arquivos "gerados" em sequência depois que o card aparece */
.ai[data-step-shown] .ai__files li {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(600ms + var(--i) * 260ms);
}

.ai[data-step-shown] .ai__done {
  opacity: 1;
  scale: 1;
  transition-delay: 2000ms;
}

/* ---------- provocação ---------- */
.stage:not(.is-open) .twist {
  display: none;
}

.twist {
  text-align: center;
  font-size: calc(var(--text-title) * 0.8);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.twist em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
