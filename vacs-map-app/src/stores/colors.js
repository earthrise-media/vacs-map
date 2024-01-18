import * as d3 from 'd3'
import { ref, computed } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useFiltersStore } from '@/stores/filters'

import {
  divergingScheme,
  stopLightScheme,
  fingerprintScheme,
  sandScheme,
  soilScheme,
  colorblindDivergingScheme,
  colorblindStopLightScheme,
  colorblindSandScheme,
  colorblindSoilScheme,
  ordinalScheme,
  colorblindOrdinalScheme,
  noDataFill,
  colorblindNoDataFill,
  selectedFill,
  referenceFill
} from '@/utils/colors'

export const useColorStore = defineStore('colorStore', () => {
  const colorblindFriendly = ref(false)

  const diverging = computed(() =>
    colorblindFriendly.value ? colorblindDivergingScheme : divergingScheme
  )

  const stopLight = computed(() =>
    colorblindFriendly.value ? colorblindStopLightScheme : stopLightScheme
  )

  const sand = computed(() => (colorblindFriendly.value ? colorblindSandScheme : sandScheme))

  const soil = computed(() => (colorblindFriendly.value ? colorblindSoilScheme : soilScheme))

  const fingerprint = computed(() => fingerprintScheme)

  const ordinal = computed(() =>
    colorblindFriendly.value ? colorblindOrdinalScheme : ordinalScheme
  )

  const noData = computed(() => (colorblindFriendly.value ? colorblindNoDataFill : noDataFill))

  const filtersStore = useFiltersStore()
  const cropInformationStore = useCropInformationStore()
  const { selectedCrop } = storeToRefs(filtersStore)
  const { data: cropInfo } = storeToRefs(cropInformationStore)

  const getCropColor = (cropId) => {
    if (!selectedCrop.value || !cropId || !cropInfo.value || cropId === 'none') return noDataFill
    if (cropId === selectedCrop.value) return selectedFill
    const cropObj = cropInfo.value.find((d) => d.id === cropId)
    if (cropObj.benchmark) return referenceFill

    const cropGroupCrops = cropInfo.value.filter((d) => d.crop_group === cropObj.crop_group)
    const scheme = d3
      .scaleOrdinal()
      .domain(cropGroupCrops.map((d) => d.id))
      .range(ordinal.value)

    return scheme(cropId)
  }

  return {
    colorblindFriendly,
    diverging,
    stopLight,
    fingerprint,
    ordinal,
    sand,
    soil,
    noData,

    getCropColor
  }
})
