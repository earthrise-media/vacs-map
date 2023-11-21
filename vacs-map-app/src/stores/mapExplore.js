import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMapExploreStore = defineStore('mapExplore', () => {
  const selectedMap = ref('')
  return { selectedMap }
})
