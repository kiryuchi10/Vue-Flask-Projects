// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import UserLogin from '@/components/UserLogin.vue';
import SignUp from '@/components/SignUp.vue';
import Profile from '@/components/ProfilePage.vue';
import MainLayout from '@/views/MainLayout.vue';
import store from '@/store'; // Import Vuex store

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: HomePage },
      { path: 'login', component: UserLogin },
      { path: 'signup', component: SignUp },
      {
        path: 'profile',
        component: Profile,
        meta: { requiresAuth: true },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.state.isAuthenticated;
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});

export default router;
