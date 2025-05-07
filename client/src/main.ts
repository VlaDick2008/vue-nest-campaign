import "./assets/main.css";
import 'vue3-toastify/dist/index.css';

import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

const app = createApp(App);

app.use(createPinia());
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
  theme: "light",
} as ToastContainerOptions);

app.mount("#app");
