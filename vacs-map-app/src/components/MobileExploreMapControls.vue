<template>
  <div class="wrapper">
    <div class="top-row">
      <div class="row-item">
        <span class="item-label"> Crop </span>
        <select v-model="selectedCrop" class="crop-picker interactive">
          <optgroup v-for="group in availableCropGroups" :key="group" :label="group">
            <option v-for="crop in getCropsByGroup(group)" :key="crop.id" :value="crop.id">
              {{ crop.label }}
            </option>
          </optgroup>
        </select>
      </div>

      <div class="row-item">
        <span class="item-label">
          Emissions
          <img
            src="@/assets/img/info.svg"
            alt=""
            class="interactive info"
            @click="openScenariosModal"
          />
        </span>
        <RadioSwitch
          v-model="selectedModel"
          :options="scenarioOptions"
          name="selected-scenario"
          class="interactive"
        />
      </div>
    </div>

    <MapLegend class="interactive" />
    <ContentModal
      v-if="modalOpen"
      @close="() => (modalOpen = false)"
      :title="modalHeader"
      class="interactive"
    >
      <div class="modal-content">
        <div class="section">
          <span> Low emissions scenario (SSP126) </span>
          <p>{{ copy.future_ssp126_long }}</p>
        </div>
        <div class="section">
          <span> High emissions scenario (SSP370) </span>
          <p>{{ copy.future_ssp370_long }}</p>
        </div>
      </div>
    </ContentModal>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useContentStore } from '@/stores/siteContent'
import RadioSwitch from '@/components/RadioSwitch.vue'
import MapLegend from '@/components/MapLegend.vue'
import ContentModal from '@/components/ContentModal.vue'

const contentStore = useContentStore()
const cropInformationStore = useCropInformationStore()
const filtersStore = useFiltersStore()
const { selectedCrop, availableModels, selectedModel, availableCropGroups } =
  storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { copy } = storeToRefs(contentStore)

const modalOpen = ref(false)
const modalHeader = ref('')

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

const openScenariosModal = () => {
  modalOpen.value = true
  modalHeader.value = 'Climate emissions scenarios'
}
</script>

<style scoped>
.wrapper {
  display: none;
  flex-direction: column;
  padding: 0.5rem 1rem 2rem 1rem;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  pointer-events: none;
}

.interactive {
  pointer-events: all;
}

.info {
  cursor: pointer;
}

.info:hover {
  opacity: 0.7;
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content .section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.modal-content span {
  font-weight: 600;
}

.top-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 100%;
  gap: 0.5rem;
}

.row-item {
  flex-grow: 1;
  gap: 0.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.item-label {
  font-size: 0.75rem;
  font-weight: 500;
  vertical-align: middle;
}

select {
  font-family: var(--font-family-header);
  font-size: 0.925rem;
  appearance: none;
  cursor: pointer;
  border-radius: 0.25rem;
  border: 1px solid var(--gray);
  background: var(--dark-gray);
  text-transform: uppercase;
  color: var(--ui-blue);
  padding: 0.375rem;
  padding-right: 1.5rem;
  min-width: none;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  background-image: url('../assets/img/select-arrow-blue.svg');
  background-position: 98% center;
  background-repeat: no-repeat;
}

@media only screen and (max-width: 720px) {
  .wrapper {
    display: flex;
  }
}
</style>
