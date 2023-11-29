<template>
  <div class="map-legend">
    <div class="legend-title">{{ selectedCropInfo?.label }} yield ratio</div>
    <div class="legend-gradient" :style="gradientStyle"></div>
    <div class="legend-ticks">
      <div class="legend-tick">Min</div>
      <div class="legend-tick">0</div>
      <div class="legend-tick">Max</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useFiltersStore } from '@/stores/filters'
import { divergingScheme } from '@/utils/colors'

const cropInformationStore = useCropInformationStore()
const filtersStore = useFiltersStore()
const { selectedCrop } = storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const gradientStyle = {
  background: `linear-gradient(to right, ${divergingScheme.min},
  ${divergingScheme.center}, ${divergingScheme.max})`,
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
  width: 15rem;
}

.legend-title {
  font-weight: 600;
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
</style>
