<template>
  <div class="map-legend">
    <div class="legend-title">
      {{ selectedCropInfo?.crop_group }} by largest yield
      <span class="metric" @click="toggleMetric">{{ metric }}</span>
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
import { useMapExploreStore } from '@/stores/mapExplore'
import ContentModal from '@/components/ContentModal.vue'

const contentStore = useContentStore()
const cropInformationStore = useCropInformationStore()
const filtersStore = useFiltersStore()
const colorStore = useColorStore()
const mapExploreStore = useMapExploreStore()

const { selectedCrop } = storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { copy } = storeToRefs(contentStore)
const { ordinal: ordinalScheme, noData: noDataFill } = storeToRefs(colorStore)
const { cropGroupMetric } = storeToRefs(mapExploreStore)

const modalOpen = ref(false)
const modalHeader = ref('')
const modalContent = ref('')

const metric = computed(() => {
  return cropGroupMetric.value === 'max' ? 'increase' : 'decrease'
})

const toggleMetric = () => {
  if (cropGroupMetric.value === 'max') {
    cropGroupMetric.value = 'min'
  } else {
    cropGroupMetric.value = 'max'
  }
}

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const cropGroupCrops = computed(() => {
  const groupName = selectedCropInfo.value?.crop_group
  return cropInformation.value?.filter((c) => c.crop_group === groupName)
})

const openCropGroupModal = () => {
  modalOpen.value = true
  modalHeader.value = 'How do I read this map?'
  modalContent.value = copy.value['crop_group_map']
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
  width: 22rem;
  margin-top: auto;
}

.legend-title {
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-bottom: 0.25rem;
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
  gap: 0.5rem;
}

.crop {
  display: flex;
  padding: 0.125rem 0.5rem;
  gap: 0.25rem;
  align-items: center;
  border: 1px solid var(--gray);
  border-radius: 6.25rem;

  font-size: 0.6875rem;
}

.metric {
  display: flex;
  padding: 0 0.25rem;
  align-items: center;
  cursor: pointer;
  border-radius: 0.125rem;
  background: var(--dark-gray);
  font-weight: 600;
}

.metric:hover {
  background: var(--dark-gray-hover);
}

.crop-indicator {
  width: 0.625rem;
  height: 0.625rem;
  aspect-ratio: 1/1;
  border-radius: 100%;
}

@media only screen and (max-width: 720px) {
  .map-legend {
    width: 100%;
  }
}
</style>
