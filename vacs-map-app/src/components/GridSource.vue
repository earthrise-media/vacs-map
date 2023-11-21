<template></template>

<script setup>
import { computed, onMounted, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { point, featureCollection } from '@turf/helpers'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useGridStore } from '@/stores/grid'

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
  }
})

const { id, map, mapReady } = toRefs(props)

const cropYieldsStore = useCropYieldsStore()
const gridStore = useGridStore()

const { data: cropYieldsData } = storeToRefs(cropYieldsStore)
const { data: gridData } = storeToRefs(gridStore)

onMounted(() => {
  gridStore.load()
  cropYieldsStore.load()
})

// TODO do this stuff in another store?
const joinData = (grid, yields) => {
  const joined = Object.fromEntries(grid.map((row) => [row.id, row]))
  yields.forEach((row) => {
    if (joined[row.id]) {
      joined[row.id] = { ...joined[row.id], ...row }
    }
  })
  return Object.values(joined)
}

const joinedData = computed(() => {
  if (!gridData.value) return []
  if (cropYieldsData.value) {
    return joinData(gridData.value, cropYieldsData.value)
  }
  return gridData.value
})

const joinedGeoJson = computed(() => {
  return featureCollection(
    joinedData.value.map((row) => point([row.X, row.Y], row, { id: row.id }))
  )
})

const addSource = (geoJson) => {
  if (!map.value || !mapReady.value || map.value.getSource(id.value)) return

  map.value.addSource(id.value, {
    type: 'geojson',
    data: geoJson
  })
}

watch(mapReady, () => {
  if (!joinedGeoJson.value) return
  addSource(joinedGeoJson.value)
})

watch(joinedGeoJson, () => {
  if (!joinedGeoJson.value) return
  addSource(joinedGeoJson.value)
})
</script>

<style></style>
