<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1 = comparação "aprender ≠ evitar aprender"; 2 = o teste (explicar o que a IA fez)
const { step } = useSteps(2) // o passo 2 (o teste) é controlado pela classe is-test
const TEST = 2
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-test': step >= TEST }">
      <div class="top">
        <div class="head">
          <p v-reveal:fade class="kicker">o perigo da IA: <strong>atrofia cognitiva</strong></p>
          <h1 v-reveal:blur="200" class="question">
            Se a IA pensar por você o tempo inteiro, o que <em>você</em> estará aprendendo?
          </h1>
        </div>

        <div v-reveal:zoom="500" class="brain" aria-hidden="true">
          <div class="brain__icon"><Icon name="brain" /></div>
          <div class="meter">
            <span class="meter__label">esforço próprio</span>
            <div class="meter__track"><div class="meter__fill" /></div>
          </div>
        </div>
      </div>

      <div v-step class="compare">
        <article class="side side--good">
          <span class="side__icon"><Icon name="lightbulb" /></span>
          <p><span>Usar IA para <strong>aprender</strong></span></p>
        </article>

        <span class="neq">≠</span>

        <article class="side side--bad">
          <span class="side__icon"><Icon name="bot" /></span>
          <p><span>Usar IA para <strong>evitar aprender</strong></span></p>
        </article>
      </div>

      <p class="test" :class="{ 'is-shown': step >= TEST }">
        <span class="test__a">Se você não sabe <em>explicar</em> o que a IA fez,</span>
        <span class="test__b">você <strong>não aprendeu nada</strong>.</span>
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
  justify-content: center;
  gap: clamp(24px, 6vh, 80px);
}

.top {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: clamp(24px, 5vw, 100px);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.kicker strong {
  color: var(--slide-accent-3);
}

.question {
  margin-top: 0.4em;
  font-size: var(--text-title);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.question em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- cérebro com "esforço" se esvaziando ---------- */
.brain {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2em;
  font-size: calc(var(--text-base) * 1.35);
}

.brain__icon {
  display: grid;
  place-items: center;
  width: 5.5em;
  height: 5.5em;
  border-radius: 1.6em;
  color: var(--slide-accent-3);
  background: rgb(244 114 182 / 0.08);
  border: 1px solid rgb(244 114 182 / 0.3);
  animation: fade-brain 6s ease-in-out infinite;
}

.brain__icon :deep(.icon) {
  width: 3em;
  height: 3em;
}

@keyframes fade-brain {
  0%, 15% { box-shadow: 0 0 60px -10px rgb(244 114 182 / 0.8); opacity: 1; }
  70%, 85% { box-shadow: 0 0 0 0 transparent; opacity: 0.35; }
  100% { box-shadow: 0 0 60px -10px rgb(244 114 182 / 0.8); opacity: 1; }
}

.meter {
  width: 8em;
  text-align: center;
}

.meter__label {
  font-family: var(--slide-font-mono);
  font-size: 0.5em;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--slide-muted);
}

.meter__track {
  margin-top: 0.5em;
  height: 0.5em;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  overflow: hidden;
}

.meter__fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--slide-accent-3), #fbbf24);
  transform-origin: left;
  animation: drain 6s ease-in-out infinite;
}

@keyframes drain {
  0%, 15% { transform: scaleX(1); }
  70%, 85% { transform: scaleX(0.08); }
  100% { transform: scaleX(1); }
}

/* ---------- aprender ≠ evitar aprender ---------- */
.compare {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: clamp(16px, 3vw, 56px);
}

.side {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: clamp(18px, 2.4vw, 44px);
  border-radius: 24px;
  font-size: calc(var(--text-base) * 1.25);
  line-height: 1.25;
  border: 1px solid;
  transition:
    opacity 0.6s var(--ease-out),
    translate 0.7s var(--ease-out);
}

.side--good {
  background: rgb(52 211 153 / 0.08);
  border-color: rgb(52 211 153 / 0.35);
}

.side--good strong { color: #6ee7b7; }

.side--bad {
  background: rgb(244 114 182 / 0.08);
  border-color: rgb(244 114 182 / 0.35);
}

.side--bad strong { color: var(--slide-accent-3); }

.side__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.2em;
  height: 2.2em;
  border-radius: 0.6em;
  background: rgb(255 255 255 / 0.06);
}

.side--good .side__icon { color: #6ee7b7; }
.side--bad .side__icon { color: var(--slide-accent-3); }

.side__icon :deep(.icon) {
  width: 1.3em;
  height: 1.3em;
}

.neq {
  align-self: center;
  font-size: calc(var(--text-title) * 1.1);
  font-weight: 800;
  color: var(--slide-muted);
  transition:
    opacity 0.6s,
    scale 0.7s var(--ease-out);
}

/* lados se aproximam do ≠ depois que o bloco aparece */
.compare:not([data-step-shown]) .side--good { translate: -40px 0; }
.compare:not([data-step-shown]) .side--bad { translate: 40px 0; }
.compare:not([data-step-shown]) .neq { scale: 0.3; opacity: 0; }

.compare[data-step-shown] .neq {
  transition-delay: 400ms;
}

@media (max-aspect-ratio: 1 / 1) {
  .top {
    grid-template-columns: 1fr;
  }

  .brain {
    flex-direction: row;
  }

  .compare {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

/* ---------- mensagem-chave ---------- */
.top,
.compare {
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}


.is-test .top,
.is-test .compare {
  filter: blur(8px);
  opacity: 0.12;
}

/* o teste: aparece sozinho no passo 2 e sai quando entra a mensagem-chave */
.test {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3em;
  padding: 0 6vw;
  text-align: center;
  pointer-events: none;
  opacity: 0;
  scale: 0.96;
  filter: blur(12px);
  transition:
    opacity 0.7s var(--ease-out),
    scale 0.7s var(--ease-out),
    filter 0.7s var(--ease-out);
}

.test.is-shown {
  opacity: 1;
  scale: 1;
  filter: blur(0);
}

.test__a {
  font-size: calc(var(--text-title) * 0.75);
  line-height: 1.15;
  font-weight: 700;
  color: var(--slide-muted);
  text-wrap: balance;
}

.test__a em {
  font-style: normal;
  color: var(--slide-fg);
}

.test__b {
  font-size: calc(var(--text-title) * 1.15);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.test__b strong {
  color: var(--slide-accent-3);
}

.test.is-shown .test__b {
  animation: thud 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s backwards;
}

@keyframes thud {
  from {
    opacity: 0;
    scale: 1.25;
  }
}



</style>
