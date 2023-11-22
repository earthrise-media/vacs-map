import * as d3 from 'd3'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getDataUrl } from '@/constants/data-load'

export const useCropYieldsStore = defineStore('cropYields', () => {
  const data = ref(null)
  const loading = ref(false)

  const load = async () => {
    if (loading.value || data.value) return false
    loading.value = true

    let transformedData = await d3.csv(getDataUrl('crop-yields-mean-models.csv'), (d) => {
      return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v && v !== '' ? +v : null]))
    })

    const yieldKeys = Object.keys(transformedData[0]).filter((k) => k.startsWith('yield'))

    transformedData = transformedData.map((d, i) => {
      const rowWithYields = { ...d }

      yieldKeys.forEach((k) => {
        const [_, crop, timeframe, scenario] = k.split('_')
        if (timeframe === 'historical') return

        const historicalKey = ['yield', crop, 'historical'].join('_')

        if (!yieldKeys.includes(historicalKey)) return

        const yieldRatioKey = ['yieldratio', crop, timeframe, scenario].join('_')

        let yieldRatioValue = null
        if (d[k] !== null && d[historicalKey] !== null && d[historicalKey]) {
          yieldRatioValue = (d[k] - d[historicalKey]) / d[historicalKey]
        }

        rowWithYields[yieldRatioKey] = yieldRatioValue
      })

      return rowWithYields
    })

    data.value = Object.freeze(transformedData)
  }

  const getColumnValues = (columnName) => {
    if (!(data.value && data.value.length)) return null
    return data.value
      .map((d) => d[columnName])
      .filter((d) => !!d)
      .sort(d3.ascending)
  }

  /*
   * Get an extent for the given column name. Uses the 98th percentile for the
   * maximum to guard against outliers.
   */
  const getExtent = (columnName) => {
    const values = getColumnValues(columnName)
    if (!values) return null
    return [values[0], d3.quantileSorted(values, 0.98)]
  }

  const getQuintiles = (columnName) => {
    const values = getColumnValues(columnName)
    if (!values) return null
    return [
      ...d3.range(0, 1, 0.2).map((d) => ({
        value: d3.quantileSorted(values, d),
        quantile: d
      })),
      {
        value: d3.quantileSorted(values, 0.98),
        quantile: 1
      }
    ]
  }

  return {
    data,
    loading,
    load,

    getExtent,
    getQuintiles
  }
})
