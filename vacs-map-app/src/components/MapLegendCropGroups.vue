<template>
  <div class="map-legend">
    <div class="legend-title">
      {{ selectedCropInfo?.crop_group }}
      <img src="@/assets/img/info.svg" alt="" @click="openCropGroupModal" />
    </div>
    <div class="legend-items">
      <div v-for="(crop, i) in cropGroupCrops" :key="crop.id" class="crop">
        <div class="crop-indicator" :style="{ background: ordinalScheme[i] }"></div>
        <div class="crop-label">{{ crop.label }}</div>
      </div>
      <div class="crop">
        <div class="crop-indicator" :style="{ background: noDataFill }"></div>
        <div class="crop-label">None</div>
      </div>
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
const { ordinal: ordinalScheme, noData: noDataFill } = storeToRefs(colorStore)

const modalOpen = ref(false)
const modalHeader = ref('')
const modalContent = ref('')

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const cropGroupCrops = computed(() => {
  const groupName = selectedCropInfo.value?.crop_group
  return cropInformation.value?.filter((c) => c.crop_group === groupName)
})

const openCropGroupModal = () => {
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

.legend-items {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  column-gap: 0.75rem;
}

.crop {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

.crop-indicator {
  width: 1rem;
  height: 1rem;
  aspect-ratio: 1/1;
  border-radius: 100%;
}

@media only screen and (max-width: 720px) {
  .map-legend {
    width: 100%;
  }
}
</style>
