import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMapExploreStore = defineStore('mapExplore', () => {
  const selectedMap = ref('')
  const hoveredId = ref(null)

  return { selectedMap, hoveredId }
})
