# Lesson One — apresentação em slides (Vue 3)

```bash
npm install
npm run dev
```

## Apresentações

Ao abrir o app aparece a tela de escolha (teclas `1`, `2`… ou clique). Cada apresentação é uma pasta em `src/decks/`:

- `src/decks/ensino-medio/` — 1º e 3º ano do Ensino Médio
- `src/decks/7-ano/` — 7º ano (reaproveita o slide de apresentação do Ensino Médio)

O `index.ts` de cada pasta define id, título e público; `src/decks/index.ts` lista as apresentações na ordem da tela de escolha. O botão de grade nos controles volta para a escolha.

## Como criar um slide

1. Crie um arquivo na pasta da apresentação (`src/decks/<apresentação>/03-MeuSlide.vue`) com prefixo numérico. A ordem dos slides segue esse número.
2. Use `Slide` como raiz:

```vue
<script setup lang="ts">
import Slide from '../../deck/Slide.vue'
</script>

<template>
  <Slide title="Título" subtitle="Opcional">
    conteúdo aqui
  </Slide>
</template>
```

Layouts: `default` (título no topo), `center` (tudo centralizado), `full` (sem padding, para imagem, vídeo ou canvas).
O slide ocupa 100% da largura e altura da tela; tamanhos de fonte e espaçamentos são fluidos (variáveis em `src/style.css`).

## Animações

Use `v-reveal` em qualquer elemento para animar sua entrada:

```vue
<h2 v-reveal>sobe</h2>
<p v-reveal="200">sobe com 200ms de atraso</p>
<img v-reveal:zoom="400" />
```

Direções: `up` (padrão), `down`, `left`, `right`, `zoom`, `fade`, `blur`.

## Passos dentro do slide

Marque com `v-step` o que deve aparecer aos poucos. → revela o próximo passo, ← volta o anterior; o slide só muda quando os passos acabam (voltando, o slide anterior aparece completo).

```vue
<li v-step>passo 1</li>
<li v-step>passo 2 (sem número = próximo na ordem)</li>
<img v-step:zoom="2" />  <!-- aparece junto com o passo 2 -->
```

Direções iguais às do `v-reveal`. Para lógica própria (destacar item, trocar gráfico), use `useSteps()`:

```ts
import { useSteps } from '../../deck/steps'
const { step } = useSteps()   // 0 = nenhum passo exibido
// useSteps(4) garante 4 passos mesmo sem elementos v-step
```

## Controles

Canto inferior direito: voltar, contador de slides, pontos dos passos (preenchidos = exibidos, vazios = faltam), avançar e tela cheia. Somem com o mouse parado.

| Tecla | Ação |
|---|---|
| → ↑ Espaço PageDown | próximo passo / slide |
| ← ↓ PageUp Backspace | passo / slide anterior |
| Home / End | primeiro / último |
| F | tela cheia |

A URL guarda apresentação, slide e passo (`#/ensino-medio/3/2`), então recarregar a página mantém a posição.
