<template>
  <div class="base-map-wrapper">
    <div id="baseMapContainer" class="base-map"></div>
    <GridSource :id="sourceId" :map="map" :mapReady="mapReady" />
    <GridOverlay
      id="grid-layer-1"
      :color-column="selectedColumn"
      :color-column-extent="selectedColumnExtent"
      :color-column-quintiles="selectedColumnQuintiles"
      :color-diverging="false"
      :sourceId="sourceId"
      :map="map"
      :mapReady="mapReady"
      />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue';
import { storeToRefs } from 'pinia';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  INITIAL_MAP_BOUNDS,
  MAPBOX_GL_ACCESS_TOKEN,
  MAPBOX_STYLE,
} from '@/constants';
import { useFiltersStore } from '@/stores/filters';
import { useCropYieldsStore } from '@/stores/cropYields';
import GridSource from './GridSource.vue';
import GridOverlay from './GridOverlay.vue';

const map = shallowRef(null);
const mapReady = ref(false);
const sourceId = 'cropGrid';

const cropYieldsStore = useCropYieldsStore();
const filtersStore = useFiltersStore();

const {
  selectedCrop,
  selectedMetric,
  selectedModel
} = storeToRefs(filtersStore);

const selectedColumn = computed(() => {
  if (!selectedMetric.value || !selectedCrop.value || !selectedModel.value) {
    return null;
  }

  return [
    selectedMetric.value,
    selectedCrop.value,
    selectedModel.value,
  ].join('_');
});

const selectedColumnExtent = computed(() => {
  if (!selectedColumn.value) return null;
  return cropYieldsStore.getExtent(selectedColumn.value);
});

const selectedColumnQuintiles = computed(() => {
  if (!selectedColumn.value) return null;
  return cropYieldsStore.getQuintiles(selectedColumn.value);
});

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
.base-map {
  height: 100vh;
  width: 100vw;
}
</style>
