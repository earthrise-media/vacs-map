<template>
  <LayoutOpen>
    <div class="video-wrapper">
      <video autoplay loop muted playsinline>
        <source src="@/assets/img/homepage-video.mp4" type="video/mp4" />
      </video>
    </div>

    <div class="overlay">
      <div class="callout">
        <div class="callout-header">{{ copy.header_question }}</div>
        <div class="callout-content">
          <span class="mobile">
            {{ copy.vacs_mini + ' ' }}
          </span>
          <span class="desktop">
            {{ copy.vacs_short + ' ' }}
          </span>
          <span class="keep-reading" @click="openModal">Keep reading. </span>
        </div>
        <button class="go-to-topic find-out-button" @click="navigate">Explore the Findings</button>
        <button class="go-to-topic learn-more-button" @click="learnMore">Learn more</button>
      </div>

      <div class="logos-row">
        <div class="text-attributions">
          Experience built by Earth Genome supported by Stamen Design | Data by AgMIP | VACS
          supported by the U.S. Dept. of State, African Union, FAO, and The Rockefeller Foundation
        </div>
        <div class="logos">
          <a href="https://www.earthgenome.org/" target="_blank">
            <img src="@/assets/img/logos/plotline.png" alt="" />
          </a>
          <a href="https://stamen.com/" target="_blank">
            <img src="@/assets/img/logos/stamen.svg" alt="" />
          </a>
          <a href="https://agmip.org/" target="_blank">
            <img src="@/assets/img/logos/agmip.png" alt="" />
          </a>
          <a href="https://www.state.gov/the-vision-for-adapted-crops-and-soils/" target="_blank">
            <img src="@/assets/img/logos/us-state-dept.png" alt="" />
          </a>
          <a href="https://au.int/" target="_blank">
            <img src="@/assets/img/logos/africanunion.png" alt="" />
          </a>
          <a href="https://www.fao.org/home/en" target="_blank">
            <img src="@/assets/img/logos/fao.svg" alt="" />
          </a>
          <a href="https://www.rockefellerfoundation.org/" target="_blank">
            <img src="@/assets/img/logos/rockefeller.png" alt="" />
          </a>
        </div>
      </div>
      <DataDisclaimer />
    </div>

    <ContentModal
    v-if="modalOpen && !dataDisclaimer && vacsInfo"
      @close="() => (modalOpen = false)"
      :title="modalHeader"
      :wide="true"
    >
      <div class="modal-content">
        <p>
          <a href="https://www.state.gov/the-vision-for-adapted-crops-and-soils/" target="_blank"
            >The Vision for Adapted Crops and Soils</a>
          is a global movement that aims to foster
          more resilient food systems by focusing on the fundamentals of food security:
          climate-adapted crops and healthy soils. Initially launched by the U.S. Department of
          State, the African Union, and the Food and Agriculture Organization of the UN, VACS seeks
          to boost agricultural productivity and nutrition by developing diverse, climate-resilient
          crop varieties and building healthy soils. VACS provides a unified investment framework
          for stakeholders to advance these goals. VACS is working with
          <a href="https://agmip.org/" target="_blank"> AgMIP</a> to develop a models of future crop
          productivity that will help identify the most promising crops for a changing climate. This
          application visualizes initial results of these models.
        </p>
        <br />
        <p>
          VACS seeks to create a solid foundation for sustaining and increasing crop production by
          mobilizing investment in the fundamentals above and below ground: above ground by
          developing resilient crop varieties and below ground by building and conserving healthier
          soils for those crops to grow in. This approach addresses the core challenges facing the
          global food system:
        </p>
        <!-- add a bullet point list that reads point 1 and point 2-->
        <ul>
          <li>
            Currently, more than 700 million people are undernourished, and child stunting and
            nutrient deficiencies are widespread in developing countries.
          </li>
          <li>
            Global food demand will increase by more than 50 percent by 2050, while climate change
            and land degradation are bringing down crop yields.
          </li>
        </ul>
        <br />
        <p></p>
        <br />
        <p>
          <a href="https://agmip.org/" target="_blank"> AgMIP</a> was chosen to lead the initial
          phase of crop-climate modeling work, the results of which are visualized on this website.
          The selection process for crops was informed by scientific data and expert opinions,
          ensuring a balance of priorities across different scientific disciplines and stakeholder
          interests. This collaborative approach is critical for developing an inclusive and
          effective strategy to address the nutritional needs and environmental challenges in
          Africa.
        </p>
        <br />
        <p>
          VACS is part of Feed the Future, the U.S. government's global hunger and food security
          initiative, and supports the implementation of the U.S. Global Food Security Strategy
          (2022-2026). It contributes to the President's Emergency Plan for Adaptation and
          Resilience (<a
            href="https://www.whitehouse.gov/briefing-room/statements-releases/2021/11/01/fact-sheet-president-biden-renews-u-s-leadership-on-world-stage-at-u-n-climate-conference-cop26/"
            target="_blank"
            >PREPARE</a
          >) and advances the commitments made in the
          <a
            href="https://www.whitehouse.gov/briefing-room/statements-releases/2022/12/15/u-s-africa-leaders-summit-joint-statement-on-food-security/"
            target="_blank"
            >U.S.-AU Joint Statement on Food Security</a
          >
          at the 2023 U.S.-Africa Leaders Summit.
        </p>
      </div>
      <div class="vacs-link">
        <br />
        <a href="https://www.state.gov/the-vision-for-adapted-crops-and-soils/" target="_blank">
          Learn more about VACS →
        </a>
      </div>
    </ContentModal>
    <ContentModal
      v-if="modalOpen && dataDisclaimer && !vacsInfo"
      @close="() => (modalOpen = false)"
      :title="modalHeader"
      :wide="true"
    >
      <div class="modal-content">
        <!-- New content for Learn More information -->
        <p>The AgMIP climate-crop modeling efforts conducted as part of the Vision for Adapted Crops and Soils (VACS) Phase 2 technical research generated yield change projections for 24 crops from a baseline period (1990-2019) to a future period (2035-2064), under a low (SSP1-2.6) and high (SSP3-7.0) emissions scenario, using a gridded process-based crop model called SIMPLE. Complete description and details of the <a href="https://www.sciencedirect.com/science/article/abs/pii/S1161030118304234" target="_blank"> SIMPLE model are provided in Zhao et al., 2019</a>. 
        </p>
        <br />
        <p>
          The model was calibrated with field experiments from the literature and validated at the national level using FAO country data. Due to inherent challenges associated with the assimilation of observational reference and management data, along with the development of model representations of climate and crop growth processes, there are substantial uncertainties associated with the assessment of opportunity crops under future climate scenarios. To increase rigor in such assessments, AgMIP traditionally conducts multi-model assessments. In this pilot case, results are based on a single model, and we will work towards complementing the current assessment with additional models. While we highlight uncertainties, there are also risks related to inaction, i.e., not utilizing the latest available methods and tools to anticipate climate change impacts. This document provides guidelines for effectively utilizing the data while acknowledging the associated uncertainties.
        </p>
        <br />
        <h2>Guidelines for Data Usage</h2>
        <strong>Regional Planning</strong>
        <p>
          The climate-crop models used in this study have a spatial resolution of 0.5 degrees, which translates to approximately 50 km x 50 km grid cells at the equator. While this resolution is suitable for regional-scale analysis, it may not capture the intricate spatial variability of climate, soil, and management factors that influence crop growth at the local level. The yield projections at individual grid cells are associated with high levels of uncertainty and using this data to inform decision-making at the 0.5-degree resolution level is not recommended. Instead, the data should be aggregated to larger spatial scales, such as countries or broadly defined (multi-national) agroecological zones, where the uncertainties can be better managed, and the overall trends in crop performance can be more reliably interpreted. The model outputs can, however help identify regions that are more likely to face significant climate-related challenges for a variety of staple and opportunity crops in the future. By analyzing projected yield changes under different climate scenarios for a wide variety of crops, researchers and policymakers can pinpoint agricultural areas that are particularly vulnerable to the anticipated impacts of climate change, and where the development of adaptation strategies, such as improved crop varieties and enhanced soil health management practices, may be most critical and best targeted. 
        </p>
        <br />
        <strong>Relative Assessments</strong>
        <p>
          All crops included in the study (both staple and opportunity crops) have been modeled using a consistent set of assumptions and parameters, ensuring a standardized approach across the diverse range of crops. This consistency allows for a reliable relative evaluation of crop performance under projected future climate change scenarios. By comparing the modeled yield changes across different crops, regions, and climate scenarios, stakeholders can identify which crops may be more resilient or vulnerable to climate change relative to the others that were modeled using the same protocols.
        </p>
        <br />
        <strong>Implications for Near-term Crop Selection</strong>
        <p>The crop yield projections generated in this study are based on climate scenarios centered on 2050 (2035-2064), representing a long-term time horizon. While this information is valuable for strategic planning and research prioritization, it should not be used by farmers to make short-term decisions about which crops to cultivate or invest in in the coming years. The climate-crop models may not accurately capture the year-to-year variability in weather patterns or extreme events and are best utilized to anticipate long term patterns and average changes over time under a variety of climate change scenarios.</p>
        <br />
        <strong>Isolating Long Term Climate Change Impacts </strong>
        <p>The model outputs are based on current crop genetics, soil parameters, and management systems to reflect the present-day potential of the opportunity crops studied in both current and future scenarios. All genetic, soils and management parameter are held constant between the baseline and future periods to isolate the impacts of climate change on crop production. Here it is important to note that we also assume all plants are grown in a non-nitrogen limited environment, to assess the full relative agricultural potential of these crops, and to further isolate the impacts of climate change on crop production. Owing to these assumptions, the model is best used as a baseline to assess the potential impact of future climate change on high-nitrogen management systems of these crops, assuming no significant changes in genetics, management, or soil profiles occur in the coming decades.</p>
        <br />
        <strong>Policy Prescriptions</strong>
        <p>The climate-crop modeling results should not be used as direct prescriptions for policy decisions without considering the broader socioeconomic, political, and institutional contexts in which agricultural systems operate. While the modeling results can inform policy discussions and provide valuable evidence for decision-making, they should not be the sole basis for prescribing specific policies or interventions. Policymakers should engage with diverse stakeholders, including farmers, extension services, researchers, and local communities, to gather additional insights, understand the on-the-ground realities, and assess the feasibility and potential impacts of different policy options. The modeling results should be used in conjunction with other sources of information, such as socioeconomic assessments and policy impact analyses, to develop holistic and context-specific policy recommendations that account for the complex interplay of biophysical, social, and economic factors influencing agricultural systems and rural livelihoods.</p>
        <br />
        <h2>Conclusion and Future Work</h2>
        <p>Climate-crop modeling for opportunity crops is subject to various sources of uncertainty, stemming from the limitations of both the climate and crop models (as well as their interaction), a scarcity of comprehensive field data, and assumptions made regarding future changes in agricultural systems. Despite these uncertainties, this modeling effort represents a crucial first step in advancing our understanding of the potential impacts of climate change on opportunity crops and identifying key regions and crops for adaptation efforts. To further reduce uncertainties, future research should focus on developing multi-model ensembles that combine the strengths of different modeling approaches and account for a broader range of plausible future scenarios. Additionally, more extensive field data collection and data quality checking are needed for improved model calibration and performance, especially for opportunity crops, which have been historically under researched. Future work should also consider improvement in models to better represent sub-optimal management practices and a variety soil nutrient and soil health deficiencies. Modeling results should not be used in isolation but should instead be complemented by local assessments and stakeholder engagement to drive effective decision-making on the ground. Engaging farmers, extension services, researchers, and other relevant stakeholders to gather local knowledge, understand practical constraints and opportunities, and co-develop context-specific adaptation strategies is necessary to increase the rigor of the models and to account for the diverse needs and perspectives of the communities most vulnerable to projected climate change impacts.
        </p>

      </div>
      <div class="learn-more-link">
        <br />
        <a href="https://agmip.org/" target="_blank"> Learn more about AgMIP → </a>
      </div>
    </ContentModal>
  </LayoutOpen>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '@/stores/siteContent'
