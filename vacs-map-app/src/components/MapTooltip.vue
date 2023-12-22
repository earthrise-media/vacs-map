<template>
  <TooltipWrapper v-if="hoveredValue">
    {{ sentence }}
  </TooltipWrapper>
</template>

<script setup>
import * as d3 from 'd3'
import { computed } from 'vue'
import TooltipWrapper from '@/components/TooltipWrapper.vue'
import { storeToRefs } from 'pinia'
import { useMapExploreStore } from '@/stores/mapExplore'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useFiltersStore } from '@/stores/filters'
import { useContentStore } from '@/stores/siteContent'
import { useCropInformationStore } from '@/stores/cropInformation'

const filtersStore = useFiltersStore()
const cropYieldsStore = useCropYieldsStore()
const mapExploreStore = useMapExploreStore()
const contentStore = useContentStore()
const cropInformationStore = useCropInformationStore()
const { hoveredId, showCropGroupMap, cropGroupMetric } = storeToRefs(mapExploreStore)
const { data: yieldData } = storeToRefs(cropYieldsStore)
const { selectedCrop, selectedModel } = storeToRefs(filtersStore)
const { copy } = storeToRefs(contentStore)
const { data: cropInfo } = storeToRefs(cropInformationStore)

const sentence = computed(() => {
  const modelDescriptor =
    selectedModel.value === 'future_ssp126'
      ? 'a low emissions scenario'
      : 'a high emissions scenario'

  if (!showCropGroupMap.value) {
    const cropName = selectedCropInfo.value?.label
    const valueDescriptor = hoveredValue.value > 0 ? 'increases' : 'decreases'

    return `In ${modelDescriptor}, ${cropName} ${valueDescriptor} by ${pFormat(
      hoveredValue.value
    )} at this location`
  } else {
    const cropField = cropGroupMetric.value + 'Crop'
    const valueField = cropGroupMetric.value + 'Val'

    const hoveredCropId = hoveredValue.value[cropField]
    const hoveredYieldRatio = hoveredValue.value[valueField]

    const descriptor = cropGroupMetric.value === 'max' ? 'increase' : 'decrease'

    if (hoveredCropId === 'none') {
      return `At this location, no ${selectedCropInfo.value.crop_group} are projected to ${descriptor} in yield`
    }

    const hoveredCropName = cropInfo.value.find((d) => d.id === hoveredCropId).label

    return `Of the ${
      selectedCropInfo.value.crop_group
    }, ${hoveredCropName} is projected to have the greatest yield ${descriptor} (${pFormat(
      hoveredYieldRatio
    )}) at this location, in ${modelDescriptor}`
  }
})

const selectedCropInfo = computed(() => {
  return cropInfo.value?.find((d) => d.id === selectedCrop.value)
})

const hoveredValue = computed(() => {
  if (!yieldData.value || !selectedCrop.value || !selectedModel.value || !hoveredId.value)
    return null

  const columnName = !showCropGroupMap.value
    ? ['yieldratio', selectedCrop.value, selectedModel.value].join('_')
    : [selectedCropInfo.value?.crop_group, selectedModel.value].join('_')

  const cellObject = yieldData.value.find((d) => d.id === hoveredId.value)

  if (!cellObject) return null
  return cellObject[columnName]
})

const pFormat = (value) => {
  return d3.format('.1%')(Math.abs(value))
}
</script>

<style scoped></style>
