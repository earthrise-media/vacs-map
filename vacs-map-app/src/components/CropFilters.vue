<template>
  <div class="crop-filters">
    <div class="filters-header mobile">
      <span class="header"> Filter crops </span>
      <img src="@/assets/img/close.svg" alt="" @click="$emit('closeFilters')" />
    </div>

    <div class="left-side">
      <span class="mobile category-header"> climate scenario </span>
      <RadioSwitch v-model="selectedModel" :options="scenarioOptions" name="selected-scenario" />

      <span class="mobile category-header"> food groups </span>
      <div class="crop-groups">
        <div
          class="crop-group-label"
          :class="{
            selected: selectedCropGroup === ''
          }"
          @click="() => (selectedCropGroup = '')"
        >
          All crops
        </div>
        <div
          class="crop-group-label"
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
    </div>

    <span class="mobile category-header"> order by </span>
    <div class="sort-by">
      <RadioList v-model="cropSortOrder" :options="sortOrderOptions" name="sort-order" />

      <select v-model="cropSortBy">
        <option v-for="option in cropSortByOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/filters'
import { useContentStore } from '@/stores/siteContent'
import RadioList from '@/components/RadioList.vue'
import RadioSwitch from '@/components/RadioSwitch.vue'

const contentStore = useContentStore()
const { copy } = storeToRefs(contentStore)

defineEmits(['closeFilters'])
const filtersStore = useFiltersStore()
const {
  availableModels,
  selectedModel,
  availableCropGroups,
  selectedCropGroup,
  cropSortByOptions,
  cropSortBy,
  cropSortOrder
} = storeToRefs(filtersStore)

const futureScenarios = computed(() => {
  return availableModels.value.filter((d) => d.startsWith('future'))
})

const sortOrderOptions = [
  {
    value: 'descending',
    label: 'High to low'
  },
  {
    value: 'ascending',
    label: 'Low to high'
  }
]

const scenarioOptions = computed(() => {
  return futureScenarios.value.map((s) => {
    return {
      value: s,
      label: copy.value[`${s}_label`]
    }
  })
})
</script>

<style scoped>
.crop-filters {
  display: flex;
  gap: 1.25rem;
  align-items: center;
}

.left-side {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
}

.scenarios,
.crop-groups {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1rem;
  cursor: pointer;
}

.crop-group-label {
  background: var(--dark-gray);
  border-radius: 0.25rem;
  padding: 0.5rem;
  font-size: 0.8125rem;
  line-height: 1rem;
  font-weight: 500;
  white-space: nowrap;
}

.crop-group-label:hover {
  background: var(--dark-gray-hover);
}

.crop-group-label.selected {
  background: var(--ui-blue);
  color: var(--black);
}

.crop-group-label.selected:hover {
  background: var(--ui-blue-hover);
}
.sort-by {
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: flex-end;
  align-self: flex-start;
  gap: 1rem;
  margin-left: auto;
}

.sort-by select {
  appearance: none;
  cursor: pointer;
  border-radius: 0.25rem;
  border: 1px solid var(--gray);
  background: var(--dark-gray);
  text-transform: uppercase;
  color: var(--ui-blue);
  padding: 0.5rem;
  padding-right: 2rem;
  font-size: 1rem;

  background-image: url('../assets/img/select-arrow-blue.svg');
  background-position: 95% center;
  background-repeat: no-repeat;
}

.sort-by select:hover {
  color: var(--ui-blue-hover);
}

.mobile {
  display: none;
}

@media only screen and (max-width: 720px) {
  .mobile {
    display: flex;
    justify-content: flex-start;
  }

  .filters-header {
    width: 100%;
    display: flex;
  }

  .filters-header img {
    margin-left: auto;
    margin-right: 1rem;
    width: 1rem;
    cursor: pointer;
  }

  .header {
    font-family: var(--font-family-h2);
    font-size: 1.25rem;
  }

  .category-header {
    text-transform: uppercase;
    font-size: 0.875rem;
  }
  .crop-filters {
    z-index: 500;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 2rem var(--page-horizontal-margin);
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
    background: var(--black);
    border-radius: 1.875rem 1.875rem 0rem 0rem;
  }

  .left-side {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .crop-groups {
    gap: 0.5rem;
  }

  .sort-by {
    width: 100%;
    margin: 0;
    flex-direction: column-reverse;
    gap: 0.5rem;
  }
}
</style>
