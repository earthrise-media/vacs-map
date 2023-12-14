<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useGridStore } from '@/stores/grid'
import { useFiltersStore } from '@/stores/filters'

const cropYieldsStore = useCropYieldsStore()
const cropInformationStore = useCropInformationStore()
const gridStore = useGridStore()
const filtersStore = useFiltersStore()

const documentHeight = () => {
  const doc = document.documentElement
  doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
}

onMounted(() => {
  // need to load the crop information file first, then load other data
  cropInformationStore.load().then(() => {
    gridStore.load()
    cropYieldsStore.load()
  })

  window.addEventListener('resize', documentHeight)
  documentHeight
})

onUnmounted(() => {
  window.removeEventListener('resize', documentHeight)
})
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  height: var(--doc-height);
  overflow: hidden;
}
</style>
