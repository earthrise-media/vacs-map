<template>
  <div class="card-container">
    <div class="crop-cards">
      <CardWrapper
        v-for="crop in sortedCrops"
        :key="crop.id"
        :title="crop.label"
        :bold-title="true"
        :description="crop.description"
        :handle-click="() => navigate(crop.id)"
        :indicator="{
          key: cropSortBy,
          val: crop.indicators.nutritional[cropSortBy]
        }"
      >
        <img :src="getUrl(crop.id)" alt="" />
      </CardWrapper>
    </div>
    <DataDisclaimer />
  </div>
</template>

<script setup>
import slugify from 'slugify'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import * as d3 from 'd3'
import { useFiltersStore } from '@/stores/filters'
import { useCropInformationStore } from '../stores/cropInformation'
import { useColorStore } from '@/stores/colors'
import CardWrapper from './CardWrapper.vue'
import DataDisclaimer from './DataDisclaimer.vue'

const router = useRouter()
const filtersStore = useFiltersStore()
const cropInformationStore = useCropInformationStore()
const { selectedCrop, selectedModel, selectedCropGroup, cropSortBy, cropSortOrder } =
  storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)

const colorStore = useColorStore()
const { colorblindFriendly } = storeToRefs(colorStore)

const filteredCrops = computed(() => {
  if (!selectedCropGroup.value) return cropInformation.value
  return cropInformation.value.filter((d) => d.crop_group === selectedCropGroup.value)
})

const sortedCrops = computed(() => {
  if (!cropSortBy.value) return filteredCrops.value
  return [...filteredCrops.value].sort((a, b) =>
    d3[cropSortOrder.value](
      a.indicators.nutritional[cropSortBy.value],
      b.indicators.nutritional[cropSortBy.value]
    )
  )
})

const navigate = (crop) => {
  selectedCrop.value = crop
  router.push('map-explore')
}

const getUrl = (crop) => {
  const schemeFolder = colorblindFriendly.value ? 'colorblindFriendly/' : 'default/'
  const url = `/minimaps/${schemeFolder}${crop}_${selectedModel.value}.png`

  return new URL(url, import.meta.url).href
}
</script>

<style scoped>
.card-container {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 2px;
}
.crop-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
  gap: 1rem;
  padding-bottom: 1rem;
}

img {
  width: 100%;
  aspect-ratio: 1/1;
}
</style>

<style>
.crop-cards .card-wrapper {
  background: #3b4650;
}
</style>
