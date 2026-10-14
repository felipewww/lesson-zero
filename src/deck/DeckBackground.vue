<script setup lang="ts">
/**
 * Fundo animado compartilhado pelo deck e pela tela de escolha.
 * `progress` (0..1) desloca as manchas conforme a apresentação avança.
 */
defineProps<{ progress?: number }>()
</script>

<template>
  <div class="deck__bg" aria-hidden="true" :style="{ '--progress': progress ?? 0 }">
    <span class="blob blob--1" />
    <span class="blob blob--2" />
    <span class="blob blob--3" />
    <span class="grain" />
  </div>
</template>

<style scoped>
.deck__bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.blob {
  position: absolute;
  width: 60vmax;
  height: 60vmax;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.35;
  transition: translate 1.6s var(--ease-out);
}

.blob--1 {
  background: var(--slide-accent);
  top: -20vmax;
  left: -15vmax;
  translate: calc(var(--progress) * 70vw) calc(var(--progress) * 20vh);
  animation: float 18s ease-in-out infinite;
}

.blob--2 {
  background: var(--slide-accent-2);
  bottom: -25vmax;
  right: -20vmax;
  translate: calc(var(--progress) * -60vw) calc(var(--progress) * -15vh);
  animation: float 22s ease-in-out -6s infinite reverse;
}

.blob--3 {
  background: var(--slide-accent-3);
  width: 35vmax;
  height: 35vmax;
  top: 40%;
  left: 40%;
  opacity: 0.18;
  translate: calc(var(--progress) * -30vw) calc(var(--progress) * 25vh);
  animation: float 26s ease-in-out -12s infinite;
}

.grain {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px);
  background-size: 3px 3px;
  mask-image: radial-gradient(ellipse at center, #000 30%, transparent 80%);
}

@keyframes float {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(6vw, -4vh) scale(1.1);
  }
  66% {
    transform: translate(-4vw, 5vh) scale(0.92);
  }
}
</style>
