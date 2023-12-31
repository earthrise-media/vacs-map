import * as d3 from 'd3'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDataUrl } from '@/constants/data-load'

export const useAfricanUnionRegionsStore = defineStore('africanUnionRegions', () => {
  const data = ref(null)
  const loading = ref(false)

  const bboxes = ref(null)
  const loadingBboxes = ref(false)

  const load = async () => {
    if (loading.value || data.value) return false
    loading.value = true

    const response = await fetch(getDataUrl('african-union-regions.geojson'))
    let geojson = await response.json()

    geojson = {
      ...geojson,
      features: geojson.features.map((f, i) => ({
        ...f,
        id: i
      }))
    }

    data.value = Object.freeze(geojson)
    loading.value = false
  }

  const loadBboxes = async () => {
    if (loadingBboxes.value || bboxes.value) return false
    loadingBboxes.value = true

    const response = await fetch(getDataUrl('african-union-regions-bboxes.geojson'))
    const geojson = await response.json()

    bboxes.value = Object.freeze(geojson)
    loadingBboxes.value = false
  }

  return {
    data,
    loading,
    load,
    bboxes,
    loadingBboxes,
    loadBboxes
  }
})
