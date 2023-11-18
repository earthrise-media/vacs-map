<template>
  <div class="overview-top">
    <div class="row">
      <div>
        What crops have the most potential in a changing climate?
      </div>
      <NavigationButton :to="backRoute">Go Back</NavigationButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import NavigationButton from '@/components/NavigationButton.vue';

const route = useRoute();
const backRoute = computed(() => route.path === '/map-explore' ? '/crops' : '/');
</script>

<style scoped>
.overview-top {
  display: flex;
  flex-direction: column;
  font-size: 1.5rem;
  gap: 0.5rem;
  margin: 1rem var(--page-horizontal-margin);
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
</style>
