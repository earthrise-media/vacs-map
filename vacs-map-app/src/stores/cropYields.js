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

    let transformedData = await d3.csv(getDataUrl('crop-yields-mean-models.csv'), d => {
      return Object.fromEntries(
        Object.entries(d).map(([k, v]) => ([k, (v && v !== "" ? +v : null)]))
      );
    });

    const yieldKeys = Object.keys(transformedData[0])
      .filter(k => k.startsWith('yield'));

    transformedData = transformedData.map((d, i) => {
      const rowWithYields = { ...d };

      yieldKeys.forEach(k => {
        const [_, crop, timeframe, scenario] = k.split('_');
        if (timeframe === 'historical') return;

        const historicalKey = [
          'yield',
          crop,
          'historical_ssp370',
        ].join('_');

        if (!yieldKeys.includes(historicalKey)) return;

        const yieldRatioKey = [
          'yieldratio',
          crop,
          timeframe,
          scenario
        ].join('_');

        let yieldRatioValue = null;
        if (d[k] !== null && d[historicalKey] !== null) yieldRatioValue = d[k] / d[historicalKey];

        rowWithYields[yieldRatioKey] = yieldRatioValue;
      });

      return rowWithYields;
    });

    data.value = Object.freeze(transformedData);
  };

  return {
    data,
    loading,
    load,
  };
});
