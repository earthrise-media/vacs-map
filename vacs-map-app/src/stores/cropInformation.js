import * as d3 from 'd3'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDataUrl } from '@/constants/data-load'

export const useCropInformationStore = defineStore('cropInformation', () => {
  const data = ref(null)
  const loading = ref(false)

  const load = async () => {
    if (loading.value || data.value) return false
    loading.value = true

    let general = await d3.csv(getDataUrl('crop-info-general.csv'), d3.autoType)
    let genetic = await d3.csv(getDataUrl('crop-info-genetic.csv'), d3.autoType)
    let nutritional = await d3.csv(getDataUrl('crop-info-nutritional.csv'), d3.autoType)
    let biophysical = await d3.csv(getDataUrl('crop-info-biophysical.csv'), d3.autoType)
    let regional = await d3.csv(getDataUrl('crop-info-regional-potential.csv'), d3.autoType)

    const getIndicators = (array, id) => {
      return Object.fromEntries(Object.entries(array.find((d) => d.id === id)).slice(1))
    }

    general = general.map((d) => {
      const indicators = {
        genetic: getIndicators(genetic, d.id),
        nutritional: getIndicators(nutritional, d.id),
        biophysical: getIndicators(biophysical, d.id)
      }

      const regionalPotential = Object.fromEntries(
        Object.entries(regional.find(c => c.id === d.id)).slice(1)
      )
      
      return {
        ...d,
        indicators,
        regionalPotential
      }
    })
    data.value = Object.freeze(general)
  }

  return {
    data,
    loading,
    load
  }
})
