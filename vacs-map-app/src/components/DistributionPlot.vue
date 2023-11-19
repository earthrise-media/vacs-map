<template>
  <div class="svg-wrapper" ref="wrapperRef">
    <svg>
      <line
        v-for="cell in gridCells"
        :key="cell.id"
        :x1="xScale(0)"
        :x2="xScale(1)"
        :y1="yScale(cell.val)"
        :y2="yScale(cell.val)"
        :stroke="getCellColor(cell.val)"
        stroke-width="0.05"
        stroke-opacity="1"
      />
    </svg>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import { useResizeObserver } from '@vueuse/core';
import { computed, toRefs, ref, onMounted } from 'vue';
import { useFiltersStore } from '@/stores/filters';
import { useCropYieldsStore } from '@/stores/cropYields'; 
import { storeToRefs } from 'pinia';

const props = defineProps({
  scenario: {
    type: String,
    default: '',
  },
});
const {scenario} = toRefs(props);

const cropYieldsStore = useCropYieldsStore();
const filtersStore = useFiltersStore();
const { selectedMetric, selectedCrop, availableModels, availableCrops } = storeToRefs(filtersStore);
const { data: cropYieldsData } = storeToRefs(cropYieldsStore);

const wrapperRef = ref(null);
const width = ref(0);
const height = ref(0);
const margin = ref(100);

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width;
  height.value = entry.contentRect.height;
})

const columnName = computed(() => {
  return [selectedMetric.value, selectedCrop.value, scenario.value].join("_")
})

const metaExtent = computed(() => {
  // want to get extent across all scenarios and included crops so that comparisons are more useful
  const extents = []
  availableModels.value.forEach(s => {
    availableCrops.value.forEach(c => {
      const column = [selectedMetric.value, c, s].join("_");
      extents.push(cropYieldsStore.getExtent(column))
    })
  })
  return [d3.min(extents.map(d => d[0])), d3.min(extents.map(d => d[1]))];
})

const gridCells = computed(() => {
  if (!cropYieldsData.value) return;
  return cropYieldsData.value.map((row) => {
    return {
      id: row.id,
      val: row[columnName.value],
    };
  });
});

const yScale = computed(() => {
  return d3.scaleLinear()
    .domain(metaExtent.value)
    .range([height.value - margin.value, margin.value])
    // .clamp(true);
})

const xScale = computed(() => {
  return d3.scaleLinear()
    .domain([0,1])
    .range([0, width.value])
})

const getCellColor = (value) => {
  if (!value) return 'transparent';
  const scale = d3.scaleLinear()
    .domain([metaExtent.value[0], 0, metaExtent.value[1]])
    .range(["#FF8A00", "#D4D5A5", "#1CAC50"])
    .clamp(true);

  return scale(value);
}

onMounted(() => {
  width.value = wrapperRef.value.clientWidth;
  height.value = wrapperRef.value.clientHeight;
});

</script>

<style scoped>

.svg-wrapper {
  height: 100%;
  width: 100%;
  padding: 1rem;
}

svg {
  width: 100%;
  height: 100%;
}
</style>