<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon from '../../components/Icon.vue'

// Passo 1: nível intermediário sobe.  Passo 2: nível avançado sobe.
const base = ['Lógica', 'JS / TS', 'HTML / CSS', 'SQL', 'APIs', 'Git', 'React / Vue']

const intermediate = [
  { label: 'Frameworks', detail: 'NestJS, Django ou Spring Boot' },
  { label: 'Arquitetura de código', detail: 'SOLID, MVC e Clean Code' },
  { label: 'Testes automatizados' },
  { label: 'Cloud', detail: 'AWS ou GCP' },
  { label: 'CI/CD' },
]

const advanced = [
  { label: 'Mensageria, filas e eventos' },
  { label: 'Observabilidade' },
  { label: 'Infraestrutura e Kubernetes' },
  { label: 'Arquitetura e sistemas distribuídos' },
]
</script>

<template>
  <Slide>
    <div class="stage">
      <header>
        <p v-reveal:fade class="kicker">um caminho possível · backend &amp; cloud</p>
        <h1 v-reveal:blur="150" class="title">E depois dos <em>fundamentos</em>?</h1>
      </header>

      <div class="stairs">
        <section v-reveal="300" class="level level--base">
          <span class="level__name"><Icon name="check" /> base</span>
          <ul class="level__mini">
            <li v-for="b in base" :key="b">{{ b }}</li>
          </ul>
        </section>

        <section v-step class="level level--mid">
          <span class="level__name">intermediário</span>
          <ul class="level__list">
            <li v-for="(item, i) in intermediate" :key="item.label" :style="{ '--i': i }">
              <strong>{{ item.label }}</strong>
              <small v-if="item.detail">{{ item.detail }}</small>
            </li>
          </ul>
        </section>

        <section v-step class="level level--top">
          <span class="level__name">avançado / especializado</span>
          <ul class="level__list">
            <li v-for="(item, i) in advanced" :key="item.label" :style="{ '--i': i }">
              <strong>{{ item.label }}</strong>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.stage {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(24px, 5vh, 64px);
}

.kicker {
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.7);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--slide-accent);
}

.title {
  margin-top: 0.3em;
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

/* ---------- degraus ---------- */
.stairs {
  height: clamp(360px, 66vh, 720px);
  display: grid;
  grid-template-columns: 0.8fr 1.2fr 1.2fr;
  align-items: end;
  gap: clamp(12px, 1.5vw, 28px);
}

.level {
  display: flex;
  flex-direction: column;
  gap: 1em;
  padding: clamp(16px, 1.8vw, 32px);
  border-radius: 20px 20px 6px 6px;
  border: 1px solid rgb(255 255 255 / 0.1);
  font-size: calc(var(--text-base) * 0.9);
  transition:
    opacity 0.7s var(--ease-out),
    transform 0.8s var(--ease-out);
}

.level--base {
  min-height: 40%;
  background: rgb(255 255 255 / 0.03);
  color: var(--slide-muted);
}

.level--mid {
  --c: var(--slide-accent);
  min-height: 82%;
  background: linear-gradient(180deg, rgb(56 189 248 / 0.14), rgb(56 189 248 / 0.03));
  border-color: rgb(56 189 248 / 0.35);
}

.level--top {
  --c: var(--slide-accent-2);
  min-height: 100%;
  background: linear-gradient(180deg, rgb(167 139 250 / 0.18), rgb(167 139 250 / 0.03));
  border-color: rgb(167 139 250 / 0.4);
  box-shadow: 0 -20px 60px -30px var(--slide-accent-2);
}

.level__name {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  font-family: var(--slide-font-mono);
  font-size: 0.8em;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c, #34d399);
}

.level__mini {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4em;
}

.level__mini li {
  padding: 0.25em 0.7em;
  border-radius: 999px;
  font-size: 0.8em;
  background: rgb(255 255 255 / 0.05);
}

.level__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.level__list li {
  display: flex;
  flex-direction: column;
  padding: 0.5em 0.9em;
  border-radius: 12px;
  background: rgb(10 15 30 / 0.6);
  border-left: 3px solid var(--c);
  line-height: 1.25;
  opacity: 0;
  translate: 0 12px;
  transition:
    opacity 0.5s,
    translate 0.5s var(--ease-out);
}

.level__list small {
  color: var(--slide-muted);
  font-size: 0.85em;
}

.level[data-step-shown] .level__list li {
  opacity: 1;
  translate: 0 0;
  transition-delay: calc(450ms + var(--i) * 120ms);
}

/* degraus sobem do chão */
.level--mid:not([data-step-shown]),
.level--top:not([data-step-shown]) {
  transform: translateY(60px);
}
</style>
