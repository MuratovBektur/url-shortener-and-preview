<script setup lang="ts">
import { ref, computed } from 'vue'
import type { UrlResult } from '@/api'

const props = defineProps<{ result: UrlResult }>()

const copied = ref(false)

const hostname = computed(() => {
  try {
    return new URL(props.result.originalUrl).hostname
  } catch {
    return props.result.originalUrl
  }
})

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

async function copyToClipboard() {
  await navigator.clipboard.writeText(props.result.shortUrl)
  copied.value = true
  setTimeout(() => (copied.value = false), 2000)
}
</script>

<template>
  <div class="card">
    <!-- Short URL -->
    <div class="url-row">
      <span class="url-label">Your short link</span>
      <div class="url-copy">
        <a :href="result.shortUrl" target="_blank" rel="noopener" class="short-link">
          {{ result.shortUrl }}
        </a>
        <button class="btn-copy" :class="{ copied }" @click="copyToClipboard">
          <svg v-if="!copied" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          {{ copied ? 'Copied!' : 'Copy' }}
        </button>
      </div>
    </div>

    <div class="divider" />

    <!-- OG Preview -->
    <div class="preview-section">
      <div class="preview-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M3 9h18M9 21V9" />
        </svg>
        Page preview
      </div>

      <div class="og-card">
        <div v-if="result.imageUrl" class="og-image-wrap">
          <img :src="result.imageUrl" :alt="result.title ?? 'Preview image'" class="og-image"
            @error="($event.target as HTMLImageElement).style.display = 'none'" />
        </div>

        <div class="og-content">
          <p class="og-domain">{{ hostname }}</p>
          <h3 class="og-title">{{ result.title ?? 'No title found' }}</h3>
          <p v-if="result.description" class="og-description">{{ result.description }}</p>
        </div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-row">

      <div class="stat">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Created {{ formatDate(result.createdAt) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 28px;
}

.url-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.url-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.url-copy {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.short-link {
  font-size: 1.1rem;
  font-weight: 600;
  color: #a78bfa;
  text-decoration: none;
  word-break: break-all;
}

.short-link:hover {
  text-decoration: underline;
}

.btn-copy {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: rgba(167, 139, 250, 0.1);
  border: 1px solid rgba(167, 139, 250, 0.3);
  color: #a78bfa;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-copy:hover {
  background: rgba(167, 139, 250, 0.2);
}

.btn-copy.copied {
  color: #34d399;
  border-color: rgba(52, 211, 153, 0.3);
  background: rgba(52, 211, 153, 0.1);
}

.divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 20px 0;
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #64748b;
}

.og-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}

.og-image-wrap {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.og-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.og-content {
  padding: 16px 18px;
}

.og-domain {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}

.og-title {
  font-size: 1rem;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 8px;
  line-height: 1.4;
}

.og-description {
  font-size: 0.875rem;
  color: #94a3b8;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.stats-row {
  display: flex;
  gap: 20px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #64748b;
}

.stat svg {
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
  }
}
</style>