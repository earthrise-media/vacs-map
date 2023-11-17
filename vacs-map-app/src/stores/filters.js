import { computed, ref, watch } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import { useCropYieldsStore } from '@/stores/cropYields';

export const useFiltersStore = defineStore('filters', () => {
  const availableCrops = ref([]);
  const selectedCrop = ref('');

  const availableMetrics = ref([]);
  const selectedMetric = ref('');

  const availableModels = ref([]);
  const selectedModel = ref('');

  const cropYieldsStore = useCropYieldsStore();
  const { data: cropData } = storeToRefs(cropYieldsStore);

  watch(cropData, () => {
    const firstRow = cropData.value?.[0] ?? [];

    availableMetrics.value = Array.from(new Set(
      Object.keys(firstRow)
        .filter(k => k !== 'id')
        .map(k => k.split('_')[0])
    )).sort();
    if (!selectedMetric.value) {
      selectedMetric.value = availableMetrics.value[0];
    }

    availableCrops.value = Array.from(new Set(
      Object.keys(firstRow)
        .filter(k => k.startsWith('yield'))
        .map(k => k.split('_')[1])
    )).sort();
    if (!selectedCrop.value) {
      selectedCrop.value = availableCrops.value[0];
    }

    availableModels.value = Array.from(new Set(
      Object.keys(firstRow)
        .filter(k => k !== 'id')
        .map(k => k.split('_').slice(-2).join('_'))
    )).sort();
    selectedModel.value = availableModels.value[0];
  });

  return {
    availableCrops,
    selectedCrop,

    availableMetrics,
    selectedMetric,

    availableModels,
    selectedModel,
  };
});
