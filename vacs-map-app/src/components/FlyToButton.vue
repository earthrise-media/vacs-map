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
  // east
  zoom: 12,
  center: [38.969, 10.182],
  pitch: 45
};

const obliqueEth = {
  zoom: 7.75,
  center: [ 36.636, 12.839],
  pitch: 70,
  bearing: 141
}

const north = {
  // north
  zoom: 2.75,
  center: [1.99, 30.11]
};

const west = {
  // west
  zoom: 3.75,
  center: [-4.28, 10.29]
};

const end4 = {
  // botswana
  zoom: 2.75,
  center: [24.82, -23.08]
};

const south = {
  // south
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
    // ...west, // Fly to the selected target
    ...south, // Fly to the selected target
    // ...obliqueEth, // Fly to the selected target
    // ...north, // Fly to the selected target
    // all scenes are 12s except all crop animation
    // duration: 12000, // Animate over 12 seconds
    duration: 120000, // Animate over 2 minutes
    essential: true
  });
};
</script>

<style scoped>
</style>
