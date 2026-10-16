<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'
import chatgpt from '../../assets/logos/chatgpt.svg'
import claude from '../../assets/logos/claude.svg'

// Passos: 1 = ferramentas; 2 = a pergunta; 3 = "Uma pessoa."
const { step } = useSteps()
const ANSWER = 3

const tools = [
  { name: 'ChatGPT', logo: chatgpt },
  { name: 'Claude Code', logo: claude },
]
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-answer': step >= ANSWER }">
      <div class="story">
        <p v-reveal:fade class="kicker">e esta apresentação?</p>
        <p v-reveal="200" class="lead">Tudo isso foi criado em apenas</p>
        <p v-reveal:zoom="450" class="days"><span class="days__n">2</span> dias</p>

        <div v-step class="tools">
          <template v-for="(tool, i) in tools" :key="tool.name">
            <span v-if="i" class="tools__plus" :style="{ '--i': i }">+</span>
            <span class="tool" :style="{ '--i': i }">
              <img :src="tool.logo" :alt="tool.name" class="tool__logo" />
              <span class="tool__name">{{ tool.name }}</span>
            </span>
          </template>
        </div>

        <p v-step class="question">
          <span>Mas quem teve as <em>ideias</em> e tomou as <em>decisões</em>?</span>
        </p>
      </div>

      <div v-step:zoom="ANSWER" class="answer">
        <span class="answer__burst" aria-hidden="true">
          <i v-for="n in 12" :key="n" :style="{ '--n': n }" />
        </span>
        <span class="answer__text">Uma pessoa.</span>
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
  text-align: center;
}

.story {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.6vh, 20px);
  transition:
    opacity 0.8s var(--ease-out),
    filter 0.8s var(--ease-out),
    scale 0.8s var(--ease-out);
}

.is-answer .story {
  opacity: 0.12;
  filter: blur(8px);
  scale: 0.96;
}

.kicker {
  font-size: calc(var(--text-base) * 0.8);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.lead {
  margin-top: 1.5vh;
  font-size: calc(var(--text-base) * 1.2);
  color: var(--slide-muted);
}

/* ---------- 2 DIAS ---------- */
.days {
  display: flex;
  align-items: baseline;
  gap: 0.18em;
  font-size: calc(var(--text-hero) * 1.15);
  line-height: 0.95;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-transform: uppercase;
}

.days__n {
  font-size: 1.9em;
  padding-bottom: 0.05em;
  background: linear-gradient(160deg, var(--slide-accent) 10%, var(--slide-accent-2) 60%, var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 40px color-mix(in srgb, var(--slide-accent) 45%, transparent));
}

/* ---------- ferramentas ---------- */
.tools {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: clamp(12px, 2vw, 32px);
  margin-top: 3vh;
}

.tool {
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.55em 1.3em 0.55em 0.6em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 1.15);
  font-weight: 800;
  background: color-mix(in srgb, var(--slide-fg) 6%, transparent);
  border: 2px solid color-mix(in srgb, var(--slide-fg) 12%, transparent);
}

.tools__plus {
  font-size: calc(var(--text-base) * 1.8);
  font-weight: 800;
  color: var(--slide-accent-2);
}

.tool,
.tools__plus {
  opacity: 0;
  translate: 0 14px;
  transition:
    opacity 0.6s var(--ease-out),
    translate 0.6s var(--ease-out);
}

.tool__logo {
  width: 1.8em;
  height: 1.8em;
  border-radius: 0.45em;
}

.tools[data-step-shown] .tool,
.tools[data-step-shown] .tools__plus {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(250ms + var(--i) * 220ms);
}

/* ---------- pergunta ---------- */
.question {
  margin-top: 3vh;
  font-size: calc(var(--text-base) * 1.4);
  font-weight: 700;
}

.question > span {
  text-wrap: balance;
}

.question em {
  font-style: normal;
  color: var(--slide-accent-2);
}

/* ---------- "Uma pessoa." toma a tela ---------- */
.answer {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.answer__text {
  position: relative;
  padding-bottom: 0.08em;
  font-size: calc(var(--text-hero) * 1.2);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(110deg, var(--slide-accent), var(--slide-accent-2) 55%, var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.answer[data-step-shown] .answer__text {
  animation: pop 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s backwards;
}

@keyframes pop {
  from {
    scale: 0.5;
  }
}

/* raios de "explosão" atrás da palavra */
.answer__burst {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 0;
  height: 0;
}

.answer__burst i {
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: clamp(40px, 8vh, 90px);
  border-radius: 6px;
  background: var(--slide-accent-2);
  transform-origin: 50% 0;
  rotate: calc(var(--n) * 30deg);
  translate: -50% 0;
  opacity: 0;
}

.answer__burst i:nth-child(3n + 1) {
  background: var(--slide-accent);
}

.answer__burst i:nth-child(3n + 2) {
  background: var(--slide-accent-3);
}

.answer[data-step-shown] .answer__burst i {
  animation: ray 1s var(--ease-out) 0.35s both;
}

@keyframes ray {
  0% {
    opacity: 0;
    transform: translateY(8vh) scaleY(0.3);
  }
  40% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(30vh) scaleY(1);
  }
}
</style>
