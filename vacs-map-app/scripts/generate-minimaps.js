import * as d3 from 'd3';
import fs from 'fs';
import sharp from 'sharp';
import { JSDOM } from 'jsdom';
import { geoChamberlinAfrica } from 'd3-geo-projection';
import * as topojsonClient from 'topojson-client';
import * as topojsonServer from 'topojson-server';

const geo_filename = 'public/data/world-110m-2020.json';
const data_filename = 'public/data/crop-yields-mean-models.csv';
const grid_filename = 'public/data/grid.csv';
const output_folder = 'public/minimaps/';

const divergingScheme = {
  name: 'default',
  min: "#FFA31A",
  center: "#424242",
  max: "#13F364",
}

const colorblindDivergingScheme = {
  name: 'colorblindFriendly',
  min: '#E7EB2A',
  center: '#424242',
  max: '#D156F0'
}

// running for both schemes at once is too much for JS, so uncomment the line below that you want
// const colorSchemes = [divergingScheme, colorblindDivergingScheme]
const colorSchemes = [divergingScheme]
// const colorSchemes = [colorblindDivergingScheme]

const getGeoData = () => {
  return JSON.parse(fs.readFileSync(geo_filename)); 
}

const getData = () => {
  const file = fs.readFileSync(data_filename, 'utf-8');
  let data = d3.csvParse(file, (d) => {
    return Object.fromEntries(
      Object.entries(d).map(([k, v]) => {
        if (k.includes('maxCrop') || k.includes('minCrop')) return [k, v && v !== '' ? v : null]
        return [k, v && v !== '' ? +v : null]
      })
    )
  })

  const grid_file = fs.readFileSync(grid_filename, 'utf-8');
  let grid = d3.csvParse(grid_file, (d) => {
    return Object.fromEntries(
      Object.entries(d).map(([k, v]) => ([k, +v]))
    );
  })

  data.forEach((d, i) => {
    d.coords = [grid[i].X, grid[i].Y]
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

const getColorGenerator = (data, crop, scheme) => {
  const columnNames = getModels(data).map(m => `yieldratio_${crop}_${m}`);
  const extents = columnNames.map(d => getExtent(data, d));
  const extent = [
    d3.min(extents, extent => d3.min(extent)),
    d3.max(extents, extent => d3.max(extent))
  ];

  return d3.scaleLinear()
    .domain([extent[0], 0, extent[1]])
    .range([scheme.min, scheme.center, scheme.max]);
};

const generateMapSvg = (crop, model, data, world, Africa, AfricanCountries, Africa0, color) => {
  const width = 600;
  const height = 600;
  const margin = 30;

  const columnName = `yieldratio_${crop}_${model}`;

  const background = '#3B4650';
  const land = "#343434";
  const borders = background;
  const shore = background;
  const africanCountries = "#262626";

  const projection = geoChamberlinAfrica()
    .fitExtent(
      [
        [margin, margin],
        [width - margin, height - margin*3]
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

  console.log("Generating maps...")

  colorSchemes.forEach(scheme => {
    crops.forEach(crop => {
      models.forEach(model => {
        const color = getColorGenerator(data, crop, scheme);
        
        const svg = generateMapSvg(crop, model, data, world, Africa, AfricanCountries, Africa0, color);

        const fileName = `${output_folder}${scheme.name}/${crop}_${model}`
  
        fs.writeFileSync(fileName + '.svg', svg.html());

        sharp(fileName + '.svg')
          .png()
          .toFile(fileName + '.png')
          .catch((err) => {
            console.log(err);
          })
          .then(() => {
            fs.unlink(fileName + '.svg', (err) => {
              if (err) {
                console.log(err);
              }
            })
          });
      })
    })
  })
}

generateMaps();


