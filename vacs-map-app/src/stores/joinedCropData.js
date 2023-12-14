import { computed } from 'vue';
import { defineStore, storeToRefs } from 'pinia'
import { point, featureCollection } from '@turf/helpers'
import { useCropYieldsStore } from '@/stores/cropYields';
import { useGridStore } from '@/stores/grid';

export const useJoinedCropDataStore = defineStore('joinedCropData', () => {
  const gridStore = useGridStore();
  const cropYieldsStore = useCropYieldsStore();

  const { data: cropYieldsData } = storeToRefs(cropYieldsStore);
  const { data: gridData } = storeToRefs(gridStore);

  // Provide the feature collection of grid data in one unified place so we
  // don't have to recalculate it
  const gridFeatureCollection = computed(() => {
    if (!(gridData.value && cropYieldsData.value)) return featureCollection([]);

    const gridMap = Object.fromEntries(gridData.value.map((row) => [row.id, row]))
    const yieldMap = Object.fromEntries(cropYieldsData.value.map((row) => [row.id, row]))

    const points = Object.keys(gridMap).map(id => {
      const g = gridMap[id];
      return point(
        [g.X, g.Y],
        {
          ...g,
          ...yieldMap[id],
        },
        { id }
      );
    });

    return Object.freeze(featureCollection(points))
  });

  return { gridFeatureCollection };
});
