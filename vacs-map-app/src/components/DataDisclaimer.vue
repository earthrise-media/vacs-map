<template>
  <div class="disclaimer-wrapper">
    <span class="disclaimer">
      {{ copy.dataDisclaimer }}
    </span>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useContentStore } from '@/stores/siteContent'

const contentStore = useContentStore()
const { copy } = storeToRefs(contentStore)
</script>

<style scoped>
.disclaimer-wrapper {
  width: 100%;
  background: var(--black-80);
  display: flex;
  padding: 0.3rem 2rem;
}

.disclaimer {
  color: var(--gray);
  font-size: 0.75rem;
  line-height: 120%;
}
</style>
