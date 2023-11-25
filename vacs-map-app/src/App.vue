<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCropYieldsStore } from '@/stores/cropYields'
import { useCropInformationStore } from './stores/cropInformation'

const cropYieldsStore = useCropYieldsStore()
const cropInformationStore = useCropInformationStore()

onMounted(() => {
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
