import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { vReveal } from './deck/reveal'
import { vStep } from './deck/steps'

createApp(App).directive('reveal', vReveal).directive('step', vStep).mount('#app')
