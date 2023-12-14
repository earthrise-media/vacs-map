<template></template>

<script setup>
import { onMounted, toRefs, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useJoinedCropDataStore } from '@/stores/joinedCropData'
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
const joinedCropDataStore = useJoinedCropDataStore()

const { gridFeatureCollection } = storeToRefs(joinedCropDataStore);

onMounted(() => {
  gridStore.load()
  cropYieldsStore.load()
})

const addSource = (geoJson) => {
  if (!map.value || !mapReady.value || map.value.getSource(id.value)) return

  map.value.addSource(id.value, {
    type: 'geojson',
    data: geoJson
  })
}

watch(mapReady, () => {
  if (!gridFeatureCollection.value) return
  addSource(gridFeatureCollection.value)
})

watch(gridFeatureCollection, () => {
  if (!gridFeatureCollection.value) return
  addSource(gridFeatureCollection.value)
})
</script>

<style></style>
