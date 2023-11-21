<template></template>

<script setup>
import * as d3 from 'd3'
import bbox from '@turf/bbox'
import { computed, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAfricanUnionRegionsStore } from '@/stores/africanUnionRegions'

const props = defineProps({
  id: {
    type: String,
    default: ''
  },

  map: {
    type: Object,
    default: null
  },

  mapReady: {
    type: Boolean,
    default: false
  },

  sourceId: {
    type: String,
    default: ''
  },

  zoomOnClick: {
    type: Boolean,
    default: true
  }
})

const { id, map, mapReady, sourceId, zoomOnClick } = toRefs(props)

const africanUnionRegionsStore = useAfricanUnionRegionsStore()

const { data: regionsData } = storeToRefs(africanUnionRegionsStore)

const addLayer = () => {
  if (!map.value || !mapReady.value || map.value.getLayer(id.value)) return
  const linesLayerId = `${id.value}-lines`

  map.value.addLayer(
    {
      id: id.value,
      source: sourceId.value,
      type: 'fill',
      paint: {
        'fill-color': 'transparent'
      }
    },
    'country-label-filter'
  )

  map.value.addLayer(
    {
      id: linesLayerId,
      source: sourceId.value,
      type: 'line',
      paint: {
        'line-color': '#bdbdbd',
        'line-width': 2
      }
    },
    'country-label-filter'
  )

  if (zoomOnClick.value) {
    map.value.on('click', [id.value, linesLayerId], (e) => {
      if (!e.features?.[0]) return
      const feature = regionsData.value.features.find(({ id }) => id === e.features[0].id)
      const [minX, minY, maxX, maxY] = bbox(feature)
      map.value.fitBounds([
        [minX, minY],
        [maxX, maxY]
      ])
    })
  }
}

watch(map, () => {
  addLayer()
})

watch(mapReady, () => {
  addLayer()
})
</script>

<style scoped></style>
