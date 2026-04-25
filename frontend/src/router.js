import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Profile from './components/Profile.vue'
import About from './components/About.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile },
  { path: '/about', component: About }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router