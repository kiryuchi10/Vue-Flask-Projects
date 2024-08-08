<template>
  <v-container>
    <h1>Main Page</h1>
    <v-btn @click="navigateTo('/login')" color="primary">Login</v-btn>
    <v-btn @click="navigateTo('/signup')" color="secondary">Signup</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "MainPage",
  methods: {
    navigateTo(path) {
      this.$router.push(path); // Use this.$router to navigate to the specified path
    }
  }
};
</script>

<style scoped>
/* Add any specific styles here if needed */
</style>
