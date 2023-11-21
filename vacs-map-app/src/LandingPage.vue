<template>
  <LayoutOpen>
    <div class="map-wrapper-row">
      <div class="callout">
        <div class="callout-header">What crops have the most potential in a changing climate?</div>
        <div class="callout-content">
          The Vision for Adapted Crops and Soils (VACS) aims to foster more resilient food systems,
          with an initial focus on the African continent. VACS seeks to boost agricultural
          productivity and nutrition by developing diverse, climate-resilient crop varieties and
          building healthy soils. Keep reading
        </div>
        <button class="go-to-topic" @click="navigate">Find out</button>
      </div>
      <div class="map-wrapper">
        <MapHomepage />
      </div>
    </div>
  </LayoutOpen>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LayoutOpen from '@/components/layouts/LayoutOpen.vue'
import MapHomepage from './components/MapHomepage.vue'

const router = useRouter()
const navigate = () => router.push('/crops')
</script>

<style scoped>
.map-wrapper-row {
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: space-between;
}

.map-wrapper {
  display: flex;
  flex-direction: column;
  width: 55%;
  justify-content: center;
}

.callout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 5rem;
  flex-basis: 0;
  flex-grow: 1;
  gap: 2rem;
}

.callout-header {
  font-size: 3em;
  line-height: 1.25em;
}

.go-to-topic {
  appearance: none;
  border: 1px solid #bfbfbf;
  background: none;
  border-radius: 4px;
  color: var(--white);
  font-size: 0.9em;
}

.topic-picker {
  display: block;
  font-size: 1em;
  appearance: none;
}
</style>
