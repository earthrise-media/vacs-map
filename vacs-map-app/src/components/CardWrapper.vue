<template>
  <div class="card-wrapper" @click="handleClick" :class="{ active: isActive }">
    <slot></slot>

    <div class="info">
      <div class="title"> {{ title }} </div>
      <p class="description"> {{ description }} </p>
    </div>
  </div>
</template>

<script setup>
import { toRefs} from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },

  description: {
    type: String,
    default: '',
  },

  handleClick: {
    type: Function,
    default: () => {}
  }, 
  
  isActive: {
    type: Boolean,
    default: false
  }
});
const {title, description, handleClick} = toRefs(props);

</script>

<style scoped>

.card-wrapper {
  --title-height: 3.5rem;

  position: relative;
  overflow-y: hidden;

  border: 1px solid transparent;
  border-radius: 1rem;

  cursor: pointer;
}

.active {
  border-color: var(--white);
}

.info {
  transition: all 0.5s ease;
  position: absolute;
  top: calc(100% - var(--title-height));
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--white);
  color: var(--black);
}

.title {
  height: var(--title-height);
  font-size: 1.5rem;
  text-transform: capitalize;
  display: flex;
  align-items: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.info:hover {
  transform: translateY(calc((100% - var(--title-height))*-1));
}
</style>