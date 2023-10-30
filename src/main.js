import "./assets/main.css";

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./components/App.vue";
import MainPage from "./components/MainPage.vue";
import WeatherInfo from "./components/WeatherInfo.vue";

const routes = [
  { path: "/", component: MainPage },
  { path: "/weather-info/:id", component: WeatherInfo, props: true },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
createApp(App).use(router).mount("#app");
