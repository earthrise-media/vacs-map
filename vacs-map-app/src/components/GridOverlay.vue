<template></template>

<script setup>
import * as d3 from 'd3';
import { computed, toRefs, watch } from 'vue';

const props = defineProps({
  id: {
    type: String,
    default: '',
  },

  colorColumn: {
    type: String,
    default: '',
  },

  colorColumnExtent: {
    type: Array,
    default: () => [],
  },

  colorColumnQuintiles: {
    type: Array,
    default: () => [],
  },

  colorDiverging: {
    type: Boolean,
    default: false,
  },

  map: {
    type: Object,
    default: null,
  },

  mapReady: {
    type: Boolean,
    default: false,
  },

  sourceId: {
    type: String,
    default: '',
  },
});

const {
  id,
  colorColumn,
  colorColumnExtent,
  colorColumnQuintiles,
  colorDiverging,
  map,
  mapReady,
  sourceId
} = toRefs(props);

const addLayer = () => {
  if (!map.value || !mapReady.value || map.value.getLayer(id.value)) return;
  map.value.addLayer({
    id: id.value,
    source: sourceId.value,
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
    ['!=', ['get', colorColumn.value], null],
    [
      'interpolate',
      ['linear'],
      ['get', colorColumn.value],
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
    ['!=', ['get', colorColumn.value], null],
    [
      'interpolate',
      ['linear'],
      ['get', colorColumn.value],
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
    ['!=', ['get', colorColumn.value], null],
    [
      'interpolate',
      ['linear'],
      ['get', colorColumn.value],
      min, getColor(0),
      center, getColor(0.5),
      max, getColor(1),
    ],
    'white',
  ];
}

const getCircleColor = () => {
  if (colorDiverging.value) {
    // < 1, decrease
    // 1 = no change
    // > 1, increase
    return getCircleColorDiverging(colorColumnExtent.value, 1);
  }

  return getCircleColorQuintiles(colorColumnQuintiles.value);

  // Defaulting to using quintiles but here's how to invoke another method:
  // return getCircleColorExtent(colorColumnExtent.value);
};

const updateLayer = () => {
  if (!map.value.getLayer(id.value)) return;
  map.value.setPaintProperty(id.value, 'circle-color', getCircleColor());
  // map.value.setPaintProperty(id.value, 'circle-radius', getCircleRadius());
};

watch(mapReady, () => {
  addLayer();
});

watch(colorColumn, () => {
  updateLayer();
});
</script>

<style scoped></style>
