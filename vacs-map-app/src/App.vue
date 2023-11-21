<template>
  <main>
    <RouterView />
  </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useCropYieldsStore } from '@/stores/cropYields'

const cropYieldsStore = useCropYieldsStore()

onMounted(() => {
  cropYieldsStore.load()
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
