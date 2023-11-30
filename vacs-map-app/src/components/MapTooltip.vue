<template>
  <TooltipWrapper v-if="hoveredId">
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
const { hoveredId } = storeToRefs(mapExploreStore)
const { data: yieldData } = storeToRefs(cropYieldsStore)
const { selectedCrop, selectedModel } = storeToRefs(filtersStore)
const { copy } = storeToRefs(contentStore)
const { data: cropInfo } = storeToRefs(cropInformationStore)

const sentence = computed(() => {
  const cropName = cropInfo.value?.find((d) => d.id === selectedCrop.value)?.label
  const modelDescriptor =
    selectedModel.value === 'future_ssp126'
      ? 'a low emissions scenario'
      : 'a high emissions scenario'

  const valueDescriptor = hoveredValue.value > 0 ? 'increases' : 'decreases'

  return `In ${modelDescriptor}, ${cropName} ${valueDescriptor} by ${pFormat(hoveredValue.value)} at this location`
})

const hoveredValue = computed(() => {
  if (!yieldData.value || !selectedCrop.value || !selectedModel.value || !hoveredId.value) return ''

  const columnName = `yieldratio_${selectedCrop.value}_${selectedModel.value}`
  const cellObject = yieldData.value.find((d) => d.id === hoveredId.value)

  if (!cellObject) return ''
  return cellObject[columnName]
})

const pFormat = (value) => {
  return d3.format('.1%')(Math.abs(value))
}

</script>

<style scoped></style>
