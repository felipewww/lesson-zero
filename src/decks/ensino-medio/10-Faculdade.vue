<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passo 1: "Não."  Passo 2: "Uma carreira se constrói com:"  Passos 3..6: blocos da torre (de baixo para cima)
const { step } = useSteps()

const blocks: { icon: IconName; text: string; color: string }[] = [
  { icon: 'graduation-cap', text: 'Formação e fundamentos', color: 'var(--slide-accent)' },
  { icon: 'wrench', text: 'Conhecimento prático', color: 'var(--slide-accent-2)' },
  { icon: 'box', text: 'Projetos e experiência', color: '#34d399' },
  { icon: 'refresh', text: 'Aprendizado contínuo', color: 'var(--slide-accent-3)' },
]
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="text">
        <h1 v-reveal:blur class="question">A faculdade garante um <em>emprego</em>?</h1>
        <p v-step="1" class="answer">
          <strong class="answer__no">Não.</strong>
          <span>O diploma, sozinho, não garante uma vaga.</span>
        </p>
      </div>

      <div class="build">
        <p v-step="2" class="build__label">Uma carreira se constrói com:</p>
        <div class="tower">
          <div
            v-for="(b, i) in blocks"
            :key="b.text"
            v-step:down="3 + i"
            class="brick"
            :class="{ 'is-current': step === 3 + i }"
            :style="{ '--c': b.color, '--w': `${100 - i * 8}%` }"
          >
            <Icon :name="b.icon" class="brick__icon" />
            <span>{{ b.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: clamp(32px, 6vw, 140px);
}

@media (max-aspect-ratio: 1 / 1) {
  .layout {
    grid-template-columns: 1fr;
    align-content: center;
  }
}

.question {
  font-size: calc(var(--text-title) * 1.15);
  line-height: 1.05;
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

.answer {
  margin-top: 0.8em;
  font-size: calc(var(--text-base) * 1.5);
  line-height: 1.3;
  color: var(--slide-muted);
  text-wrap: balance;
}

.answer__no {
  display: block;
  font-size: 2.6em;
  line-height: 1;
  font-weight: 800;
  letter-spacing: -0.04em;
  color: var(--slide-accent-3);
}

/* ---------- torre ---------- */
.build__label {
  margin-bottom: 1em;
  font-size: calc(var(--text-base) * 1.3);
  font-weight: 700;
}

.tower {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: clamp(8px, 1.2vh, 16px);
}

.brick {
  display: flex;
  align-items: center;
  gap: 0.8em;
  width: var(--w);
  padding: 1em 1.4em;
  border-radius: 16px;
  font-size: calc(var(--text-base) * 1.2);
  font-weight: 700;
  white-space: nowrap;
  background: color-mix(in srgb, var(--c) 12%, rgb(10 15 30 / 0.7));
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1),
    box-shadow 0.4s,
    border-color 0.4s;
}

.brick__icon {
  font-size: 1.4em;
  color: var(--c);
}

.brick.is-current {
  border-color: var(--c);
  box-shadow: 0 16px 40px -16px var(--c);
}
</style>
