<template>
  <div class="chart-wrapper" ref="wrapperRef">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { useResizeObserver } from '@vueuse/core'
import { computed, toRefs, ref, onMounted, watch } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useMapExploreStore } from '../stores/mapExplore'
import { useColorStore } from '@/stores/colors'
import { storeToRefs } from 'pinia'

const props = defineProps({
  scenario: {
    type: String,
    default: ''
  }
})
const { scenario } = toRefs(props)

const mapExploreStore = useMapExploreStore()
const cropYieldsStore = useCropYieldsStore()
const filtersStore = useFiltersStore()
const { selectedMetric, selectedCrop, availableModels, availableCrops } = storeToRefs(filtersStore)
const { data: cropYieldsData } = storeToRefs(cropYieldsStore)
const { hoveredId } = storeToRefs(mapExploreStore)

const colorStore = useColorStore()
const { diverging: divergingScheme } = storeToRefs(colorStore)

const canvasRef = ref(null)
const context = ref(null)
const wrapperRef = ref(null)
const width = ref(0)
const height = ref(0)

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height

  canvasRef.value.width = width.value
  canvasRef.value.height = height.value
  draw()
})

const columnName = computed(() => {
  return [selectedMetric.value, selectedCrop.value, scenario.value].join('_')
})

const cropExtent = computed(() => {
  // want to get extent across all scenarios for selected crop
  const extents = []
  availableModels.value.forEach((s) => {
    const column = [selectedMetric.value, selectedCrop.value, s].join('_')
    extents.push(cropYieldsStore.getExtent(column))
  })
  return [d3.min(extents.map((d) => d[0])), d3.min(extents.map((d) => d[1]))]
})

const gridCells = computed(() => {
  if (!cropYieldsData.value) return
  return cropYieldsData.value
    .map((row) => {
      const val = row[columnName.value]
      return {
        id: row.id,
        val,
        x: xScale.value(val),
        fill: getCellColor(val)
      }
    })
    .filter((d) => !!d.val)
})

const xScale = computed(() => {
  return (
    d3
      .scaleLinear()
      // keep 0 values centered on spectrum
      .domain([cropExtent.value[0], 0, cropExtent.value[1]])
      .range([2, width.value / 2, width.value - 2])
      .clamp(true)
  )
})

const getCellColor = (value) => {
  if (!value) return 'transparent'
  const scale = d3
    .scaleLinear()
    .domain([cropExtent.value[0], 0, cropExtent.value[1]])
    .range([divergingScheme.value.min, divergingScheme.value.center, divergingScheme.value.max])
    .clamp(true)

  return scale(value)
}

// from D3 beeswarm example
const dodge = (data, { radius = 1, x = (d) => d } = {}) => {
  const radius2 = radius ** 2
  const circles = data.map((d) => ({ x: x(d), data: d })).sort((a, b) => a.x - b.x)
  const epsilon = 1e-3
  let head = null,
    tail = null

  // Returns true if circle ⟨x,y⟩ intersects with any circle in the queue.
  function intersects(x, y) {
    let a = head
    while (a) {
      if (radius2 - epsilon > (a.x - x) ** 2 + (a.y - y) ** 2) {
        return true
      }
      a = a.next
    }
    return false
  }

  // Place each circle sequentially.
  for (const b of circles) {
    // Remove circles from the queue that can’t intersect the new circle b.
    while (head && head.x < b.x - radius2) head = head.next

    // Choose the minimum non-intersecting tangent.
    if (intersects(b.x, (b.y = 0))) {
      let a = head
      b.y = Infinity
      do {
        let y1 = a.y + Math.sqrt(radius2 - (a.x - b.x) ** 2)
        let y2 = a.y - Math.sqrt(radius2 - (a.x - b.x) ** 2)
        if (Math.abs(y1) < Math.abs(b.y) && !intersects(b.x, y1)) b.y = y1
        if (Math.abs(y2) < Math.abs(b.y) && !intersects(b.x, y2)) b.y = y2
        a = a.next
      } while (a)
    }

    // Add b to the queue.
    b.next = null
    if (head === null) head = tail = b
    else tail = tail.next = b
  }

  return circles
}

const draw = () => {
  if (!context.value) return

  context.value.save()
  //clear old canvas
  context.value.clearRect(0, 0, width.value, height.value)

  gridCells.value?.forEach((cell) => {
    context.value.fillStyle = cell.fill
    context.value.fillRect(cell.x, 0, 0.1, height.value)
  })

  //draw hovered
  if (hoveredId.value) {
    const cell = gridCells?.value.find((d) => d.id === hoveredId.value)
    if (!cell) return
    context.value.fillStyle = 'white'
    context.value.fillRect(cell.x, 0, 3, height.value)
  }

  // draw dots as swarm plot -- seems too slow
  // const grid = dodge(gridCells.value, {radius: 1, x: d => d.x});

  // //draw grid dots
  // grid.forEach(cell => {
  //   context.value.fillStyle = cell.data.fill;
  //   context.value.fillRect(cell.x, height.value*.3 + cell.y, 2, 2);
  // })

  context.value.restore()
}

onMounted(() => {
  width.value = wrapperRef.value.clientWidth
  height.value = wrapperRef.value.clientHeight

  canvasRef.value.width = width.value
  canvasRef.value.height = height.value

  context.value = canvasRef.value?.getContext('2d')

  draw()
})

watch(gridCells, () => {
  draw()
})

watch(selectedCrop, () => {
  draw()
})

watch(scenario, () => {
  draw()
})

watch(hoveredId, () => {
  draw()
})

watch(divergingScheme, () => {
  draw()
})
</script>

<style scoped>
.chart-wrapper {
  height: 8rem;
  width: 100%;
}
</style>
