<template>
  <div class="layout-overview">
    <OverviewTop :topic="topic" />
    <div class="layout-overview-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import OverviewTop from '@/components/OverviewTop.vue'
import { topicUrlOptions } from '@/constants/topics'

const props = defineProps({
  topicLabel: {
    type: String,
    default: ''
  }
})
const { topicLabel } = toRefs(props)
const topic = computed(() => topicUrlOptions.find(({ label }) => label === topicLabel.value)?.value)
</script>

<style scoped>
.layout-overview {
  background: var(--dark-gray);
  color: var(--white);
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.layout-overview-content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: auto;
}
</style>
