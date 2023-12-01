<template>
  <div class="overview-top">
    <div class="row">
      <div class="header-question" @click="navigateHome">{{ copy.header_question }}</div>
      <div class="buttons">
        <button @click="copyLink">
          <img src="@/assets/img/copy-link.svg" alt="copy-link" />
        </button>
        <NavigationButton :to="backRoute" class="desktop">Back</NavigationButton>
        <NavigationButton :to="backRoute" class="mobile">
          <img src="@/assets/img/back-arrow.svg" alt="" />
        </NavigationButton>
        <span v-if="linkCopied" class="link-copied-message"> Url copied to clipboard </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '../stores/siteContent'
import NavigationButton from '@/components/NavigationButton.vue'

const linkCopied = ref(false)
const route = useRoute()
const router = useRouter()
const backRoute = computed(() => (route.path === '/map-explore' ? '/crops' : '/'))

const navigateHome = () => router.push('/');

const contentStore = useContentStore()
const { copy } = storeToRefs(contentStore)

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  linkCopied.value = true
  setTimeout(() => {
    linkCopied.value = false
  }, 1200)
}
</script>

<style scoped>
.overview-top {
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-h2);
  font-size: 1.5rem;
  gap: 0.5rem;
  padding: 1rem var(--page-horizontal-margin) 0.375rem var(--page-horizontal-margin);
  background: var(--black-90);
}

.header-question {
  cursor: pointer;
}

.link-copied-message {
  position: absolute;
  bottom: 0;
  transform: translateY(130%) translateX(-90%);
  font-size: 0.75rem;
  font-family: var(--font-family-body);
  font-weight: 500;
  animation: fadeIn 1s;
  white-space: nowrap;
  background: var(--ui-blue);
  box-shadow: var(--shadow);
  color: var(--black);
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  position: relative;
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

  display: flex;
  align-items: center;

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

.mobile {
  display: none;
}

@media only screen and (max-width: 720px) {
  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
  }
  .overview-top {
    font-size: 1rem;
    font-family: var(--font-family-header);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
