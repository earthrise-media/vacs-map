import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useContentStore = defineStore('siteContent', () => {
  const tooltips = ref({})

  const copy = ref({
    header_question: 'Which crops have the most potential in a changing climate?',
    vacs_mini:
      'The Vision for Adapted Crops and Soils (VACS) is a global movement that aims to foster more resilient food systems by focusing on the fundamentals of food security: climate-adapted crops and healthy soils.',
    vacs_short:
      'The Vision for Adapted Crops and Soils (VACS) is a global movement that aims to foster more resilient food systems by focusing on the fundamentals of food security: climate-adapted crops and healthy soils. Initially launched by the U.S. Department of State, the African Union, and the Food and Agriculture Organization of the UN, VACS seeks to boost agricultural productivity and nutrition by developing diverse, climate-resilient crop varieties and building healthy soils. VACS provides a unified investment framework for stakeholders to advance these goals. VACS is working with AgMIP to develop a models of future crop productivity that will help identify the most promising crops for a changing climate. This application visualizes initial results of these models.',
    future_ssp126_label: 'Low emissions',
    future_ssp370_label: 'High emissions',
    future_ssp126_short:
      'SSP126 is a scenario used in climate modeling that envisions a sustainable and equitable future with low greenhouse gas emissions and a peak and decline in global warming.',
    future_ssp370_short:
      'SSP370 is a scenario in climate modeling that represents a fragmented world with high greenhouse gas emissions, leading to significant environmental degradation.',
    future_ssp126_long:
      'Climate modeling experts often use narrative based scenarios to project what greenhouse gas emissions could be in the future. SSP126 is one of these scenarios. It is an optimistic projection of what climate emissions could look like in 2050 if we were to limit temperature rise to below 2°C above pre-industrial levels. The scenario itself is rooted in an increasingly sustainable world. In this scenario global commons are being preserved, the limits of nature are respected. The focus in the future is more on human well-being than on economic growth. Income inequalities between states and within states are being reduced and consumption is oriented towards minimizing material resource and energy usage. In this application SSP126 represents the lower greenhouse gas emissions future and crop yields in the low emissions model are simulated based on this value.',
    future_ssp370_long:
      'Climate modeling experts often use narrative based scenarios to project what greenhouse gas emissions could be in the future. SSP370 is one of these scenarios. It is a middle of the road, somewhat pessimistic projection, of what climate emissions could look like in the future projecting a global average temperature rise exceeding 3°C by 2100. The scenario itself is rooted in a revival of nationalism and regional conflicts that push global issues into the background. In this scenario, policies increasingly focus on questions of national and regional security; investments in education and technological development are decreasing; inequality is rising; some regions suffer drastic environmental damage. In this application SSP370 represents the higher greenhouse gas emissions future and crop yields in the high emissions model are simulated based on this value.',
    yield_ratio:
      'A crops yield ratio at a given location compares its modeled historical amount produced (also known as yield) to the projected production in the selected future scenario. A negative yield ratio means that the projected yield in the future will be less than what it has been in the past. A positive yield ratio means the projected yield in the future will be more than it has been in the past. A yield ratio of zero means the projected yield is the same as the historical yield.',
    distribution_chart:
      'These two line graphs show how a crop will do in each climate change scenario. Any dot that has data on the map is drawn as a line in this chart. Its position on the chart indicates how positive or negative the yield ratio is in that specific scenario. \n\n Hover over the scenario name to learn more about what each model indicates or choose a new crop to see how climate change impacts different crops.',
    fingerprint_chart:
      'This crop footprint gives an impression of the nutritional, biophysical, and genetic characteristics of the selected crop. Larger segments with more ticks have better scores in that category. Some charts also show a benchmark crop outline that represents a more widely-used or known crop in the same food group that can be useful in understanding footprint of the crop on the map. \n\n Hover over a column to see what each segment is representing or hover over a category to highlight that specific section. Choose a new crop to understand how its nutritional, biophysical, and genetic characteristics vary.',
    dataDisclaimer:
      'All data in this app are produced by AgMIP, preliminary, and subject to change',
    sandAndSoil:
      'High sand levels and low soil carbon can negatively impact crop growth. The coarse texture of sandy soils leads to poor water and nutrient retention, posing challenges for crops that require consistent moisture and nutrient availability. This can result in weaker growth and lower yields. \n\n Low soil carbon levels reduce soil fertility and structure. Without adequate organic matter, soils struggle to support the diverse microorganisms vital for nutrient cycling. This leads to reduced nutrient availability hindering robust and healthy crop growth.',
    crop_group_map:
      'This map displays the crop with the greatest increase at a given location. For example, a circle in blue for the cereal crop group indicates that maize increased in that area more than any other cereal crop. \n\n When no crop increases (i.e., the future yield is never projected to be higher than the historic yield), the area will be represented as “No increase”. \n\n Each crop group is viewable by both greatest increase and greatest decrease.'
  })

  return {
    tooltips,
    copy
  }
})