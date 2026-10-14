<script setup lang="ts">
import SlideDeck from './deck/SlideDeck.vue'
import { slides } from './slides'
</script>

<template>
  <SlideDeck :slides="slides" />
</template>
