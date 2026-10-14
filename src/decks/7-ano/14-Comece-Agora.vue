<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import { useSteps } from '../../deck/steps'
import scratch from '../../assets/logos/scratch.svg'
import robloxStudio from '../../assets/logos/roblox-studio.svg'
import javascript from '../../assets/logos/javascript.svg'

// Passo 1 = "Pode começar agora!"; 2..4 = cada ferramenta; 5 = os três degraus
const { step } = useSteps()
const STAIRS = 5

const tools = [
  { name: 'Scratch', logo: scratch, text: 'Crie jogos com blocos.', color: 'var(--slide-accent-2)' },
  { name: 'Roblox Studio', logo: robloxStudio, text: 'Crie mundos e experiências.', color: 'var(--slide-accent-3)' },
  { name: 'JavaScript', logo: javascript, text: 'Dê os primeiros passos com código.', color: 'var(--slide-accent)' },
]

const stairs = ['Comece pequeno.', 'Crie alguma coisa.', 'Melhore aos poucos.']
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-stairs': step >= STAIRS }">
      <header class="head">
        <h1 v-reveal:blur class="title">Você não precisa esperar ficar adulto.</h1>
        <p v-step:zoom class="now"><span>Pode começar <em>agora!</em></span></p>
      </header>

      <div class="tools">
        <article
          v-for="(t, i) in tools"
          :key="t.name"
          v-step
          class="tool"
          :class="{ 'is-current': step === i + 2 }"
          :style="{ '--c': t.color }"
        >
          <span class="tool__logo"><img :src="t.logo" :alt="t.name" /></span>
          <h2 class="tool__name">{{ t.name }}</h2>
          <p class="tool__text">{{ t.text }}</p>
        </article>
      </div>

      <div v-step class="stairs">
        <div v-for="(s, i) in stairs" :key="s" class="stair" :style="{ '--i': i }">
          <span class="stair__label">{{ s }}</span>
          <span class="stair__block" />
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
  gap: clamp(20px, 4.5vh, 56px);
}

.head {
  text-align: center;
}

.title {
  font-size: calc(var(--text-title) * 0.85);
  line-height: 1.08;
  font-weight: 700;
  color: var(--slide-muted);
  text-wrap: balance;
}

.now {
  margin-top: 0.15em;
  font-size: var(--text-hero);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.now em {
  font-style: normal;
  display: inline-block;
  padding-bottom: 0.08em;
  background: linear-gradient(110deg, var(--slide-accent), var(--slide-accent-2) 60%, var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.now[data-step-shown] em {
  animation: pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s backwards;
}

@keyframes pop {
  from {
    scale: 0.6;
    rotate: -6deg;
  }
}

/* ---------- ferramentas ---------- */
.tools {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: clamp(14px, 2vw, 36px);
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

@media (max-aspect-ratio: 1 / 1) {
  .tools {
    grid-template-columns: 1fr;
  }
}

.tool {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5em;
  padding: clamp(18px, 2.4vw, 40px) clamp(14px, 1.6vw, 28px);
  border-radius: 26px;
  text-align: center;
  background: color-mix(in srgb, var(--slide-fg) 4%, transparent);
  border: 2px solid color-mix(in srgb, var(--slide-fg) 8%, transparent);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s,
    box-shadow 0.4s;
}

.tool.is-current {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  box-shadow: 0 24px 60px -28px var(--c);
}

.tool__logo {
  position: relative;
  width: clamp(110px, 15vh, 190px); /* largo: o Scratch é um logotipo horizontal */
  height: clamp(64px, 9vh, 110px);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 10px 30px -12px var(--c);
}

.tool__logo img {
  position: absolute;
  inset: 12%;
  width: 76%;
  height: 76%;
  object-fit: contain;
}

.tool__name {
  margin-top: 0.3em;
  font-size: calc(var(--text-base) * 1.3);
  font-weight: 800;
}

.tool__text {
  font-size: var(--text-base);
  line-height: 1.3;
  color: var(--slide-muted);
  text-wrap: balance;
}

/* ---------- três degraus: ocupam a tela no último passo ---------- */
.is-stairs .head,
.is-stairs .tools {
  filter: blur(6px);
  opacity: 0.15;
}

.head {
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.stairs {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: end;
  gap: clamp(10px, 1.6vw, 24px);
  padding: 12vh 4vw 10vh;
  pointer-events: none;
}

.stair {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
}

.stair__label {
  font-size: calc(var(--text-title) * 0.6);
  line-height: 1.1;
  font-weight: 800;
  text-align: center;
  text-wrap: balance;
  opacity: 0;
  translate: 0 20px;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out);
}

.stair__block {
  width: 100%;
  height: calc((var(--i) + 1) * 14vh);
  border-radius: 20px 20px 6px 6px;
  background: linear-gradient(
    180deg,
    var(--slide-accent),
    color-mix(in srgb, var(--slide-accent) 25%, transparent)
  );
  box-shadow: 0 0 40px -10px var(--slide-accent);
  transform-origin: bottom;
  scale: 1 0;
  transition: scale 0.7s var(--ease-out);
}

.stair:nth-child(2) .stair__block {
  background: linear-gradient(180deg, var(--slide-accent-2), color-mix(in srgb, var(--slide-accent-2) 25%, transparent));
  box-shadow: 0 0 40px -10px var(--slide-accent-2);
}

.stair:nth-child(3) .stair__block {
  background: linear-gradient(180deg, var(--slide-accent-3), color-mix(in srgb, var(--slide-accent-3) 25%, transparent));
  box-shadow: 0 0 40px -10px var(--slide-accent-3);
}

.stairs[data-step-shown] .stair__block {
  scale: 1 1;
  transition-delay: calc(200ms + var(--i) * 450ms);
}

.stairs[data-step-shown] .stair__label {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(500ms + var(--i) * 450ms);
}
</style>
