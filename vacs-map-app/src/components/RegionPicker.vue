<template>
  <div class="region-picker" ref="wrapperRef">
    <svg :width="width" :height="height">
      <path
        v-for="r in paths"
        class="bbox-path"
        :key="r.id"
        :d="r.d"
        @click="handleClick(r.geometry)"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, toRefs } from 'vue';
import { useResizeObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import * as d3 from 'd3';
import bbox from '@turf/bbox';
import rewind from '@turf/rewind';
import { useAfricanUnionRegionsStore } from '@/stores/africanUnionRegions';

const props = defineProps({
  map: {
    type: Object,
    default: null
  },

  mapReady: {
    type: Boolean,
    default: false
  },
})

const { map, mapReady } = toRefs(props)

const africanUnionRegionsStore = useAfricanUnionRegionsStore();
const { bboxes } = storeToRefs(africanUnionRegionsStore)

const wrapperRef = ref(null)
const width = ref(0)
const height = ref(0)

const fixedBboxes = computed(() => {
  // NB: Rewind because of D3's winding order handling
  return {
    type: 'FeatureCollection',
    features: bboxes.value?.features?.map(f => ({
      ...f,
      geometry: rewind(f.geometry, { reverse: true }),
    })) ?? [],
  };
});

const geoGenerator = computed(() => {
  const v = d3.geoNaturalEarth1()
    .fitSize([width.value, height.value], fixedBboxes.value);
  return d3.geoPath(v);
});

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height
})

onMounted(() => {
  africanUnionRegionsStore.loadBboxes()
})

const paths = computed(() => {
  return fixedBboxes.value?.features?.map(f => {
    return {
      d: geoGenerator.value(f),
      id: f.properties.AU_region,
      geometry: f.geometry,
    };
  }) ?? [];
});

const handleClick = geometry => {
  if (map.value && geometry) {
    map.value.fitBounds(bbox(geometry));
  }
};
</script>

<style scoped>
.bbox-path {
  fill: rgba(251, 189, 5, 0.70);;
  fill-opacity: 0.8;
}

.bbox-path:hover {
  fill: rgba(255, 109, 1, 0.70);;
}
</style>
