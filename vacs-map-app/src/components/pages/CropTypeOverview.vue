<template>
  <LayoutOverview>
    <div class="wrapper">
      <CropFilters />
      <CropCards />
    </div>
  </LayoutOverview>
</template>

<script setup>
import LayoutOverview from '@/components/layouts/LayoutOverview.vue'
import CropCards from '@/components/CropCards.vue'
import CropFilters from '@/components/CropFilters.vue'
</script>

<style scoped>
.wrapper {
  margin: 0 var(--page-horizontal-margin);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  height: 100%;
}
</style>
