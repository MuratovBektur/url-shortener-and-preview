<template>
  <div class="card">
    <h1 class="card-title">Shorten a URL</h1>
    <p class="card-subtitle">Paste any link and get a short URL with a rich metadata preview</p>

    <form class="form" @submit.prevent="shorten">
      <div class="input-group" :class="{
        'input-error': trimmedInputUrl && isValidUrl === false,
        'input-valid': trimmedInputUrl && isValidUrl === true,
      }">
        <svg class="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="2">
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
        <input v-model="inputUrl" type="url" class="input" placeholder="https://example.com/very/long/url"
          autocomplete="off" spellcheck="false" />
        <button type="submit" class="btn-submit" :disabled="loading || isValidUrl !== true">
          <span v-if="loading" class="spinner" />
          <span v-else>Shorten</span>
        </button>
      </div>

      <p v-if="inputUrl && isValidUrl === false" class="validation-msg">
        Please enter a valid URL
      </p>
    </form>

    <div v-if="error" class="alert">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { urlApi, type UrlResult } from '@/api'
import type { AxiosError } from 'axios'
import isUrl from 'is-url'
import debounce from 'debounce';

const emit = defineEmits<{
  result: [value: UrlResult]
}>()

const inputUrl = ref('')
const trimmedInputUrl = computed(() => inputUrl.value.trim())
const loading = ref(false)
const isValidUrl = ref(true)
const error = ref<string | null>(null)

watch(inputUrl, debounce(() => {
  const trimmedUrl = trimmedInputUrl.value
  isValidUrl.value = isUrl(trimmedUrl)
}, 300), { immediate: true })


async function shorten() {
  error.value = null
  loading.value = true

  try {
    const { data } = await urlApi.shorten({ url: inputUrl.value.trim() })
    emit('result', data)
  } catch (err) {
    const axiosError = err as AxiosError<{ error: string }>
    error.value =
      axiosError.response?.data?.error ||
      'Failed to connect to the server. Is it running?'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
}

.card-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 6px;
}

.card-subtitle {
  color: #94a3b8;
  font-size: 0.875rem;
  margin-bottom: 24px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.07);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-group:focus-within {
  border-color: #a78bfa;
  box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15);
}

.input-group.input-error {
  border-color: #f87171;
}

.input-group.input-valid {
  border-color: #34d399;
}

.input-icon {
  margin-left: 14px;
  color: #64748b;
  flex-shrink: 0;
}

.input {
  flex: 1;
  padding: 14px 12px;
  background: transparent;
  border: none;
  outline: none;
  color: #f1f5f9;
  font-size: 0.95rem;
  min-width: 0;
}

.input::placeholder {
  color: #475569;
}

.btn-submit {
  margin: 6px;
  padding: 10px 22px;
  background: linear-gradient(135deg, #7c3aed, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-submit:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn-submit:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.validation-msg {
  color: #f87171;
  font-size: 0.8rem;
  padding-left: 4px;
}

.alert {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.875rem;
  margin-top: 12px;
  background: rgba(248, 113, 113, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
  }

  .btn-submit {
    padding: 10px 16px;
  }
}
</style>