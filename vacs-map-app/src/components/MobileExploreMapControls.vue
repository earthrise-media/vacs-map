<template>
  <div class="wrapper">
    <div class="top-row">
      <div class="row-item">
        <span class="item-label"> Crop </span>
        <select v-model="selectedCrop" class="crop-picker">
          <optgroup v-for="group in availableCropGroups" :key="group" :label="group">
            <option v-for="crop in getCropsByGroup(group)" :key="crop.id" :value="crop.id">
              {{ crop.label }}
            </option>
          </optgroup>
        </select>
      </div>

      <div class="row-item">
        <span class="item-label"> Emissions </span>
        <RadioSwitch v-model="selectedModel" :options="scenarioOptions" name="selected-scenario" />
      </div>
    </div>

    <!-- TODO: add map color legend -->
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useCropInformationStore } from '@/stores/cropInformation'
import RadioSwitch from '@/components/RadioSwitch.vue'

const cropInformationStore = useCropInformationStore()
const filtersStore = useFiltersStore()
const { selectedCrop, availableModels, selectedModel, availableCropGroups } =
  storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)

const getCropsByGroup = (group) => {
  return cropInformation?.value?.filter((crop) => crop.crop_group === group)
}

const futureScenarios = computed(() => {
  return availableModels?.value?.filter((d) => d.startsWith('future'))
})

const scenarioOptions = computed(() => {
  return futureScenarios?.value?.map((s, i) => {
    return {
      value: s,
      label: i ? 'High' : 'Low'
    }
  })
})
</script>

<style scoped>
.wrapper {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  flex-direction: column;
  padding: 0 1rem;
  width: 100%;
}

.top-row {
  display: flex;
  width: 100%;
  gap: 1rem;
}

.row-item {
  flex-grow: 1;
  gap: 0.25rem;
  display: flex;
  flex-direction: column;
}

.item-label {
  font-size: 0.75rem;
  font-weight: 500;
}

select {
  font-family: var(--font-family-header);
  font-size: 0.75rem;
  appearance: none;
  cursor: pointer;
  border-radius: 0.25rem;
  border: 1px solid var(--gray);
  background: var(--dark-gray);
  text-transform: uppercase;
  color: var(--ui-blue);
  padding: 0.5rem;
  padding-right: 2rem;

  background-image: url('../assets/img/select-arrow-blue.svg');
  background-position: 95% center;
  background-repeat: no-repeat;
}

@media only screen and (max-width: 720px) {
  .wrapper {
    display: flex;
  }
}
</style>
