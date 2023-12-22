<template>
  <div
    class="card-wrapper"
    @click="handleClick"
    :class="{ dynamic: isDynamic, active: isActive, bold: boldTitle }"
  >
    <slot></slot>

    <div class="info" :class="{ bold: boldTitle, hasDescription: description }">
      <div class="title" :class="{ bold: boldTitle }">
        <span> {{ title }} </span>
        <span class="subtitle"> {{ subtitle }} </span>
        <img v-if="isDynamic && !isActive" src="../assets/img/arrow-right-pointy.svg" alt="" />
      </div>
      <div v-if="indicator" class="indicator">
        <span class="indicator-category"> {{ indicator.key }} </span>
        <span
          class="indicator-level"
          :class="{ 'dark-text': useDarkIndicatorText }"
          :style="{ background: indicatorColor }"
        >
          {{ indicatorLevel }}
        </span>
      </div>
      <p class="description">
        {{ description }}
        <span v-if="showMoreInfo" class="more-info" @click="() => $emit('showInfo')">
          More info
        </span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { toRefs, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useColorStore } from '@/stores/colors'

defineEmits(['showInfo'])
const props = defineProps({
  title: {
    type: String,
    default: ''
  },

  subtitle: {
    type: String,
    default: ''
  },

  boldTitle: {
    type: Boolean,
    default: false
  },

  description: {
    type: String,
    default: ''
  },

  handleClick: {
    type: Function,
    default: () => {}
  },

  isDynamic: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: false
  },

  showMoreInfo: {
    type: Boolean,
    default: false
  },

  indicator: {
    type: Object,
    default: () => {}
  }
})
const { title, description, handleClick, indicator, isActive, isDynamic, showMoreInfo, boldTitle } =
  toRefs(props)

const colorStore = useColorStore()
const { stopLight: stopLightScheme, colorblindFriendly } = storeToRefs(colorStore)

const indicatorLevel = computed(() => {
  if (indicator?.value.val === null) return 'no data'
  if (indicator.value.val < 3) return 'low'
  if (indicator.value.val < 7) return 'medium'
  return 'high'
})

const indicatorColor = computed(() => {
  if (indicatorLevel.value === 'no data') return stopLightScheme.value.default
  return stopLightScheme.value[indicatorLevel.value]
})

const useDarkIndicatorText = computed(() => {
  return (
    (indicatorLevel.value === 'low' && colorblindFriendly.value) ||
    (indicatorLevel.value === 'medium' && !colorblindFriendly.value)
  )
})
</script>

<style scoped>
.card-wrapper {
  --title-height: 2.5rem;

  position: relative;
  overflow-y: hidden;

  box-shadow: 0 0 0 1px var(--gray);
  border-radius: 0.5rem;

  cursor: pointer;
}

.card-wrapper.bold {
  border-radius: 0.75rem;
}

.card-wrapper.dynamic {
  height: var(--title-height);
}

.card-wrapper.dynamic.active {
  height: unset;
}

.info {
  transition: all 0.5s ease;
  position: absolute;
  top: calc(100% - var(--title-height));
  padding: 0.75rem;
  padding-top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--white);
  color: var(--black);
  font-size: 0.8125rem;
  line-height: 140%;

  height: 100%;
  max-height: 100%;
}

.info.bold {
  background: var(--white-80);
  height: unset;
}

.card-wrapper.dynamic .info {
  transition: none;
  padding: 0.375rem 0.75rem;
  background: var(--dark-gray);
  color: var(--white);
}

.card-wrapper.dynamic.active .info {
  padding: 0.75rem;
  padding-top: 0;
}

.title {
  font-family: var(--font-family-h2);
  height: var(--title-height);
  font-size: 1.125rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title img {
  margin-left: auto;
}

.subtitle {
  font-size: 0.875rem;
  font-family: var(--font-family-h3);
}

.title.bold {
  font-family: var(--font-family-header);
  font-size: 1.375rem;
}

.indicator {
  display: flex;
  gap: 0.375rem;
  align-items: center;
}

.indicator-category {
  color: var(--black);
  text-transform: uppercase;
  font-weight: 600;
}

.indicator-level {
  color: var(--white);
  padding: 0.0625rem 0.1875rem;
  text-transform: capitalize;
  font-weight: 600;
}

.dark-text {
  color: var(--gray);
}

.active {
  border-color: var(--ui-blue);
}

.active .info {
  background: var(--ui-blue);
}

.dynamic.active {
  border-color: var(--ui-blue);
  color: var(--black);
}

.dynamic.active .info {
  background: var(--ui-blue);
  color: var(--black);
}

.info.hasDescription:hover {
  transform: translateY(calc((100% - var(--title-height)) * -1));
}

.card-wrapper:hover {
  box-shadow: 0 0 0 2px var(--ui-blue);
}

.card-wrapper.dynamic.active:hover {
  box-shadow: 0 0 0 1px var(--gray);
}

.more-info {
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.875rem;
  white-space: nowrap;
}

@media only screen and (max-width: 720px) {
  .card-wrapper:hover {
    box-shadow: 0 0 0 1px var(--gray);
  }
}
</style>
