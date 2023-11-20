<template>
  <div class="svg-wrapper" ref="wrapperRef">
    <svg>
      <g class="grid-cells">
        <circle 
          v-for="cell in gridCells"
          class="grid-cell"
          :key="cell.id"
          :cx="cell.x"
          :cy="cell.y"
          :r="2"
          :fill="getCellColor(cell.val)"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useResizeObserver } from '@vueuse/core';
import { ref, computed, onMounted, onBeforeUnmount} from 'vue';
import { useFiltersStore } from '@/stores/filters';
import { useCropYieldsStore } from '@/stores/cropYields';
import { useGridStore } from '@/stores/grid';
import * as d3 from 'd3';
import { geoChamberlinAfrica } from 'd3-geo-projection';
import { divergingScheme } from '../utils/colors';

const filtersStore = useFiltersStore();
const cropYieldsStore = useCropYieldsStore();
const gridStore = useGridStore();

const { data: cropYieldsData } = storeToRefs(cropYieldsStore);
const { data: gridData } = storeToRefs(gridStore);
const { availableCrops, availableModels } = storeToRefs(filtersStore);

const wrapperRef = ref(null);
const width = ref(0);
const height = ref(0);
const timer = ref(null);
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
  

// this handles the projection, with translation and scale based on window size (responsive)
const projection = computed(() => {
  return geoChamberlinAfrica()
    .translate([width.value/2, height.value/2])
    .scale(width.value * .75);
});

const gridCells = computed(() => {
  if (!gridData.value || !cropYieldsData.value) return;
  return gridData.value.map((cell, i) => {
    return {
      id: cell.id,
      val: cropYieldsData.value[i][selectedColumn.value],
      x: projection.value([cell.X, cell.Y])[0],
      y: projection.value([cell.X, cell.Y])[1]
    };
  });
});


const getCellColor = (value) => {
  if (!value) return 'transparent';

  const scale = d3.scaleLinear()
    .domain([selectedExtent.value[0], 0, selectedExtent.value[1]])
    .range([divergingScheme.min, divergingScheme.center, divergingScheme.max])
    .clamp(true);
  
  return scale(value);
};

const updateGrid = () => {
  if (switchCrop.value) {
    if (selectedCropIndex.value === availableCrops.value.length - 1) {
      selectedCropIndex.value = 0;
    } else {
      selectedCropIndex.value++;
    }
    switchCrop.value = false;
  } else {
    if (selectedScenarioIndex.value === futureScenarios.value.length - 1) {
      selectedScenarioIndex.value = 0;
    } else {
      selectedScenarioIndex.value++;
    }
    switchCrop.value = true;
  }
};

onMounted(() => {
  gridStore.load();
  cropYieldsStore.load();

  width.value = wrapperRef.value.clientWidth;
  height.value = wrapperRef.value.clientHeight;

  timer.value = setInterval(() => {
    updateGrid();
  }, 2000)
});


onBeforeUnmount(() => {
  clearInterval(timer.value);
});

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

svg .grid-cell {
  transition: fill 1s ease-in-out;
}

</style>