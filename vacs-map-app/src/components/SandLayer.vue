<template>
  <RasterLayer :id="id" :map="map" :map-ready="mapReady" :source-id="sourceId" :paint="paint" />
</template>

<script setup>
import * as d3 from 'd3'
import { toRefs, watch, computed } from 'vue'
import RasterLayer from './RasterLayer.vue'

import { storeToRefs } from 'pinia'
import { useMapExploreStore } from '@/stores/mapExplore'
import { useColorStore } from '@/stores/colors'

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
  }
})

const { id, map, mapReady, sourceId } = toRefs(props)

const mapExploreStore = useMapExploreStore()
const { showSandAndSoil } = storeToRefs(mapExploreStore)

const colorStore = useColorStore()
const { sand: sandScheme } = storeToRefs(colorStore)

const minRasterValue = 50
const maxRasterValue = 100

const getRasterColor = () => {
  const getColor = (value) => {
    const interpolator = d3.interpolateHsl(sandScheme.value[0], sandScheme.value[1])

    return interpolator(value)
  }

  const steps = d3
    .range(0, 5, 1)
    .map((i) => [minRasterValue + maxRasterValue * (i * 0.25), getColor(i * 0.25)])
    .flat()

  return ['interpolate', ['linear'], ['raster-value'], ...steps]
}

const paint = computed(() => {
  return {
    'raster-color': getRasterColor(),
    'raster-opacity': showSandAndSoil.value ? 0.8 : 0.2,
    'raster-color-mix': [255, 0, 0, 0],
    'raster-color-range': [0, maxRasterValue]
  }
})
</script>

<style scoped></style>
