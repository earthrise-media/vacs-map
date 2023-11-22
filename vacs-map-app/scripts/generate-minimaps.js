import * as d3 from 'd3';
import fs from 'fs';
import { JSDOM } from 'jsdom';
import { geoChamberlinAfrica } from 'd3-geo-projection';
import * as topojsonClient from 'topojson-client';
import * as topojsonServer from 'topojson-server';

const geo_filename = 'public/data/world-110m-2020.json';
const data_filename = 'public/data/crop-yields-mean-models.csv';
const grid_filename = 'public/data/grid.csv';
const output_folder = 'src/assets/img/minimaps/';

const divergingScheme = {
  min: "#FFA31A",
  center: "#424242",
  max: "#13F364",
}

const getGeoData = () => {
  return JSON.parse(fs.readFileSync(geo_filename)); 
}

const getData = () => {
  const file = fs.readFileSync(data_filename, 'utf-8');
  let data = d3.csvParse(file, (d) => {
    return Object.fromEntries(Object.entries(d).map(([k, v]) => [k, v && v !== '' ? +v : null]));
  })

  const grid_file = fs.readFileSync(grid_filename, 'utf-8');
  let grid = d3.csvParse(grid_file, (d) => {
    return Object.fromEntries(
      Object.entries(d).map(([k, v]) => ([k, +v]))
    );
  })

  const yieldKeys = Object.keys(data[0]).filter((k) => k.startsWith('yield'));

  data = data.map((d, i) => {
    const rowWithYields = { 
      id: d.id,
      coords: [grid[i].X, grid[i].Y]
    };

    yieldKeys.forEach((k) => {
      const [_, crop, timeframe, scenario] = k.split('_');
      if (timeframe === 'historical') return;

      const historicalKey = ['yield', crop, 'historical'].join('_');

      if (!yieldKeys.includes(historicalKey)) return;

      const yieldRatioKey = ['yieldratio', crop, timeframe, scenario].join('_');

      let yieldRatioValue = null;
      if (d[k] !== null && d[historicalKey] !== null && d[historicalKey]) {
        yieldRatioValue = (d[k] - d[historicalKey]) / d[historicalKey];
      }
      rowWithYields[yieldRatioKey] = yieldRatioValue;
    })
    return rowWithYields;
  })
  return data;
}

const getColumnValues = (data, columnName) => {
  if (!(data && data.length)) return null;
  return data.map(d => d[columnName]).filter(d => !!d).sort(d3.ascending);
};

/*
 * Get an extent for the given column name. Uses the 98th percentile for the
 * maximum to guard against outliers.
 */
const getExtent = (data, columnName) => {
  const values = getColumnValues(data, columnName);
  if (!values) return null;
  return [
    values[0],
    d3.quantileSorted(values, 0.98),
  ];
};

const getCrops = (data) => {
  return Array.from(new Set(Object.keys(data[0])
    .filter(k => k.startsWith('yield'))
    .map(k => k.split('_')[1])
  )).sort();
}

const getModels = (data) => {
  return Array.from(new Set(Object.keys(data[0])
    .filter(k => k !== 'id')
    .map(k => k.split('_').slice(-2).join('_'))
  )).filter(m => m.startsWith('future')).sort();
}

const getColorGenerator = (data, crop) => {
  const columnNames = getModels(data).map(m => `yieldratio_${crop}_${m}`);
  const extents = columnNames.map(d => getExtent(data, d));
  const extent = [
    d3.min(extents, extent => d3.min(extent)),
    d3.max(extents, extent => d3.max(extent))
  ];

  return d3.scaleLinear()
    .domain([extent[0], 0, extent[1]])
    .range([divergingScheme.min, divergingScheme.center, divergingScheme.max]);
};

const generateMapSvg = (crop, model, data, world, Africa, AfricanCountries, Africa0, color) => {
  const width = 600;
  const height = 600;
  const margin = 30;

  const columnName = `yieldratio_${crop}_${model}`;

  const background = '#AAA49B';
  const land = "#E1DCD5";
  const borders = background;
  const shore = background;
  const africanCountries = "#585855";

  const projection = geoChamberlinAfrica()
    .fitExtent(
      [
        [margin, margin],
        [width - margin, height - margin]
      ],
      Africa
    )
    .clipExtent([
      [-2, -2],
      [width + 2, height + 2]
    ]);

  const dom = new JSDOM(`<!DOCTYPE html><body></body>`);

  let body = d3.select(dom.window.document.querySelector("body"))
  let svg = body.append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('xmlns', 'http://www.w3.org/2000/svg');

  svg.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", height)
      .style("fill", background);

  const g0 = svg.append("g").attr("id", "all");
  const g1 = svg.append("g").attr("id", "africa");
  const grid = svg.append("g").attr("id", "grid");

  g0.append('path')
    .attr('id', 'land')
    .attr('fill', land)
    .attr('stroke', 'none')
    .datum(topojsonClient.feature(world, world.objects.land));

  g0.append("path")
  .attr("id", "borders-all")
  .attr("fill", "none")
  .attr("stroke", borders)
  .datum(topojsonClient.mesh(world, world.objects.countries, (a, b) => a !== b));

  g0.append("path")
    .attr("id", "shore-all")
    .attr("fill", "none")
    .attr("stroke", borders)
    .datum(topojsonClient.feature(world, world.objects.land));

  g1.append("g")
    .attr("id", "countries-africa")
    .selectAll()
    .data(AfricanCountries)
    .join("path")
    .attr("fill", africanCountries)
    .attr("stroke", "none");

  g1.append("path")
    .attr("id", "borders-africa")
    .attr("fill", "none")
    .attr("stroke", borders)
    .datum(
      topojsonClient.mesh(Africa0, Africa0.objects.countries, (a, b) => a !== b)
    );

  g1.append("path")
    .attr("id", "shore-africa")
    .attr("fill", "none")
    .attr("stroke", shore)
    .datum(Africa);

  grid.selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", d => projection(d.coords)[0])
    .attr("cy", d => projection(d.coords)[1])
    .attr('fill', 'black')
    .attr("fill", d => d[columnName] ? color(d[columnName]) : 'transparent')
    .attr("r", 2);

  const path = d3.geoPath(projection);
  svg.selectAll('path').attr('d', path);

  return body;
}

const generateMaps = () => {
  const data = getData();
  const world = getGeoData();
  const crops = getCrops(data);
  const models = getModels(data);

  const AfricanCountries = topojsonClient
    .feature(world, world.objects.countries)
    .features.filter(d => {
      const c = d3.geoCentroid(d);
      return c[0] > -20 && c[0] < 47 && c[1] < 34.5 && c[0] + c[1] < 60;
    });

  const Africa0 = topojsonServer.topology({
    countries: { type:"FeatureCollection", features: AfricanCountries }
  });

  const Africa = topojsonClient.merge(Africa0, Africa0.objects.countries.geometries);

  crops.forEach(crop => {
    models.forEach(model => {
      const color = getColorGenerator(data, crop);
      
      const svg = generateMapSvg(crop, model, data, world, Africa, AfricanCountries, Africa0, color);

      fs.writeFileSync(`${output_folder}${crop}_${model}.svg`, svg.html());
    })
  })

}

generateMaps();


