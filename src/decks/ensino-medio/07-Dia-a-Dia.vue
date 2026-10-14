<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
import Icon, { type IconName } from '../../components/Icon.vue'
import { useSteps } from '../../deck/steps'

// Passos 1..5: cada bloco da agenda do dia; o bloco atual fica destacado
const { step } = useSteps()

const day: { time: string; icon: IconName; text: string; people: number; color: string }[] = [
  { time: '09:30', icon: 'users', text: 'Reunião para entender o problema', people: 5, color: 'var(--slide-accent)' },
  { time: '10:30', icon: 'message', text: 'Conversa com clientes e outras equipes', people: 4, color: 'var(--slide-accent-3)' },
  { time: '13:00', icon: 'compass', text: 'Planejamento e decisões técnicas', people: 3, color: '#fbbf24' },
  { time: '14:30', icon: 'git-pull-request', text: 'Desenvolvimento, testes e revisão de código', people: 2, color: '#34d399' },
  { time: '16:30', icon: 'scale', text: 'Discussão sobre diferentes soluções', people: 4, color: 'var(--slide-accent-2)' },
]

const avatarColors = ['#38bdf8', '#a78bfa', '#f472b6', '#fbbf24', '#34d399']
</script>

<template>
  <Slide>
    <div class="layout">
      <div class="text">
        <p v-reveal:fade class="kicker">Como é o dia a dia de um programador?</p>
        <h1 v-reveal:blur="150" class="title">
          <span class="title__line">Menos isolamento.</span>
          <em class="title__line">Mais colaboração.</em>
        </h1>
      </div>

      <ol class="agenda">
        <li
          v-for="(slot, i) in day"
          :key="slot.time"
          v-step:left
          class="slot"
          :class="{ 'is-current': step === i + 1 }"
          :style="{ '--c': slot.color }"
        >
          <time class="slot__time">{{ slot.time }}</time>
          <div class="slot__card">
            <span class="slot__icon"><Icon :name="slot.icon" /></span>
            <span class="slot__text">{{ slot.text }}</span>
            <span class="avatars" aria-hidden="true">
              <i v-for="n in slot.people" :key="n" :style="{ background: avatarColors[(n + i) % 5], '--n': n }" />
            </span>
          </div>
        </li>
      </ol>
    </div>
  </Slide>
</template>

<style scoped>
.layout {
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

.title__line {
  display: block;
}

.title em {
  font-style: normal;
  background: linear-gradient(120deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- agenda ---------- */
.agenda {
  position: relative;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: clamp(8px, 1.6vh, 20px);
}

.agenda::before {
  content: '';
  position: absolute;
  left: 4.2em;
  top: 0.5em;
  bottom: 0.5em;
  width: 2px;
  background: linear-gradient(180deg, transparent, rgb(255 255 255 / 0.12) 10%, rgb(255 255 255 / 0.12) 90%, transparent);
  font-size: calc(var(--text-base) * 0.8);
}

.slot {
  display: grid;
  grid-template-columns: 3.2em 1fr;
  align-items: center;
  gap: 1.4em;
  font-size: calc(var(--text-base) * 0.8);
}

.slot__time {
  font-family: var(--slide-font-mono);
  color: var(--slide-muted);
  text-align: right;
  transition: color 0.4s;
}

.slot__card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1em;
  padding: 0.9em 1.1em;
  border-radius: 16px;
  background: rgb(255 255 255 / 0.04);
  border: 1px solid rgb(255 255 255 / 0.08);
  border-left: 3px solid var(--c);
  transition:
    background 0.4s,
    box-shadow 0.4s,
    translate 0.4s var(--ease-out);
}

.slot__icon {
  display: grid;
  place-items: center;
  font-size: 1.5em;
  color: var(--c);
}

.slot__text {
  flex: 1;
  font-size: 1.2em;
  line-height: 1.25;
}

/* avatares: mostram quantas pessoas participam de cada momento */
.avatars {
  display: flex;
}

.avatars i {
  width: 1.5em;
  height: 1.5em;
  margin-left: -0.45em;
  border-radius: 50%;
  border: 2px solid #0b1020;
  opacity: 0;
  scale: 0.4;
  transition:
    opacity 0.4s,
    scale 0.4s var(--ease-out);
}

.slot[data-step-shown] .avatars i {
  opacity: 0.9;
  scale: 1;
  transition-delay: calc(300ms + var(--n) * 90ms);
}

.slot.is-current .slot__card {
  translate: -6px 0;
  background: color-mix(in srgb, var(--c) 10%, transparent);
  box-shadow: 0 16px 40px -20px var(--c);
}

.slot.is-current .slot__time {
  color: var(--c);
}
</style>
