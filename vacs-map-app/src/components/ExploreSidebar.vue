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
      <CardWrapper 
        v-for="scenario in futureScenarios" 
        :key="scenario" 
        :title="scenario"
        :description="'this is a longer description to test how a longer description looks'"
        :is-active="selectedModel === scenario"
        :handle-click="() => selectedModel = scenario"
      >
        <DistributionPlot :scenario="scenario" />
      </CardWrapper>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useFiltersStore } from '@/stores/filters';
import DistributionPlot from './DistributionPlot.vue';
import CardWrapper from './CardWrapper.vue';

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
  justify-content: space-between;
  margin-left: var(--page-horizontal-margin);
  padding-right: 2rem;
  padding-bottom: 2rem;
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
  border: 1px solid var(--white);
  border-radius: 0.5rem;
}

.scenarios { 
  width: 100%;
  height: 40%;
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

</style>