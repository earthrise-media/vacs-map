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
      <span class="sidebar-header">
        What are {{ selectedCropInfo?.label }}'s characteristics?
        <img
          class="info"
          src="@/assets/img/info.svg"
          alt=""
          @click="openChartModal('fingerprint')"
        />
      </span>
      <div class="crop-fingerprint">
        <CropFingerprint :crop-id="selectedCrop" />
      </div>
    </div>

    <div class="sidebar-section">
      <div class="scenario-switch">
        <div class="scenario-title">
          <span class="scenarios-title"> emissions scenario </span>
          <img
            class="info"
            src="@/assets/img/info.svg"
            alt=""
            @click="openScenarioModal(selectedModel)"
          />
        </div>

        <RadioSwitch
          v-model="selectedModel"
          :options="scenarioOptions"
          name="selected-scenario"
          :grow="true"
        />
      </div>
    </div>

    <div class="sidebar-section">
      <span class="sidebar-header"> How will {{ selectedCropInfo?.label }} yields change? </span>

      <div class="map-mode-cards">
        <CardWrapper
          :title="`${selectedCropInfo?.label} in 2050`"
          subtitle="compared to 2010"
          :is-dynamic="true"
          :is-active="!showCropGroupMap"
          :handle-click="
            () => {
              showCropGroupMap = false
            }
          "
          @show-info="() => openScenarioModal(selectedModel)"
        >
          <DistributionPlot :scenario="selectedModel" />
        </CardWrapper>

        <CardWrapper
          :title="`${selectedCropInfo?.label} vs. other ${selectedCropInfo?.crop_group}`"
          :is-dynamic="true"
          :is-active="showCropGroupMap"
          :handle-click="
            () => {
              showCropGroupMap = true
            }
          "
        >
          <CropGroupStackedBarChart />
        </CardWrapper>
      </div>
    </div>

    <SandAndSoilOverlay v-if="showSandAndSoil" />

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
import { useContentStore } from '@/stores/siteContent'
import { useMapExploreStore } from '@/stores/mapExplore'
import DistributionPlot from '@/components/DistributionPlot.vue'
import CropFingerprint from '@/components/CropFingerprint.vue'
import CardWrapper from '@/components/CardWrapper.vue'
import ContentModal from '@/components/ContentModal.vue'
import SandAndSoilOverlay from '@/components/SandAndSoilOverlay.vue'
import RadioSwitch from '@/components/RadioSwitch.vue'
import CropGroupStackedBarChart from '@/components/CropGroupStackedBarChart.vue'

const contentStore = useContentStore()
const filtersStore = useFiltersStore()
const cropInformationStore = useCropInformationStore()
const mapExploreStore = useMapExploreStore()

const { availableCrops, selectedCrop, availableModels, selectedModel, availableCropGroups } =
  storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { copy } = storeToRefs(contentStore)
const { showCropGroupMap, cropGroupMetric, showSandAndSoil } = storeToRefs(mapExploreStore)

const modalOpen = ref(false)
const modalHeader = ref('')
const modalContent = ref('')

const futureScenarios = computed(() => availableModels.value.filter((d) => d.startsWith('future')))

const scenarioOptions = computed(() => {
  return futureScenarios?.value?.map((s, i) => {
    return {
      value: s,
      label: i ? 'High' : 'Low'
    }
  })
})

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const getCropsByGroup = (group) => {
  return cropInformation?.value?.filter((crop) => crop.crop_group === group)
}

const openChartModal = (chartType) => {
  modalOpen.value = true
  modalHeader.value = 'How do I interpret this chart?'
  modalContent.value = copy.value[chartType + '_chart']
}

const openScenarioModal = (s) => {
  modalOpen.value = true
  modalHeader.value = copy.value[`${s}_label`] + ' scenario' + ` (${s.split('_')[1].toUpperCase()})`
  modalContent.value = copy.value[`${s}_long`]
}
</script>

<style scoped>
.sidebar {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: space-between;
  height: 100%;
  max-height: 50rem;
  padding: 1.25rem;
  width: 465px;
  border: 1px solid var(--dark-gray);
  border-radius: 1rem;
  background: var(--black-90);

  overflow-y: auto;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.sidebar-header {
  font-size: 0.925rem;
  font-weight: 600;
  line-height: 120%;
}

.info {
  vertical-align: top;
  cursor: pointer;
}

.info:hover {
  opacity: 0.7;
}

.grow {
  flex-grow: 1;
}

.shrink {
  flex-shrink: 1;
}

.scenario-switch {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.scenarios-title {
  font-size: 0.875rem;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 1.05rem */
  text-transform: uppercase;
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
  font-size: 1.5rem;
  color: var(--white);
  padding: 0.5rem 0;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  background-image: url('../assets/img/select-arrow-blue.svg');
  background-size: 1rem;
  background-position: 100% center;
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

.map-mode-cards {
  width: 100%;
  flex-shrink: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 0.5rem;
}

.scenario-title {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;
}
</style>
