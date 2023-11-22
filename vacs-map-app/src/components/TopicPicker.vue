<template>
  <select :value="value" class="topic-picker" @change="navigate">
    <option v-for="t in topicUrlOptions" :key="t.value" :value="t.value">{{ t.label }}</option>
  </select>
</template>

<script setup>
import { toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { topicUrlOptions } from '@/constants/topics'

const router = useRouter()

const props = defineProps({
  value: {
    type: String,
    default: ''
  }
})
const { value } = toRefs(props)
const navigate = (e) => router.push(e.target.value)
</script>

<style scoped>
.topic-picker {
}
</style>
