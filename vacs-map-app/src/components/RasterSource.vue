<template></template>

<script setup>
import { computed, onMounted, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'

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

  tilesUrl: {
    type: String,
    default: ''
  }
})

const { id, map, mapReady, tilesUrl } = toRefs(props)

const addSource = () => {
  if (!map.value || !mapReady.value || map.value.getSource(id.value)) return

  map.value.addSource(id.value, {
    type: 'raster',
    tiles: [tilesUrl.value],
    tileSize: 256,
    scheme: 'tms',
    minzoom: 0,
    maxzoom: 9
  })
}

watch(map, () => {
  addSource()
})

watch(mapReady, () => {
  addSource()
})
</script>

<style></style>
