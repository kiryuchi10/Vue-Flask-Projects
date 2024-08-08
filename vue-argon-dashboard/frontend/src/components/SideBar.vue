<template>
  <v-navigation-drawer v-model="drawer" app>
    <v-list dense>
      <v-list-item @click="navigateToProfile">
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Profile</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <!-- Other menu items -->
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const drawer = ref(false);
const router = useRouter();
const store = useStore();

function navigateToProfile() {
  if (store.state.isAuthenticated) {
    router.push('/profile');
  } else {
    router.push('/login');
  }
}
</script>

<style scoped>
/* Add any scoped styles for the sidebar here */
</style>
