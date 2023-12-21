<template>
  <span class="switch">
    <label
      v-for="option in options"
      :key="option.value"
      :class="{ selected: option.value === modelValue }"
      :style="{
        width: `${100 / options.length}%`
      }"
    >
      <input
        type="radio"
        :name="name"
        :checked="modelValue === option.value"
        :value="option.value"
        @change="(e) => $emit('update:modelValue', e.target.value)"
      />
      {{ option.label }}
    </label>
  </span>
</template>

<script setup>
import { toRefs } from 'vue'

defineEmits(['update:modelValue'])
const props = defineProps({
  name: {
    type: String,
    default: ''
  },

  options: {
    type: Array,
    default: () => []
  },

  modelValue: {
    type: String,
    default: null
  }
})
const { name, options, modelValue } = toRefs(props)
</script>

<style scoped>
.switch {
  flex-grow: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border: 1px solid var(--gray);
  border-radius: 100px;
  background: var(--black);
}

label {
  flex-grow: 1;
  color: var(--white);
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: 1.375rem;
  padding: 0.25rem 0.5rem;
  margin: 2px;
  display: flex;
  justify-content: center;
  white-space: nowrap;
}

label:hover {
  color: var(--white-hover);
}

label.selected {
  background: var(--ui-blue);
  color: var(--black);
  border-radius: 100px;
}

label.selected:hover {
  background: var(--ui-blue-hover);
}

input {
  display: none;
}

@media only screen and (max-width: 720px) {
  .switch {
    width: 100%;
  }
}
</style>