import LayoutOpen from '@/components/layouts/LayoutOpen.vue'
import ContentModal from '@/components/ContentModal.vue'
import DataDisclaimer from './components/DataDisclaimer.vue'

const router = useRouter()
const navigate = () => router.push('/crops')

const modalOpen = ref(false)
const vacsInfo = ref(false)
const dataDisclaimer = ref(false)

const modalHeader = ref('')

const contentStore = useContentStore()
const { copy } = storeToRefs(contentStore)

const openModal = () => {
  modalOpen.value = true
  vacsInfo.value = true
  dataDisclaimer.value = false
}
const learnMore = () => {
  modalOpen.value = true
  vacsInfo.value = false
  dataDisclaimer.value = true
  modalHeader.value = 'Guidelines for using AgMIP climate-crop model projections in support of the Vision for Adapted Crops and Soils'
}

</script>

<style scoped>
.video-wrapper {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background: var(--black);
  justify-content: space-between;
}

video {
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  min-width: 100vw;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: var(--doc-height);

  display: flex;
  flex-direction: column;
  align-items: center;
}

.logos-row {
  margin-top: auto;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.75rem 2rem;
  gap: 0.5rem;
  color: var(--white);
  background: var(--black-80);
}

.text-attributions {
  text-align: center;
  color: #a9b2c2;
  font-size: 0.875rem;
  font-weight: 400;
}
strong {
  font-weight: 700;
}
h2 {
  font-family: var(--font-family-header);
}

