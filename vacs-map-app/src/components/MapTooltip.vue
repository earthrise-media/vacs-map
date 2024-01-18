<template>
  <TooltipWrapper v-if="hoveredValue || (hoveredCropId && showCropGroupMap)">
    <div class="tooltip-indicator">
      <span
        v-if="showCropGroupMap"
        class="indicator"
        :style="{
          background: colorStore?.getCropColor(hoveredCropId)
        }"
      />
      <img v-else-if="hoveredValue > 0" src="../assets/img/positive-yield.svg" alt="" />
      <img v-else src="../assets/img/negative-yield.svg" alt="" />
      <span class="title">
        {{ showCropGroupMap ? hoveredCropName : pFormat(hoveredValue) }}
      </span>
    </div>
    <span class="sentence">
      {{ sentence }}
    </span>
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
import { useColorStore } from '@/stores/colors'
import { useCropInformationStore } from '@/stores/cropInformation'

const filtersStore = useFiltersStore()
const cropYieldsStore = useCropYieldsStore()
const mapExploreStore = useMapExploreStore()
const contentStore = useContentStore()
const cropInformationStore = useCropInformationStore()
const colorStore = useColorStore()

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
    const valueDescriptor = hoveredValue.value > 0 ? 'increase' : 'decrease'

    return `${cropName} yields ${valueDescriptor} by ${pFormat(
      hoveredValue.value
    )} in ${modelDescriptor}`
  } else {
    const descriptor = cropGroupMetric.value === 'max' ? 'increase' : 'decrease'

    if (hoveredCropId.value === 'none') {
      return `At this location, no ${selectedCropInfo.value.crop_group} are projected to ${descriptor} in yield`
    }

    return `Of the ${selectedCropInfo.value.crop_group}, ${
      hoveredCropName.value
    } is projected to have the greatest yield ${descriptor} (${pFormat(
      hoveredValue.value
    )}) at this location, in ${modelDescriptor}`
  }
})

const hoveredCropName = computed(() => {
  if (hoveredCropId.value === 'none') return 'None'
  return cropInfo.value?.find((d) => d.id === hoveredCropId.value)?.label
})

const selectedCropInfo = computed(() => {
  return cropInfo.value?.find((d) => d.id === selectedCrop.value)
})

const hoveredCropId = computed(() => {
  if (
    !yieldData.value ||
    !selectedCrop.value ||
    !selectedModel.value ||
    !hoveredId.value ||
    !cropGroupMetric.value
  )
    return null

  const cellObject = yieldData.value.find((d) => d.id === hoveredId.value)

  if (!cellObject) return null
  return cellObject[
    [selectedCropInfo.value?.crop_group, selectedModel.value, cropGroupMetric.value + 'Crop'].join(
      '_'
    )
  ]
})

const hoveredValue = computed(() => {
  if (
    !yieldData.value ||
    !selectedCrop.value ||
    !selectedModel.value ||
    !hoveredId.value ||
    !cropGroupMetric.value
  )
    return null

  const columnName = !showCropGroupMap.value
    ? ['yieldratio', selectedCrop.value, selectedModel.value].join('_')
    : [selectedCropInfo.value?.crop_group, selectedModel.value, cropGroupMetric.value + 'Val'].join(
        '_'
      )

  const cellObject = yieldData.value.find((d) => d.id === hoveredId.value)

  if (!cellObject) return null
  return cellObject[columnName]
})

const pFormat = (value) => {
  return d3.format('.1%')(Math.abs(value))
}
</script>

<style scoped>
.tooltip-indicator {
  display: flex;
  flex-direction: row;
  gap: 0.25rem;
  align-items: center;
}

.indicator {
  width: 0.625rem;
  height: 0.625rem;
  aspect-ratio: 1/1;
  border-radius: 100%;
}
.title {
  color: var(--white);
  font-size: 0.875rem;
  font-weight: 700;
}

.sentence {
  color: var(--gray);
}
</style>
