<template>
  <div class="overview-top">
    <div class="row">
      <div> {{ copy.header_question }}</div>
      <div class="buttons">
        <button @click="copyLink" title="Copy URL">
          <img src="@/assets/img/copy-link.svg" alt="copy-link">
        </button>
        <NavigationButton :to="backRoute">Back</NavigationButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/siteContent'
import NavigationButton from '@/components/NavigationButton.vue'

const route = useRoute()
const backRoute = computed(() => (route.path === '/map-explore' ? '/crops' : '/'))

const contentStore = useContentStore()
const {
  copy
} = storeToRefs(contentStore)

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href);
}
</script>

<style scoped>
.overview-top {
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-h2);
  font-size: 1.875rem;
  gap: 0.5rem;
  margin: 1rem var(--page-horizontal-margin);
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

button {
  appearance: none;
  border: none;
  text-decoration: none;

  padding: 0.625rem 0.75rem;
  border-radius: 100%;
  background: var(--dark-gray);
  display: flex;
  aspect-ratio: 1/1;

  cursor: pointer;
}

button:hover {
  background: var(--dark-gray-hover);
}

</style>
