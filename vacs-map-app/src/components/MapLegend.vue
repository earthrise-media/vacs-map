<template>
  <div class="map-legend">
    <div class="legend-title">
      {{ selectedCropInfo?.label }} yield ratio
      <img src="@/assets/img/info.svg" alt="" @click="openYieldRatioModal" />
    </div>
    <div class="legend-gradient" :style="gradientStyle"></div>
    <div class="legend-ticks">
      <div class="legend-tick">↓%</div>
      <div class="legend-tick">No change</div>
      <div class="legend-tick">↑%</div>
    </div>

    <ContentModal v-if="modalOpen" @close="() => (modalOpen = false)" :title="modalHeader">
      <p class="modal-content">
        {{ modalContent }}
      </p>
    </ContentModal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useFiltersStore } from '@/stores/filters'
import { useContentStore } from '@/stores/siteContent'
import { useColorStore } from '@/stores/colors'
import ContentModal from '@/components/ContentModal.vue'

const contentStore = useContentStore()
const cropInformationStore = useCropInformationStore()
const filtersStore = useFiltersStore()
const colorStore = useColorStore()
const { selectedCrop } = storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { copy } = storeToRefs(contentStore)
const { diverging: divergingScheme } = storeToRefs(colorStore)

const modalOpen = ref(false)
const modalHeader = ref('')
const modalContent = ref('')

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const gradientStyle = computed(() => {
  return {
    background: `linear-gradient(to right, ${divergingScheme.value.min},
  ${divergingScheme.value.center}, ${divergingScheme.value.max})`
  }
})

const openYieldRatioModal = () => {
  modalOpen.value = true
  modalHeader.value = 'What is yield ratio?'
  modalContent.value = copy.value['yield_ratio']
}
</script>

<style scoped>
.map-legend {
  background: var(--black-90);
  border: 1px solid var(--dark-gray);
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 18rem;
  margin-top: auto;
}

.legend-title {
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.legend-title img {
  cursor: pointer;
}

.legend-title img:hover {
  opacity: 70%;
}

.legend-gradient {
  height: 1rem;
}

.legend-ticks {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.legend-tick {
  font-size: 0.8em;
  text-align: center;
}

.legend-tick:first-of-type {
  text-align: left;
}

.legend-tick:last-of-type {
  text-align: right;
}

@media only screen and (max-width: 720px) {
  .map-legend {
    width: 100%;
  }
}
</style>
