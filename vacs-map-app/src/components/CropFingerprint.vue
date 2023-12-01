<template>
  <div class="fingerprint-wrapper">
    <div class="legend">
      <div v-if="hovered" class="hovered-label">
        <span class="metric-label"> {{ hovered?.key }} </span>
        <span class="category-label" :style="{ background: fingerprintScheme[hovered?.category] }">
          {{ selectedCropObject?.label }}
        </span>
        <span v-if="showBenchmark" class="category-label benchmark-label">
          {{ benchmarkCropObject?.label }}
        </span>
      </div>
      <div v-else class="hovered-label">
        <span
          v-for="cat in indicatorCategories"
          :key="cat"
          class="category-label"
          :style="{ background: fingerprintScheme[cat] }"
        >
          {{ cat }}
        </span>
        <span v-if="showBenchmark" class="category-label benchmark-label"> Benchmark </span>
      </div>
    </div>
    <div class="svg-wrapper" ref="wrapperRef">
      <svg>
        <g class="chart" :transform="`translate(${width / 2}, ${height / 2})`">
          <g class="selected-crop-plots">
            <path
              v-for="indicator in selectedIndicators"
              :key="indicator.key"
              :fill="fingerprintScheme[indicator.category]"
              stroke="#17191b"
              stroke-width="0.5"
              :d="arc(indicator)"
              :class="{
                highlighted: hovered?.key === indicator.key,
                unhighlighted: hovered && hovered.key !== indicator.key
              }"
            />
          </g>

          <g class="chart-overlay">
            <g class="axes" fill="none" stroke="#17191b">
              <circle v-for="d in d3.range(11)" :key="d" :r="y(d)" />
            </g>

            <g v-if="showBenchmark">
              <path
                v-for="indicator in benchmarkIndicators"
                :key="indicator.key"
                fill="#ffffff01"
                stroke="#7e899c"
                :stroke-width="1"
                :d="arc(indicator)"
                :class="{
                  highlighted: hovered?.key === indicator.key,
                  unhighlighted: hovered && hovered.key !== indicator.key
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

const benchmarkCropObject = computed(() => {
  if (!cropInformation.value) return null
  return cropInformation.value.find(
    (d) => d.crop_group === selectedCropObject.value.crop_group && d.benchmark
  )
})

const benchmarkIndicators = computed(() => {
  return getIndicators(benchmarkCropObject.value).filter(
    (d, i) => selectedIndicators.value[i].value
  )
})

const showBenchmark = computed(() => {
  if (!benchmarkCropObject.value) return false
  return benchmarkCropObject.value !== selectedCropObject.value
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
  opacity: 0.5;
}

.legend {
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: var(--white);
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
}

.metric-label {
  color: var(--white);
  font-size: 0.8125rem;
  font-weight: 500;
  text-transform: uppercase;
}

.benchmark-label {
  color: var(--gray);
  border: 1px solid var(--gray);
}
</style>
