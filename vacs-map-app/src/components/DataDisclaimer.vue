<template>
  <div class="disclaimer-wrapper">
    <span class="disclaimer full">
      {{ copy.dataDisclaimer }}
    </span>
    <span class="disclaimer short">
      {{ copy.shortDataDisclaimer }}
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
  display: flex;
  padding: 0.3rem 2rem;
  margin-bottom: 0.2rem;
}

.disclaimer {
  color: var(--gray);
  font-size: 0.75rem;
  line-height: 120%;
}
/* Initially hide the short disclaimer */
.disclaimer.short {
  display: none;
}

@media (max-width: 768px) {
  /* Hide the full disclaimer */
  .disclaimer.full {
    display: none;
  }
  /* Show the short disclaimer */
  .disclaimer.short {
    display: block;
  }
}
</style>
