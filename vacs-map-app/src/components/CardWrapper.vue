<template>
  <div class="card-wrapper" @click="handleClick" :class="{ active: isActive }">
    <slot></slot>

    <div class="info">
      <div class="title" :class="{ bold: boldTitle }">{{ title }}</div>
      <p class="description">
        {{ description }}
        <span v-if="showMoreInfo" class="more-info" @click="() => $emit('showInfo')">
          More info >
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'

defineEmits(['showInfo'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  boldTitle: {
    type: Boolean,
    default: false
  },

  description: {
    type: String,
    default: ''
  },

  handleClick: {
    type: Function,
    default: () => {}
  },

  isActive: {
    type: Boolean,
    default: false
  },

  showMoreInfo: {
    type: Boolean,
    default: false
  }
})
const { title, description, handleClick } = toRefs(props)
</script>

<style scoped>
.card-wrapper {
  --title-height: 2.5rem;

  position: relative;
  overflow-y: hidden;

  box-shadow: 0 0 0 1px var(--gray);
  border-radius: 1rem;

  cursor: pointer;
}

.info {
  transition: all 0.5s ease;
  position: absolute;
  top: calc(100% - var(--title-height));
  padding: 0.75rem;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--white);
  color: var(--black);
  font-size: 0.8125rem;
  line-height: 140%;

  max-height: 100%;
}

.title {
  font-family: var(--font-family-h2);
  height: var(--title-height);
  font-size: 1.375rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title.bold {
  font-family: var(--font-family-header);
}

.active {
  border-color: var(--ui-blue);
}

.active .info {
  background: var(--ui-blue);
}

.info:hover {
  transform: translateY(calc((100% - var(--title-height)) * -1));
  background: var(--white-80);
}

.active .info:hover {
  background: var(--ui-blue-80);
}

.card-wrapper:hover {
  box-shadow: 0 0 0 2px var(--ui-blue);
}

.more-info {
  text-decoration: underline;
  cursor: pointer;
}
</style>
