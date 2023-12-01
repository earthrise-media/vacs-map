<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useGridStore } from '@/stores/grid'
import { useFiltersStore } from '@/stores/filters'

const cropYieldsStore = useCropYieldsStore()
const cropInformationStore = useCropInformationStore()
const gridStore = useGridStore()
// load filters store to ensure we have all needed data in app
const filtersStore = useFiltersStore()

onMounted(() => {
  gridStore.load()
  cropYieldsStore.load()
  cropInformationStore.load()
})
</script>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