.logos {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-evenly;
  gap: 0.5rem;
}

.logos img {
  margin: auto 0;
}

.callout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem;
  max-width: 70%;
  gap: 2rem;
  text-align: center;

  margin-top: auto;
  background: var(--black-80);
  border-radius: 0.5rem;
}

.callout-header {
  font-family: var(--font-family-header);

  font-size: 2.875rem;
  line-height: 120%;
}

.callout-content {
  font-size: 0.9375rem;
}

.find-out-button {
  border: none;
  appearance: none;
  border-radius: 6.25rem;
  background: var(--ui-blue);

  color: var(--black);
  font-family: Work Sans;
  font-size: 1.25rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  padding: 0.75rem 1.125rem;

  cursor: pointer;
}


button:hover {
  background: var(--ui-blue-hover);
}

.learn-more-button {
  border: none;
  appearance: none;
  border-radius: 6.25rem;
  background: "#3E3D45";
  color: black;
  font-family: Work Sans;
  font-size: 1rem;
  font-style: normal;
  font-weight: 500;
  line-height: normal;

  padding: 0.75rem 1.125rem;

  cursor: pointer;
}
.keep-reading,
.vacs-link {
  cursor: pointer;
  color: var(--ui-blue);
  text-decoration: underline;
  white-space: nowrap;
}

