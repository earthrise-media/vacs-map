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
  font-family: var(--font-family-body);
  border-radius: 6.25rem;
  color: var(--white);
  background: var(--dark-gray);
  font-size: 1rem;
  padding: 0.625rem 0.75rem;
  text-decoration: none;
  display: flex;
}

.navigation-button:hover {
  background: var(--dark-gray-hover);
}

@media only screen and (max-width: 720px) {
  .navigation-button {
    background: var(--ui-blue);
    aspect-ratio: 1/1;
  }  
}
</style>
