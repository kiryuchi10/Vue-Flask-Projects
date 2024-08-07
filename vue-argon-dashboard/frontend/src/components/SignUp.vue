<template>
  <div class="signup-container">
    <h1>Signup</h1>
    <form @submit.prevent="handleSignUp" class="signup-form">
      <div class="form-group">
        <input type="text" v-model="userNo" placeholder="User Number" required />
      </div>
      <div class="form-group">
        <input type="text" v-model="userName" placeholder="User Name" required />
      </div>
      <div class="form-group">
        <input type="password" v-model="password" placeholder="Password" required />
      </div>
      <div class="form-group">
        <input type="text" v-model="branchId" placeholder="Branch ID" required />
      </div>
      <div class="form-group">
        <input type="text" v-model="authCode" placeholder="Auth Code" required />
      </div>
      <div class="form-group">
        <button type="submit">Sign Up</button>
      </div>
      <div class="form-group">
        <button type="button" @click="navigateHome">Go to Home</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from '../axios';


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
        const response = await axios.post('/signup', {
          userNo: this.userNo,
          userName: this.userName,
          password: this.password,
          branchId: this.branchId,
          authCode: this.authCode
        });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    },
    navigateHome() {
      this.$router.push('/'); // Use this.$router to navigate
    }
  }
};
</script>

<style scoped>
.signup-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.signup-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group input,
.form-group button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.form-group button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

.form-group button:hover {
  background-color: #0056b3;
}
</style>
