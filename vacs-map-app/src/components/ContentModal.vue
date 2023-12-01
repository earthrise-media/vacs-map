<template>
  <div class="content-modal" :style="{ top: `${top}px` }">
    <div class="content-modal-inner" :class="{ wide }" ref="contentInnerRef">
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
  },

  wide: {
    type: Boolean,
    default: false
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
  background: var(--dark-gray);
  color: var(--white);
  border-radius: 1rem;
  max-height: 75%;
  overflow-y: auto;
  max-width: 40%;
  padding: 2.5rem;

  white-space: pre-line;
}

.wide {
  max-width: 80%;
}

.header {
  font-family: var(--font-family-h2);
  font-size: 1.875rem;
  padding-bottom: 0.25rem;
}

.close-button {
  position: sticky;
  display: flex;
  width: 100%;
  justify-content: flex-end;
  right: 0rem;
  top: 0rem;
  cursor: pointer;
  height: 20px;
}

@media only screen and (max-width: 720px) {
  .content-modal {
    justify-content: flex-end;
  }
  .content-modal-inner {
    max-width: 100%;
    max-height: 92%;
    border-radius: 1.875rem 1.875rem 0 0;
  }
}
</style>
