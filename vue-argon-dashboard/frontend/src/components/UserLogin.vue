<template>
  <v-container>
    <v-row justify="center" align="center" class="full-height">
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title class="headline">Login</v-card-title>
          <v-card-subtitle>Enter your credentials to access the site</v-card-subtitle>
          <v-form @submit.prevent="login">
            <v-text-field
              v-model="email"
              label="Email"
              type="email"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
            ></v-text-field>
            <v-btn type="submit" color="primary">Login</v-btn>
            <v-btn text @click="navigateToSignup">Don't have an account? Sign Up</v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const email = ref('');
const password = ref('');

function login() {
  // Simulate login logic
  console.log('Logging in with:', email.value, password.value);

  // On successful login
  store.dispatch('login', { firstName: 'John', lastName: 'Doe' }); // Example user data
  router.push('/'); // Redirect to home or previous page
}

function navigateToSignup() {
  router.push('/signup'); // Redirect to signup page
}
</script>

<style scoped>
.full-height {
  height: 100vh;
}
</style>
