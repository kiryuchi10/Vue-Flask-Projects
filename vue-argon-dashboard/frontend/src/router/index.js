import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/UserLogin.vue';
import SignupPage from '../components/SignUp.vue';

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;