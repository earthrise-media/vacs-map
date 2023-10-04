const rangeElement = document.getElementById("maize-year");
const dataQuantiles = {
  yield_ratio_maize_126: {
    min: 0.0,
    quantile_1: 0.320679826244946,
    quantile_2: 0.3665178117368092,
    quantile_10: 0.5078634642928715,
    quantile_20: 0.603901278295438,
    quantile_30: 0.6812192339734442,
    quantile_40: 0.7511014446979176,
    quantile_50: 0.8222431308226588,
    quantile_60: 0.8856544020092065,
    quantile_70: 0.9462014907604208,
    quantile_80: 0.9907185066550891,
    quantile_90: 1.0578471081092335,
    quantile_98: 1.3141182515987966,
    quantile_99: 1.4587238067925545,
    max: "inf",
  },
  yield_ratio_maize_370: {
    min: 0.0,
    quantile_1: 0.21719770363899676,
    quantile_2: 0.2519661786087626,
    quantile_10: 0.3729102970189739,
    quantile_20: 0.46544588894156774,
    quantile_30: 0.5564343901788148,
    quantile_40: 0.6513872530893962,
    quantile_50: 0.7538395104184578,
    quantile_60: 0.8408960864918201,
    quantile_70: 0.9193339085360102,
    quantile_80: 0.9802138984990384,
    quantile_90: 1.1022211800742965,
    quantile_98: 1.5536560160306123,
    quantile_99: 1.8411379005300281,
    max: 5.5528455284552845,
  },
  yield_maize_hist: {
    min: 0.0,
    quantile_1: 6.199333333333334,
    quantile_2: 11.264666666666669,
    quantile_10: 230.8,
    quantile_20: 800.1533333333332,
    quantile_30: 1486.8296296296296,
    quantile_40: 2200.3155555555554,
    quantile_50: 2837.7166666666667,
    quantile_60: 3314.42,
    quantile_70: 3676.3966666666665,
    quantile_80: 3975.5066666666667,
    quantile_90: 4252.34074074074,
    quantile_98: 4609.35111111111,
    quantile_99: 4708.950000000001,
    max: 5421.62962962963,
  },
  yield_maize_126: {
    min: 0.0,
    quantile_1: 6.216333333333334,
    quantile_2: 10.712,
    quantile_10: 148.26896551724136,
    quantile_20: 525.6445977011493,
    quantile_30: 966.9201149425287,
    quantile_40: 1510.8827586206894,
    quantile_50: 2068.0333333333333,
    quantile_60: 2657.06,
    quantile_70: 3183.9068965517245,
    quantile_80: 3612.576091954023,
    quantile_90: 4060.2882758620694,
    quantile_98: 4480.206298850574,
    quantile_99: 4598.684655172414,
    max: 4998.275862068966,
  },
  yield_maize_370: {
    min: 0.0,
    quantile_1: 6.1496666666666675,
    quantile_2: 11.498000000000001,
    quantile_10: 138.12999999999997,
    quantile_20: 428.75333333333333,
    quantile_30: 770.9482758620691,
    quantile_40: 1193.9310344827586,
    quantile_50: 1721.4482758620688,
    quantile_60: 2341.592643678161,
    quantile_70: 2932.0433333333326,
    quantile_80: 3451.193333333333,
    quantile_90: 4007.568965517242,
    quantile_98: 4463.945344827584,
    quantile_99: 4607.233103448277,
    max: 5043.517241379311,
  },
  biomass_maize_hist: {
    min: 1.0,
    quantile_1: 18.064666666666668,
    quantile_2: 33.324000000000005,
    quantile_10: 678.8233333333333,
    quantile_20: 2353.5933333333332,
    quantile_30: 4373.051851851852,
    quantile_40: 6471.4222222222215,
    quantile_50: 8346.05,
    quantile_60: 9748.36,
    quantile_70: 10812.903333333334,
    quantile_80: 11692.513333333334,
    quantile_90: 12506.777777777777,
    quantile_98: 13557.119999999999,
    quantile_99: 13849.869629629631,
    max: 15946.074074074075,
  },
  biomass_maize_126: {
    min: 1.0,
    quantile_1: 18.232666666666667,
    quantile_2: 31.266,
    quantile_10: 436.20344827586194,
    quantile_20: 1545.9252873563216,
    quantile_30: 2844.0997701149427,
    quantile_40: 4443.75172413793,
    quantile_50: 6082.416666666667,
    quantile_60: 7815.066666666667,
    quantile_70: 9364.413793103447,
    quantile_80: 10625.244597701148,
    quantile_90: 11942.162413793105,
    quantile_98: 13176.826988505745,
    quantile_99: 13525.72051724138,
    max: 14701.172413793103,
  },
  biomass_maize_370: {
    min: 1.0,
    quantile_1: 17.983,
    quantile_2: 33.76133333333333,
    quantile_10: 406.2566666666666,
    quantile_20: 1261.08,
    quantile_30: 2267.713793103448,
    quantile_40: 3511.4206896551723,
    quantile_50: 5063.103448275862,
    quantile_60: 6887.070804597702,
    quantile_70: 8623.566666666664,
    quantile_80: 10150.74,
    quantile_90: 11787.031034482761,
    quantile_98: 13129.504482758617,
    quantile_99: 13550.678965517243,
    max: 14833.586206896553,
  },
  duration_maize_hist: {
    min: 28.2,
    quantile_1: 38.31633333333333,
    quantile_2: 44.029333333333334,
    quantile_10: 58.46666666666667,
    quantile_20: 68.36666666666666,
    quantile_30: 74.51296296296296,
    quantile_40: 78.56666666666666,
    quantile_50: 81.49074074074073,
    quantile_60: 84.74074074074075,
    quantile_70: 88.83888888888887,
    quantile_80: 94.90666666666667,
    quantile_90: 104.37333333333333,
    quantile_98: 132.63992592592575,
    quantile_99: 148.20148148148184,
    max: 226.14814814814815,
  },
  duration_maize_126: {
    min: 25.6,
    quantile_1: 31.98166666666667,
    quantile_2: 35.79257471264368,
    quantile_10: 48.74741379310345,
    quantile_20: 56.827586206896555,
    quantile_30: 63.51206896551724,
    quantile_40: 69.76666666666667,
    quantile_50: 74.3103448275862,
    quantile_60: 77.4,
    quantile_70: 81.1806896551724,
    quantile_80: 86.97241379310344,
    quantile_90: 96.66785714285716,
    quantile_98: 120.35733333333333,
    quantile_99: 131.5764482758621,
    max: 241.32142857142858,
  },
  duration_maize_370: {
    min: 24.333333333333332,
    quantile_1: 29.482333333333333,
    quantile_2: 32.4,
    quantile_10: 43.73142857142857,
    quantile_20: 52.0,
    quantile_30: 58.36666666666667,
    quantile_40: 64.62068965517241,
    quantile_50: 70.23735632183909,
    quantile_60: 74.0,
    quantile_70: 78.56666666666666,
    quantile_80: 84.93149425287356,
    quantile_90: 94.38137931034484,
    quantile_98: 117.34793103448268,
    quantile_99: 127.21966666666673,
    max: 229.82142857142858,
  },
};

