<template>
  <div class="crop-cards">
    <CardWrapper 
      v-for="crop in filteredCrops" 
      :key="crop"
      :title="crop"
      :description="'description'"
      :handle-click="() => navigate(crop)"
    >
      <div class="card-background"></div>
    </CardWrapper>
  </div>
</template>

<script setup>
import slugify from 'slugify';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFiltersStore } from '@/stores/filters';
import CardWrapper from './CardWrapper.vue';

const router = useRouter();
const filtersStore = useFiltersStore();
const { availableCrops, selectedCrop } = storeToRefs(filtersStore);

// TODO actually filter
const filteredCrops = computed(() => availableCrops.value);

const navigate = (crop) => {
  selectedCrop.value = crop;
  router.push('map-explore');
}

</script>

<style scoped>
.crop-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
}

.card-background {
  height: 15rem;
  width: 100%;
  background: var(--black);
}
</style>
