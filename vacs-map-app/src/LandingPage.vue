<template>
  <LayoutOpen>
    <div class="map-wrapper-row">
      <div class="callout">
        <div class="callout-content">
          How does
          <select v-model="topic" class="topic-picker">
            <option
              v-for="t in topicUrlOptions"
              :key="t.value"
              :value="t.value"
            >{{ t.label }}</option>
          </select>
          impact decisions about food security?
        </div>
        <button class="go-to-topic" @click="navigate">
          Find out
        </button>
      </div>
      <div class="map-wrapper">
        <MapContainerColor />
      </div>
    </div>
  </LayoutOpen>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import LayoutOpen from '@/components/layouts/LayoutOpen.vue';
import MapContainerColor from '@/components/MapContainerColor.vue';
import { topicUrlOptions } from '@/constants/topics';

const router = useRouter();
const topic = ref(topicUrlOptions[0].value);
const navigate = () => router.push(topic.value);
</script>

<style scoped>
.map-wrapper-row {
  display: flex;
  flex-direction: row;
  height: 100vh;
  justify-content: space-between;
}

.map-wrapper {
  display: flex;
  flex-direction: column;
  width: 55%;
}

.callout {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 5rem;
  font-size: 3em;
  flex-basis: 0;
  flex-grow: 1;
  gap: 2rem;
  line-height: 1.25em;
}

.go-to-topic {
  appearance: none;
  border: 1px solid #BFBFBF;
  background: none;
  border-radius: 4px;
  color: var(--white);
  font-size: 0.9em;
}

.topic-picker {
  display: block;
  font-size: 1em;
  appearance: none;
}
</style>
