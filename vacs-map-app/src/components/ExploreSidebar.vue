<template>
  <div class="sidebar">
    <div class="sidebar-section">
      <div class="crop-selection">
        <select v-model="selectedCrop" class="crop-picker">
          <optgroup v-for="group in availableCropGroups" :key="group" :label="group">
            <option v-for="crop in getCropsByGroup(group)" :key="crop.id" :value="crop.id">
              {{ crop.label }}
            </option>
          </optgroup>
        </select>
        <span class="crop-description"> {{ selectedCropInfo?.description }}</span>
      </div>
    </div>

    <div class="sidebar-section grow">
      <span class="sidebar-header"> What are {{ selectedCropInfo?.label }}'s characteristics?</span>
      <div class="crop-fingerprint">
        <CropFingerprint :crop-id="selectedCrop" />
      </div>
    </div>

    <div class="sidebar-section">
      <div class="scenarios">
        <span class="sidebar-header">
          How will climate change affect {{ selectedCropInfo?.label }}?</span
        >
        <CardWrapper
          v-for="scenario in futureScenarios"
          :key="scenario"
          :title="copy[`${scenario}_label`]"
          :description="copy[`${scenario}_short`]"
          :is-active="selectedModel === scenario"
          :handle-click="() => (selectedModel = scenario)"
          :show-more-info="true"
          @show-info="() => openModal(scenario)"
        >
          <DistributionPlot :scenario="scenario" />
        </CardWrapper>
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
import { useFiltersStore } from '@/stores/filters'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useContentStore } from '../stores/siteContent'
import DistributionPlot from '@/components/DistributionPlot.vue'
import CropFingerprint from '@/components/CropFingerprint.vue'
import CardWrapper from '@/components/CardWrapper.vue'
import ContentModal from '@/components/ContentModal.vue'

const contentStore = useContentStore()
const filtersStore = useFiltersStore()
const cropInformationStore = useCropInformationStore()
const { availableCrops, selectedCrop, availableModels, selectedModel, availableCropGroups } =
  storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { copy } = storeToRefs(contentStore)

const modalOpen = ref(false)
const modalHeader = ref('')
const modalContent = ref('')

const futureScenarios = computed(() => availableModels.value.filter((d) => d.startsWith('future')))

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const getCropsByGroup = (group) => {
  return cropInformation?.value?.filter((crop) => crop.crop_group === group)
}

const openModal = (s) => {
  modalOpen.value = true
  modalHeader.value = copy.value[`${s}_label`] + ' scenario' + ` (${s.split('_')[1].toUpperCase()})`
  modalContent.value = copy.value[`${s}_long`]
}
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  height: 100%;
  margin-left: var(--page-horizontal-margin);
  padding: 1.25rem;
  width: 440px;
  border: 1px solid var(--dark-gray);
  border-radius: 1rem;
  background: var(--black-90);

  overflow-y: auto;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-header {
  font-size: 1rem;
  font-weight: 600;
  line-height: 120%;
}

.grow {
  flex-grow: 1;
}

.crop-selection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.crop-description {
  font-size: 0.875rem;
  line-height: 140%;
}

.crop-selection select {
  appearance: none;
  cursor: pointer;
  border: none;
  background: none;
  border-bottom: 1px solid var(--gray);
  font-family: var(--font-family-header);
  font-size: 1.75rem;
  color: var(--white);
  padding: 0.5rem;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  background-image: url('../assets/img/select-arrow-blue.svg');
  background-size: 1rem;
  background-position: 98% center;
  background-repeat: no-repeat;

  outline: none !important;
}

.crop-selection optgroup {
  color: var(--black) !important;
  font-size: 1.25rem !important;
}
.crop-selection option {
  color: var(--black) !important;
  font-size: 1rem !important;
}

.crop-fingerprint {
  flex-grow: 1;
  width: 100%;
}

.scenarios {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
