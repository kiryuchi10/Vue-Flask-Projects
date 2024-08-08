<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <h1>User Profile</h1>
          </v-card-title>
          <v-card-subtitle>
            <v-form>
              <v-text-field
                v-model="username"
                label="Username"
                readonly
              ></v-text-field>
              <v-text-field
                v-model="email"
                label="Email"
                readonly
              ></v-text-field>
              <v-text-field
                v-model="bio"
                label="Bio"
                multiline
              ></v-text-field>
            </v-form>
          </v-card-subtitle>
          <v-card-actions>
            <v-btn @click="editProfile" color="primary">Edit Profile</v-btn>
            <v-btn @click="logout" color="secondary">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const username = ref('John Doe'); // Placeholder values; replace with actual user data
const email = ref('johndoe@example.com');
const bio = ref('This is a brief bio.');

function editProfile() {
  // Navigate to an edit profile page or toggle edit mode
  router.push('/profile/edit');
}

function logout() {
  store.dispatch('logout');
  router.push('/login');
}
</script>

<style scoped>
/* Scoped styles specific to the Profile component */
h1 {
  font-size: 2rem;
}

v-text-field {
  margin-bottom: 16px;
}
</style>
