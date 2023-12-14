import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  divergingScheme,
  stopLightScheme,
  fingerprintScheme,
  colorblindDivergingScheme,
  colorblindStopLightScheme
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

  return { colorblindFriendly, diverging, stopLight, fingerprint }
})
