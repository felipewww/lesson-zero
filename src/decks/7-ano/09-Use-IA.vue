<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1 = jeito 1; 2 = jeito 2; 3 = a pergunta (votação); 4 = resposta: o jeito 2 ajuda a aprender
const VOTE = 3
const ANSWER = 4
// o passo da resposta não tem elemento v-step próprio, então declara o total
const { step } = useSteps(ANSWER)

const ways = [
  {
    n: 1,
    ask: 'Faça meu trabalho por mim.',
    reply: 'Pronto! Aqui está a resposta completa.',
    brain: 5,
  },
  {
    n: 2,
    ask: 'Me ensine a resolver esse problema.',
    reply: 'Bora! Primeiro: o que você já sabe sobre isso?',
    brain: 90,
  },
]
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-answer': step >= ANSWER }">
      <h1 v-reveal:blur class="title">Dois jeitos de usar <em>IA</em></h1>

      <div class="ways">
        <article
          v-for="w in ways"
          :key="w.n"
          v-step="w.n"
          class="way"
          :class="[`way--${w.n}`, { 'is-winner': step >= ANSWER && w.n === 2, 'is-loser': step >= ANSWER && w.n === 1 }]"
        >
          <span class="way__label">jeito {{ w.n }}</span>

          <div class="chat">
            <p class="msg msg--me">“{{ w.ask }}”</p>
            <p class="msg msg--ai">
              <Icon name="sparkles" class="msg__icon" />
              <span>{{ w.reply }}</span>
            </p>
          </div>

          <!-- quanto o cérebro de quem pediu trabalhou -->
          <div class="meter">
            <Icon name="brain" class="meter__icon" />
            <span class="meter__bar"><span class="meter__fill" :style="{ '--v': `${w.brain}%` }" /></span>
          </div>

          <span v-if="w.n === 2" class="stamp">esse!</span>
        </article>
      </div>

      <p v-step:zoom="VOTE" class="vote">
        <Icon name="hand" class="vote__hand" />
        <span>Qual deles ajuda você a <em>aprender</em>?</span>
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
  gap: clamp(18px, 4vh, 52px);
}

.title {
  text-align: center;
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.title em {
  font-style: normal;
  color: var(--slide-accent-2);
}

/* ---------- os dois jeitos lado a lado ---------- */
.ways {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(16px, 3vw, 56px);
}

@media (max-aspect-ratio: 1 / 1) {
  .ways {
    grid-template-columns: 1fr;
  }
}

.way {
  --c: var(--slide-accent-3);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: clamp(16px, 2vw, 36px);
  border-radius: 28px;
  font-size: var(--text-base);
  background: rgb(255 255 255 / 0.04);
  border: 2px solid rgb(255 255 255 / 0.1);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.5s,
    background 0.5s,
    box-shadow 0.5s,
    filter 0.5s,
    scale 0.5s var(--ease-out);
}

.way--2 {
  --c: var(--slide-accent);
}

.way__label {
  align-self: flex-start;
  padding: 0.2em 0.8em;
  border-radius: 999px;
  font-size: 0.8em;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--slide-bg);
  background: var(--c);
}

.chat {
  display: flex;
  flex-direction: column;
  gap: 0.6em;
}

.msg {
  max-width: 88%;
  padding: 0.6em 1em;
  border-radius: 20px;
  line-height: 1.3;
}

.msg--me {
  align-self: flex-end;
  font-size: 1.15em;
  font-weight: 700;
  color: var(--slide-bg);
  background: var(--c);
  border-bottom-right-radius: 6px;
}

.msg--ai {
  align-self: flex-start;
  display: flex;
  align-items: flex-start;
  gap: 0.5em;
  font-size: 0.9em;
  color: var(--slide-fg);
  background: rgb(255 255 255 / 0.08);
  border-bottom-left-radius: 6px;
  opacity: 0;
  translate: 0 10px;
  transition:
    opacity 0.5s,
    translate 0.5s var(--ease-out);
}

.msg__icon {
  flex-shrink: 0;
  margin-top: 0.15em;
  color: var(--slide-accent-2);
}

.way[data-step-shown] .msg--ai {
  opacity: 1;
  translate: 0 0;
  transition-delay: 0.7s;
}

/* medidor do "cérebro trabalhando": só enche na resposta */
.meter {
  display: flex;
  align-items: center;
  gap: 0.6em;
  opacity: 0;
  transition: opacity 0.5s;
}

.is-answer .meter {
  opacity: 1;
}

.meter__icon {
  width: 1.4em;
  height: 1.4em;
  color: var(--c);
}

.meter__bar {
  flex: 1;
  height: 0.7em;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  overflow: hidden;
}

.meter__fill {
  display: block;
  height: 100%;
  width: 0;
  border-radius: inherit;
  background: var(--c);
  transition: width 1.2s var(--ease-out);
}

.is-answer .meter__fill {
  width: var(--v);
  transition-delay: 0.3s;
}

/* resposta: o jeito 2 ganha destaque */
.way.is-winner {
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  box-shadow: 0 30px 80px -30px var(--c);
  scale: 1.03;
}

.way.is-loser {
  filter: grayscale(0.7);
  opacity: 0.55;
  scale: 0.97;
}

.stamp {
  position: absolute;
  top: -0.6em;
  right: 1em;
  padding: 0.15em 0.7em;
  border-radius: 0.4em;
  font-size: 1.3em;
  font-weight: 900;
  color: var(--slide-bg);
  background: var(--slide-accent-2);
  rotate: 8deg;
  opacity: 0;
  scale: 1.8;
  transition:
    opacity 0.3s,
    scale 0.5s var(--ease-out);
}

.is-answer .stamp {
  opacity: 1;
  scale: 1;
  transition-delay: 0.5s;
}

/* ---------- votação ---------- */
.vote {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  font-size: calc(var(--text-title) * 0.7);
  font-weight: 800;
  text-align: center;
}

.vote > span {
  text-wrap: balance;
}

.vote em {
  font-style: normal;
  color: var(--slide-accent);
}

.vote__hand {
  flex-shrink: 0;
  color: var(--slide-accent-2);
  transform-origin: 70% 90%;
  animation: wave 2.4s ease-in-out infinite;
}

@keyframes wave {
  0%, 60%, 100% { rotate: 0deg; }
  10%, 30% { rotate: 14deg; }
  20%, 40% { rotate: -8deg; }
}
</style>
