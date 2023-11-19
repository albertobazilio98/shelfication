import { registerPlugins } from '@/plugins'
import App from './App.vue'
import { createApp } from 'vue'

const app = createApp(App)
console.log(import.meta.env)
registerPlugins(app)

app.mount('#app')
