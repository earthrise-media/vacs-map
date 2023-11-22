<template>
  <div class="layout-open">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped>
.layout-open {
  background: var(--dark-gray);
  color: var(--white);
  min-height: 100vh;
  width: 100vw;
}
</style>
