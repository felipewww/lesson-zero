import type { Component } from 'vue'
import '@fontsource-variable/outfit'
import { sortSlides, type DeckInfo } from '../../deck/slides'
import Apresentacao from '../ensino-medio/01-Apresentacao.vue'
import Obrigado from '../ensino-medio/22-Obrigado.vue'

// Todo arquivo .vue desta pasta é um slide, na ordem do prefixo numérico.
// Apresentação do palestrante (início) e agradecimento (fim) vêm do Ensino Médio.
const modules = import.meta.glob<{ default: Component }>('./*.vue', { eager: true })

export default {
  id: '7-ano',
  title: 'Programação: como transformar ideias em realidade',
  audience: '7º ano do Ensino Fundamental',
  // Mais vivo que o Ensino Médio: turquesa, amarelo e coral sobre índigo, com fonte arredondada
  theme: {
    '--slide-bg': '#0c0a20',
    '--slide-fg': '#f1f5f9',
    '--slide-muted': '#a5b0cc',
    '--slide-accent': '#2dd4bf',
    '--slide-accent-2': '#facc15',
    '--slide-accent-3': '#fb7185',
    '--slide-font': "'Outfit Variable', system-ui, sans-serif",
  },
  slides: [Apresentacao, ...sortSlides(modules), Obrigado],
} satisfies DeckInfo
