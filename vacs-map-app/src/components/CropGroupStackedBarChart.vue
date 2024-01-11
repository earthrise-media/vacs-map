<template>
  <div class="stacked-bar-wrapper">
    <div
      v-for="bar in bars"
      :key="bar.id"
      class="crop-bar"
      :style="{
        width: `${bar.gridShare}%`,
        background: bar.fill
      }"
    />
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
const { ordinal: ordinalScheme, noData: noDataFill } = storeToRefs(colorStore)
const { data: cropYieldsData } = storeToRefs(cropYieldsStore)
const { showCropGroupMap, cropGroupMetric } = storeToRefs(mapExploreStore)

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
      fill: ordinalScheme.value[i],
      gridShare
    }
  })

  const noDataCells = cropGroupCells.filter((d) => d[cropGroupColumn.value] == 'none')

  const noDataGridShare = (noDataCells.length / cropGroupCells.length) * 100

  const noData = {
    id: 'none',
    lable: 'No Data',
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
}

.crop-bar {
  height: 100%;
}
</style>
