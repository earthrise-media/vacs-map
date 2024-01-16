<template></template>

<script setup>
import { toRefs, watch } from 'vue'

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

  paint: {
    type: Object,
    default: () => {}
  },

  sourceId: {
    type: String,
    default: ''
  }
})

const { id, map, mapReady, paint, sourceId } = toRefs(props)

const addLayer = () => {
  if (!map.value || !mapReady.value || map.value.getLayer(id.value)) return

  map.value.addLayer(
    {
      id: id.value,
      source: sourceId.value,
      type: 'raster',
      paint: paint.value
    },
    'settlement-subdivision-label'
  )
}

const updateLayer = () => {
  if (!map.value.getLayer(id.value)) return

  Object.entries(paint.value).forEach(([k, v]) => {
    map.value.setPaintProperty(id.value, k, v)
  })
}

watch(map, () => {
  addLayer()
})

watch(mapReady, () => {
  addLayer()
})

watch(paint, () => {
  updateLayer()
})
</script>

<style scoped></style>
