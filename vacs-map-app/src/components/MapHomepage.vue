<template>
  <div class="svg-wrapper" ref="wrapperRef">
    <svg>
      <defs>
        <radialGradient id="globeGradient">
          <stop offset="30%" stop-color="#3B4650" />
          <stop offset="95%" stop-color="#272E34" />
        </radialGradient>
      </defs>
      <g class="basemap">
        <circle 
          :cx="width/2"
          :cy="height/2"
          :r="width/2 - 90"
          fill="url('#globeGradient')" 
        />

      </g>
      <g class="grid-cells">
        <circle
          v-for="cell in gridCells"
          class="grid-cell"
          :key="cell.id"
          :cx="cell.x"
          :cy="cell.y"
          :r="1"
          :fill="getCellColor(cell.val)"
          :stroke="getCellColor(cell.val)"
          :stroke-width="0.75"
          :stroke-opacity="0.5"
        />
      </g>
    </svg>
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

const wrapperRef = ref(null);
const inset = -20;
const width = ref(0);
const height = ref(0);
const timer = ref(null);

// these variables control what crop/scenario we are currently looking at
const selectedCropIndex = ref(0);
const selectedScenarioIndex = ref(0);
const switchCrop = ref(false);

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width;
  height.value = entry.contentRect.height;
});

const futureScenarios = computed(() => availableModels.value.filter(d => d.startsWith('future')));

const selectedCrop = computed(() => availableCrops.value[selectedCropIndex.value]);
const selectedScenario = computed(() => futureScenarios.value[selectedScenarioIndex.value]);
const selectedColumn = computed(() => `yieldratio_${selectedCrop.value}_${selectedScenario.value}`);

const scenarioColumns = computed(() => {
  return availableModels.value.filter(d => d.startsWith('future')).map(
    d => `yieldratio_${selectedCrop.value}_${d}`
  )
})

const selectedExtent = computed(() => {
  const extents = scenarioColumns.value.map(d => cropYieldsStore.getExtent(d))
  return [
    d3.min(extents, extent => d3.min(extent)),
    d3.max(extents, extent => d3.max(extent))
  ];
})
  
const outline = ({type: "Sphere"});

// this handles the projection, with translation and scale based on window size (responsive)
const projection = computed(() => {
  return d3.geoOrthographic()
    .rotate([-15,-3])
    .fitExtent([[inset, inset], [width.value - inset, height.value - inset]], outline)
})

const gridCells = computed(() => {
  if (!gridData.value || !cropYieldsData.value) return
  return gridData.value.map((cell, i) => {
    return {
      id: cell.id,
      val: cropYieldsData.value[i][selectedColumn.value],
      x: projection.value([cell.X, cell.Y])[0],
      y: projection.value([cell.X, cell.Y])[1]
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
      selectedCropIndex.value = 0;
    } else {
      selectedCropIndex.value++;
    }
    switchCrop.value = false;
  } else { //increment scenario
    if (selectedScenarioIndex.value === futureScenarios.value.length - 1) {
      selectedScenarioIndex.value = 0;
    } else {
      selectedScenarioIndex.value++;
    }
    switchCrop.value = true;
  }
}

onMounted(() => {
  gridStore.load()
  cropYieldsStore.load()

  width.value = wrapperRef.value.clientWidth
  height.value = wrapperRef.value.clientHeight

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
.svg-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

svg {
  width: 100%;
  height: 100%;
}

/* this css transition is what is causing the animation between fill colors right now */
/* we can switch to using d3 for animation if we want, but css transitions/animations
  can also pretty powerful  */
svg .grid-cell {
  transition: fill 750ms linear;
}
</style>
