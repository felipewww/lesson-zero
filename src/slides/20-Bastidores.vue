<script setup lang="ts">
import Slide from '../deck/Slide.vue'
import { useSteps } from '../deck/steps'
import chatgpt from '../assets/logos/chatgpt.svg'
import claude from '../assets/logos/claude.svg'

// Passos: 1 = ferramentas; 2 = "do planejamento..."; 3 = frase sobre as decisões humanas
const { step } = useSteps()
const HUMAN = 3

const tools = [
  { name: 'ChatGPT', logo: chatgpt },
  { name: 'Claude Code', logo: claude },
]

const scope = ['planejamento', 'slides', 'animações', 'interações']
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-human': step >= HUMAN }">
      <div class="story">
        <p v-reveal:fade class="kicker">e essa apresentação?</p>

        <p v-reveal="200" class="lead">Tudo o que vocês viram aqui foi criado em apenas</p>
        <p v-reveal:zoom="450" class="days"><span class="days__n">2</span> dias</p>

        <div v-step class="tools">
          <span class="tools__label">com a ajuda de duas ferramentas</span>
          <div class="tools__row">
            <div v-for="(tool, i) in tools" :key="tool.name" class="tool" :style="{ '--i': i }">
              <img :src="tool.logo" :alt="tool.name" class="tool__logo" />
              <span class="tool__name">{{ tool.name }}</span>
            </div>
          </div>
        </div>

        <p v-step class="scope">
          <span class="scope__from">do</span>
          <span v-for="(item, i) in scope" :key="item" class="scope__item" :style="{ '--i': i }">{{ item }}</span>
        </p>
      </div>

      <p v-step:blur class="human">
        <span class="human__a">A IA acelerou a execução.</span>
        <span class="human__b">
          Mas as ideias, decisões e direcionamento foram <mark class="human__mark">humanos</mark>.
        </span>
      </p>

    </div>
  </Slide>
</template>

<style scoped>
.stage {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.is-human .story {
  opacity: 0.12;
  filter: blur(8px);
  scale: 0.96;
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.lead {
  margin-top: 2vh;
  font-size: calc(var(--text-base) * 1.1);
  color: var(--slide-muted);
}

/* ---------- 2 DIAS ---------- */
.days {
  display: flex;
  align-items: baseline;
  gap: 0.18em;
  font-size: calc(var(--text-hero) * 1.15);
  line-height: 0.9;
  font-weight: 800;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

.days__n {
  font-size: 1.9em;
  background: linear-gradient(160deg, var(--slide-accent) 10%, var(--slide-accent-2) 60%, var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 40px rgb(56 189 248 / 0.35));
}

/* ---------- ferramentas ---------- */
.tools {
  margin-top: 4vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2em;
}

.tools__label,
.scope__from {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.6);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.tools__row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: clamp(16px, 3vw, 48px);
}

.tool {
  display: flex;
  align-items: center;
  gap: 0.6em;
  padding: 0.55em 1.2em 0.55em 0.6em;
  border-radius: 999px;
  font-size: calc(var(--text-base) * 1.05);
  font-weight: 700;
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.1);
  opacity: 0;
  translate: 0 14px;
  transition:
    opacity 0.6s var(--ease-out),
    translate 0.6s var(--ease-out);
}

.tool__logo {
  width: 1.7em;
  height: 1.7em;
  border-radius: 0.4em;
}

.tools[data-step-shown] .tool {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(250ms + var(--i) * 180ms);
}

/* ---------- escopo ---------- */
.scope {
  margin-top: 2.5vh;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.5em 0.9em;
  font-size: calc(var(--text-base) * 0.9);
}

.scope__item {
  color: var(--slide-fg);
  opacity: 0;
  transition: opacity 0.5s;
}

.scope__item + .scope__item::before {
  content: '→';
  margin-right: 0.9em;
  color: var(--slide-accent);
}

.scope[data-step-shown] .scope__item {
  opacity: 1;
  transition-delay: calc(200ms + var(--i) * 220ms);
}

/* ---------- decisões humanas ---------- */
.human {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  padding: 0 8vw;
  pointer-events: none;
}

.human__a {
  font-size: calc(var(--text-base) * 1.3);
  color: var(--slide-muted);
}

.human__b {
  max-width: 18em;
  font-size: var(--text-title);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
  text-wrap: balance;
}

/* marca-texto que "pinta" a palavra depois que a frase entra */
.human__mark {
  padding: 0 0.12em;
  color: var(--slide-fg);
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3)) no-repeat left
    82% / 0% 0.32em;
  border-radius: 0.1em;
  transition: background-size 0.9s var(--ease-out);
}

.human[data-step-shown] .human__mark {
  background-size: 100% 0.32em;
  transition-delay: 700ms;
}
</style>
