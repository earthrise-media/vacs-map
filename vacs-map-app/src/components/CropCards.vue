<template>
  <div class="crop-cards">
    <div class="crop-card" v-for="crop in filteredCrops" :key="crop">
      <router-link :to="`/map-explore`" @click="selectedCrop = crop">
        {{ crop }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import slugify from 'slugify';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useFiltersStore } from '@/stores/filters';

const router = useRouter();
const filtersStore = useFiltersStore();
const { availableCrops, selectedCrop } = storeToRefs(filtersStore);

// TODO actually filter
const filteredCrops = computed(() => availableCrops.value);

</script>

<style scoped>
.crop-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
}

.crop-card {
  background: white;
  border-radius: 10px;
  height: 10rem;
}
</style>
