<template>
  <div class="region-picker" ref="wrapperRef">
    <svg :width="width" :height="height">
      <path
        v-for="r in paths"
        class="bbox-path"
        :key="r.id"
        :d="r.d"
        :fill="r.fill"
        @click="handleClick(r.geometry)"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import * as d3 from 'd3'
import bbox from '@turf/bbox'
import rewind from '@turf/rewind'
import { useFiltersStore } from '@/stores/filters'
import { useAfricanUnionRegionsStore } from '@/stores/africanUnionRegions'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useColorStore } from '@/stores/colors'

const props = defineProps({
  map: {
    type: Object,
    default: null
  },

  mapReady: {
    type: Boolean,
    default: false
  }
})

const { map, mapReady } = toRefs(props)

const filtersStore = useFiltersStore()
const cropInformationStore = useCropInformationStore()
const africanUnionRegionsStore = useAfricanUnionRegionsStore()
const { bboxes } = storeToRefs(africanUnionRegionsStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { selectedCrop } = storeToRefs(filtersStore)

const colorStore = useColorStore()
const { stopLight: stopLightScheme } = storeToRefs(colorStore)

const wrapperRef = ref(null)
const width = ref(0)
const height = ref(0)

const fixedBboxes = computed(() => {
  // NB: Rewind because of D3's winding order handling
  return {
    type: 'FeatureCollection',
    features:
      bboxes.value?.features?.map((f) => ({
        ...f,
        geometry: rewind(f.geometry, { reverse: true })
      })) ?? []
  }
})

const geoGenerator = computed(() => {
  const v = d3.geoNaturalEarth1().fitSize([width.value, height.value], fixedBboxes.value)
  return d3.geoPath(v)
})

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height
})

onMounted(() => {
  africanUnionRegionsStore.loadBboxes()
})

const selectedCropRegionalPotentials = computed(() => {
  if (!selectedCrop.value) return null
  return cropInformation.value?.find((d) => d.id === selectedCrop.value).regionalPotential
})

const getColor = (regionId) => {
  if (!selectedCropRegionalPotentials.value) return stopLightScheme.default
  const rp = selectedCropRegionalPotentials.value[regionId]
  if (!rp) return stopLightScheme.value.default
  return stopLightScheme.value[rp.toLowerCase()]
}

const paths = computed(() => {
  return (
    fixedBboxes.value?.features?.map((f) => {
      const rid = f.properties.AU_region
      return {
        d: geoGenerator.value(f),
        id: rid,
        fill: getColor(rid),
        geometry: f.geometry
      }
    }) ?? []
  )
})

const handleClick = (geometry) => {
  if (map.value && geometry) {
    map.value.fitBounds(bbox(geometry))
  }
}
</script>

<style scoped>
.bbox-path {
  cursor: pointer;
  fill-opacity: 0.7;
}

.bbox-path:hover {
  stroke: var(--white);
  stroke-width: 2;
  stroke-opacity: 0.7;
}

.region-picker {
  background: var(--black-90);
  border: 1px solid var(--dark-gray);
  border-radius: 100%;
}
</style>
