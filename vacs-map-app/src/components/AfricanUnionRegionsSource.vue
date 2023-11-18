<template></template>

<script setup>
import { computed, onMounted, toRefs, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAfricanUnionRegionsStore } from '@/stores/africanUnionRegions';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },

  map: {
    type: Object,
    default: null,
  },

  mapReady: {
    type: Boolean,
    default: false,
  },
});

const { id, map, mapReady } = toRefs(props);

const africanUnionRegionsStore = useAfricanUnionRegionsStore();

const { data } = storeToRefs(africanUnionRegionsStore);

onMounted(() => {
  africanUnionRegionsStore.load();
});

const addSource = (geoJson) => {
  if (!map.value || !mapReady.value || map.value.getSource(id.value)) return;

  map.value.addSource(id.value, {
    type: 'geojson',
    data: geoJson,
  });
};

watch(mapReady, () => {
  if (!data.value) return;
  addSource(data.value);
});

watch(data, () => {
  if (!data.value) return;
  addSource(data.value);
});
</script>

<style></style>