const colorScheme = {
  rdylgn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
  blues: ["#f7fbff", "#e3eef9", "#cfe1f2", "#b5d4e9", "#93c3df", "#6daed5", "#4b97c9", "#2f7ebc", "#1864aa", "#0a4a90", "#08306b"],
  greens: ["#f7fcf5", "#e8f6e3", "#d3eecd", "#b7e2b1", "#97d494", "#73c378", "#4daf62", "#2f984f", "#157f3b", "#036429", "#00441b"],
  greys: ["#ffffff", "#f2f2f2", "#e2e2e2", "#cecece", "#b4b4b4", "#979797", "#7a7a7a", "#5f5f5f", "#404040", "#1e1e1e", "#000000"],
  oranges: ["#fff5eb", "#fee8d3", "#fdd8b3", "#fdc28c", "#fda762", "#fb8d3d", "#f2701d", "#e25609", "#c44103", "#9f3303", "#7f2704"],
  purples: ["#fcfbfd", "#f1eff6", "#e2e1ef", "#cecee5", "#b6b5d8", "#9e9bc9", "#8782bc", "#7363ac", "#61409b", "#501f8c", "#3f007d"],
  reds: ["#fff5f0", "#fee3d6", "#fdc9b4", "#fcaa8e", "#fc8a6b", "#f9694c", "#ef4533", "#d92723", "#bb151a", "#970b13", "#67000d"],
  cividis: ["#002051", "#0a326a", "#2b446e", "#4d566d", "#696970", "#7f7c75", "#948f78", "#ada476", "#caba6a", "#ead156", "#fdea45"],
  virids: ["#440154", "#482475", "#414487", "#355f8d", "#2a788e", "#21918c", "#22a884", "#44bf70", "#7ad151", "#bddf26", "#fde725"],
  inferno: ["#000004", "#160b39", "#420a68", "#6a176e", "#932667", "#bc3754", "#dd513a", "#f37819", "#fca50a", "#f6d746", "#fcffa4"],
  magma: ["#000004", "#140e36", "#3b0f70", "#641a80", "#8c2981", "#b73779", "#de4968", "#f7705c", "#fe9f6d", "#fecf92", "#fcfdbf"],
  plasma: ["#0d0887", "#41049d", "#6a00a8", "#8f0da4", "#b12a90", "#cc4778", "#e16462", "#f2844b", "#fca636", "#fcce25", "#f0f921"],
  warm: ["#6e40aa", "#963db3", "#bf3caf", "#e4419d", "#fe4b83", "#ff5e63", "#ff7847", "#fb9633", "#e2b72f", "#c6d63c", "#aff05b"],
  cool: ["#6e40aa", "#6054c8", "#4c6edb", "#368ce1", "#23abd8", "#1ac7c2", "#1ddfa3", "#30ef82", "#52f667", "#7ff658", "#aff05b"],
  cubehelix: ["#000000", "#1a1530", "#163d4e", "#1f6642", "#54792f", "#a07949", "#d07e93", "#cf9cda", "#c1caf3", "#d2eeef", "#ffffff"],
  turbo: ["#900c00", "#ba2208", "#f65f18", "#ffa423", "#dedd32", "#95fb51", "#4df884", "#27d7c4", "#2f9df5", "#4a58dd", "#23171b"],
};

