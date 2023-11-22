<template>
  <RouterLink class="navigation-button" v-bind="props">
    <slot></slot>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const props = defineProps({
  ...RouterLink.props
})
</script>

<style scoped>
.navigation-button {
  border: 1px solid #bfbfbf;
  border-radius: 4px;
  color: var(--white);
  font-size: 0.8em;
  padding: 0.25rem 0.5rem;
  text-decoration: none;
}
</style>
