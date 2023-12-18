import * as d3 from 'd3'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  divergingScheme,
  stopLightScheme,
  fingerprintScheme,
  colorblindDivergingScheme,
  colorblindStopLightScheme,
  ordinalScheme,
  noDataFill,
} from '@/utils/colors'

export const useColorStore = defineStore('colorStore', () => {
  const colorblindFriendly = ref(false)

  const diverging = computed(() =>
    colorblindFriendly.value ? colorblindDivergingScheme : divergingScheme
  )

  const stopLight = computed(() =>
    colorblindFriendly.value ? colorblindStopLightScheme : stopLightScheme
  )

  const fingerprint = computed(() => fingerprintScheme)

  const ordinal = computed(() => ordinalScheme)

  const noData = computed(() => noDataFill)

  return { colorblindFriendly, diverging, stopLight, fingerprint, ordinal, noData }
})
