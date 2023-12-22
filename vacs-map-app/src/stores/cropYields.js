import * as d3 from 'd3'
import { ref, watch } from 'vue'
import { defineStore, storeToRefs } from 'pinia'
import { getDataUrl } from '@/constants/data-load'
import { useCropInformationStore } from '@/stores/cropInformation'

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

    // add yield ratio columns for all crops and scenarios
    transformedData = transformedData.map((d, i) => {
      const rowWithYields = Object.fromEntries(Object.entries(d).filter(([k, v]) => v !== null))

      yieldKeys.forEach((k) => {
        const [_, crop, timeframe, scenario] = k.split('_')
        if (timeframe === 'historical') return

        // NB: abbreviating these could get more performance improvements
        const historicalKey = ['yield', crop, 'historical'].join('_')

        if (!yieldKeys.includes(historicalKey)) return

        const yieldRatioKey = ['yieldratio', crop, timeframe, scenario].join('_')

        let yieldRatioValue = null
        if (
          rowWithYields[k] !== null &&
          rowWithYields[historicalKey] !== null &&
          rowWithYields[historicalKey]
        ) {
          yieldRatioValue =
            (rowWithYields[k] - rowWithYields[historicalKey]) / rowWithYields[historicalKey]
        }

        if (yieldRatioValue === null) return
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

  const cropInformationStore = useCropInformationStore()
  const { data: cropInfo } = storeToRefs(cropInformationStore)

  watch(cropInfo, () => {
    // get max/min yield ratios (and which crops they correspond to)
    // for each food group at each grid cell
    const cropGroups = Array.from(new Set(cropInfo.value?.map((d) => d.crop_group)))
    const futureScenarios = ['future_ssp126', 'future_ssp370']

    const groupYieldRatioKeysHash = Object.fromEntries(
      d3.cross(futureScenarios, cropGroups).map(([scenario, cropGroup]) => {
        return [`${cropGroup}_${scenario}`,
          cropInfo.value
            .filter((c) => c.crop_group === cropGroup)
            .map((c) => {
              return ['yieldratio', c.id, scenario].join('_')
            })
        ];
      })
    );

    const dataWithCropGroups = data.value.map((row, i) => {
      const rowUpdates = d3.cross(futureScenarios, cropGroups)
        .map(([scenario, cropGroup]) => {
          const groupKey = [cropGroup, scenario].join('_')
          const groupYieldRatioKeys = groupYieldRatioKeysHash[groupKey];
          const rowHasYieldRatios = Object.keys(row)
            .some((k) => groupYieldRatioKeys.includes(k))
          if (!rowHasYieldRatios) return

          const obj = {
            maxCrop: 'none',
            minCrop: 'none',
            maxVal: null,
            minVal: null
          }

          // TODO might be faster just to pull out the relevant entries and sort
          // them?
          groupYieldRatioKeys.forEach((k) => {
            if (row[k] === null) return;
            if (row[k] > obj.maxVal) {
              obj.maxVal = row[k]
              obj.maxCrop = k.split('_')[1]
            }
            if (row[k] < obj.minVal) {
              obj.minVal = row[k]
              obj.minCrop = k.split('_')[1]
            }
          })
          return [groupKey, obj]
        })
        .filter(d => !!d)

      return { ...row, ...Object.fromEntries(rowUpdates) };
    })
    data.value = Object.freeze(dataWithCropGroups)
  })

  return {
    data,
    loading,
    load,

    getExtent,
    getQuintiles
  }
})
