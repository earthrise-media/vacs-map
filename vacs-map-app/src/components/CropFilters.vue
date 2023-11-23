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

    <div class="crop-groups">
      <div 
        :class="{
          selected: selectedCropGroup === ''
        }"
        @click="() => (selectedCropGroup = '')"
      >
        All crops
      </div>
      <div
        v-for="group in availableCropGroups"
        :key="group"
        :class="{
          selected: selectedCropGroup === group
        }"
        @click="() => (selectedCropGroup = group)"
      >
        {{ group }}
      </div>
    </div>

    <div class="sort-by">
      <div class="sort-order">
        <div class="sort-order-option">
          <input type="radio" v-model="cropSortOrder" id="descending" value="descending">
          <label for="descending">High to low</label>
        </div>
        <div class="sort-order-option">
          <input type="radio" v-model="cropSortOrder" id="ascending" value="ascending">
          <label for="ascending">Low to high</label>
        </div>
      </div>

      <select v-model="cropSortBy">
        <option 
          v-for="option in cropSortByOptions" 
          :key="option"
          :value="option"
        >
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/filters'

const filtersStore = useFiltersStore();
const { 
  availableModels, 
  selectedModel, 
  availableCropGroups, 
  selectedCropGroup,
  cropSortByOptions,
  cropSortBy,
  cropSortOrder,
} = storeToRefs(filtersStore);

const futureScenarios = computed(() => {
  return availableModels.value.filter((d) => d.startsWith('future'))
})
</script>

<style scoped>
.crop-filters {
  display: flex;
  gap: 2rem;
}

.scenarios, .crop-groups {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  cursor: pointer;
}

.selected {
  text-decoration: underline;
}

.sort-by {
  display: flex;
  gap: 1rem;
  margin-left: auto;
}

.sort-order {
  display: flex;
  gap: 0.5rem;
}

.sort-order-option {
  display: flex;
  gap: 0.25rem;
}
</style>
