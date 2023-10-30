<template>
  <main>
    <BaseMap />
    <div class="overlay">
      <Filters />
    </div>
  </main>
</template>

<script setup>
import BaseMap from '@/components/BaseMap.vue';
import Filters from '@/components/Filters.vue';
</script>

<style scoped>
.overlay {
  position: absolute;
  left: 1rem;
  top: 1rem;
}
</style>
