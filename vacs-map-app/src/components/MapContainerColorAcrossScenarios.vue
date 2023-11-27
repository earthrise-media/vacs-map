<template>
  <BaseMap>
    <template v-slot="{ map, mapReady }">
      <RasterSource
        :id="rasterSourceId"
        tiles-url="https://plotine-vacs.s3.us-east-2.amazonaws.com/population-tiles/{z}/{x}/{y}.png"
        :map="map"
        :map-ready="mapReady"
      />
      <PopulationLayer id="population" :map="map" :map-ready="mapReady" :source-id="rasterSourceId" />
      <GridSource :id="sourceId" :map="map" :mapReady="mapReady" />
      <GridOverlay
        id="grid-layer-1"
        :color-column="selectedColumn"
        :color-column-extent="selectedExtent"
        :color-column-quintiles="selectedColumnQuintiles"
        :color-diverging="selectedMetric === 'yieldratio'"
        :sourceId="sourceId"
        :map="map"
        :mapReady="mapReady"
      />
    </template>
  </BaseMap>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import BaseMap from '@/components/BaseMap.vue';
import { useFiltersStore } from '@/stores/filters';
import { useCropYieldsStore } from '@/stores/cropYields';
import GridSource from './GridSource.vue';
import GridOverlay from './GridOverlay.vue';
import RasterSource from './RasterSource.vue';
import PopulationLayer from './PopulationLayer.vue';
import * as d3 from 'd3';

const sourceId = 'cropGrid';
const rasterSourceId = 'populationSource'
const cropYieldsStore = useCropYieldsStore();
const filtersStore = useFiltersStore();

const {
  selectedCrop,
  selectedMetric,
  selectedModel,
  availableModels
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

// to get extent across scenarios
const scenarios = computed(() => {
  if (selectedMetric.value === 'yieldratio') {
    return availableModels.value.filter(d => d.startsWith('future'))
  } else {
    return availableModels.value;
  }
});

// to get extent across scenarios
const columns = computed(() => {
  if (!selectedMetric.value || !selectedCrop.value || !scenarios.value.length) {
    return null;
  }
  return scenarios.value.map(s => [selectedMetric.value, selectedCrop.value, s].join('_'));
});

const selectedExtent = computed(() => {
  if (!columns.value?.length) return null;

  const extents = columns.value.map(c => cropYieldsStore.getExtent(c));

  return [
    d3.min(extents, extent => d3.min(extent)),
    d3.max(extents, extent => d3.max(extent))
  ];
});

const selectedColumnQuintiles = computed(() => {
  if (!selectedColumn.value) return null;
  return cropYieldsStore.getQuintiles(selectedColumn.value);
});
</script>

<style scoped></style>
