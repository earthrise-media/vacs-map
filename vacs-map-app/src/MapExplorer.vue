<template>
  <LayoutOpen>
    <div class="map-wrapper-row">
      <div class="map-wrapper">
        <component :is="selectedMapComponent">
          <template v-slot="{ map, mapReady }">
            <RegionPicker :map="map" :map-ready="mapReady" />
            <span class="region-picker-message hover-message"> Zoom to a region </span>
          </template>
        </component>
        <div class="overlay-wrapper">
          <OverviewTop class="interactive"/>
          <div class="map-overlay desktop">
            <div class="overlay-left">
              <ExploreSidebar class="interactive" ref="overlayLeftRef"/>
              <MapLegend class="interactive"/>
            </div>
            <div class="overlay-right">
              <select v-model="selectedMap" class="interactive">
                <option v-for="map in availableMaps" :value="map.id">{{ map.name }}</option>
              </select>
              <span class="layer-selector-message hover-message"> Add layer </span>
            </div>
          </div>
          <MobileExploreMapControls />
        </div>
      </div>
    </div>
    <MapTooltip />
  </LayoutOpen>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useResizeObserver } from '@vueuse/core'
import MapContainerColor from '@/components/MapContainerColor.vue'
import MapContainerColorAcrossScenarios from './components/MapContainerColorAcrossScenarios.vue'
import MapContainerColorRadius from '@/components/MapContainerColorRadius.vue'
import MapContainerNotFilled from '@/components/MapContainerNotFilled.vue'
import MapContainerNotFilledTwoLayers from '@/components/MapContainerNotFilledTwoLayers.vue'
import MapContainerColorAfricanUnion from '@/components/MapContainerColorAfricanUnion.vue'
import MapContainerColorSandSoil from '@/components/MapContainerColorSandSoil.vue'
import MapContainerColorSoil from '@/components/MapContainerColorSoil.vue'
import MapContainerColorSand from '@/components/MapContainerColorSand.vue'
import MapContainerColorPopulation from '@/components/MapContainerColorPopulation.vue'
import { useMapExploreStore } from '@/stores/mapExplore'
import LayoutOpen from './components/layouts/LayoutOpen.vue'
import ExploreSidebar from './components/ExploreSidebar.vue'
import RegionPicker from './components/RegionPicker.vue'
import MobileExploreMapControls from './components/MobileExploreMapControls.vue'
import MapTooltip from '@/components/MapTooltip.vue'
import MapLegend from '@/components/MapLegend.vue'
import OverviewTop from '@/components/OverviewTop.vue'

const availableMaps = [
  // {
  //   id: 'just-color',
  //   name: 'dynamic color',
  //   component: MapContainerColor
  // },
  {
    id: 'color-across-scenarios',
    name: 'Default',
    component: MapContainerColorAcrossScenarios
  },
  // {
  //   id: 'color-and-radius-1',
  //   name: 'dynamic color and radius (cropyield)',
  //   component: MapContainerColorRadius
  // },
  // {
  //   id: 'not-filled',
  //   name: 'circles not filled',
  //   component: MapContainerNotFilled
  // },
  // {
  //   id: 'not-filled-2',
  //   name: 'circles not filled, two layers',
  //   component: MapContainerNotFilledTwoLayers
  // },
  // {
  //   id: 'african-union',
  //   name: 'circles + african union regions',
  //   component: MapContainerColorAfricanUnion
  // },
  {
    id: 'sand-soil',
    name: 'Sand + Soil',
    component: MapContainerColorSandSoil
  },
  // {
  //   id: 'soil',
  //   name: 'circles + soil carbon',
  //   component: MapContainerColorSoil
  // },
  // {
  //   id: 'sand',
  //   name: 'circles + sand',
  //   component: MapContainerColorSand
  // },
  {
    id: 'population',
    name: 'Population',
    component: MapContainerColorPopulation
  }
]

const basePadding = 50
const leftWidth = ref(null)
const overlayLeftRef = ref(null)

useResizeObserver(overlayLeftRef, ([entry]) => {
  leftWidth.value = entry.contentRect.width

  mapPadding.value = {
    ...mapPadding.value,
    left: basePadding + leftWidth.value
  }
})

const mapExploreStore = useMapExploreStore()
const { selectedMap, mapPadding } = storeToRefs(mapExploreStore)

if (!selectedMap.value) {
  selectedMap.value = availableMaps[0].id
}

const selectedMapComponent = computed(() => {
  return availableMaps.find(({ id }) => id === selectedMap.value).component
})

onMounted(() => {
  mapPadding.value = {
    top: basePadding,
    right: basePadding,
    left: basePadding,
    bottom: basePadding
  }
})

onUnmounted(() => {
  mapPadding.value = null
})
</script>

<style scoped>
.map-wrapper-row {
  display: flex;
  flex-direction: row;
  height: 100%;
}

.map-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.overlay-wrapper {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0rem;
  left: 0rem;
  pointer-events: none;

  display: flex;
  flex-direction: column;
}

.map-overlay {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  padding: 1rem 0 2rem 0;
}

.overlay-left {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  gap: 2rem;
}

.overlay-right {
  position: relative;
  margin-right: var(--page-horizontal-margin);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.interactive {
  pointer-events: all;
}

select {
  cursor: pointer;
  width: 1.875rem;
  padding-right: 1.875rem;
  aspect-ratio: 1/1;

  border-radius: 100%;
  background: none;
  border: none;
  appearance: none;
  background: var(--ui-blue);
  background-image: url('@/assets/img/layers.svg');
  background-position: center center;
  background-repeat: no-repeat;
  outline: none;
}

select:hover {
  background-color: var(--ui-blue-hover);
}

.hover-message {
  opacity: 0;
  transition: all 0.5s ease;
  font-size: 1rem;
  color: var(--gray);
  white-space: nowrap;
  padding: 0.25rem 0.5rem;
}

.layer-selector-message {
  position: absolute;
  left: 1rem;
  transform: translateX(-130%);
}

.region-picker-message {
  position: absolute;
  right: calc(var(--page-horizontal-margin) - 0.75rem);
  bottom: 11rem;
}

select:hover + .layer-selector-message {
  opacity: 1;
}

@media only screen and (max-width: 720px) {
  .desktop {
    display: none;
  }
}
</style>

<style>
.region-picker {
  position: absolute;
  bottom: 2.5rem;
  right: var(--page-horizontal-margin);
  z-index: 1000;
  width: 8rem;
  height: 8rem;
  padding: 1rem;
}

.region-picker:hover + .region-picker-message {
  opacity: 1;
}

@media only screen and (max-width: 720px) {
  .region-picker {
    display: none;
  }
}
</style>
