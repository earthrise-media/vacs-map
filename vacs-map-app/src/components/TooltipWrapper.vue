<template>
  <div
    ref="root"
    class="tooltip"
    :class="{
      [horizontalAlign]: true,
      [verticalAlign]: true
    }"
    :style="{
      left: pageX + 'px',
      top: pageY + 'px'
    }"
  >
    <slot></slot>
  </div>
</template>

<script setup>
import { toRefs, ref, computed, onMounted, onUnmounted } from 'vue'
import { useResizeObserver } from '@vueuse/core'

const props = defineProps({
  align: {
    type: String,
    default: 'bottom-right'
  }
})

const { align } = toRefs(props)

const root = ref(null)

const pageX = ref(0)
const pageY = ref(0)
const width = ref(0)
const height = ref(0)

useResizeObserver(root, ([entry]) => {
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height
})

const horizontalAlign = computed(() => {
  let a = align.value.split('-')[1]

  let xOffset = 150
  const availableWidth = document.body.offsetWidth

  let maxX = pageX.value
  let minX = pageX.value

  if (a === 'right') maxX += width.value + xOffset
  if (a === 'left') maxX -= width.value - xOffset

  if (maxX > availableWidth) a = 'left'

  if (minX < 0) a = 'right'

  return a
})

const verticalAlign = computed(() => {
  let a = align.value.split('-')[0]

  const yOffset = 150
  const availableHeight = document.body.offsetHeight

  let maxY = pageY.value
  let minY = pageY.value

  if (a === 'bottom') maxY += height.value + yOffset
  if (a === 'top') minY -= height.value - yOffset

  if (maxY > availableHeight) a = 'top'

  if (minY < 0) a = 'bottom'

  return a
})

onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove)
})

const handleMouseMove = (e) => {
  setPosition(e.clientX, e.clientY)
}

const setPosition = (px, py) => {
  pageX.value = px
  pageY.value = py
}
</script>

<style scoped>
.tooltip {
  position: absolute;
  user-select: none;
  pointer-events: none;
  z-index: 2000;

  display: flex;
  width: max-content;
  max-width: 200px;
  padding: 0.5rem;
  border-radius: 0.125rem;
  background: var(--black);

  font-size: 0.75rem;
  font-weight: 500;
  line-height: 140%;
}

.left {
  transform: translateX(-100%);
}

.top {
  transform: translateY(-100%);
}

.top.left {
  transform: translateX(-100%) translateY(-100%);
}

@media only screen and (max-width: 720px) {
  .tooltip {
    top: unset !important;
    bottom: 8rem !important;
    left: 1rem !important;
    transform: unset !important;
  }
}
</style>
