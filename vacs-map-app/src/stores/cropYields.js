import * as d3 from 'd3';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import { getDataUrl } from '@/constants/data-load';

export const useCropYieldsStore = defineStore('cropYields', () => {
  const data = ref(null);
  const loading = ref(false);

  const load = async () => {
    if (loading.value || data.value) return false;
    loading.value = true;
    data.value = Object.freeze(await d3.csv(getDataUrl('crop-yields-mean-models.csv'), d => {
      return Object.fromEntries(
        Object.entries(d).map(([k, v]) => ([k, (v && v !== "" ? +v : null)]))
      );
    }));
  };

  return {
    data,
    loading,
    load,
  };
});