mapboxgl.accessToken = "pk.eyJ1IjoicGxvdGxpbmUiLCJhIjoiY2xmOGo1NW4wMGVtNzNya2UyNnllZGcyciJ9.gUFn8Mj5HQbagkpQWaDqaw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/plotline/cln0rhs6b024901r8f4sk1f7t",
  projection: "globe",
  center: [14.2, 1.41],
  zoom: 2.54,
  minZoom: 2,
  hash: true,
});

let cropMenu = document.getElementById("crop-select");
let sizeMenu = document.getElementById("size-select");
let colorMenu = document.getElementById("color-select");
let colorSchemeMenu = document.getElementById("color-scheme-select");
let sizeCol = sizeMenu.value.split("__").join(cropMenu.value);
let colorCol = colorMenu.value.split("__").join(cropMenu.value);
// making size max and min the max and min across all projections so max is from historical data and min is from
let sizeMin = 6.15;
let sizeMax = 5421.63;
let hoveredCircleId = null;
// for every key in colorScheme add an option with that key to the colorSchemeMenu
for (const key in colorScheme) {
  let option = document.createElement("option");
  option.text = key;
  colorSchemeMenu.add(option);
}

map.on("load", () => {
  map.addSource("maize_hist-source", {
    type: "geojson",
    data: "https://plotine-vacs.s3.us-east-2.amazonaws.com/maize_ratios.geojson",
    // add id to features
    generateId: true,
  });

  map.addLayer(
    {
      id: "maize_hist-shadow",
      type: "circle",
      source: "maize_hist-source",
      // filter: ["match", ["get", "SowingYear_maize_hist"], [selectedYear], true, false],
      paint: {
        "circle-radius": ["interpolate", ["exponential", 1.99], ["zoom"], 2, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 1, sizeMax, 2], 10, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 150, sizeMax, 300]],
        "circle-color": ["case", ["boolean", ["feature-state", "hover"], false], "rgba(0,0,0,0.5)", "rgba(0,0,0,0)"],
        "circle-pitch-alignment": "map",
        "circle-translate": ["interpolate", ["exponential", 1.7], ["zoom"], 2, [3, 3], 10, [30, 30]],
        "circle-blur": ["interpolate", ["linear"], ["zoom"], 2, 0.5, 10, 0.2],
      },
    },
    "road-label-simple"
  );
  map.addLayer(
    {
      id: "maize_hist-layer",
      type: "circle",
      source: "maize_hist-source",
      // filter: ["match", ["get", "SowingYear_maize_hist"], [selectedYear], true, false],
      paint: {
        "circle-radius": ["interpolate", ["exponential", 1.99], ["zoom"], 2, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 1, sizeMax, 2], 10, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 150, sizeMax, 300]],
        "circle-color": [
          "interpolate",
          ["linear"],
          ["get", colorCol],
          0.3,
          colorScheme[colorSchemeMenu.value][0],
          0.5,
          colorScheme[colorSchemeMenu.value][1],
          0.6,
          colorScheme[colorSchemeMenu.value][2],
          0.7,
          colorScheme[colorSchemeMenu.value][3],
          0.8,
          colorScheme[colorSchemeMenu.value][4],
          0.9,
          colorScheme[colorSchemeMenu.value][5],
          1,
          colorScheme[colorSchemeMenu.value][6],
          1.1,
          colorScheme[colorSchemeMenu.value][7],
          1.2,
          colorScheme[colorSchemeMenu.value][8],
          1.3,
          colorScheme[colorSchemeMenu.value][9],
          1.4,
          colorScheme[colorSchemeMenu.value][10],
        ],
        "circle-pitch-alignment": "map",
        // "circle-translate": [0,0],
        // "circle-translate": ["case", ["boolean", ["feature-state", "hover"], false], [10, 0], [0, 0]],
        // make dark grey circle outline appear when hover feature state is true
        // "circle-stroke-color": "gray",
        // "circle-stroke-width": ["case", ["boolean", ["feature-state", "hover"], false], 4, 0],
      },
      // create feature state for hover
      // make circle-translate  10px on feature state hover equals true
      // make circle-translate 0px on feature state hover equals false
    },
    "road-label-simple"
  );
  // handles when color scheme changes
  colorSchemeMenu.onchange = function () {
    map.setPaintProperty("maize_hist-layer", "circle-color", [
      "interpolate",
      ["linear"],
      ["get", colorCol],
      0.3,
      colorScheme[colorSchemeMenu.value][0],
      0.5,
      colorScheme[colorSchemeMenu.value][1],
      0.6,
      colorScheme[colorSchemeMenu.value][2],
      0.7,
      colorScheme[colorSchemeMenu.value][3],
      0.8,
      colorScheme[colorSchemeMenu.value][4],
      0.9,
      colorScheme[colorSchemeMenu.value][5],
      1,
      colorScheme[colorSchemeMenu.value][6],
      1.1,
      colorScheme[colorSchemeMenu.value][7],
      1.2,
      colorScheme[colorSchemeMenu.value][8],
      1.3,
      colorScheme[colorSchemeMenu.value][9],
      1.4,
      colorScheme[colorSchemeMenu.value][10],
    ]);
  };

  // handles when size menu changes
  sizeMenu.onchange = function () {
    sizeCol = sizeMenu.value.split("__").join(cropMenu.value);
    sizeMin = dataQuantiles[sizeCol]["quantile_1"];
    sizeMax = dataQuantiles[sizeCol]["quantile_99"];
    map.setPaintProperty("maize_hist-layer", "circle-radius", ["interpolate", ["exponential", 1.99], ["zoom"], 2, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 1, sizeMax, 2], 10, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 150, sizeMax, 300]]);
    map.setPaintProperty("maize_hist-shadow", "circle-radius", ["interpolate", ["exponential", 1.99], ["zoom"], 2, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 1, sizeMax, 2], 10, ["interpolate", ["linear"], ["get", sizeCol], sizeMin, 150, sizeMax, 300]]);
  };

  // handles when color menu changes
  colorMenu.onchange = function () {
    colorCol = colorMenu.value.split("__").join(cropMenu.value);
    map.setPaintProperty("maize_hist-layer", "circle-color", [
      "interpolate",
      ["linear"],
      ["get", colorCol],
      0.3,
      colorScheme[colorSchemeMenu.value][0],
      0.5,
      colorScheme[colorSchemeMenu.value][1],
      0.6,
      colorScheme[colorSchemeMenu.value][2],
      0.7,
      colorScheme[colorSchemeMenu.value][3],
      0.8,
      colorScheme[colorSchemeMenu.value][4],
      0.9,
      colorScheme[colorSchemeMenu.value][5],
      1,
      colorScheme[colorSchemeMenu.value][6],
      1.1,
      colorScheme[colorSchemeMenu.value][7],
      1.2,
      colorScheme[colorSchemeMenu.value][8],
      1.3,
      colorScheme[colorSchemeMenu.value][9],
      1.4,
      colorScheme[colorSchemeMenu.value][10],
    ]);
  };
  // map.on("mousemove", "maize_hist-layer", (e) => {
  //   console.log(e.features[0].properties);
  //   if (e.features.length > 0) {
  //     if (hoveredCircleId) {
  //       map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: false });
  //     }
  //     hoveredCircleId = e.features[0].id;
  //     map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: true });
  //   }
  // });
  map.on("mousemove", "maize_hist-layer", (e) => {
    map.getCanvas().style.cursor = "pointer";
    if (e.features.length > 0) {
      if (hoveredCircleId !== null) {
        map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: false });
      }
      hoveredCircleId = e.features[0].id;
      console.log(e.features[0].properties);
      map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: true });
    }
  });

  map.on("mouseleave", "maize_hist-layer", () => {
    map.getCanvas().style.cursor = "";
    if (hoveredCircleId !== null) {
      map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: false });
    }
    hoveredCircleId = null;
  });
  // on mouse down de activate hover state
  map.on("mousedown", "maize_hist-layer", () => {
    if (hoveredCircleId !== null) {
      map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: false });
    }
    hoveredCircleId = null;
  });
  // on mouse up activate hover state
  map.on("mouseup", "maize_hist-layer", (e) => {
    if (e.features.length > 0) {
      if (hoveredCircleId !== null) {
        map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: true });
      }
      hoveredCircleId = e.features[0].id;
      console.log(e.features[0].properties);
      map.setFeatureState({ source: "maize_hist-source", id: hoveredCircleId }, { hover: true });
    }
  });
  // add show class to the div with id click-menu

  map.on("click", (e) => {
    document.getElementById("click-menu").classList.remove("show");
  });
  map.on("click", "maize_hist-layer", (e) => {
    console.log(e.features[0].properties);
    document.getElementById("click-menu").classList.add("show");
    // update data in bar chart
    yieldBarChart.data.datasets[0].data = randomValues(5);
    yieldBarChart.data.datasets[1].data = randomValues(5);
    yieldBarChart.data.datasets[2].data = randomValues(5);
    yieldBarChart.update();

    

  });
  
});


