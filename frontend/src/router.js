import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './components/Dashboard.vue'
import HOARegistry from './components/HOARegistry.vue'
import NOVList from './components/NOVList.vue'
import OTPList from './components/OTPList.vue'
import OIASList from './components/OIASList.vue'
import SanctionsList from './components/SanctionsList.vue'
import Archive from './components/Archive.vue'
import AddHOA from './components/AddHOA.vue'
import HOADetails from './components/HOADetails.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/hoa-registry', component: HOARegistry },
  { path: '/hoa/add', component: AddHOA },
  { path: '/hoa/:id', component: HOADetails },
  { path: '/nov', component: NOVList },
  { path: '/otp', component: OTPList },
  { path: '/oias', component: OIASList },
  { path: '/sanctions', component: SanctionsList },
  { path: '/archive', component: Archive },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
