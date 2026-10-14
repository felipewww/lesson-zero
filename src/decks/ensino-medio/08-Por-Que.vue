<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'

// Passo 1: setores; passo 2: "duas grandes possibilidades"; passos 3 e 4: cada caminho
const sectors: { icon: IconName; name: string; color: string }[] = [
  { icon: 'heart-pulse', name: 'Saúde', color: 'var(--slide-accent-3)' },
  { icon: 'graduation-cap', name: 'Educação', color: 'var(--slide-accent)' },
  { icon: 'truck', name: 'Logística', color: '#fbbf24' },
  { icon: 'factory', name: 'Indústria', color: '#94a3b8' },
  { icon: 'landmark', name: 'Bancos', color: '#34d399' },
  { icon: 'gamepad', name: 'Entretenimento', color: 'var(--slide-accent-2)' },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <header>
        <p v-reveal:fade class="kicker">Por que escolher essa profissão?</p>
        <h1 v-reveal:blur="150" class="title">
          A tecnologia está em <em>praticamente todos</em> os setores.
        </h1>
      </header>

      <ul v-step class="sectors">
        <li v-for="(s, i) in sectors" :key="s.name" class="sector" :style="{ '--c': s.color, '--i': i }">
          <span class="sector__icon"><Icon :name="s.icon" /></span>
          <span class="sector__name">{{ s.name }}</span>
        </li>
      </ul>

      <section class="paths">
        <h2 v-step class="paths__title">Duas grandes possibilidades:</h2>
        <div class="paths__grid">
          <article v-step:right class="path" style="--c: var(--slide-accent)">
            <span class="path__icon"><Icon name="briefcase" /></span>
            <p><span>Trabalhar para empresas de <strong>diferentes segmentos e tamanhos</strong>.</span></p>
          </article>
          <span v-step:fade="4" class="or">ou</span>
          <article v-step:left="4" class="path" style="--c: var(--slide-accent-3)">
            <span class="path__icon"><Icon name="rocket" /></span>
            <p><span>Criar seus <strong>próprios produtos e negócios</strong>.</span></p>
          </article>
        </div>
      </section>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(20px, 4.5vh, 56px);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.75);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.title {
  margin-top: 0.4em;
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

/* ---------- setores ---------- */
.sectors {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: clamp(8px, 1.2vw, 24px);
}

.sector {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6em;
  padding: 1em 0.5em;
  border-radius: 18px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  font-size: calc(var(--text-base) * 0.9);
  opacity: 0;
  translate: 0 20px;
  transition:
    opacity 0.5s var(--ease-out),
    translate 0.5s var(--ease-out);
}

.sectors[data-step-shown] .sector {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(var(--i) * 90ms);
}

.sector__icon {
  display: grid;
  place-items: center;
  width: 2.4em;
  height: 2.4em;
  border-radius: 30%;
  font-size: 1.6em;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 14%, transparent);
}

/* cada setor "respira" num ritmo diferente: tecnologia viva em todo lugar */
.sectors[data-step-shown] .sector__icon {
  animation: breathe 3s ease-in-out infinite;
  animation-delay: calc(var(--i) * 0.4s);
}

@keyframes breathe {
  50% {
    box-shadow: 0 0 24px -4px var(--c);
  }
}

/* ---------- dois caminhos ---------- */
.paths__title {
  margin-bottom: 0.8em;
  font-size: calc(var(--text-title) * 0.6);
  font-weight: 800;
  letter-spacing: -0.02em;
}

.paths__grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: stretch;
  gap: clamp(12px, 2vw, 32px);
}

.path {
  display: flex;
  align-items: center;
  gap: 1em;
  padding: clamp(16px, 2vw, 32px);
  border-radius: 22px;
  background: color-mix(in srgb, var(--c) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--c) 40%, transparent);
  font-size: calc(var(--text-base) * 1.1);
  line-height: 1.3;
}

.path strong {
  color: var(--c);
}

.path__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 2.6em;
  height: 2.6em;
  border-radius: 30%;
  font-size: 1.2em;
  color: var(--c);
  background: color-mix(in srgb, var(--c) 16%, transparent);
}

.or {
  align-self: center;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--slide-muted);
}

@media (max-aspect-ratio: 1 / 1) {
  .sectors {
    grid-template-columns: repeat(3, 1fr);
  }

  .paths__grid {
    grid-template-columns: 1fr;
  }
}
</style>
