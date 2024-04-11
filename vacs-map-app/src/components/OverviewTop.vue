<template>
  <div class="overview-top">
    <div class="row">
      <div class="header-question" @click="navigateHome">{{ copy.header_question }}</div>
      <div class="buttons">
        <button @click="copyLink" @mouseleave="linkCopied = false" class="desktop">
          <img src="@/assets/img/copy-link.svg" alt="copy-link" />
          <span class="copy-link-message">
            <img v-if="linkCopied" src="../assets/img/checkmark.svg" alt="" />
            {{ linkCopied ? 'Link copied to clipboard' : 'Copy a link to your clipboard' }}
          </span>
        </button>
        <button @click="toggleColorblindFriendly" :class="{ 'button-active': colorblindFriendly }">
          <img v-if="colorblindFriendly" src="@/assets/img/colorblind-active.svg" alt="" />
          <img v-else src="@/assets/img/colorblind.svg" alt="" />
          <span class="toggle-colormode-message">
            {{
              colorblindFriendly
                ? 'Colorblind friendly color palette: ON'
                : 'Colorblind friendly color palette: OFF'
            }}
          </span>
        </button>
        <NavigationButton :to="backRoute" class="desktop">Back</NavigationButton>
        <NavigationButton :to="backRoute" class="mobile">
          <img src="@/assets/img/back-arrow.svg" alt="" />
        </NavigationButton>
        <attributionLogo></attributionLogo>

      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useContentStore } from '@/stores/siteContent'
import { useColorStore } from '@/stores/colors'
import NavigationButton from '@/components/NavigationButton.vue'
import attributionLogo from '@/components/attributionLogo.vue'

const linkCopied = ref(false)
const route = useRoute()
const router = useRouter()
const backRoute = computed(() => (route.path === '/map-explore' ? '/crops' : '/'))

const navigateHome = () => router.push('/')

const contentStore = useContentStore()
const { copy } = storeToRefs(contentStore)

const colorStore = useColorStore()
const { colorblindFriendly } = storeToRefs(colorStore)

const toggleColorblindFriendly = () => {
  colorblindFriendly.value = !colorblindFriendly.value
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  linkCopied.value = true
}
</script>

<style scoped>
.overview-top {
  display: flex;
  flex-direction: column;
  font-family: var(--font-family-header);
  font-size: 1.5rem;
  gap: 0.5rem;
  padding: 1rem var(--page-horizontal-margin) 0.375rem var(--page-horizontal-margin);
  background: var(--black-70);
}

.header-question {
  cursor: pointer;
}

.copy-link-message,
.toggle-colormode-message {
  display: none;
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateY(calc(100% + 0.5rem)) translateX(-80%);
  font-size: 0.75rem;
  font-family: var(--font-family-body);
  font-weight: 400;
  animation: fadeIn 0.5s linear;
  background: var(--ui-blue);
  box-shadow: var(--shadow);
  color: var(--black);
  padding: 0.5rem;
  border-radius: 0.125rem;
  cursor: default;
  width: max-content;
  z-index: 5000;
  box-shadow: var(--shadow);

  white-space: nowrap;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.buttons {
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  padding-bottom: 0.25rem;
}

button {
  position: relative;
  appearance: none;
  border: none;
  text-decoration: none;

  display: flex;
  align-items: center;

  border-radius: 100%;
  background: var(--dark-gray);
  display: flex;
  width: 2.4375rem;
  height: 2.4375rem;
  justify-content: center;
  align-items: center;

  cursor: pointer;
}

button:hover {
  background: var(--dark-gray-hover);
}

button:hover .copy-link-message,
button:hover .toggle-colormode-message {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.button-active {
  background: var(--ui-blue);
}

.button-active:hover {
  background: var(--ui-blue-hover);
}

.mobile {
  display: none;
}

@media only screen and (max-width: 720px) {
  .desktop {
    display: none;
  }

  .mobile {
    display: flex;
  }
  .overview-top {
    font-size: 1rem;
    font-family: var(--font-family-header);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
