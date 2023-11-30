<template>
  <div class="base-map-wrapper">
    <div id="baseMapContainer" class="base-map"></div>
    <slot :map="map" :map-ready="mapReady"></slot>
  </div>
</template>

<script setup>
import { onMounted, ref, shallowRef, watch } from 'vue'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { INITIAL_MAP_BOUNDS, MAPBOX_GL_ACCESS_TOKEN, MAPBOX_STYLE } from '@/constants'
import { storeToRefs } from 'pinia'
import { useMapExploreStore } from '@/stores/mapExplore'

const mapExploreStore = useMapExploreStore()
const { mapPadding } = storeToRefs(mapExploreStore)

const map = shallowRef(null)
const mapReady = ref(false)

const initializeMap = () => {
  mapboxgl.accessToken = MAPBOX_GL_ACCESS_TOKEN
  let mapOptions = {
    container: 'baseMapContainer',
    style: MAPBOX_STYLE,
    bounds: INITIAL_MAP_BOUNDS,
    minZoom: 2,
    maxzoom: 12
  }

  map.value = new mapboxgl.Map(mapOptions)

  map.value.once('load', () => (mapReady.value = true))

  const nav = new mapboxgl.NavigationControl({
    showCompass: false
  })

  map.value.addControl(nav, 'top-right')
  map.value.dragRotate.disable()
  map.value.touchZoomRotate.disableRotation()
}

onMounted(() => {
  initializeMap()
  if (mapPadding.value) map.value.setPadding(mapPadding.value)
})

watch(mapPadding, () => {
  if (mapPadding.value) map.value.setPadding(mapPadding.value)
})
</script>

<style scoped>
.base-map-wrapper {
  flex-grow: 1;
}

.base-map {
  height: 100%;
}
</style>

<style>
.mapboxgl-ctrl {
  margin: 0 !important;
}

.mapboxgl-ctrl-top-right {
  top: 4rem;
  right: calc(var(--page-horizontal-margin));
}

.mapboxgl-ctrl-group:not(:empty) {
  border-radius: 0.5rem !important;
  width: 1.875rem;
  height: 3.5rem;
}

.mapboxgl-ctrl-group button {
  background-color: var(--dark-gray) !important;
  width: 100%;
  height: 50%;
}

.mapboxgl-ctrl-group button:hover {
  background-color: var(--dark-gray-hover) !important;
}

.mapboxgl-ctrl-group button + button {
  border-top: 1px solid var(--gray) !important;
}

.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-in .mapboxgl-ctrl-icon {
  background-image: url(@/assets/img/map-plus-ctrl.svg) !important;
}

.mapboxgl-ctrl button.mapboxgl-ctrl-zoom-out .mapboxgl-ctrl-icon {
  background-image: url(@/assets/img/map-minus-ctrl.svg) !important;
}

.mapboxgl-ctrl button:disabled .mapboxgl-ctrl-icon {
  opacity: 1 !important;
}

.mapboxgl-ctrl-attrib-inner,
.mapboxgl-ctrl-attrib {
  background: var(--dark-gray) !important;
}

.mapboxgl-ctrl-attrib a {
  color: var(--white) !important;
}

@media only screen and (max-width: 720px) {
  .mapboxgl-ctrl-top-right {
    top: 5rem;
  }

 }
</style>
