<template></template>

<script setup>
import * as d3 from 'd3';
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

const selectedColumnExtent = computed(() => {
  return cropYieldsStore.getExtent(selectedColumn.value);
});

const selectedColumnQuintiles = computed(() => {
  return cropYieldsStore.getQuintiles(selectedColumn.value);
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
        1, 1,
        5, 5,
        9, 25
      ],
      'circle-stroke-width': 0.2,
      'circle-stroke-color': 'gray',
      'circle-stroke-opacity': 0,
      'circle-opacity': 1,
      'circle-color': getCircleColor(),
    }
  }, 'country-label-filter');

  updateLayer();
};

const addLayerToMap = (geoJson) => {
  addSource(geoJson);
  addLayer();
};

const getCircleColorQuintiles = (quintiles) => {
  if (!quintiles) return 'gray';

  const getColor = quantile => {
    // This is the easiest thing we can do for sequential color schemes--use 
    // d3 to interpolate a given color scheme.

    // There are built-in d3 interpolators we can use:
    const interpolator = d3.interpolateGreens;

    // Or it's pretty easy to define your own:
    // (you can include as many colors here as you like)
    // const interpolator = d3.interpolateHsl("purple", "orange");

    return interpolator(quantile);
  };

  // This is linear interpolating between quantiles but we could easily switch
  // to strict buckets if we prefer.
  return [
    'case',
    ['!=', ['get', selectedColumn.value], null],
    [
      'interpolate',
      ['linear'],
      ['get', selectedColumn.value],
      ...quintiles.map(({ value, quantile }) => ([value, getColor(quantile)])).flat()
    ],
    'transparent',
  ];
};

const getCircleRadius = () => {
  return [
    'interpolate',
    ['linear'],
    ['zoom'],
    1,
    [
      'interpolate', 
      ['linear'], 
      ['get', selectedMetric.value],
      // value, size
      0, 0.1,
      10000, 0.3,
      28000, 0.5
      ],
    6,
    [
      'interpolate', 
      ['linear'], 
      ['get', selectedMetric.value],
      0, 2,
      10000, 5,
      28000, 10
      ]
  ];
};

const getCircleColorExtent = (extent) => {
  if (extent[0] === undefined) return 'gray';
  const [min, max] = extent;
  const middle = min + (max - min) / 2;

  // We could switch the color selection here to a similar scheme as in
  // getCircleColorQuintiles if we wanted

  return [
    'case',
    ['!=', ['get', selectedColumn.value], null],
    [
      'interpolate',
      ['linear'],
      ['get', selectedColumn.value],
      min, 'red',
      middle, 'yellow',
      max, 'green',
    ],
    'white',
  ];
};

const getCircleColorDiverging = (extent, center) => {
  if (extent[0] === undefined) return 'gray';
  const [min, max] = extent;

  const getColor = value => {
    // See getCircleColorQuintiles for details about how this works
    // const interpolator = d3.interpolateBrBG;

    const interpolator = d3.interpolatePiYG;

    // const interpolator = d3.interpolateHsl("purple", "orange");

    return interpolator(value);
  };

  return [
    'case',
    ['!=', ['get', selectedColumn.value], null],
    [
      'interpolate',
      ['linear'],
      ['get', selectedColumn.value],
      min, getColor(0),
      center, getColor(0.5),
      max, getColor(1),
    ],
    'white',
  ];
}

const getCircleColor = () => {
  if (selectedMetric.value === 'yieldratio') {
    // < 1, decrease
    // 1 = no change
    // > 1, increase
    return getCircleColorDiverging(selectedColumnExtent.value, 1);
  }

  return getCircleColorQuintiles(selectedColumnQuintiles.value);

  // Defaulting to using quintiles but here's how to invoke another method:
  // return getCircleColorExtent(selectedColumnExtent.value);
};

const updateLayer = () => {
  if (!map.value.getLayer(LAYER_ID)) return;
  map.value.setPaintProperty(LAYER_ID, 'circle-color', getCircleColor());
  // map.value.setPaintProperty(LAYER_ID, 'circle-radius', getCircleRadius());
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
