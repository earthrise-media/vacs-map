<template>
  <div class="chart-wrapper" ref="wrapperRef">
    <canvas ref="canvasRef" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useResizeObserver } from '@vueuse/core'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useFiltersStore } from '@/stores/filters'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useGridStore } from '@/stores/grid'
import * as d3 from 'd3'
import { divergingScheme } from '../utils/colors'

const filtersStore = useFiltersStore()
const cropYieldsStore = useCropYieldsStore()
const gridStore = useGridStore()

const { data: cropYieldsData } = storeToRefs(cropYieldsStore)
const { data: gridData } = storeToRefs(gridStore)
const { availableCrops, availableModels } = storeToRefs(filtersStore)

const wrapperRef = ref(null)
const canvasRef = ref(null)
const context = ref(null)

const inset = -20
const width = ref(0)
const height = ref(0)
const timer = ref(null)

// these variables control what crop/scenario we are currently looking at
const selectedCropIndex = ref(0)
const selectedScenarioIndex = ref(0)
const switchCrop = ref(false)

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height

  canvasRef.value.width = width.value
  canvasRef.value.height = height.value
  draw()
})

const futureScenarios = computed(() => availableModels.value.filter((d) => d.startsWith('future')))

const selectedCrop = computed(() => availableCrops.value[selectedCropIndex.value])
const selectedScenario = computed(() => futureScenarios.value[selectedScenarioIndex.value])
const selectedColumn = computed(() => `yieldratio_${selectedCrop.value}_${selectedScenario.value}`)

const scenarioColumns = computed(() => {
  return availableModels.value
    .filter((d) => d.startsWith('future'))
    .map((d) => `yieldratio_${selectedCrop.value}_${d}`)
})

const selectedExtent = computed(() => {
  const extents = scenarioColumns.value.map((d) => cropYieldsStore.getExtent(d))
  return [d3.min(extents, (extent) => d3.min(extent)), d3.max(extents, (extent) => d3.max(extent))]
})

const outline = { type: 'Sphere' }

// this handles the projection, with translation and scale based on window size (responsive)
const projection = computed(() => {
  return d3
    .geoOrthographic()
    .rotate([-18, -3])
    .fitExtent(
      [
        [inset, inset],
        [width.value - inset, height.value - inset]
      ],
      outline
    )
})

const gridCells = computed(() => {
  if (!gridData.value || !cropYieldsData.value) return
  return gridData.value.map((cell, i) => {
    const val = cropYieldsData.value[i][selectedColumn.value]
    return {
      id: cell.id,
      val,
      x: projection.value([cell.X, cell.Y])[0],
      y: projection.value([cell.X, cell.Y])[1],
      fill: getCellColor(val)
    }
  })
})

const getCellColor = (value) => {
  if (!value) return 'transparent'

  const scale = d3
    .scaleLinear()
    .domain([selectedExtent.value[0], 0, selectedExtent.value[1]])
    .range([divergingScheme.min, divergingScheme.center, divergingScheme.max])
    .clamp(true)

  return scale(value)
}

// this is where the page state is changing, cycling through crops/scenarios
// the timing of this update is below in onMounted()
const updateGrid = () => {
  // if we've gotten through all scenarios - increment selected crop
  if (switchCrop.value) {
    if (selectedCropIndex.value === availableCrops.value.length - 1) {
      selectedCropIndex.value = 0
    } else {
      selectedCropIndex.value++
    }
    switchCrop.value = false
  } else {
    //increment scenario
    if (selectedScenarioIndex.value === futureScenarios.value.length - 1) {
      selectedScenarioIndex.value = 0
    } else {
      selectedScenarioIndex.value++
    }
    switchCrop.value = true
  }
  draw()
}

const draw = () => {
  if (!context.value) return

  context.value.save()
  //clear old canvas
  context.value.clearRect(0, 0, width.value, height.value)

  //draw 'globe'
  const radius = Math.min(width.value, height.value) / 2 - 90
  const gradient = context.value.createRadialGradient(
    width.value / 2,
    height.value / 2,
    0,
    width.value / 2,
    height.value / 2,
    radius
  )
  gradient.addColorStop(0.05, '#3B4650')
  gradient.addColorStop(0.99, '#272E34')
  gradient.addColorStop(1, '#17191b')

  context.value.fillStyle = gradient
  context.value.fillRect(
    width.value / 2 - radius,
    height.value / 2 - radius,
    2 * radius,
    2 * radius
  )

  //draw grid dots
  const cellRadius = 1
  gridCells.value?.forEach((cell) => {
    context.value.beginPath()
    context.value.arc(cell.x, cell.y, cellRadius, 0, Math.PI * 2, false)
    context.value.fillStyle = cell.fill
    context.value.fill()
  })
  context.value.restore()
}

onMounted(() => {
  gridStore.load()
  cropYieldsStore.load()

  width.value = wrapperRef.value.clientWidth
  height.value = wrapperRef.value.clientHeight

  canvasRef.value.width = width.value
  canvasRef.value.height = height.value

  context.value = canvasRef.value?.getContext('2d')

  draw()

  // call update grid every x milliseconds
  timer.value = setInterval(() => {
    updateGrid()
  }, 1500)
})

onBeforeUnmount(() => {
  clearInterval(timer.value)
})
</script>

<style>
.chart-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}
</style>
