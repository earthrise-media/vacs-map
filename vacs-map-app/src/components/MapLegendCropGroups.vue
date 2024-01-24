<template>
  <div class="map-legend">
    <div class="legend-title">
      All {{ selectedCropInfo?.crop_group }} by largest yield
      <span class="metric" @click="toggleMetric">
        <img src="../assets/img/up-down-arrow.svg" alt="" />
        {{ metric }}
      </span>
      <img src="@/assets/img/info.svg" alt="" @click="openCropGroupModal" />
    </div>
    <div class="legend-items">
      <div
        v-for="(crop, i) in cropGroupCrops"
        :key="crop.id"
        class="crop"
        :class="{
          highlighted: hoveredCrop && hoveredCrop === crop.id,
          unhighlighted: hoveredCrop && hoveredCrop !== crop.id,
          selected: selectedCrop === crop.id
        }"
        @mouseenter="() => (hoveredCrop = crop.id)"
        @mouseleave="() => (hoveredCrop = null)"
      >
        <div class="crop-indicator" :style="{ background: colorStore.getCropColor(crop.id) }"></div>
        <div class="crop-label">{{ crop.label }}</div>
      </div>
      <div
        class="crop"
        :class="{
          highlighted: hoveredCrop === 'none',
          unhighlighted: hoveredCrop && hoveredCrop !== 'none'
        }"
        @mouseenter="() => (hoveredCrop = 'none')"
        @mouseleave="() => (hoveredCrop = null)"
      >
        <div class="crop-indicator" :style="{ background: noDataFill }"></div>
        <div class="crop-label">None</div>
      </div>
    </div>

    <div v-if="hoveredCrop" class="legend-tooltip">
      {{ hoveredCropTooltipContent }}
    </div>

    <ContentModal v-if="modalOpen" @close="() => (modalOpen = false)" :title="modalHeader">
      <p class="modal-content">
        {{ modalContent }}
      </p>
    </ContentModal>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCropInformationStore } from '@/stores/cropInformation'
import { useFiltersStore } from '@/stores/filters'
import { useContentStore } from '@/stores/siteContent'
import { useColorStore } from '@/stores/colors'
import { useMapExploreStore } from '@/stores/mapExplore'
import { useCropYieldsStore } from '@/stores/cropYields'
import ContentModal from '@/components/ContentModal.vue'

const contentStore = useContentStore()
const cropInformationStore = useCropInformationStore()
const filtersStore = useFiltersStore()
const colorStore = useColorStore()
const mapExploreStore = useMapExploreStore()
const cropYieldsStore = useCropYieldsStore()

const { selectedCrop, selectedModel } = storeToRefs(filtersStore)
const { data: cropInformation } = storeToRefs(cropInformationStore)
const { copy } = storeToRefs(contentStore)
const { ordinal: ordinalScheme, noData: noDataFill } = storeToRefs(colorStore)
const { cropGroupMetric, hoveredCrop } = storeToRefs(mapExploreStore)
const { data: yieldsData } = storeToRefs(cropYieldsStore)

const modalOpen = ref(false)
const modalHeader = ref('')
const modalContent = ref('')

const metric = computed(() => {
  return cropGroupMetric.value === 'max' ? 'increase' : 'decrease'
})

const toggleMetric = () => {
  if (cropGroupMetric.value === 'max') {
    cropGroupMetric.value = 'min'
  } else {
    cropGroupMetric.value = 'max'
  }
}

const selectedCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === selectedCrop.value)
})

const hoveredCropInfo = computed(() => {
  return cropInformation?.value?.find((d) => d.id === hoveredCrop.value)
})

const cropGroupCrops = computed(() => {
  const groupName = selectedCropInfo.value?.crop_group
  return cropInformation.value?.filter((c) => c.crop_group === groupName)
})

const hoveredCropTooltipContent = computed(() => {
  const yieldRatioColumn = ['yieldratio', hoveredCrop.value, selectedModel.value].join('_')
  const cropGroupColumn = [
    selectedCropInfo.value.crop_group,
    selectedModel.value,
    cropGroupMetric.value + 'Crop'
  ].join('_')

  const cellsWithSelectedCropValue = yieldsData.value.filter((d) => !!d[yieldRatioColumn])
  const cellsWithCropGroupData = yieldsData.value.filter((d) => !!d[cropGroupColumn])

  const cellsWithSelectedCropMax = yieldsData.value.filter(
    (d) => d[cropGroupColumn] === hoveredCrop.value
  )

  const maxCropRate = cellsWithSelectedCropMax.length / cellsWithSelectedCropValue.length

  const noneCropRate = cellsWithSelectedCropMax.length / cellsWithCropGroupData.length

  if (!hoveredCropInfo.value) {
    return `${pFormat(noneCropRate)} of locations with data on ${
      selectedCropInfo.value?.crop_group
    } have no crops with a yield ${metric.value}`
  }

  return `${hoveredCropInfo.value.label} has the greatest yield ${metric.value} in ${pFormat(
    maxCropRate
  )} of the locations that it grows`
})

const pFormat = (n) => {
  return d3.format('.1%')(n)
}

const openCropGroupModal = () => {
  modalOpen.value = true
  modalHeader.value = 'How do I interpret this map?'
  modalContent.value = copy.value['crop_group_map']
}
</script>

<style scoped>
.map-legend {
  position: relative;
  background: var(--black-90);
  border: 1px solid var(--dark-gray);
  border-radius: 4px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  width: 22rem;
  margin-top: auto;
}

.legend-title {
  font-weight: 600;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding-bottom: 0.25rem;
}

.legend-title img {
  cursor: pointer;
}

.legend-title img:hover {
  opacity: 70%;
}

.legend-items {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.crop {
  display: flex;
  padding: 0.125rem 0.5rem;
  gap: 0.25rem;
  align-items: center;
  border: 1px solid var(--dark-gray);
  border-radius: 6.25rem;

  font-size: 0.6875rem;
  cursor: pointer;
}

.highlighted {
  background-color: var(--dark-gray);
}

.unhighlighted {
  opacity: 60%;
}

.selected {
  border-color: var(--ui-blue);
}

.legend-tooltip {
  position: absolute;
  transform: translateY(-100%);
  top: -0.5rem;
  left: 0;

  background: var(--black-90);
  border: 1px solid var(--dark-gray);
  border-radius: 4px;
  padding: 0.5rem;

  width: 100%;
  font-size: 0.875rem;
}

.metric {
  display: flex;
  gap: 0.25rem;
  padding: 0.125rem 0.375rem;
  align-items: center;
  cursor: pointer;
  border-radius: 6.25rem;

  background: var(--dark-gray);
  font-weight: 600;
}

.metric:hover {
  background: var(--dark-gray-hover);
}

.crop-indicator {
  width: 0.625rem;
  height: 0.625rem;
  aspect-ratio: 1/1;
  border-radius: 100%;
}

@media only screen and (max-width: 720px) {
  .map-legend {
    width: 100%;
  }
}
</style>
