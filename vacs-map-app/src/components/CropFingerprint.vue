<template>
  <div class="fingerprint-wrapper">
    <div class="legend">
      <span class="reference-message">
        *As compared to reference crop {{ referenceCropObject?.label }}</span
      >

      <div class="responsive-legend">
        <div v-if="hovered" class="hovered-label">
          <span class="metric-label"> {{ hovered?.key }} </span>
          <span
            class="category-label"
            :style="{ background: fingerprintScheme[hovered?.category] }"
          >
            {{ selectedCropObject?.label }}
          </span>
          <span v-if="showReference" class="category-label reference-label">
            {{ referenceCropObject?.label }}
          </span>
        </div>
        <div v-else class="hovered-label">
          <span
            v-for="cat in indicatorCategories"
            :key="cat"
            class="category-label"
            :style="{ background: fingerprintScheme[cat] }"
            @mouseenter="hoveredCategory = cat"
            @mouseleave="hoveredCategory = null"
          >
            {{ cat }}
          </span>
          <span
            v-if="showReference"
            class="category-label reference-label"
            @mouseenter="hoveredCategory = 'reference'"
            @mouseleave="hoveredCategory = null"
          >
            Reference
          </span>
        </div>
      </div>
    </div>
    <div class="svg-wrapper" ref="wrapperRef">
      <svg>
        <g class="chart" :transform="`translate(${width / 2}, ${height / 2})`">
          <circle class="chart-background" :r="y(11)" fill="#17191b" />

          <g class="selected-crop-plots">
            <path
              v-for="indicator in selectedIndicators"
              :key="indicator.key"
              :fill="fingerprintScheme[indicator.category]"
              stroke="#17191b"
              stroke-width="0.5"
              :d="arc(indicator)"
              :class="{
                highlighted:
                  hovered?.key === indicator.key || hoveredCategory === indicator.category,
                unhighlighted:
                  (hovered && hovered.key !== indicator.key) ||
                  (hoveredCategory && hoveredCategory !== indicator.category)
              }"
            />
          </g>

          <g class="chart-overlay">
            <g class="axes" fill="none" stroke="#17191b">
              <circle v-for="d in d3.range(11)" :key="d" :r="y(d)" />
            </g>

            <g v-if="showReference">
              <path
                v-for="indicator in referenceIndicators"
                :key="indicator.key"
                fill="#ffffff01"
                stroke="#DAB967"
                :stroke-width="1"
                :d="arc(indicator)"
                :class="{
                  highlighted:
                    hovered?.key === indicator.key ||
                    hoveredCategory === indicator.category ||
                    hoveredCategory === 'reference',
                  unhighlighted:
                    (hovered && hovered.key !== indicator.key && hoveredCategory !== 'reference') ||
                    (hoveredCategory &&
                      hoveredCategory !== indicator.category &&
                      hoveredCategory !== 'reference')
                }"
              />
            </g>

            <g class="hover-detectors">
              <path
                v-for="indicator in hoverIndicators"
                :key="indicator.key"
                fill="transparent"
                :d="arc(indicator)"
                @mouseenter="hovered = indicator"
                @mouseleave="hovered = null"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { useResizeObserver } from '@vueuse/core'
import { computed, toRefs, ref } from 'vue'
import { useCropInformationStore } from '../stores/cropInformation'
import { storeToRefs } from 'pinia'
import { fingerprintScheme } from '../utils/colors'

const props = defineProps({
  cropId: {
    type: String,
    default: ''
  }
})
const { cropId } = toRefs(props)
const hovered = ref(null)

const hoveredCategory = ref(null)

const wrapperRef = ref(null)
const width = ref(0)
const height = ref(0)

useResizeObserver(wrapperRef, ([entry]) => {
  width.value = entry.contentRect.width
  height.value = entry.contentRect.height
})

const cropInformationStore = useCropInformationStore()
const { data: cropInformation } = storeToRefs(cropInformationStore)

const selectedCropObject = computed(() => {
  if (!cropInformation.value) return null
  return cropInformation.value.find((d) => d.id === cropId.value)
})

const selectedIndicators = computed(() => {
  return getIndicators(selectedCropObject.value)
})

const hoverIndicators = computed(() => {
  return selectedIndicators.value.map((d) => {
    return {
      ...d,
      value: 10
    }
  })
})

const referenceCropObject = computed(() => {
  if (!cropInformation.value) return null
  return cropInformation.value.find(
    (d) => d.crop_group === selectedCropObject.value.crop_group && d.benchmark
  )
})

const referenceIndicators = computed(() => {
  return getIndicators(referenceCropObject.value).filter(
    (d, i) => selectedIndicators.value[i].value
  )
})

const showReference = computed(() => {
  if (!referenceCropObject.value) return false
  return referenceCropObject.value !== selectedCropObject.value
})

const getIndicators = (crop) => {
  if (!crop) return []
  const arr = []
  Object.entries(crop.indicators).forEach((cat) => {
    const category = cat[0]
    Object.entries(cat[1]).forEach(([k, v]) => {
      arr.push({
        key: k,
        value: v,
        category
      })
    })
  })
  return arr
}

const indicatorCategories = computed(() => {
  if (!selectedCropObject.value) return []
  return Object.keys(selectedCropObject.value.indicators)
})

const indicatorMetrics = computed(() => {
  return selectedIndicators.value.map((d) => d.key)
})

const radius = computed(() => {
  return (Math.min(width.value, height.value) / 2) * 0.95
})

const x = computed(() => {
  return d3
    .scaleBand()
    .domain(indicatorMetrics.value)
    .range([0, Math.PI * 2])
})

const y = computed(() => {
  return d3.scaleLinear().domain([0, 11]).range([0, radius.value])
})

const arc = computed(() => {
  return d3
    .arc()
    .innerRadius(y.value(0))
    .outerRadius((d) => y.value(d.value !== null ? d.value + 1 : 0))
    .startAngle((d) => x.value(d.key))
    .endAngle((d) => x.value(d.key) + x.value.bandwidth())
})
</script>

<style scoped>
.fingerprint-wrapper {
  height: 100%;
  max-width: 100%;
  display: flex;
  flex-direction: row;
}
.svg-wrapper {
  height: 100%;
  padding-top: 1rem;
}

svg {
  height: 100%;
  width: 100%;
}

.chart-overlay {
  pointer-events: none;
}

.hover-detectors {
  pointer-events: all;
}

.highlighted {
  opacity: 1;
}

.unhighlighted {
  opacity: 0.2;
}

.legend {
  width: 40%;
  display: flex;
  flex-direction: column;
  color: var(--white);
}

.reference-message {
  color: var(--gray);
  font-size: 0.8125rem;
  font-style: italic;
  font-weight: 400;
  line-height: 140%;
  white-space: nowrap;
}

.responsive-legend {
  margin: auto 0;
}

.hovered-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  line-height: 110%;
}

.category-label {
  white-space: nowrap;
  width: min-content;
  color: var(--black);
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 1px 4px;
  text-transform: capitalize;
  cursor: default;
}

.metric-label {
  color: var(--white);
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
}

.reference-label {
  color: #dab967;
  border: 1px solid #dab967;
}
</style>
