<template>
  <div class="card-container">
    <div class="crop-cards">
      <CardWrapper
        v-for="crop in filteredCrops"
        :key="crop"
        :title="crop"
        :description="'description'"
        :handle-click="() => navigate(crop)"
      >
        <img :src="`src/assets/img/minimaps/${crop}_${selectedModel}.svg`" alt="" />
      </CardWrapper>
    </div>
  </div>
</template>

<script setup>
import slugify from 'slugify'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useFiltersStore } from '@/stores/filters'
import CardWrapper from './CardWrapper.vue'

const router = useRouter()
const filtersStore = useFiltersStore()
const { availableCrops, selectedCrop, selectedModel } = storeToRefs(filtersStore)

// TODO actually filter
const filteredCrops = computed(() => availableCrops.value)

const navigate = (crop) => {
  selectedCrop.value = crop
  router.push('map-explore')
}
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: 2rem;
}
.crop-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
}

img {
  width: 100%;
  aspect-ratio: 1/1;
}
</style>
