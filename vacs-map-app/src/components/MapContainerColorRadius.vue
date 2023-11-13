<template>
  <BaseMap>
    <template v-slot="{ map, mapReady }">
      <GridSource :id="sourceId" :map="map" :mapReady="mapReady" />
      <GridOverlay
        id="grid-layer-1"
        :color-column="selectedColumn"
        :color-column-extent="selectedColumnExtent"
        :color-column-quintiles="selectedColumnQuintiles"
        :color-diverging="false"
        :radius-column="radiusColumn"
        :radius-column-extent="radiusColumnExtent"
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

const radiusColumn = computed(() => {
  if (!selectedMetric.value || !selectedCrop.value || !selectedModel.value) {
    return null;
  }

  // As an  example, adding a radius column that is always the yield ratio for
  // the selected crop + model
  return [
    'yieldratio',
    selectedCrop.value,
    selectedModel.value,
  ].join('_');
});

const radiusColumnExtent = computed(() => {
  if (!radiusColumn.value) return null;
  return cropYieldsStore.getExtent(radiusColumn.value);
});
</script>

<style scoped></style>
