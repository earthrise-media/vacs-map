<template>
  <RasterLayer :id="id" :map="map" :map-ready="mapReady" :source-id="sourceId" :paint="paint" />
</template>

<script setup>
import * as d3 from 'd3'
import { toRefs, watch } from 'vue'
import RasterLayer from './RasterLayer.vue'

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

const minRasterValue = 50
const maxRasterValue = 100

const getRasterColor = () => {
  const getColor = (value) => {
    const interpolator = d3.interpolateHsl('transparent', 'orange')
    // colorblind version
    const colorblindInterpolator = d3.interpolateHsl('transparent', '#E7EB2A')

    return interpolator(value)
  }

  const steps = d3
    .range(0, 5, 1)
    .map((i) => [minRasterValue + maxRasterValue * (i * 0.25), getColor(i * 0.25)])
    .flat()

  return ['interpolate', ['linear'], ['raster-value'], ...steps]
}

const paint = {
  'raster-color': getRasterColor(),
  'raster-opacity': 0.2,
  'raster-color-mix': [255, 0, 0, 0],
  'raster-color-range': [0, maxRasterValue]
}
</script>

<style scoped></style>
