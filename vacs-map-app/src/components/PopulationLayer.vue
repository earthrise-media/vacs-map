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
const maxRasterValue = 20

const getRasterColor = () => {
  const getColor = (value) => {
    // Pick an interpolate function here:
    //  https://d3js.org/d3-scale-chromatic/sequential
    //
    // Like this:
    //
    // const interpolator = d3.interpolateSinebow;
    // const interpolator = d3.interpolateCubehelixDefault
    // Or define your own:
    const interpolator = d3.interpolateHsl('transparent', 'palegoldenrod')

    // const interpolator = d3.interpolateInferno
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
  'raster-opacity': 0.45,
  'raster-color-mix': [255, 0, 0, 0],
  'raster-color-range': [0, maxRasterValue]
}
</script>

<style scoped></style>
