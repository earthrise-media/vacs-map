<template>
  <div class="filters">
    <select @change="(e) => (selectedCrop = e.target.value)" :value="selectedCrop">
      <option value="">Select a crop</option>
      <option v-for="crop in availableCrops" :key="crop" :value="crop">
        {{ crop }}
      </option>
    </select>
    <select @change="(e) => (selectedMetric = e.target.value)" :value="selectedMetric">
      <option value="">Select a metric</option>
      <option v-for="metric in availableMetrics" :key="metric" :value="metric">
        {{ metric }}
      </option>
    </select>
    <select @change="(e) => (selectedModel = e.target.value)" :value="selectedModel">
      <option value="">Select a model</option>
      <option v-for="model in availableModels" :key="model" :value="model">
        {{ model }}
      </option>
    </select>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/filters'

const filtersStore = useFiltersStore()
const {
  availableCrops,
  selectedCrop,
  availableMetrics,
  selectedMetric,
  availableModels,
  selectedModel
} = storeToRefs(filtersStore)
</script>

<style scoped>
.filters {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
</style>
