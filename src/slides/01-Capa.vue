<script setup lang="ts">
import Slide from '../deck/Slide.vue'
</script>

<template>
  <Slide layout="center" title="Lesson One" subtitle="Título da apresentação">
    <p v-reveal:fade="600" class="hint">Use → ou os controles no canto para avançar</p>
  </Slide>
</template>

<style scoped>
.hint {
  margin-top: 4vh;
  font-size: calc(var(--text-base) * 0.75);
  color: var(--slide-muted);
}
</style>
