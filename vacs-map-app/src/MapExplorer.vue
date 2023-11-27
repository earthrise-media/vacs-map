<template>
  <LayoutOverview>
    <div class="map-wrapper-row">
      <ExploreSidebar />
      <div class="map-wrapper">
        <component :is="selectedMapComponent" />
        <div class="map-overlay">
          <select v-model="selectedMap">
            <option v-for="map in availableMaps" :value="map.id">{{ map.name }}</option>
          </select>
        </div>
      </div>
    </div>
  </LayoutOverview>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import MapContainerColor from '@/components/MapContainerColor.vue'
import MapContainerColorAcrossScenarios from './components/MapContainerColorAcrossScenarios.vue'
import MapContainerColorRadius from '@/components/MapContainerColorRadius.vue'
import MapContainerNotFilled from '@/components/MapContainerNotFilled.vue'
import MapContainerNotFilledTwoLayers from '@/components/MapContainerNotFilledTwoLayers.vue'
import MapContainerColorAfricanUnion from '@/components/MapContainerColorAfricanUnion.vue'
import MapContainerColorSandSoil from '@/components/MapContainerColorSandSoil.vue'
import MapContainerColorSoil from '@/components/MapContainerColorSoil.vue'
import MapContainerColorSand from '@/components/MapContainerColorSand.vue'
import MapContainerColorPopulation from '@/components/MapContainerColorPopulation.vue';
import { useMapExploreStore } from '@/stores/mapExplore'
import LayoutOverview from './components/layouts/LayoutOverview.vue'
import ExploreSidebar from './components/ExploreSidebar.vue'

const availableMaps = [
  {
    id: 'just-color',
    name: 'dynamic color',
    component: MapContainerColor
  },
  {
    id: 'color-across-scenarios',
    name: 'color across scenarios',
    component: MapContainerColorAcrossScenarios
  },
  {
    id: 'color-and-radius-1',
    name: 'dynamic color and radius (cropyield)',
    component: MapContainerColorRadius
  },
  {
    id: 'not-filled',
    name: 'circles not filled',
    component: MapContainerNotFilled
  },
  {
    id: 'not-filled-2',
    name: 'circles not filled, two layers',
    component: MapContainerNotFilledTwoLayers
  },
  {
    id: 'african-union',
    name: 'circles + african union regions',
    component: MapContainerColorAfricanUnion
  },
  {
    id: 'sand-soil',
    name: 'circles + sand + soil carbon',
    component: MapContainerColorSandSoil
  },
  {
    id: 'soil',
    name: 'circles + soil carbon',
    component: MapContainerColorSoil
  },
  {
    id: 'sand',
    name: 'circles + sand',
    component: MapContainerColorSand
  },
  {
    id: 'population',
    name: 'circles + population',
    component: MapContainerColorPopulation
  },
]

const mapExploreStore = useMapExploreStore()
const { selectedMap } = storeToRefs(mapExploreStore)

if (!selectedMap.value) {
  selectedMap.value = availableMaps[1].id
}

const selectedMapComponent = computed(() => {
  return availableMaps.find(({ id }) => id === selectedMap.value).component
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

.map-overlay {
  position: absolute;
  top: 5rem;
  right: 1rem;
}
</style>
