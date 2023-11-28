<template>
  <button class="fly-to" @click="handleClick">Fly to</button>
</template>


<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  map: {
    type: Object,
    default: null
  },

  mapReady: {
    type: Boolean,
    default: false
  }
})

const { map } = toRefs(props)

const end = {
  center: [8.11862, 46.58842],
  zoom: 12.5,
  bearing: 130,
  pitch: 75
};

const handleClick = () => {
  map.value.setFog({
    'color': 'rgb(220, 159, 159)', // Pink fog / lower atmosphere
    'high-color': 'rgb(36, 92, 223)', // Blue sky / upper atmosphere
    'horizon-blend': 0.4 // Exaggerate atmosphere (default is .1)
  });

  map.value.flyTo({
    ...end, // Fly to the selected target
    duration: 12000, // Animate over 12 seconds
    essential: true // This animation is considered essential with
    //respect to prefers-reduced-motion
  });
};
</script>

<style scoped>
</style>
