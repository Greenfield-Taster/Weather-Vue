<template>
  <div class="wrapper">
    <div class="fullTitle">
      <div class="goBackLink">
        <router-link v-bind:to="'/'">
          <button class="goBackButton">Go back</button>
        </router-link>
      </div>
      <div class="titleContainer">
        <div class="title">
          <img
            :src="`https://flagsapi.com/${selectedCity.country}/flat/64.png`"
          />
          <h1>
            {{ props.id }}
          </h1>
        </div>
      </div>
    </div>
    <div class="navigationButtons">
      <button @click="showChart(1)">Table</button>
      <button @click="showChart(2)">Chart for today</button>
      <button @click="showChart(3)">Chart for 5 days</button>
    </div>

    <div v-if="selectedChart === 1" class="currentWeatherTable">
      <table>
        <thead>
          <td>
            <img
              :src="`https://flagsapi.com/${selectedCity.country}/flat/64.png`"
            />
          </td>
          <td>
            {{ props.id }}
          </td>
          <td>
            {{ selectedCity.country }}
          </td>
          <!-- <td>[{{ selectedCity.latitude }}; {{ selectedCity.longitude }}]</td> -->
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="../assets/iconsHumidity.png" />
            </td>
            <td>humidity</td>
            <td>{{ selectedCity.humidity }}</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/iconsTemp.png" />
            </td>
            <td>temp</td>
            <td>{{ tempCelsius }} °C</td>
          </tr>
          <tr>
            <td>
              <img
                :src="`https://openweathermap.org/img/wn/${selectedCity.icon}@2x.png`"
              />
            </td>
            <td>main</td>
            <td>{{ selectedCity.main }}</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/iconsPressure.png" />
            </td>
            <td>pressure</td>
            <td>{{ selectedCity.pressure }}</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/iconsWind.png" />
            </td>
            <td>wind</td>
            <td>{{ selectedCity.wind }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <Chart
      v-else-if="selectedChart === 2"
      :city="selectedCityName"
      :country="selectedCountryName"
    />
    <MyChartForFive
      v-else-if="selectedChart === 3"
      :city="selectedCityName"
      :country="selectedCountryName"
    />
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import Chart from "./Chart.vue";

import MyChartForFive from "./ChartForecastFive.vue";

const cities = ref([]);
const selectedCity = ref({
  id: "",
  countryId: "",
  humidity: "",
  temp: "",
  main: "",
  pressure: "",
  description: "",
  icon: "",
  latitude: "",
  longitude: "",
  country: "",
  wind: "",
});

const tempCelsius = ref("");
const selectedCityName = ref("");
const selectedCountryName = ref("");
const selectedChart = ref(1);

const keyOpenweather = import.meta.env.VITE_OPENWEATHERMAP_TOREN;

const props = defineProps(["id"]);

const showChart = (chartNumber) => {
  selectedChart.value = chartNumber;
};

onMounted(() => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${props.id}&appid=${keyOpenweather}`
    )
    .then((response) => {
      console.log("Selected city", response);
      selectedCity.value.humidity = response.data.main.humidity;
      selectedCity.value.temp = response.data.main.temp;
      selectedCity.value.main = response.data.weather[0].description;
      selectedCity.value.pressure = response.data.main.pressure;
      selectedCity.value.description = response.data.weather[0].description;
      selectedCity.value.icon = response.data.weather[0].icon;
      selectedCity.value.latitude = response.data.coord.lat;
      selectedCity.value.longitude = response.data.coord.lon;
      selectedCity.value.country = response.data.sys.country;
      selectedCity.value.wind = response.data.wind.speed;

      selectedCountryName.value = response.data.sys.country;
      selectedCityName.value = response.data.name;

      tempCelsius.value = (selectedCity.value.temp - 273.15).toFixed(0);
    })
    .catch((error) => {
      console.log("In selected city", error);
    });

  const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.value = storedCities;
});
</script>
<style scoped>
img {
  width: 40px;
}
.title {
  font-size: 29px;
  display: flex;
  flex-direction: row;
  gap: 2em;
  color: white;
}
.title img {
  width: 80px;
}
.fullTitle {
  display: flex;
  align-content: flex-end;
  flex-direction: row;
  align-items: center;
  gap: 15em;
  width: 100%;
}
@media (max-width: 1050px) {
  .fullTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0px;
  }

  .titleContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
}
@media (max-width: 750px) {
  .fullTitle {
    flex-direction: column;
  }
  .titleContainer {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
}
@media (max-width: 500px) {
  .title {
    flex-direction: column;
    gap: 5px;
    align-items: center;
    padding-top: 15px;
  }
  .currentWeatherTable {
    width: 100%;
  }
  .navigationButtons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .navigationButtons button {
    width: 300px;
  }
}
@media (max-width: 370px) {
  .title {
    font-size: 25px;
  }
}
</style>
