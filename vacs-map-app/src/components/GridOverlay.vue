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

  radiusColumn: {
    type: String,
    default: '',
  },

  radiusColumnExtent: {
    type: Array,
    default: () => [],
  },

  fill: {
    type: Boolean,
    default: true,
  },

  stroke: {
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
  fill,
  radiusColumn,
  radiusColumnExtent,
  map,
  mapReady,
  sourceId,
  stroke,
} = toRefs(props);

const addLayer = () => {
  if (!map.value || !mapReady.value || map.value.getLayer(id.value)) return;
  map.value.addLayer({
    id: id.value,
    source: sourceId.value,
    type: 'circle',
    paint: {
      'circle-radius': getCircleRadius(),
      'circle-stroke-width': fill.value ? 0.2 : 1.5,
      'circle-stroke-color': getCircleStrokeColor(),
      'circle-stroke-opacity': fill.value ? 0 : 0.8,
      'circle-opacity': 1,
      'circle-color': getCircleFillColor(),
      'circle-blur': 0.5
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
    // const interpolator = d3.interpolateGreens;

    // Or it's pretty easy to define your own:
    // (you can include as many colors here as you like)
    const interpolator = d3.interpolateHsl("purple", "orange");

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
      // what color should we assign to each quintile?
      ...quintiles.map(({ value, quantile }) => ([value, getColor(quantile)])).flat()
    ],
    'transparent',
  ];
};

const getCircleRadius = () => {
  if (!radiusColumn.value || !radiusColumnExtent.value) {
    return [
      'interpolate',
      ['linear'],
      ['zoom'],
      1, 1,
      3, 3,
      5, 7,
      9, 25
    ];
  }
  else {
    const [min, max] = radiusColumnExtent.value;
    const inputs = [
      min,
      min + (max - min) / 2,
      max,
    ];

    return [
      'interpolate',
      ['linear'],
      ['zoom'],
      1,
      [
        'interpolate', 
        ['linear'], 
        ['get', radiusColumn.value],
        inputs[0], 0.1,
        inputs[1], 0.3,
        inputs[2], 0.5
      ],
      6,
      [
        'interpolate', 
        ['linear'], 
        ['get', radiusColumn.value],
        inputs[0], 2,
        inputs[1], 5,
        inputs[2], 10
      ]
    ];
  }
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

    // const interpolator = d3.interpolatePiYG;

    const interpolator = d3.interpolateHsl("#FFA31A", "#13F364");

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
      center, "#424242",
      max, getColor(1),
    ],
    'transparent',
  ];
}

const getCircleFillColor = () => {
  if (!fill.value) return 'transparent';
  return getCircleColor();
};

const getCircleStrokeColor = () => {
  if (!stroke.value) return 'transparent';
  return getCircleColor();
};

const getCircleColor = () => {
  if (colorDiverging.value) {
    // < 0, decrease
    // 0 = no change
    // > 0, increase
    return getCircleColorDiverging(colorColumnExtent.value, 0);
  }

  return getCircleColorQuintiles(colorColumnQuintiles.value);

  // Defaulting to using quintiles but here's how to invoke another method:
  // return getCircleColorExtent(colorColumnExtent.value);
};

const updateLayer = () => {
  if (!map.value.getLayer(id.value)) return;
  map.value.setPaintProperty(id.value, 'circle-color', getCircleFillColor());
  map.value.setPaintProperty(id.value, 'circle-stroke-color', getCircleStrokeColor());
  map.value.setPaintProperty(id.value, 'circle-radius', getCircleRadius());
};

watch(mapReady, () => {
  addLayer();
});

watch(colorColumn, () => {
  updateLayer();
});
</script>

<style scoped></style>
