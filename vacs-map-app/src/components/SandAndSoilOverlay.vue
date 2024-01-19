<template>
  <div class="overlay-wrapper">
    <h1>Sand and soil</h1>
    <h2>How do sand content and soil carbon impact crop growth?</h2>
    <p>
      {{ copy.sandAndSoil }}
    </p>

    <RasterLegend title="Soil carbon" min-value="0%" max-value="6%" :color-extent="soilScheme" />
    <RasterLegend title="Sand content" min-value="0%" max-value="50%" :color-extent="sandScheme" />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useContentStore } from '@/stores/siteContent'
import { useColorStore } from '@/stores/colors'
import RasterLegend from '@/components/RasterLegend.vue'

const contentStore = useContentStore()
const colorStore = useColorStore()

const { copy } = storeToRefs(contentStore)
const { soil: soilScheme, sand: sandScheme } = storeToRefs(colorStore)
</script>

<style scoped>
.overlay-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  min-height: 100%;

  backdrop-filter: blur(8px);
  background: var(--black-90);
  color: var(--white);

  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  justify-content: center;

  padding: 1.25rem;
}

h1 {
  font-family: var(--font-family-header);
}

h2 {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 110%; /* 1.375rem */
}

p {
  font-size: 1rem;
  font-weight: 400;
  line-height: 160%; /* 1.6rem */
  white-space: pre-line;
}
</style>
