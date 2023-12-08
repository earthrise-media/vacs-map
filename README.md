# VACS Explorer ReadMe
This repo contains the code that supports the [VACS explorer application](https://vacs.theplotline.org/#/) and the notebooks that prepared the data for the application. Application code can be found in the `vacs-map-app` folder. Data work was done in the `data` folder. 

# Methodology
Below is a short overview of how we put the data together to support the VACS Explorer Application.

## VACS program overview
VACS as a program is split into three phases: identifying the most important crops for nutrition in Africa, assessing how these crops will fare under climate change stress through the year 2050; and mobilizing resources to accelerate research and development for these crops. This project has mainly focused on the second phase, visualizing the impact that climate change will have on the crops identified to be essential for nutrition across Africa. Below we give an overview of the data that was used in the application and how it was put together. 

Note, many parts of climate modeling and simulation are quite complex; this blog article is meant to give an overview of these processes and how the data was used in the application. More information can be found in literature AgMIP has published on these topics. 

## Climate Scenario Data
Climate modeling experts often use narrative based scenarios to project what greenhouse gas emissions could be in the future. These scenarios represent different future socio-economic developments or world events and translate these into a prediction of what greenhouse gas emissions could be at a future date in time. This project uses two scenarios, SSP126 and SSP370, that predict emissions in the year 2050. 

SSP126 is an optimistic projection of what climate emissions could look like in 2050 if we were to limit temperature rise to below 2°C above pre-industrial levels. The scenario itself is rooted in an increasingly sustainable world. In this scenario global commons are being preserved, the limits of nature are respected. The focus in the future is more on human well-being than on economic growth. Income inequalities between states and within states are being reduced and consumption is oriented towards minimizing material resource and energy usage. In this application SSP126 represents the lower greenhouse gas emissions future and crop yields in the low emissions model are simulated based on this value.

SSP370 is a middle of the road, somewhat pessimistic projection, of what climate emissions could look like in the future projecting a global average temperature rise exceeding 3°C by 2100. The scenario itself is rooted in a revival of nationalism and regional conflicts that push global issues into the background. In this scenario, policies increasingly focus on questions of national and regional security; investments in education and technological development are decreasing; inequality is rising; some regions suffer drastic environmental damage. In this application SSP370 represents the higher greenhouse gas emissions future and crop yields in the high emissions model are simulated based on this value.
## Crop Yield Data
The data in the application represents crop yields across Africa in future scenarios compared to historical yields. Yield data is measured at a quarter-degree scale across the African continent.

Historical yield was based on CROPGRIDS and historical values were simulated and predicted based on the parameters in the climate models used to predict future weather conditions. These historic values are used as a benchmark at each location and future scenario yield is measured against these values. An additional filtering step compared production to historical production data to ensure predicted yield values align with regional growth trends. 

Using data from the scenarios outlined above, future weather data was simulated at points across the continent of Africa on a quarter-degree grid scale. More can be read about this complex process here, but the takeaway is it returns values that can be used to simulate the impacts of climate change on yield at the quarter-degree grid scale. These simulations were conducted using four prominent climate models: MRI, MPI, GFDL, and IPSL. The values in the application represent the mean prediction of these four models at each of the points on the grid. You can find the data and explore how the data was processed in this notebook.

On the map, predicted values from the chosen scenario are depicted by percentage increase or decrease of the selected crop at each point.

## Crop profile data
In the application, crop profiles were built using data from AgMIP. They assessed the climate-resilient potential for each of the crops, analyzing them along five dimensions: biophysical, genetic, nutritional, economic, and sociocultural. In the application adaptation indicators ranked on a scale of 1-10 are displayed in the radar diagram. These are provided in contrast to references of commonly distributed crops in the same category. This data is also used to sort crops in the comparison feature. Reference crops and categories are:
- Fruit & Vegetable - Tomato
- Roots & Tubers Cassava
- Cereals - Maize
- Legume - Soybean
Note that this data is actively being refined by the AgMIP team and with further research these values may be adjusted.

## Additional data
A few additional data sources were used in the basemap of the application. Population data is from World Pop. Soil organic carbon and sand content data was sourced from ISRIC. This data was processed as raster data tilesets. More information on how we process raster data can be found in a previous blog post. 
