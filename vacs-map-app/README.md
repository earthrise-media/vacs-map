# VACS Explorer
This directory contains the code which drives the [VACS Explorer App](https://vacs.theplotline.org/#/). Any pushes to `main` will automatically update the deployed app. Below you'll find instructions for setting up and running the project locally, as well as a brief rundown of directory contents, and a checklist for updating data.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Contents
_Disclaimer: there are a number of remnants from prototyping in this directory that are not currently being used in the application_

### `src`
- contains all code which drives the app, specifically of note are `LandingPage.vue` and `MapExplorer.vue` which drive the layouts of the landing page and main map page, respectively

### `src/components`
- contains the individual components which make up the app
- the layout other main page in the app, the crop cards page, is contained in `pages/CropTypeOverview.vue`
- there are a number of map components that were used in prototyping - the only map component used in the app is in `MapContainerExploreMap.vue`

### `src/stores`
- these files load and hold the state of data in the app, and control/track variables that are accessed by many components

### `src/utils`
- contains the main color schemes used throughout the app. this file is mainly just a collection of arrays of colors - the logic for how colors are accessed etc. is in `stores/colors.js`

### `src/assets`
- contains fonts, style sheets, and UI icons

### `src/public`
- contains raw data (pre-processed), data processed for the app, and all of the minimap image files

### `src/scripts`
- contains scripts to process the raw data and to generate the minimap images

## Updating The Data
Most of this process is automated, but there are a few things to keep track of and make sure are in sync.

### Step 1: Data Processing
1. download raw data and replace existing data in folder `data/unsynced-data/crop-yield-data/` This directory is not synced with the repo, so you may have to create this directory and add the data.
2. open the notebook `data/crop-data-processing.ipynb` and run all cells
3. copy the newly updated `/data/synced-data/crop-yields-mean-models.csv` into the `vacs-map-app/public/data-raw` directory and continue with step 2

### Step 2: Updating App Data

**If crop yields data gets updated, but crops are all the same:**
1. ensure the `public/data-raw/crop-yields-mean-models.csv` has been replaced with the new data
2. run `node scripts/format-yields-data.js` (this files contains an input filename which can be edited)
3. update minimaps (see below)

**If crops are added/removed:**
1. follow the steps above^
2. update the other crop-info files in `public/data` (general, genetic, nutritional, regional-potential)
- these files come directly from [this spreadsheet](https://docs.google.com/spreadsheets/d/1mU91Pbc--wN14cb_sNCVWaScF0nwho7T/edit#gid=892630347). Make sure each spreadsheet has a row for all desired crops, and that the `id` field matches the crop variable name used in the yields data. Once they are updated, download each sheet as a csv and replace the crop-info files, leaving the filenames as they were.

### Step 3: Updating Minimaps
1. run `node scripts/generate-minimaps.js`
2. because this script generates a new image for each crop in each scenario and using both the default and colorblind friendly color schemes, it can reach the js stack limit if all are generated at once
3. to deal with this there are some arrays at the top of the file which control the minimaps that are generated in a run of the script (see comments there for more detail)
4. this means that multiple runs of the script are necessary to fully update all the minimaps - currently only running once for each color scheme works, but if many crops are added that could change
5. its also worth mentioning that the color settings and data processing for the minimaps are done separately from the rest of the app. so any major changes in those areas will need to be replicated for the minimaps
