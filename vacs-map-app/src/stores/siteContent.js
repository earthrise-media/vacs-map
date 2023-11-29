import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useContentStore = defineStore('siteContent', () => {
  const tooltips = ref({})

  const copy = ref({
    header_question: 'What crops have the most potential in a changing climate?',
    vacs_mini: 
      'Vision for Adapted Crops and Soils (VACS) addresses food security in Africa by developing and mobilizing investment in resilient, nutritious indigenous crops suited to the changing climate.',
    vacs_short:
      'The Vision for Adapted Crops and Soils (VACS) is a multi-phase initiative launched by the U.S. Department of State, in collaboration with the African Union, and the Food and Agriculture Organization (FAO). VASC aims to address food security and nutrition challenges in Africa in the face of climate change. The program focuses on identifying, adapting, and promoting the use of nutritious, indigenous, and traditional food crops that are well-suited to the local environment and are able to withstand changing climate conditions.',
    vacs_long:
      "The Vision for Adapted Crops and Soils (VACS) is a multi-phase initiative launched by the U.S. Department of State, in collaboration with the African Union, and the Food and Agriculture Organization (FAO). VACS aims to address food security and nutrition challenges in Africa in the face of climate change. The program focuses on identifying, adapting, and promoting the use of nutritious, indigenous, and traditional food crops that are well-suited to the local environment and are able to withstand the changing climate conditions. \n\n VACS promotes an integrated approach, with investments designed to be self-sustaining and  have increasing returns year after year. Interventions will be guided by a cohesive framework that recognizes the complexity of land use—with a particular focus on what farmers should plant and where. Farmers, policymakers, extension workers, and suppliers will be empowered with options and information tailored for their own local conditions and preferences. Nutrition will also be prioritized as the endpoint for resilient food systems. \n\n The program has brought together experts in various fields, including climate adaptation, plant breeding, nutrition, and food composition. The selection process for crops was informed by scientific data and expert opinions, ensuring a balance of priorities across different scientific disciplines and stakeholder interests. This collaborative approach is critical for developing an inclusive and effective strategy to address the nutritional needs and environmental challenges in Africa. \n\n VACS is part of Feed the Future, the U.S. government's global hunger and food security initiative, and supports the implementation of the U.S. Global Food Security Strategy (2022-2026). It contributes to the President's Emergency Plan for Adaptation and Resilience (PREPARE) and advances the commitments made in the U.S.-AU Joint Statement on Food Security at the 2023 U.S.-Africa Leaders Summit.",
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
      'This crop footprint gives an impression of the nutritional, biophysical, and genetic characteristics of the selected crop. Larger segments with more ticks have better scores in that category. Some charts also show a benchmark crop outline that represents a more widely-used or known crop in the same food group that can be useful in understanding footprint of the crop on the map. \n\n Hover over a column to see what each segment is representing or hover over a category to highlight that specific section. Choose a new crop to understand how its nutritional, biophysical, and genetic characteristics vary.'
  })

  return {
    tooltips,
    copy
  }
})
