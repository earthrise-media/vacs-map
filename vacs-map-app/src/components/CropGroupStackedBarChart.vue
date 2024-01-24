<template>
  <div class="stacked-bar-wrapper">
    <div
      v-for="bar in bars"
      :key="bar.id"
      class="crop-bar"
      :class="{
        unhighlighted:
          (hoveredCrop && hoveredCrop !== bar.id) || (localHovered && localHovered.id !== bar.id)
      }"
      :style="{
        width: `${bar.gridShare}%`,
        background: bar.fill
      }"
      @mouseenter="localHovered = bar"
      @mouseleave="localHovered = null"
    />

    <div v-if="localHovered" class="tooltip">
      {{ localHovered.label }}
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useFiltersStore } from '@/stores/filters'
import { useColorStore } from '@/stores/colors'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useMapExploreStore } from '@/stores/mapExplore'

const cropInformationStore = useCropInformationStore()
const filtersStore = useFiltersStore()
const colorStore = useColorStore()
const cropYieldsStore = useCropYieldsStore()
const mapExploreStore = useMapExploreStore()

const { selectedCrop, selectedModel } = storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { ordinal: ordinalScheme, noData: noDataFill, getCropColor } = storeToRefs(colorStore)
const { data: cropYieldsData } = storeToRefs(cropYieldsStore)
const { showCropGroupMap, cropGroupMetric, hoveredCrop } = storeToRefs(mapExploreStore)

const localHovered = ref(null)

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const cropGroupCrops = computed(() => {
  const groupName = selectedCropInfo.value?.crop_group
  return cropInformation.value?.filter((c) => c.crop_group === groupName)
})

const cropGroupColumn = computed(() => {
  if (!selectedCropInfo.value || !selectedModel.value || !cropGroupMetric.value) {
    return null
  }

  return [
    selectedCropInfo.value.crop_group,
    selectedModel.value,
    cropGroupMetric.value + 'Crop'
  ].join('_')
})

const bars = computed(() => {
  if (!cropGroupColumn.value) return null
  const cropGroupCells = cropYieldsData.value.filter((d) => !!d[cropGroupColumn.value])

  const crops = cropGroupCrops.value.map((crop, i) => {
    const cropCells = cropGroupCells.filter((d) => d[cropGroupColumn.value] === crop.id)

    const gridShare = (cropCells.length / cropGroupCells.length) * 100
    return {
      id: crop.id,
      label: crop.label,
      fill: colorStore.getCropColor(crop.id),
      gridShare
    }
  })

  const noDataCells = cropGroupCells.filter((d) => d[cropGroupColumn.value] == 'none')

  const noDataGridShare = (noDataCells.length / cropGroupCells.length) * 100

  const noData = {
    id: 'none',
    label: 'None',
    fill: noDataFill.value,
    gridShare: noDataGridShare
  }

  return [...crops, noData]
})
</script>

<style scoped>
.stacked-bar-wrapper {
  height: 8rem;
  width: 100%;
  background: var(--black);
  color: var(--white);

  display: flex;
  position: relative;
}

.tooltip {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;

  background: var(--black-90);
  border: 1px solid var(--dark-gray);
  color: var(--white);
  border-radius: 4px;
  padding: 0.125rem 0.375rem;
  font-size: 0.875rem;
}

.crop-bar {
  height: 100%;
}

.unhighlighted {
  opacity: 20%;
}
</style>
