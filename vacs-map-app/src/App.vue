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
  gridStore.load()
  cropYieldsStore.load()
  cropInformationStore.load()

  // initialize so pages load
  filtersStore.selectedCrop = filtersStore.availableCrops[0]

  window.addEventListener('resize', documentHeight)
  documentHeight
})

onUnmounted(() => {
  window.removeEventListener('resize')
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
