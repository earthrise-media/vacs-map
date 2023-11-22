import * as d3 from 'd3'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDataUrl } from '@/constants/data-load'

export const useGridStore = defineStore('grid', () => {
  const data = ref(null)
  const loading = ref(false)

  const load = async () => {
    if (loading.value || data.value) return false
    loading.value = true
    data.value = Object.freeze(
      await d3.csv(getDataUrl('grid.csv'), (d) => {
        return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, +v]))
      })
    )
  }

  return {
    data,
    loading,
    load
  }
})
