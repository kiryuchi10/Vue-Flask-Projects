<template>
  <v-container>
    <v-row justify="center" align="center" class="signup-container">
      <v-col cols="12" md="6" lg="4">
        <v-card>
          <v-card-title class="text-h5">Signup</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleSignUp">
              <v-text-field
                v-model="userNo"
                label="User Number"
                required
              ></v-text-field>
              <v-text-field
                v-model="userName"
                label="User Name"
                required
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="branchId"
                label="Branch ID"
                required
              ></v-text-field>
              <v-text-field
                v-model="authCode"
                label="Auth Code"
                required
              ></v-text-field>
              <v-btn type="submit" color="primary" class="mt-4">Sign Up</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios';

export default {
  name: 'SignupPage',
  data() {
    return {
      userNo: '',
      userName: '',
      password: '',
      branchId: '',
      authCode: ''
    };
  },
  methods: {
    async handleSignUp() {
      try {
        const response = await axios.post('http://localhost:5000/signup', {
          userNo: this.userNo,
          userName: this.userName,
          password: this.password,
          branchId: this.branchId,
          authCode: this.authCode
        });
        alert(response.data.message);
      } catch (error) {
        alert('Signup failed: ' + error.response.data.message);
      }
    }
  }
};
</script>

<style scoped>
/* Container styling */
.signup-container {
  min-height: 100vh;
  padding: 20px;
}

/* Card styling */
.v-card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* Button styling */
.v-btn {
  width: 100%;
}
</style>
