<template>
  <div class="radio-list">
    <label
      v-for="option in options"
      :key="option.value"
      class="option-wrapper"
      :class="{ checked: modelValue === option.value }"
    >
      <input
        type="radio"
        :name="name"
        :checked="modelValue === option.value"
        :value="option.value"
        @change="(e) => $emit('update:modelValue', e.target.value)"
      />
      <img
        v-if="modelValue === option.value"
        src="@/assets/img/radio-checked.svg"
        alt=""
      />
      <img v-else src="@/assets/img/radio-unchecked.svg" alt="" />
      {{ option.label }}
    </label>
  </div>
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
.radio-list {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  padding: 0.25rem 0;
}
.option-wrapper {
  width: 100%;
  display: flex;
}

label {
  color: var(--white);
  cursor: pointer;
  font-family: var(--font-family-body);
  font-size: 0.8125rem;
  font-style: normal;
  font-weight: 500;
  display: flex;
  gap: 0.375rem;
  align-items: center;
  white-space: nowrap;
}

label:hover img {
  opacity: 80%;
}

input {
  display: none;
}
</style>