import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMapExploreStore = defineStore('mapExplore', () => {
  const mapPadding = ref(null)
  const selectedMap = ref('')
  // hovered grid cell id
  const hoveredId = ref(null)
  // hovered crop for crop group
  const hoveredCrop = ref(null)

  const showSandAndSoil = ref(false)

  const showCropGroupMap = ref(false)
  const cropGroupMetric = ref('max')

  return { 
    selectedMap, 
    mapPadding, 
    
    hoveredId, 
    hoveredCrop, 
    
    showSandAndSoil,
    showCropGroupMap, 
    cropGroupMetric 
  }
})
