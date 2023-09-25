const rangeElement = document.getElementById("maize-year");

mapboxgl.accessToken = "pk.eyJ1IjoicGxvdGxpbmUiLCJhIjoiY2xmOGo1NW4wMGVtNzNya2UyNnllZGcyciJ9.gUFn8Mj5HQbagkpQWaDqaw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/plotline/cll735ypl00ao01rdbh4m4a99",
  center: [-74.5, 40],
  zoom: 6,
  hash: true,
});

// historical data is from 1990 - 2019 projected data is 2035 - 2064

let selectedYear = 1990;
let maizeMax = 5945;
let maizeMin = 0;
// interpret selectedYear as string



// when the element of id maize-year is changed, update the selectedYear variable and filter map for selectedYear
rangeElement.addEventListener("change", (event) => {
  selectedYear = event.target.value;
  console.log(selectedYear);
  console.log(typeof selectedYear);
  console.log(["match", ["get", "SowingYear_maize_hist"], [selectedYear], true, false])
  map.setFilter("maize_hist-layer", ["match", ["get", "SowingYear_maize_hist"], [parseInt(selectedYear)], true, false]);
});
// console.log(string(selectedYear))

map.on("load", () => {
  // add a geojson source named maize_historical
  map.addSource("maize_hist-source", {
    type: "geojson",
    data: "./data/maize_hist.geojson",
  });
  map.addLayer({
    id: "maize_hist-layer",
    type: "circle",
    source: "maize_hist-source",
    filter: ["match", ["get", "SowingYear_maize_hist"], [selectedYear], true, false],
    paint: {
        "circle-radius": ["interpolate", ["exponential", 1.99], ["zoom"], 2, ["interpolate", ["linear"], ["get", "Yield_maize_hist"], maizeMin, 1, maizeMax, 2], 10, ["interpolate", ["linear"], ["get", "Yield_maize_hist"], maizeMin, 150, maizeMax, 300]],
    //   "circle-radius": 5,
      "circle-color": "#ffe16b",
    },
  });
});

// [
//   {
//     layout: {},
//     filter: ["match", ["get", "SowingYear_maize_hist"], [year], true, false],
//     type: "circle",
//     source: "composite",
//     id: "min ipsl",
//     paint: {
//       "circle-radius": ["interpolate", ["exponential", 1.99], ["zoom"], 2, ["interpolate", ["linear"], ["get", "ssp370_ipsl_av"], 113, 1, 1971, 2], 10, ["interpolate", ["linear"], ["get", "ssp370_ipsl_av"], 113, 150, 1971, 300]],
//       "circle-color": ["interpolate", ["linear"], ["get", "ssp370_ipsl_pc"], -92.1, "#e70404", -50, "#ffe16b", 0, "#0ecc00"],
//     },
//     "source-layer": "cowpea_summary-1628hx",
//   }
// ];
