<template>
  <LayoutOpen>
    <div class="video-wrapper">
      <video autoplay loop muted>
        <source src="@/assets/img/homepage-video.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="callout">
      <div class="callout-header">{{ copy.header_question }}</div>
      <div class="callout-content">
        <span>
          {{ copy.vacs_short + ' ' }}
        </span>
        <span class="keep-reading" @click="openModal">Keep reading</span>
      </div>
      <button class="go-to-topic" @click="navigate">Find out</button>
    </div>

    <div class="logos-row">[logos go here]</div>

    <ContentModal v-if="modalOpen" @close="() => (modalOpen = false)" :title="modalHeader">
      <div class="modal-content">
        {{ modalContent }}
      </div>
      <div class="vacs-link">
        <a href="https://www.state.gov/the-vision-for-adapted-crops-and-soils/" target="_blank">
          Learn more about VACS >
        </a>
      </div>
    </ContentModal>
  </LayoutOpen>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '@/stores/siteContent'
import LayoutOpen from '@/components/layouts/LayoutOpen.vue'
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
.video-wrapper {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background: var(--black);
  justify-content: space-between;
}

video {
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
  height: 100vh;
}

.logos-row {
  position: absolute;
  bottom: 0;
  width: 100vw;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  height: 4rem;
  color: var(--white);
  background: var(--black-80);
}

.callout {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 60%;
  padding: 2.5rem;
  flex-basis: 0;
  flex-grow: 1;
  gap: 2rem;
  text-align: center;

  background: var(--black-80);
  border-radius: 0.5rem;
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

.keep-reading,
.vacs-link a {
  cursor: pointer;
  color: var(--ui-blue);
  text-decoration: underline;
  white-space: nowrap;
}

.keep-reading:hover,
.vacs-link a:hover {
  color: var(--ui-blue-hover);
}

.vacs-link {
  margin-left: auto;
}

@media only screen and (max-width: 1080px) {
  .callout-header {
    font-size: 2rem;
  }
  .callout-content {
    font-size: 0.875rem;
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
    max-width: 90%;
    width: 95%;
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
