<template>
  <LayoutOpen>
    <div class="map-wrapper-row">
      <div class="callout">
        <div class="callout-header">{{ copy.header_question }}</div>
        <div class="callout-content">
          <p>
          {{ copy.vacs_short }}
          </p>
          <p class="keep-reading" @click="openModal">Keep reading</p>
        </div>
        <button class="go-to-topic" @click="navigate">Find out</button>
      </div>
      <div class="map-wrapper">
        <MapHomepage />
      </div>
    </div>

    <ContentModal v-if="modalOpen" @close="() => (modalOpen = false)" :title="modalHeader">
      <p class="modal-content">
        {{ modalContent }}
        <span class="vacs-link">
          <a href="https://www.state.gov/the-vision-for-adapted-crops-and-soils/" target="_blank"> 
            Learn more about VACS >
          </a>
        </span>
      </p>
      
    </ContentModal>
  </LayoutOpen>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '@/stores/siteContent'
import LayoutOpen from '@/components/layouts/LayoutOpen.vue'
import MapHomepage from '@/components/MapHomepage.vue'
import ContentModal from '@/components/ContentModal.vue'

const router = useRouter()
const navigate = () => router.push('/crops')

const modalOpen = ref(false)
const modalHeader = ref('')
const modalContent = ref('')

const contentStore = useContentStore()
const { copy } = storeToRefs(contentStore)

const openModal = () => {
  modalOpen.value = true
  modalHeader.value = 'What is VACS?'
  modalContent.value = copy.value.vacs_long
}
</script>

<style scoped>
.map-wrapper-row {
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: space-between;
}

.map-wrapper {
  display: flex;
  flex-direction: column;
  width: 55%;
  justify-content: center;
}

.callout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 2rem 0 6rem;
  flex-basis: 0;
  flex-grow: 1;
  gap: 2rem;
}

.callout-header {
  font-family: var(--font-family-header);

  font-size: 2.875rem;
  line-height: 120%;
}

.callout-content {
  font-size: 0.9375rem;
}

button {
  border: none;
  appearance: none;
  border-radius: 6.25rem;
  background: var(--ui-blue);

  color: var(--black);
  font-family: Work Sans;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  padding: 0.75rem 1.125rem;

  cursor: pointer;
}

button:hover {
  background: var(--ui-blue-hover);
}

.keep-reading, .vacs-link a {
  cursor: pointer;
  color: var(--ui-blue);
  text-decoration: underline;
}

.keep-reading:hover, .vacs-link a:hover {
  color: var(--ui-blue-hover);
}

@media only screen and (max-width: 1080px) {
  .callout-header {
    font-size: 2rem;
  }
  .callout-content {
    font-size: 0.875rem;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 8;
    overflow-y: hidden;
    text-overflow: ellipsis;
  }

  button {
    font-size: 0.875rem;
  }
}

@media only screen and (max-width: 720px) {
  .map-wrapper-row {
    flex-direction: column-reverse;
  }

  .map-wrapper {
    width: 100%;
  }

  .callout {
    padding: 1rem;
  }

  .callout-header {
    font-size: 1.375rem;
    line-height: 120%;
  }
  .callout-content {
    font-size: 0.875rem;
  }

  button {
    width: 100%;
    font-size: 1rem;
  }
}
</style>
