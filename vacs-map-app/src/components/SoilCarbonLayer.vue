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

const minRasterValue = 0
const maxRasterValue = 100

const getRasterColor = () => {
  const getColor = (value) => {
    // const interpolator = d3.interpolateBrBG;
    const interpolator = d3.interpolateHsl("hsla(143, 52%, 13%, 0)", "#6DACA4");
    // const interpolator = d3.interpolatePiYG;
    // const interpolator = d3.interpolateCubehelixDefault

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
  'raster-opacity': 0.35,
  'raster-color-mix': [255, 0, 0, 0],
  'raster-color-range': [0, maxRasterValue]
}
</script>

<style scoped></style>
