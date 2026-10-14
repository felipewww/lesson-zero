import { computed, reactive } from 'vue'

/**
 * Regras do jogo inventadas pela turma no slide 07 (digitadas ao vivo).
 * Ficam em memória para o slide 08 poder mostrá-las de volta.
 */
export const gameRules = reactive({
  points: '',
  enemy: '',
  end: '',
})

export const hasGameRules = computed(() => Object.values(gameRules).some((r) => r.trim() !== ''))
