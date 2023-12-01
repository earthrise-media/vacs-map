<template>
  <div class="layout-open">
    <slot></slot>
  </div>
</template>

<script setup></script>

<style scoped>
.layout-open {
  height: 100vh;
  max-height: var(--doc-height);
  min-height: var(--doc-height);
  width: 100vw;
}
</style>
