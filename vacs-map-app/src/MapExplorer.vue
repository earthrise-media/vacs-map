<template>
  <main>
    <div class="top-bar">
      <select v-model="selectedMap">
        <option v-for="map in availableMaps" :value="map.id">{{ map.name }}</option>
      </select>
      <Filters />
    </div>
    <component :is="selectedMapComponent" />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import MapContainerColor from '@/components/MapContainerColor.vue';
import MapContainerColorRadius from '@/components/MapContainerColorRadius.vue';
import MapContainerNotFilled from '@/components/MapContainerNotFilled.vue';
import MapContainerNotFilledTwoLayers from '@/components/MapContainerNotFilledTwoLayers.vue';
import MapContainerColorAfricanUnion from '@/components/MapContainerColorAfricanUnion.vue';
import MapContainerColorSoil from '@/components/MapContainerColorSoil.vue';
import MapContainerColorSand from '@/components/MapContainerColorSand.vue';
import Filters from '@/components/Filters.vue';

const availableMaps = [
  {
    id: 'just-color',
    name: 'dynamic color',
    component: MapContainerColor,
  },
  {
    id: 'color-and-radius-1',
    name: 'dynamic color and radius (cropyield)',
    component: MapContainerColorRadius,
  },
  {
    id: 'not-filled',
    name: 'circles not filled',
    component: MapContainerNotFilled,
  },
  {
    id: 'not-filled-2',
    name: 'circles not filled, two layers',
    component: MapContainerNotFilledTwoLayers,
  },
  {
    id: 'african-union',
    name: 'circles + african union regions',
    component: MapContainerColorAfricanUnion,
  },
  {
    id: 'soil',
    name: 'circles + soil carbon',
    component: MapContainerColorSoil,
  },
  {
    id: 'sand',
    name: 'circles + sand',
    component: MapContainerColorSand,
  },
];
const selectedMap = ref(availableMaps[0].id);
const selectedMapComponent = computed(() => {
  return availableMaps.find(({ id }) => id === selectedMap.value).component;
});
</script>

<style scoped>
.top-bar {
  padding: 0.5rem 2rem;
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}

.overlay {
  position: absolute;
  left: 1rem;
  top: 3rem;
}
</style>

