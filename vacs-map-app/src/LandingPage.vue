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
          <span class="keep-reading" @click="openModal">Keep reading</span>
        </div>
        <button class="go-to-topic" @click="navigate">Find out</button>
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
      v-if="modalOpen"
      @close="() => (modalOpen = false)"
      :title="modalHeader"
      :wide="true"
    >
      <div class="modal-content">
        <p>
          <a href="https://www.state.gov/the-vision-for-adapted-crops-and-soils/" target="_blank"
            >The Vision for Adapted Crops and Soils</a
          >
          (VACS) is a multi-phase initiative launched by the U.S. Department of State, in
          collaboration with the African Union, and the Food and Agriculture Organization (FAO).
          VACS aims to address food security and nutrition challenges in Africa in the face of
          climate change. The program focuses on identifying, adapting, and promoting the use of
          nutritious, indigenous, and traditional food crops that are well-suited to the local
          environment and are able to withstand the changing climate conditions.
        </p>
        <br />
        <p>
          VACS promotes an integrated approach, with investments designed to be self-sustaining and
          have increasing returns year after year. Interventions will be guided by a cohesive
          framework that recognizes the complexity of land use—with a particular focus on what
          farmers should plant and where. Farmers, policymakers, extension workers, and suppliers
          will be empowered with options and information tailored for their own local conditions and
          preferences. Nutrition will also be prioritized as the endpoint for resilient food
          systems.
        </p>
        <br />
        <p>
          The program has brought together experts in various fields, including climate adaptation,
          plant breeding, nutrition, and food composition.
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
const modalHeader = ref('')

const contentStore = useContentStore()
const { copy } = storeToRefs(contentStore)

const openModal = () => {
  modalOpen.value = true
  modalHeader.value = 'What is VACS?'
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

button {
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
  justify-content: center;
  background: var(--black-80);
}
</style>
