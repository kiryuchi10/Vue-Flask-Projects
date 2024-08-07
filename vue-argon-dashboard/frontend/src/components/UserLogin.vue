<template>
<div>
<h2>Login</h2>
<form @submit.prevent="login">
    <div>
    <label for="username">Username:</label>
    <input type="text" v-model="userName" required />
    </div>
    <div>
    <label for="password">Password:</label>
    <input type="password" v-model="password" required />
    </div>
    <button type="submit">Login</button>
</form>
</div>
</template>

<script>
import axios from 'axios';

export default {
data() {
return {
    userName: '',
    password: ''
};
},
methods: {
async login() {
    try {
    const response = await axios.post('http://localhost:5000/login', {
        userName: this.userName,
        password: this.password
    });
    alert(response.data.message);
    } catch (error) {
    alert('Login failed: ' + error.response.data.message);
    }
}
}
};
</script>
