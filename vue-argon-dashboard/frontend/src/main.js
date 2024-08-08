import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Import Vuex store
import vuetify from './plugins/vuetify'; // Import Vuetify plugin

// Create Vue application instance
const app = createApp(App);

// Use Vue Router
app.use(router);

// Use Vuex store
app.use(store);

// Use Vuetify
app.use(vuetify);

// Mount the application to the DOM
app.mount('#app');
