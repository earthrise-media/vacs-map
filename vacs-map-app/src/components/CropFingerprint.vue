<template>
  <div class="fingerprint-wrapper">
    <div class="svg-wrapper" ref="wrapperRef">
      <svg>
        <g class="chart" :transform="`translate(${width / 2}, ${height / 2})`">
          <g class="selected-crop-plots">
            <path
              v-for="indicator in selectedIndicators"
              :key="indicator.key"
              :fill="fingerprintScheme[indicator.category]"
              :d="arc(indicator)"
              :class="{
                highlighted: hovered === indicator.key,
                unhighlighted: hovered && hovered !== indicator.key
              }"
              @mouseenter="hovered = indicator.key"
              @mouseleave="hovered = null"
            />
          </g>

          <g class="chart-overlay">
            <g class="axes" fill="none" stroke="#17191b">
              <circle v-for="d in d3.range(11)" :key="d" :r="y(d)" />

              <line
                v-for="metric in indicatorMetrics"
                :key="metric"
                :transform="`rotate(${xDegrees(metric) + xDegrees.bandwidth() / 2})`"
                :x1="0"
                :x2="y(10)"
              />
            </g>

            <g v-if="showBenchmark">
              <path
                v-for="indicator in benchmarkIndicators"
                :key="indicator.key"
                fill="none"
                stroke="#e1dcd5"
                :stroke-width="1"
                :d="arc(indicator)"
                :class="{
                  highlighted: hovered === indicator.key,
                  unhighlighted: hovered && hovered !== indicator.key
                }"
              />
            </g>
          </g>
        </g>
      </svg>
    </div>
    <div class="legend">
      <div class="metric-label" :class="{ active: hovered }">
        {{ hovered ? hovered : 'no metric selected' }}
      </div>
      <div class="category-labels">
        <span
          v-for="cat in indicatorCategories"
          :key="cat"
          :style="{ color: fingerprintScheme[cat] }"
        >
          {{ cat }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as d3 from 'd3'
import { useResizeObserver } from '@vueuse/core'
import { computed, toRefs, ref, onMounted } from 'vue'
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

const benchmarkCropObject = computed(() => {
  if (!cropInformation.value) return null
  return cropInformation.value.find(
    (d) => d.crop_group === selectedCropObject.value.crop_group && d.benchmark
  )
})

const benchmarkIndicators = computed(() => {
  return getIndicators(benchmarkCropObject.value)
})

const showBenchmark = computed(() => {
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
  return Object.keys(selectedCropObject.value.indicators)
})

const indicatorMetrics = computed(() => {
  return selectedIndicators.value.map((d) => d.key)
})

const radius = computed(() => {
  return Math.min(width.value, height.value) / 2
})

const x = computed(() => {
  return d3
    .scaleBand()
    .domain(indicatorMetrics.value)
    .range([0, Math.PI * 2])
})

const xDegrees = computed(() => {
  return d3.scaleBand().domain(indicatorMetrics.value).range([0, 360])
})

const y = computed(() => {
  return d3.scaleLinear().domain([0, 10]).range([0, radius.value])
})

const arc = computed(() => {
  return d3
    .arc()
    .innerRadius(y.value(0))
    .outerRadius((d) => y.value(d.value))
    .startAngle((d) => x.value(d.key))
    .endAngle((d) => x.value(d.key) + x.value.bandwidth())
})
</script>

<style scoped>
.fingerprint-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.svg-wrapper {
  height: 100%;
  width: 100%;
}

svg {
  height: 100%;
  width: 100%;
}

.chart-overlay {
  pointer-events: none;
}

.highlighted {
  opacity: 1;
}

.unhighlighted {
  opacity: 0.5;
}

.legend {
  display: flex;
  flex-direction: column;
}

.category-labels {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  text-transform: uppercase;
}

.metric-label {
  text-align: center;
  color: var(--dark-gray);
}

.metric-label.active {
  color: var(--white);
}
</style>
