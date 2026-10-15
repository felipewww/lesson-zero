<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
</script>

<template>
  <Slide layout="center">
    <div class="thanks">
      <h1 class="title">
        <span class="title__text">Obrigado</span>
        <span class="yawn" role="img" aria-label="bocejo">🥱</span>
      </h1>

      <span v-reveal:fade="500" class="divider" />

      <div v-reveal="700" class="contact">
        <p class="contact__name">Felipe Barreiros</p>
        <p class="contact__role">Software Engineer Sênior</p>
        <p class="contact__email">
          <svg class="mail" viewBox="0 0 24 24" aria-hidden="true">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span>felipewww@outlook.com.br</span>
        </p>
      </div>
    </div>
  </Slide>
</template>

<style scoped>
.thanks {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(20px, 4vh, 48px);
}

.title {
  display: flex;
  align-items: center;
  gap: 0.15em;
  font-size: calc(var(--text-hero) * 1.3);
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.title__text {
  padding-bottom: 0.08em; /* o degradê recorta pelo box: sem folga, o "g" perde a perna */
  background: linear-gradient(120deg, var(--slide-fg) 20%, var(--slide-accent) 55%, var(--slide-accent-2) 80%, var(--slide-accent-3));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation:
    reveal-blur 0.9s var(--ease-out) backwards,
    drift 8s ease-in-out 1s infinite alternate;
}

/* entra depois do "Obrigado" e fica bocejando de tempos em tempos */
.yawn {
  display: inline-block;
  font-size: 0.75em;
  transform-origin: 50% 80%;
  animation:
    reveal-zoom 0.6s var(--ease-out) 1.2s backwards,
    yawn 4s ease-in-out 2s infinite;
}

@keyframes yawn {
  0%, 60%, 100% { scale: 1; rotate: 0deg; }
  70% { scale: 1.12 0.92; rotate: -6deg; }
  80% { scale: 0.96 1.1; rotate: 4deg; }
  90% { scale: 1.04 0.98; rotate: -2deg; }
}

@keyframes drift {
  to {
    background-position: 100% 0;
  }
}

.divider {
  width: clamp(48px, 6vw, 120px);
  height: 3px;
  border-radius: 3px;
  background: linear-gradient(90deg, var(--slide-accent), var(--slide-accent-2), var(--slide-accent-3));
}

.contact {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3em;
}

.contact__name {
  font-size: calc(var(--text-base) * 1.4);
  font-weight: 700;
}

.contact__role {
  font-size: var(--text-base);
  color: var(--slide-muted);
}

.contact__email {
  display: inline-flex;
  align-items: center;
  gap: 0.6em;
  margin-top: 1em;
  padding: 0.5em 1.1em;
  border-radius: 999px;
  font-family: var(--slide-font-mono);
  font-size: calc(var(--text-base) * 0.85);
  background: rgb(255 255 255 / 0.05);
  border: 1px solid rgb(255 255 255 / 0.12);
}

.mail {
  width: 1.1em;
  height: 1.1em;
  fill: none;
  stroke: var(--slide-accent);
  stroke-width: 1.75;
  stroke-linecap: round;
  stroke-linejoin: round;
}
</style>
