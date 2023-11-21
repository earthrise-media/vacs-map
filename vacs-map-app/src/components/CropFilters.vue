<template>
  <div class="crop-filters">
    <div class="scenarios">
      <div
        v-for="scenario in futureScenarios"
        :key="scenario"
        :class="{
          selected: scenario === selectedModel
        }"
        @click="() => (selectedModel = scenario)"
      >
        {{ scenario }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/filters'

const filtersStore = useFiltersStore()
const { availableModels, selectedModel } = storeToRefs(filtersStore)

const futureScenarios = computed(() => {
  return availableModels.value.filter((d) => d.startsWith('future'))
})
</script>

<style scoped>
.crop-filters {
  display: flex;
  gap: 1rem;
}

.scenarios {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  cursor: pointer;
}

.selected {
  text-decoration: underline;
}
</style>
