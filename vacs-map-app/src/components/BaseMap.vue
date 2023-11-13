<template>
  <div class="base-map-wrapper">
    <div id="baseMapContainer" class="base-map"></div>
    <slot :map="map" :map-ready="mapReady"></slot>
  </div>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  INITIAL_MAP_BOUNDS,
  MAPBOX_GL_ACCESS_TOKEN,
  MAPBOX_STYLE,
} from '@/constants';

const map = shallowRef(null);
const mapReady = ref(false);

const initializeMap = () => {
  mapboxgl.accessToken = MAPBOX_GL_ACCESS_TOKEN;
  let mapOptions = {
    container: 'baseMapContainer',
    style: MAPBOX_STYLE,
    bounds: INITIAL_MAP_BOUNDS,
  };

  map.value = new mapboxgl.Map(mapOptions);

  map.value.once('load', () => mapReady.value = true);

  const nav = new mapboxgl.NavigationControl({
    showCompass: false
  });
  map.value.addControl(nav, 'top-right');
  map.value.dragRotate.disable();
  map.value.touchZoomRotate.disableRotation();
};

onMounted(() => {
  initializeMap();
});
</script>

<style scoped>
.base-map-wrapper {
  flex-grow: 1;
}

.base-map {
  height: 100%;
}
</style>
