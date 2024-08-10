import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Adjust the path if necessary
import vuetify from './plugins/vuetify'; // Adjust the path if necessary

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app');
