<script setup lang="ts">
import { ref } from 'vue'
import { type UrlResult } from './api'
import UrlForm from './components/UrlForm.vue'
import ResultCard from './components/ResultCard.vue'

const result = ref<UrlResult | null>(null)
</script>

<template>
  <div class="page">
    <header class="header">
      <div class="logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
        <span>Shortify</span>
      </div>
      <p class="tagline">Shorten links. Preview metadata.</p>
    </header>

    <main class="main">
      <UrlForm @result="result = $event" />

      <transition name="slide-up">
        <ResultCard v-if="result" :result="result" />
      </transition>
    </main>
  </div>
</template>

<style scoped>
.header {
  text-align: center;
  margin-bottom: 40px;
}

.logo {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(90deg, #a78bfa, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.logo svg {
  stroke: #a78bfa;
  -webkit-text-fill-color: initial;
  flex-shrink: 0;
}

.tagline {
  color: #94a3b8;
  font-size: 0.95rem;
}

.main {
  width: 100%;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.slide-up-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.footer {
  margin-top: 48px;
  color: #334155;
  font-size: 0.8rem;
}
</style>