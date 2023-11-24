<template>
  <div class="chart-wrapper" ref="wrapperRef">
    <canvas ref="canvasRef"/>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { useResizeObserver } from '@vueuse/core'
import { computed, toRefs, ref, onMounted, watch } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useCropYieldsStore } from '@/stores/cropYields'
import { storeToRefs } from 'pinia'
import { divergingScheme } from '@/utils/colors'

const props = defineProps({
  scenario: {
    type: String,
    default: ''
  }
})
const { scenario } = toRefs(props)

const cropYieldsStore = useCropYieldsStore()
const filtersStore = useFiltersStore()
const { selectedMetric, selectedCrop, availableModels, availableCrops } = storeToRefs(filtersStore)
const { data: cropYieldsData } = storeToRefs(cropYieldsStore)

const canvasRef = ref(null);
const context = ref(null);
const wrapperRef = ref(null)
const width = ref(0)
const height = ref(0)

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height

  canvasRef.value.width = width.value;
  canvasRef.value.height = height.value;
  draw();
})

const margin = computed(() => {
  return height.value * 0.2
})

const columnName = computed(() => {
  return [selectedMetric.value, selectedCrop.value, scenario.value].join('_')
})

const metaExtent = computed(() => {
  // want to get extent across all scenarios and included crops so that comparisons are more useful
  const extents = []
  availableModels.value.forEach((s) => {
    availableCrops.value.forEach((c) => {
      const column = [selectedMetric.value, c, s].join('_')
      extents.push(cropYieldsStore.getExtent(column))
    })
  })
  return [d3.min(extents.map((d) => d[0])), d3.min(extents.map((d) => d[1]))]
})

const colorExtent = computed(() => {
  // want to get extent across all scenarios and included crops so that comparisons are more useful
  const extents = []
  availableModels.value.forEach(s => {
    const column = [selectedMetric.value, selectedCrop.value, s].join("_");
    extents.push(cropYieldsStore.getExtent(column))
  })
  return [d3.min(extents.map(d => d[0])), d3.min(extents.map(d => d[1]))];
})

const gridCells = computed(() => {
  if (!cropYieldsData.value) return
  return cropYieldsData.value.map((row) => {
    const val = row[columnName.value];
    return {
      id: row.id,
      val,
      y: yScale.value(val),
      fill: getCellColor(val)
    }
  })
})

const yScale = computed(() => {
  return d3
    .scaleLinear()
    .domain(metaExtent.value)
    .range([height.value - margin.value, margin.value])
  // .clamp(true);
})

// const xScale = computed(() => {
//   return d3.scaleLinear().domain([0, 1]).range([0, width.value])
// })

const getCellColor = (value) => {
  if (!value) return 'transparent';
  const scale = d3.scaleLinear()
    .domain([colorExtent.value[0], 0, colorExtent.value[1]])
    .range([divergingScheme.min, divergingScheme.center, divergingScheme.max])
    .clamp(true)

  return scale(value)
}

const draw = () => {
  if (!context.value) return;

  context.value.save();
  //clear old canvas
  context.value.clearRect(0, 0, width.value, height.value);

  //draw grid dots
  gridCells.value?.forEach(cell => {
    context.value.fillStyle = cell.fill;
    context.value.fillRect(0, cell.y, width.value, 0.1);
  })
  context.value.restore();
}

onMounted(() => {
  width.value = wrapperRef.value.clientWidth
  height.value = wrapperRef.value.clientHeight

  canvasRef.value.width = width.value
  canvasRef.value.height = height.value

  context.value = canvasRef.value?.getContext('2d')

  draw();
})

watch(selectedCrop, () => {
  draw();
})
</script>

<style scoped>
.chart-wrapper {
  height: 100%;
  width: 100%;
}
</style>
