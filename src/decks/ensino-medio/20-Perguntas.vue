<script setup lang="ts">
import { ref, watch } from 'vue'
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos: 1 = "Mas alguém precisa decidir"; 2..6 = cada pergunta; 7 = mensagem-chave
const { step } = useSteps()
const FIRST_QUESTION = 2
const KEY_MESSAGE = 7

const questions: { icon: IconName; text: string; color: string }[] = [
  { icon: 'users', text: 'pessoas acessarem ao mesmo tempo?', color: 'var(--slide-accent)' },
  { icon: 'wifi-off', text: 'a internet ou o servidor cair?', color: '#fbbf24' },
  { icon: 'credit-card', text: 'um pagamento acontecer duas vezes?', color: '#34d399' },
  { icon: 'shield', text: 'alguém tentar roubar os dados?', color: 'var(--slide-accent-3)' },
  { icon: 'lock', text: 'uma informação não puder ser alterada?', color: 'var(--slide-accent-2)' },
]

// Contador "10 mil" sobe quando a primeira pergunta aparece
const users = ref(0)
let raf = 0
watch(
  () => step.value >= FIRST_QUESTION,
  (shown) => {
    cancelAnimationFrame(raf)
    if (!shown) return (users.value = 0)
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / 1400, 1)
      users.value = Math.round(10000 * (1 - Math.pow(1 - t, 3)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
  },
  { immediate: true },
)
</script>

<template>
  <Slide>
    <div class="stage" :class="{ 'is-key': step >= KEY_MESSAGE }">
      <div class="chat">
        <p v-reveal="0" class="bubble bubble--me">Você pede para a IA construir um sistema.</p>
        <p v-reveal="500" class="bubble bubble--ai">
          <Icon name="check" class="bubble__check" /> Ela constrói.
        </p>
      </div>

      <h2 v-step class="decide">Mas alguém precisa <em>decidir</em>:</h2>

      <div class="grid">
        <article
          v-for="(q, i) in questions"
          :key="q.text"
          v-step:zoom
          class="card"
          :class="{ 'is-current': step === FIRST_QUESTION + i }"
          :style="{ '--c': q.color }"
        >
          <span class="card__icon"><Icon :name="q.icon" /></span>
          <p class="card__text">
            <span class="card__if">E se</span>
            <template v-if="i === 0">
              <strong class="counter">{{ users.toLocaleString('pt-BR') }}</strong>
            </template>
            {{ q.text }}
          </p>
        </article>
      </div>

      <p v-step:blur class="key">
        <span>Saber <em>quais perguntas fazer</em> é tão importante quanto saber <span class="nowrap">respondê-las.</span></span>
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
  gap: clamp(16px, 3.5vh, 48px);
}

/* ---------- conversa com a IA ---------- */
.chat {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8em;
  font-size: calc(var(--text-base) * 0.85);
}

.bubble {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  padding: 0.6em 1.1em;
  border-radius: 1.2em;
}

.bubble--me {
  background: rgb(255 255 255 / 0.08);
  border: 1px solid rgb(255 255 255 / 0.12);
  border-bottom-left-radius: 0.3em;
}

.bubble--ai {
  background: rgb(52 211 153 / 0.12);
  border: 1px solid rgb(52 211 153 / 0.35);
  border-bottom-right-radius: 0.3em;
  color: #6ee7b7;
  font-weight: 700;
}

.bubble__check {
  font-size: 1.2em;
}

.decide {
  font-size: var(--text-title);
  line-height: 1.05;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.decide em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- perguntas ---------- */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 200px), 1fr));
  gap: clamp(12px, 1.5vw, 28px);
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out),
    scale 0.8s var(--ease-out);
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.8em;
  padding: clamp(16px, 1.8vw, 32px);
  border-radius: 20px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  font-size: var(--text-base);
  line-height: 1.3;
  transition:
    opacity 0.6s var(--ease-out),
    transform 0.6s var(--ease-out),
    border-color 0.4s,
    background 0.4s,
    box-shadow 0.4s,
    translate 0.4s var(--ease-out);
}

.card__icon {
  display: grid;
  place-items: center;
  width: 2.4em;
  height: 2.4em;
  border-radius: 0.7em;
  font-size: 1.2em;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 14%, transparent);
}

.card__icon :deep(.icon) {
  width: 1.4em;
  height: 1.4em;
}

.card__if {
  display: block;
  font-size: 0.7em;
  font-family: var(--slide-font-mono);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--c);
}

.counter {
  font-variant-numeric: tabular-nums;
  color: var(--slide-fg);
}

.card.is-current {
  translate: 0 -8px;
  border-color: var(--c);
  background: color-mix(in srgb, var(--c) 10%, transparent);
  box-shadow: 0 20px 50px -20px var(--c);
}

/* ---------- mensagem-chave: tudo recua e ela toma a tela ---------- */
.chat,
.decide {
  transition:
    filter 0.8s var(--ease-out),
    opacity 0.8s var(--ease-out);
}

.is-key .chat,
.is-key .decide,
.is-key .grid {
  filter: blur(6px);
  opacity: 0.18;
}

.is-key .grid {
  scale: 0.96;
}

.key {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 0 6vw;
  text-align: center;
  font-size: calc(var(--text-title) * 0.95);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.key > span {
  text-wrap: balance;
}

.nowrap {
  white-space: nowrap;
}

.key em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
</style>
