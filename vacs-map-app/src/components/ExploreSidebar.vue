<template>
  <div class="sidebar">
    <div class="crop-selection">
      <select v-model="selectedCrop" class="crop-picker">
        <option
          v-for="crop in availableCrops"
          :key="crop"
          :value="crop"
        > {{crop}} </option>
      </select>

      <span> a description of {{ selectedCrop }}</span>
    </div>

    <div class="crop-fingerprint">
      crop fingerprint
    </div>

    <div class="scenarios">
      <div v-for="scenario in futureScenarios" :key="scenario" class="scenario" :class="{selected: selectedModel === scenario}" @click="selectedModel = scenario">
        <span>
          {{ scenario }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useFiltersStore } from '@/stores/filters';

const filtersStore = useFiltersStore();
const {
  availableCrops,
  selectedCrop,
  availableModels,
  selectedModel,
} = storeToRefs(filtersStore);

const futureScenarios = computed(() => availableModels.value.filter(d => d.startsWith('future')));
</script>

<style scoped>

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: var(--page-horizontal-margin);
  padding-right: 2rem;
  width: 400px;
}

.crop-selection {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.crop-fingerprint {
  width: 100%;
  height: 40%;
  border: 1px solid white;
  border-radius: 0.5rem;
}

.scenarios { 
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

.scenario {
  width: 100%;
  border: 1px solid gray;
  border-radius: 0.5rem;
  cursor: pointer;
}

.scenario.selected {
  cursor: pointer;
  border-color: white;
}

</style>