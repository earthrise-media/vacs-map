<template>
  <LayoutOverview>
    {{ slug }}
  </LayoutOverview>
</template>

<script setup>
import { useRoute } from 'vue-router'
import LayoutOverview from '@/components/layouts/LayoutOverview.vue'

const route = useRoute()

// TODO handle fact that this is a slug (in case of multi-word crop names)
const { slug } = route.params
</script>

<style scoped></style>
