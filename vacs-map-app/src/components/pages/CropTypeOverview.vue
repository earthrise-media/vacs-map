<template>
  <LayoutOverview>
    <div class="wrapper">
      <CropFilters class="desktop" />
      <CropCards />
      <div class="overlay mobile" :class="{ showFilters }" />
    </div>
    <CropFilters v-if="showFilters" class="mobile" @close-filters="() => (showFilters = false)" />
    <div class="mobile show-filters" @click="() => (showFilters = true)">
      <img src="@/assets/img/show-filters.svg" alt="" />
    </div>
  </LayoutOverview>
</template>

<script setup>
import { ref } from 'vue'
import LayoutOverview from '@/components/layouts/LayoutOverview.vue'
import CropCards from '@/components/CropCards.vue'
import CropFilters from '@/components/CropFilters.vue'

const showFilters = ref(false)
</script>

<style scoped>
.wrapper {
  margin: 0 var(--page-horizontal-margin);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}

.mobile {
  display: none;
}

@media only screen and (max-width: 720px) {
  .desktop {
    display: none;
  }
  .mobile {
    display: flex;
  }

  .show-filters {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    cursor: pointer;
  }

  .show-filters img {
    width: 3.5rem;
  }

  .overlay.showFilters {
    position: fixed;
    width: 100%;
    height: 100%;
    pointer-events: none;
    background: var(--black-70);
  }
}
</style>
