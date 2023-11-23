<template>
  <div class="sidebar">
    <div class="crop-selection">
      <select v-model="selectedCrop" class="crop-picker">
        <optgroup v-for="group in availableCropGroups" :key="group" :label="group">

          <option 
            v-for="crop in getCropsByGroup(group)" 
            :key="crop.id" 
            :value="crop.id"
          >
            {{ crop.label }}
          </option>
        </optgroup>
      </select>

      <span> {{ selectedCropInfo.description }}</span>
    </div>

    <div class="crop-fingerprint">crop fingerprint</div>

    <div class="scenarios">
      <CardWrapper
        v-for="scenario in futureScenarios"
        :key="scenario"
        :title="scenario"
        :description="'this is a longer description to test how a longer description looks'"
        :is-active="selectedModel === scenario"
        :handle-click="() => (selectedModel = scenario)"
      >
        <DistributionPlot :scenario="scenario" />
      </CardWrapper>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/filters'
import { useCropInformationStore } from '../stores/cropInformation'
import DistributionPlot from './DistributionPlot.vue'
import CardWrapper from './CardWrapper.vue'

const filtersStore = useFiltersStore()
const cropInformationStore = useCropInformationStore()
const { availableCrops, selectedCrop, availableModels, selectedModel, availableCropGroups } = storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)

const futureScenarios = computed(() => availableModels.value.filter((d) => d.startsWith('future')))

const selectedCropInfo = computed(() => {
  return cropInformation.value.find(d => d.id === selectedCrop.value);
})

const getCropsByGroup = (group) => {
  return cropInformation.value.filter(crop => crop.crop_group === group);
}


</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: var(--page-horizontal-margin);
  padding-right: 2rem;
  padding-bottom: 2rem;
  width: 400px;
}

.crop-selection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.crop-fingerprint {
  width: 100%;
  height: 40%;
  border: 1px solid var(--white);
  border-radius: 0.5rem;
}

.scenarios {
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
</style>
