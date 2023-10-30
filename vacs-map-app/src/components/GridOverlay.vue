<template></template>

<script setup>
import { computed, onMounted, toRefs, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { point, featureCollection } from '@turf/helpers';
import { useFiltersStore } from '@/stores/filters';
import { useCropYieldsStore } from '@/stores/cropYields';
import { useGridStore } from '@/stores/grid';

const LAYER_ID = 'grid-overlay';
const SOURCE_ID = 'grid-overlay';

const cropYieldsStore = useCropYieldsStore();
const filtersStore = useFiltersStore();
const gridStore = useGridStore();

const props = defineProps({
  map: {
    type: Object,
    default: null,
  },

  mapReady: {
    type: Boolean,
    default: false,
  },
});

const { map, mapReady } = toRefs(props);

const {
  selectedCrop,
  selectedMetric,
  selectedModel
} = storeToRefs(filtersStore);
const { data: cropYieldsData } = storeToRefs(cropYieldsStore);
const { data: gridData } = storeToRefs(gridStore);

const selectedColumn = computed(() => {
  return [
    selectedMetric.value,
    selectedCrop.value,
    selectedModel.value,
  ].join('_');
});

onMounted(() => {
  gridStore.load();
  cropYieldsStore.load();
});

// TODO do this stuff in another store?
const joinData = (grid, yields) => {
  const joined = Object.fromEntries(grid.map(row => ([row.id, row])));
  yields
    .forEach(row => {
      if (joined[row.id]) {
        joined[row.id] = { ...joined[row.id], ...row};
      }
    })
  return Object.values(joined);
};

const joinedData = computed(() => {
  if (!gridData.value) return [];
  if (cropYieldsData.value) {
    return joinData(gridData.value, cropYieldsData.value);
  }
  return gridData.value;
});

const joinedGeoJson = computed(() => {
  return featureCollection(
    joinedData.value.map(row => point([row.X, row.Y], row, { id: row.id }))
  );
});

const addSource = (geoJson) => {
  if (!map.value || !mapReady.value || map.value.getSource(SOURCE_ID)) return;

  map.value.addSource(SOURCE_ID, {
    type: 'geojson',
    data: geoJson,
  });
};

const addLayer = () => {
  if (!map.value || !mapReady.value || map.value.getLayer(LAYER_ID)) return;
  map.value.addLayer({
    id: LAYER_ID,
    source: SOURCE_ID,
    type: 'circle',
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['zoom'],
        1, 2,
        5, 5,
        9, 25
      ],
      'circle-stroke-width': 0.2,
      'circle-stroke-color': 'gray',
      'circle-stroke-opacity': 0,
      'circle-opacity': 1,
      'circle-color': getCircleColor(),
    }
  }, 'settlement-subdivision-label');

  updateLayer();
};

const addLayerToMap = (geoJson) => {
  addSource(geoJson);
  addLayer();
};

const getCircleColor = () => {
  return [
    'case',
    ['!=', ['get', selectedColumn.value], null],
    [
      'interpolate',
      ['linear'],
      ['get', selectedColumn.value],
      // TODO these are hard coded right now, will likely want the real extent
      // of the data and/or quintiles
      0, 'red',
      500, 'yellow',
      1000, 'green',
    ],
    'white',
  ];
};

const updateLayer = () => {
  if (!map.value.getLayer(LAYER_ID)) return;
  map.value.setPaintProperty(LAYER_ID, 'circle-color', getCircleColor());
};

watch(mapReady, () => {
  if (!joinedGeoJson.value) return;
  addLayerToMap(joinedGeoJson.value);
});

watch(joinedGeoJson, () => {
  if (!joinedGeoJson.value) return;
  addLayerToMap(joinedGeoJson.value);
});

watch(selectedMetric, () => {
  updateLayer();
});

watch(selectedModel, () => {
  updateLayer();
});

watch(selectedCrop, () => {
  updateLayer();
});
</script>

<style scoped></style>
