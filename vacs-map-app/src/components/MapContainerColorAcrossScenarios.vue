<template>
  <BaseMap>
    <template v-slot="{ map, mapReady }">
      <RasterSource
        :id="rasterSourceId"
        tiles-url="https://plotine-vacs.s3.us-east-2.amazonaws.com/population-tiles/{z}/{x}/{y}.png"
        :map="map"
        :map-ready="mapReady"
      />
      <PopulationLayer
        id="population"
        :map="map"
        :map-ready="mapReady"
        :source-id="rasterSourceId"
      />
      <GridSource :id="sourceId" :map="map" :mapReady="mapReady" />
      <GridOverlay
        id="grid-layer-1"
        :use-crop-group-map="showCropGroupMap"
        :crop-group-column="cropGroupColumn"
        :crop-group-crops="cropGroupCrops"
        :crop-group-metric="cropGroupMetric"
        :color-column="selectedColumn"
        :color-column-extent="selectedExtent"
        :color-column-quintiles="selectedColumnQuintiles"
        :color-diverging="selectedMetric === 'yieldratio'"
        :sourceId="sourceId"
        :map="map"
        :mapReady="mapReady"
      />
      <slot :map="map" :map-ready="mapReady"></slot>
    </template>
  </BaseMap>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import BaseMap from '@/components/BaseMap.vue'
import { useFiltersStore } from '@/stores/filters'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useMapExploreStore } from '@/stores/mapExplore'
import { useCropInformationStore } from '@/stores/cropInformation'
import GridSource from './GridSource.vue'
import GridOverlay from './GridOverlay.vue'
import RasterSource from './RasterSource.vue'
import PopulationLayer from './PopulationLayer.vue'
import * as d3 from 'd3'

const sourceId = 'cropGrid'
const rasterSourceId = 'populationSource'
const cropYieldsStore = useCropYieldsStore()
const filtersStore = useFiltersStore()
const mapExploreStore = useMapExploreStore()
const cropInformationStore = useCropInformationStore()

const { selectedCrop, selectedMetric, selectedModel, availableModels } = storeToRefs(filtersStore)

const { data: cropInfo } = storeToRefs(cropInformationStore)

const { showCropGroupMap, cropGroupMetric } = storeToRefs(mapExploreStore)

const selectedColumn = computed(() => {
  if (!selectedMetric.value || !selectedCrop.value || !selectedModel.value) {
    return null
  }

  return [selectedMetric.value, selectedCrop.value, selectedModel.value].join('_')
})

const selectedCropGroup = computed(() => {
  if (!cropInfo.value || !selectedCrop.value) {
    return null
  }

  return cropInfo.value.find((c) => c.id === selectedCrop.value).crop_group
})

const cropGroupColumn = computed(() => {
  if (!selectedCropGroup.value || !selectedModel.value) {
    return null
  }

  return [selectedCropGroup.value, selectedModel.value].join('_')
})

const cropGroupCrops = computed(() => {
  if (!cropInfo.value || !selectedCropGroup.value) {
    return null
  }

  return cropInfo.value.filter((c) => c.crop_group === selectedCropGroup.value).map((c) => c.id)
})

// to get extent across scenarios
const scenarios = computed(() => {
  if (selectedMetric.value === 'yieldratio') {
    return availableModels.value.filter((d) => d.startsWith('future'))
  } else {
    return availableModels.value
  }
})

// to get extent across scenarios
const columns = computed(() => {
  if (!selectedMetric.value || !selectedCrop.value || !scenarios.value.length) {
    return null
  }
  return scenarios.value.map((s) => [selectedMetric.value, selectedCrop.value, s].join('_'))
})

const selectedExtent = computed(() => {
  if (!columns.value?.length) return null

  const extents = columns.value.map((c) => cropYieldsStore.getExtent(c))

  return [d3.min(extents, (extent) => d3.min(extent)), d3.max(extents, (extent) => d3.max(extent))]
})

const selectedColumnQuintiles = computed(() => {
  if (!selectedColumn.value) return null
  return cropYieldsStore.getQuintiles(selectedColumn.value)
})
</script>

<style scoped></style>
