<template>
  <div class="content-modal" :style="{ top: `${top}px` }">
    <div class="content-modal-inner" ref="contentInnerRef">
      <div class="close-button" @click="emit('close')">
        <img src="@/assets/img/close.svg" />
      </div>
      <span class="header">
        {{ title }}
      </span>
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs } from 'vue'
import { onClickOutside } from '@vueuse/core'

const props = defineProps({
  top: {
    type: Number,
    default: 0
  },

  title: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const { top } = toRefs(props)
const contentInnerRef = ref(null)

onClickOutside(contentInnerRef, () => emit('close'))
</script>

<style scoped>
.content-modal {
  background: rgba(52, 63, 69, 0.7);
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5000;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
  align-items: center;
}

.content-modal-inner {
  position: relative;
  display: flex;
  flex-direction: column;
  background: var(--white);
  color: var(--black);
  border-radius: 4px;
  overflow-y: auto;
  max-width: 50%;
  padding: 2.5rem;
}

.header {
  font-family: var(--font-family-h2);
  font-size: 1.875rem;
}

.close-button {
  position: absolute;
  right: 1.75rem;
  top: 1.5rem;
  cursor: pointer;
  height: 20px;
}
</style>
