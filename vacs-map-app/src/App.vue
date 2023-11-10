<template>
  <main>
    <MapContainer />
    <div class="overlay">
      <Filters />
    </div>
  </main>
</template>

<script setup>
import MapContainer from '@/components/MapContainer.vue';
import Filters from '@/components/Filters.vue';
</script>

<style scoped>
.overlay {
  position: absolute;
  left: 1rem;
  top: 1rem;
}
</style>
