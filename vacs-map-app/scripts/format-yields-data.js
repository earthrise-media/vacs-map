import * as d3 from 'd3';
import fs from 'fs';

const source_filename = 'public/data-raw/crop-yields-mean-models.csv';
const yields_target_filename = 'public/data/crop-yields-mean-models.csv';
const grid_target_filename = 'public/data/grid.csv';

const crop_info_filename = 'public/data/crop-info-general.csv';

const yields_file = fs.readFileSync(source_filename, 'utf-8')
const crop_info_file = fs.readFileSync(crop_info_filename, 'utf-8')

const cropInfo = d3.csvParse(crop_info_file, d3.autoType);

// ---------------------------------------
// SPLIT SOURCE YIELDS FILE INTO TWO, ONE THAT STORES THE DATA AND ASSOCIATES
// EACH GRID CELL WITH AND ID, AND ONE THAT STORES THE GRID IDS AND COORDS
const yields = d3.csvParse(yields_file, (d, i) => {
  let obj = Object.fromEntries(
    Object.entries(d).slice(1).map(([k, v]) => {
      return [k, v && v !== '' ? +v : null]
    })
  );
  obj.id = i+1;
  return obj;
})

const grid = d3.csvParse(yields_file, (d, i) => {
  const regExp = /\(([^)]+)\)/g;
  const coords = [...d.geometry.matchAll(regExp)].flat()[1]
  return {
    id: i+1,
    X: coords.split(' ')[0],
    Y: coords.split(' ')[1]
  }
})
// ---------------------------------------
// PRECALCULATE YIELD RATIOS FOR EACH GRID CELL AND CONSOLIDATE THE INFORMATION STORED
const yieldKeys = Object.keys(yields[0]).filter((k) => k.startsWith('yield'))

// add yield ratio columns for all crops and scenarios
const yieldsWithRatios = yields.map((d, i) => {
  const rowWithYields = Object.fromEntries(Object.entries(d).filter(([k, v]) => v !== null))

  yieldKeys.forEach((k) => {
    const [_, crop, timeframe, scenario] = k.split('_')
    if (timeframe === 'historical') return

    // NB: abbreviating these could get more performance improvements
    const historicalKey = ['yield', crop, 'historical'].join('_')

    if (!yieldKeys.includes(historicalKey)) return

    const yieldRatioKey = ['yieldratio', crop, timeframe, scenario].join('_')

    let yieldRatioValue = null
    if (
      rowWithYields[k] !== null &&
      rowWithYields[historicalKey] !== null &&
      rowWithYields[historicalKey]
    ) {
      yieldRatioValue =
        (rowWithYields[k] - rowWithYields[historicalKey]) / rowWithYields[historicalKey]
    }

    if (yieldRatioValue === null) return
    rowWithYields[yieldRatioKey] = yieldRatioValue
  })

  return rowWithYields
})

// ---------------------------------------
// PRECACLULATE THE INFO FOR CROP GROUP MAPS
const cropGroups = Array.from(new Set(cropInfo.map((d) => d.crop_group)))
const futureScenarios = ['future_ssp126', 'future_ssp370']

const groupYieldRatioKeysHash = Object.fromEntries(
  d3.cross(futureScenarios, cropGroups).map(([scenario, cropGroup]) => {
    return [`${cropGroup}_${scenario}`,
      cropInfo
        .filter((c) => c.crop_group === cropGroup)
        .map((c) => {
          return ['yieldratio', c.id, scenario].join('_')
        })
    ];
  })
);

const yieldsWithCropGroups = yieldsWithRatios.map((row, i) => {
  d3.cross(futureScenarios, cropGroups)
    .forEach(([scenario, cropGroup]) => {
      const groupKey = [cropGroup, scenario].join('_')
      const groupYieldRatioKeys = groupYieldRatioKeysHash[groupKey];
      const rowHasYieldRatios = Object.keys(row)
        .some((k) => groupYieldRatioKeys.includes(k))
      if (!rowHasYieldRatios) {
        return
      }
      const obj = {
        maxCrop: 'none',
        minCrop: 'none',
        maxVal: null,
        minVal: null
      }

      // TODO might be faster just to pull out the relevant entries and sort
      // them?
      groupYieldRatioKeys.forEach((k) => {
        if (row[k] === null) return;
        if (row[k] > obj.maxVal) {
          obj.maxVal = row[k]
          obj.maxCrop = k.split('_')[1]
        }
        if (row[k] < obj.minVal) {
          obj.minVal = row[k]
          obj.minCrop = k.split('_')[1]
        }
      })

      Object.entries(obj).forEach(([k, v]) => {
        row[groupKey+"_"+k] = v;
      })
    })
  return { ...row };
})

fs.writeFileSync(yields_target_filename, d3.csvFormat(yieldsWithCropGroups));
fs.writeFileSync(grid_target_filename, d3.csvFormat(grid));

