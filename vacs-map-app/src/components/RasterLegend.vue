<template>
  <div class="legend-wrapper">
    <div class="legend-title">
      {{ title }}
    </div>

    <div class="legend-gradient" :style="gradientStyle"></div>
    <div class="legend-ticks">
      <div class="legend-tick">{{ minValue }}</div>
      <div class="legend-tick">{{ maxValue }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed, toRefs } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  minValue: {
    type: String,
    default: ''
  },

  maxValue: {
    type: String,
    default: ''
  },

  colorExtent: {
    type: Array,
    default: () => []
  }
})

const { colorExtent } = toRefs(props)

const gradientStyle = computed(() => {
  return {
    background: `linear-gradient(to right, ${colorExtent.value[0]}, ${colorExtent.value[1]})`
  }
})
</script>

<style scoped>
.legend-wrapper {
  background: var(--black-90);
  border: 1px solid var(--dark-gray);
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 100%;
}

.legend-title {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.legend-gradient {
  height: 1rem;
}

.legend-ticks {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.legend-tick {
  font-size: 0.8em;
  text-align: center;
}

.legend-tick:first-of-type {
  text-align: left;
}

.legend-tick:last-of-type {
  text-align: right;
}
</style>
