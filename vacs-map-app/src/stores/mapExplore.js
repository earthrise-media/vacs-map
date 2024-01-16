import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMapExploreStore = defineStore('mapExplore', () => {
  const selectedMap = ref('')
  const hoveredId = ref(null)
  const mapPadding = ref(null)

  const showSandAndSoil = ref(false)

  return { selectedMap, mapPadding, hoveredId, showSandAndSoil }
})
