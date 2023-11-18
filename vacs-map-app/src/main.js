import './assets/main.css';

import { createApp } from 'vue';
import * as VueRouter from 'vue-router';
import { createPinia } from 'pinia';
import App from './App.vue';
import LandingPage from './LandingPage.vue';
import MapExplorer from './MapExplorer.vue';
import ClimateChangeOverview from '@/components/pages/ClimateChangeOverview.vue';
import CropDetail from '@/components/pages/CropDetail.vue';
import CropTypeOverview from '@/components/pages/CropTypeOverview.vue';
import GeographyOverview from '@/components/pages/GeographyOverview.vue';
import QueryPlugin from '@/store-plugins/query';
import { getActivePinia } from 'pinia';

const app = createApp(App)

const routes = [
  { path: '/', component: LandingPage },
  { path: '/crops', component: CropTypeOverview },
  { path: '/crops/:slug', component: CropDetail },
  { path: '/climate-change', component: ClimateChangeOverview },
  { path: '/geography', component: GeographyOverview },
  { path: '/map-explore', component: MapExplorer },
];

const router = VueRouter.createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: VueRouter.createWebHashHistory(),
  routes, // short for `routes: routes`
})

app.use(createPinia());
app.use(router);
app.mount('#app');

getActivePinia().use(QueryPlugin);
