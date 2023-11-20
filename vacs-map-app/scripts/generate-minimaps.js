import * as d3 from 'd3';
import fs from 'fs';
import JSDOM from 'jsdom';

const data_file = 'public/data/crop-yields-mean-models.csv';
const output_foler = 'src/assets/img/minimaps/';

const getData = () => {
  const file = fs.readFileSync(data_file, 'utf-8');
  let data = d3.csvParse(file, (d) => {
    return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v && v !== '' ? +v : null]));
  })

  const yieldKeys = Object.keys(data[0]).filter((k) => k.startsWith('yield'));

  data = data.map((d, i) => {
    const rowWithYields = { ...d };

    yieldKeys.forEach((k) => {
      const [_, crop, timeframe, scenario] = k.split('_');
      if (timeframe === 'historical') return;

      const historicalKey = ['yield', crop, 'historical_ssp370'].join('_');

      if (!yieldKeys.includes(historicalKey)) return;

      const yieldRatioKey = ['yieldratio', crop, timeframe, scenario].join('_');

      let yieldRatioValue = null;
      if (d[k] !== null && d[historicalKey] !== null) {
        yieldRatioValue = (d[k] - d[historicalKey]) / d[historicalKey];
      }
      rowWithYields[yieldRatioKey] = yieldRatioValue;
    })
    return rowWithYields;
  })
  return data;
}

