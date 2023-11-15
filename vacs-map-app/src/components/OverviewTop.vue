<template>
  <div class="overview-top">
    <div class="row">
      <div>
        How does <TopicPicker :value="topic" /> impact decisions about food security?
      </div>
      <NavigationButton to="/map-explore">Explore the map</NavigationButton>
    </div>
    <div class="row">
      <NavigationButton to="/">Go Back</NavigationButton>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue';
import NavigationButton from '@/components/NavigationButton.vue';
import TopicPicker from '@/components/TopicPicker.vue';

const props = defineProps({
  topic: {
    type: String,
    default: '',
  },
});
const { topic } = toRefs(props);
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
