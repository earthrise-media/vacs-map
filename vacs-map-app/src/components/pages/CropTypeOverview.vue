<template>
  <LayoutOverview topic-label="crop type">
    <CropFilters />
    <CropCards />
  </LayoutOverview>
</template>

<script setup>
import LayoutOverview from '@/components/layouts/LayoutOverview.vue';
import CropCards from '@/components/CropCards.vue';
import CropFilters from '@/components/CropFilters.vue';
</script>

<style scoped>
</style>
