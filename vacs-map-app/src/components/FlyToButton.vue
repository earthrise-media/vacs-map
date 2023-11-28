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

const end1 = {
  zoom: 6,
  center: [38.969, 10.182]
};

const end2 = {
  zoom: 2.75,
  center: [1.99, 30.11]
};

const end3 = {
  zoom: 3.75,
  center: [-4.28, 10.29]
};

const end4 = {
  zoom: 2.75,
  center: [24.82, -23.08]
};

const end5 = {
  zoom: 3.75,
  center: [37.19, -18]
}

const handleClick = () => {
  map.value.setFog({
    'color': 'hsla(209, 78%, 63%, 0.1)', // Pink fog / lower atmosphere
    'high-color': 'hsl(210, 8%, 10%)', // Blue sky / upper atmosphere
    'horizon-blend': 0.4 // Exaggerate atmosphere (default is .1)
  });

  map.value.flyTo({
    ...end5, // Fly to the selected target
    duration: 120000, // Animate over 12 seconds
    essential: true
  });
};
</script>

<style scoped>
</style>
