import { registerPlugins } from '@/plugins';
import App from './App.vue';
import { createApp } from 'vue';
import { setLocale } from 'yup';
import { ptShort } from 'yup-locale-pt';
import '@/firebase';

setLocale({ ...ptShort });

const app = createApp(App);
console.log(import.meta.env);
registerPlugins(app);

app.mount('#app');