.keep-reading:hover,
.vacs-link a:hover {
  color: var(--ui-blue-hover);
}

a {
  cursor: pointer;
  color: var(--ui-blue);
  text-decoration: underline;
}

.vacs-link {
  margin-left: auto;
}

.mobile {
  display: none;
}

@media only screen and (max-width: 1080px) {
  .callout-header {
    font-size: 2rem;
  }
  .callout-content {
    font-size: 0.875rem;
    overflow-y: hidden;
    text-overflow: ellipsis;
  }

  .callout-content .mobile {
    display: flex;
  }

  .callout-content .desktop {
    display: none;
  }

  button {
    font-size: 0.875rem;
  }
}

@media only screen and (max-width: 720px) {
  .desktop {
    display: none;
  }

  .text-attributions {
    display: none;
  }

  .mobile {
    display: flex;
  }

  .callout {
    padding: 1rem;
    max-width: 90%;
    width: 95%;
    gap: 1rem;
  }

  .callout-header {
    font-size: 1.375rem;
    line-height: 120%;
  }
  .callout-content {
    font-size: 0.875rem;
  }

  button {
    width: 100%;
    font-size: 1rem;
  }
}
</style>

<style>
.overlay .disclaimer-wrapper {
  background: var(--black-80);
}
</style>
