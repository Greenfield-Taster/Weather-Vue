import "./assets/main.css";

import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";

import App from "./components/App.vue";
import MainPage from "./components/MainPage.vue";
import WeatherInfo from "./components/WeatherInfo.vue";
import Chart from "./components/Chart.vue";

const routes = [
  { path: "/", component: MainPage, props: true },
  { path: "/weather-info/:id", component: WeatherInfo, props: true },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});
createApp(App).use(router).mount("#app");
