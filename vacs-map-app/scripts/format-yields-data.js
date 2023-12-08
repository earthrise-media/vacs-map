import * as d3 from 'd3';
import fs from 'fs';

const source_filename = 'public/data-raw/crop-yields-mean-models.csv';
const yields_target_filename = 'public/data/crop-yields-mean-models.csv';
const grid_target_filename = 'public/data/grid.csv';

const file = fs.readFileSync(source_filename, 'utf-8')

const yields = d3.csvParse(file, (d, i) => {
  let obj = Object.fromEntries(
    Object.entries(d).slice(1).map(([k, v]) => {
      return [k, v && v !== '' ? +v : null]
    })
  );
  obj.id = i+1;
  return obj;
})

const grid = d3.csvParse(file, (d, i) => {
  const regExp = /\(([^)]+)\)/g;
  const coords = [...d.geometry.matchAll(regExp)].flat()[1]
  return {
    id: i+1,
    X: coords.split(' ')[0],
    Y: coords.split(' ')[1]
  }
})

fs.writeFileSync(yields_target_filename, d3.csvFormat(yields));
fs.writeFileSync(grid_target_filename, d3.csvFormat(grid));

