import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  divergingScheme,
  stopLightScheme,
  fingerprintScheme,
  sandScheme,
  soilScheme,
  colorblindDivergingScheme,
  colorblindStopLightScheme,
  colorblindSandScheme,
  colorblindSoilScheme
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

  return { colorblindFriendly, diverging, stopLight, sand, soil, fingerprint }
})
