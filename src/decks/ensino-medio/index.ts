import type { Component } from 'vue'
import { sortSlides, type DeckInfo } from '../../deck/slides'

// Todo arquivo .vue desta pasta é um slide, na ordem do prefixo numérico
const modules = import.meta.glob<{ default: Component }>('./*.vue', { eager: true })

export default {
  id: 'ensino-medio',
  title: 'A profissão de programador na era da Inteligência Artificial',
  audience: '1º e 3º ano do Ensino Médio',
  slides: sortSlides(modules),
} satisfies DeckInfo