// add a chart js radar chart to the cp-radar element
// write a function that returns an array of 10 random numbers
function randomValues(num) {
  let arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(Math.round(Math.random() * 10));
  }
  console.log(arr)
  return arr;
}
let cpRadar = document.getElementById("cp-radar");
let cpRadarChart = new Chart(cpRadar, {
  type: "polarArea",
  data: {
    labels: ["Protein", "Calcium", "Iron", "Zinc", "Folate", "Vitamin A", ["Genebank", "Distribution"], ["Money", "Invested"], ["Seed", "Quantity"], ["Projected", "Yield"], ["Current", "Yield"], ["Soil Health", "Contribution"], "Heat Tolerance", "Drought Tolerance", ["Flood", "Resilience"]],
    datasets: [
      {
        label: "Maize",
        data: randomValues(15) ,
        backgroundColor: ["#6DBEBF50", "#6DBEBF50", "#6DBEBF50", "#6DBEBF50", "#6DBEBF50", "#6DBEBF50", "#57A0E550", "#57A0E550", "#57A0E550", "#57A0E550", "#57A0E550", "#57A0E550", "#ED6D8550", "#ED6D8550", "#ED6D8550"],
        borderColor: ["#6DBEBF", "#6DBEBF", "#6DBEBF", "#6DBEBF", "#6DBEBF", "#6DBEBF", "#57A0E5", "#57A0E5", "#57A0E5", "#57A0E5", "#57A0E5", "#57A0E5", "#ED6D85", "#ED6D85", "#ED6D85"],
        borderWidth: 0.75,
        pointBackgroundColor: "#697d7d",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgb(255, 99, 132)",
      },
    ],
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        pointLabels: {
          display: true,
          centerPointLabels: true,
          font: {
            size: 10,
          },
        },
        angleLines: {
          display: false,
        },
        suggestedMin: -1,
        suggestedMax: 10,
        ticks: {
          display: false,
        },
      },
    },
  },
});
let yieldBar = document.getElementById("bar-chart");
let yieldBarChart = new Chart(yieldBar, {
  type: "bar",
  data: {
    labels: ["Maize", "Rice", "Wheat", "Sorghum", "Millet"],
    datasets: [
      {
        label: 'Historic Yield',
        data: randomValues(5),
        backgroundColor:  "#6DBEBF",
      },
      {
        label: 'SSP 126 Prediction',
        data: randomValues(5),
        backgroundColor:  "#57A0E5",
      },
      {
        label: 'SSP 370 Prediction',
        data: randomValues(5),
        backgroundColor:  "#ED6D85",
      },
    ]
  },
  options: {
    plugins: {
      legend: {
        display: false,
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false
      }
    },
  }
});
