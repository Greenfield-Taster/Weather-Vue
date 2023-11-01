<template>
  <div class="wrapper">
    <div class="addCityBlock">
      <div class="inputCity">
        <div class="input-container">
          <input
            class="input-field"
            v-model="cityInput"
            placeholder="type city"
          />
          <img @click="clearInput" src="../assets/iconsCancel.png" />
        </div>
        <button class="action" @click="addCity(cityInput)">Add city</button>
      </div>

      <div class="selectedCity">
        <select v-model="selectedCity">
          <option value="">Select city</option>
          <option v-for="(city, index) in cities" :key="index" :value="city">
            {{ city }}
          </option>
        </select>
        <router-link v-bind:to="'/weather-info/' + selectedCity">
          <button class="action" @click="selectCity">Select city</button>
        </router-link>
      </div>
    </div>
    <div class="currentWeatherTable">
      <table>
        <thead>
          <td>
            {{ cityCurrent }}
          </td>
          <td>
            {{ countryCurrent }}
          </td>
          <td>[{{ latitude }}; {{ longitude }}]</td>
        </thead>
        <tbody>
          <tr>
            <td>ico</td>
            <td>humidity</td>
            <td>{{ Weather.humidity }}</td>
          </tr>
          <tr>
            <td>ico</td>
            <td>temp</td>
            <td>{{ Weather.temp }}</td>
          </tr>
          <tr>
            <td>
              <img
                :src="`https://openweathermap.org/img/wn/${Weather.icon}@2x.png`"
              />
            </td>
            <td>main</td>
            <td>{{ Weather.main }}</td>
          </tr>
          <tr>
            <td>ico</td>
            <td>pressure</td>
            <td>{{ Weather.pressure }}</td>
          </tr>
          <tr>
            <td>ico</td>
            <td>description</td>
            <td>{{ Weather.description }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";

const cityCurrent = ref("");
const countryCurrent = ref("");
const latitude = ref("");
const longitude = ref("");
const cityInput = ref("");
const cities = ref([]);
const selectedCity = ref("");

const Weather = ref({
  id: "",
  humidity: "",
  temp: "",
  main: "",
  pressure: "",
  description: "",
  icon: "",
});

const getLocation = () => {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
};
const showPosition = (position) => {
  latitude.value = position.coords.latitude;
  longitude.value = position.coords.longitude;
  // const apiKey = "pk.dfc77c3e733a06fba2855876c491f105";
  axios
    .get(
      `https://us1.locationiq.com/v1/reverse?lat=${latitude.value}&lon=${longitude.value}&format=json&key=pk.dfc77c3e733a06fba2855876c491f105`
    )
    .then((response) => {
      cityCurrent.value = response.data.address.city;
      countryCurrent.value = response.data.address.country;
      console.log(cityCurrent.value);
      console.log(countryCurrent.value);

      getWeatherInfo(position);
    })
    .catch((error) => console.log("Міста не знайдено", error));
};
const getWeatherInfo = (position) => {
  latitude.value = position?.coords.latitude;
  longitude.value = position?.coords.longitude;
  if (latitude.value && longitude.value) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude.value}&lon=${longitude.value}&appid=7914d5a440960cfd5df3bd0388a7ad0f`
      )
      .then((response) => {
        Weather.value.humidity = response.data.main.humidity;
        Weather.value.temp = response.data.main.temp;
        Weather.value.main = response.data.weather[0].description;
        Weather.value.pressure = response.data.main.pressure;
        Weather.value.description = response.data.weather[0].description;
        Weather.value.icon = response.data.weather[0].icon;
        Weather.value.id = response.data.weather[0].id;
      });
  }
};
const addCity = (city) => {
  cities.value.push(city);
  localStorage.setItem("cities", JSON.stringify(cities.value));
  console.log("Cities value", cities.value);
  // alert(JSON.stringify(cities.value));

  cityInput.value = "";
};
const clearInput = () => {
  cityInput.value = "";
};

onMounted(() => {
  getLocation();
  getWeatherInfo();

  const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.value = storedCities;
  console.log(storedCities, cities.value);

  // alert(JSON.stringify(cities.value));
});
</script>
<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10em;
  padding: 10px;
}
.currentWeatherTable {
  background-color: rgba(169, 169, 169, 0.5);
  width: 100%;
  height: auto;
  border-radius: 10px;
}

.addCityBlock {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  background-color: rgba(169, 169, 169, 0.5);
  width: 60%;
  height: auto;
  border-radius: 10px;
  padding: 30px 0;
}
.inputCity {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.inputCity input {
  background-color: rgba(200, 200, 200, 0.7);
  border: none;
  border-radius: 5px;
  color: white;
  outline: none;
  height: 30px;
  font-size: 14px;
}
.input-container {
  position: relative;
  display: inline-block;
  width: 100%;
}
.input-field {
  background-color: rgba(200, 200, 200, 0.7);
  color: black;
  padding: 10px;
  border: none;
  width: 100%;
}
.input-container img {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  cursor: pointer;
}
.selectedCity {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.selectedCity select {
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: rgba(200, 200, 200, 0.7);
  color: rgb(255, 255, 255);
  height: 30px;
  font-size: 14px;
  outline: none;
}
.action {
  width: 200px;
  height: 40px;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  background-color: rgba(200, 200, 200, 0.7);
  color: white;
  font-size: 17px;
}
.action:hover {
  background-color: rgba(200, 200, 200, 1);
}
</style>
