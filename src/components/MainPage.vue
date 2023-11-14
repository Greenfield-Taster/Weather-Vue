<template>
  <div class="wrapper">
    <div class="addCityBlock">
      <div class="inputCity">
        <div class="input-container">
          <input
            class="input-field"
            v-model="cityInput"
            @input="onInput"
            placeholder="type city"
          />
          <img @click="clearInput" src="../assets/iconsCancel.png" />
          <ul v-if="showSuggestions">
            <li
              v-for="city in filtredCities"
              :key="city"
              @mousedown="selectFiltredCity(city)"
            >
              {{ city }}
            </li>
          </ul>
        </div>
        <div class="typeCityAction">
          <div class="buttonCheck">
            <router-link v-bind:to="'/weather-info/' + cityInput">
              <button class="action" @click="selectCity">Check weather</button>
            </router-link>
          </div>
          <button class="action buttonAdd" @click="addCity(cityInput)">
            Add
          </button>
        </div>
      </div>

      <div class="selectedCity">
        <select v-model="selectedCity">
          <option value="" disabled>Select city</option>
          <option v-for="(city, index) in cities" :key="index">
            {{ city }}
            <!-- <span @click="deleteCity(index)" class="delete-button"> х </span> -->
          </option>
        </select>
        <router-link v-bind:to="'/weather-info/' + selectedCity">
          <button class="action" @click="selectCity">Select city</button>
        </router-link>
      </div>
    </div>

    <!-- <div class="currentWeatherTable">
      <table>
        <thead>
          <td>
            <img
              :src="`https://flagsapi.com/${Weather.countryId}/flat/64.png`"
            />
          </td>
          <td>
            {{ cityCurrent }}
          </td>
          <td>
            {{ countryCurrent }}
          </td>
        </thead>
        <tbody>
          <tr>
            <td>
              <img src="../assets/iconsHumidity.png" />
            </td>
            <td>humidity</td>
            <td>{{ Weather.humidity }}</td>
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
                :src="`https://openweathermap.org/img/wn/${Weather.icon}@2x.png`"
              />
            </td>
            <td>main</td>
            <td>{{ Weather.main }}</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/iconsPressure.png" />
            </td>
            <td>pressure</td>
            <td>{{ Weather.pressure }}</td>
          </tr>
          <tr>
            <td>
              <img src="../assets/iconsWind.png" />
            </td>
            <td>wind</td>
            <td>{{ Weather.wind }}</td>
          </tr>
        </tbody>
      </table>
    </div> -->

    <MyChart :city="cityCurrent" :country="countryCurrentId" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import MyChart from "./Chart.vue";

const cityCurrent = ref("");
const countryCurrent = ref("");
const countryCurrentId = ref("");
const latitude = ref("");
const longitude = ref("");
const cityInput = ref("");
const cities = ref([]);
const selectedCity = ref("");
const citiesList = ref([]);
const showSuggestions = ref(false);
const storedCities = ref("");

const Weather = ref({
  id: "",
  humidity: "",
  temp: "",
  main: "",
  pressure: "",
  wind: "",
  icon: "",
  countryId: "",
});
const tempCelsius = ref("");

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
    .catch((error) => console.log("Міста не знайдено(!)", error));
};
const getWeatherInfo = (position) => {
  latitude.value = position?.coords.latitude;
  longitude.value = position?.coords.longitude;
  if (latitude.value && longitude.value) {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude.value}&lon=${longitude.value}&appid=dfa005455b567aa3e83b16a666d56b88`
      )
      .then((response) => {
        Weather.value.humidity = response.data.main.humidity;
        Weather.value.temp = response.data.main.temp;
        Weather.value.main = response.data.weather[0].description;
        Weather.value.pressure = response.data.main.pressure;
        Weather.value.icon = response.data.weather[0].icon;
        Weather.value.id = response.data.weather[0].id;
        Weather.value.wind = response.data.wind.speed;
        Weather.value.countryId = response.data.sys.country;
        countryCurrentId.value = response.data.sys.country;

        tempCelsius.value = (Weather.value.temp - 273.15).toFixed(0);
      });
  }
};
const getAllCities = () => {
  axios
    .get("https://restcountries.com/v3.1/all")
    .then((response) => {
      // console.log(response.data);
      citiesList.value = response.data
        .filter((country) => country.capital)
        .map((country) => country.capital[0]);

      console.log("CitiesList:", citiesList.value);
    })
    .catch((error) => {
      console.error("Error of getting cities:", error);
    });
};

const addCity = (city) => {
  if (JSON.stringify(cities.value).length <= 5) {
    cities.value.push(city);
    localStorage.setItem("cities", JSON.stringify(cities.value));
    console.log("Cities value", cities.value);
    alert(JSON.stringify(cities.value));

    cityInput.value = "";
  } else {
    alert("You can only have up to 5 cities");
  }
};
const clearInput = () => {
  cityInput.value = "";
  showSuggestions.value = false;
};
const filtredCities = computed(() => {
  return citiesList.value.filter((city) =>
    city.toLowerCase().startsWith(cityInput.value.toLowerCase())
  );
});
const selectFiltredCity = (selectedCity) => {
  cityInput.value = selectedCity;
  showSuggestions.value = false;
};
const onInput = () => {
  showSuggestions.value = cityInput.value.length >= 2;
};
const deleteCity = (index) => {
  const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  storedCities.splice(index, 1);
  localStorage.setItem("cities", JSON.stringify(storedCities));

  cities.value.splice(index, 1);
  selectedCity.value = "";

  alert("deleted");
};

onMounted(() => {
  getLocation();
  getWeatherInfo();

  storedCities.value = JSON.parse(localStorage.getItem("cities")) || [];
  cities.value = storedCities.value;
  console.log("Cities in storage", storedCities.value);

  getAllCities();
});
</script>
<style scoped>
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
  width: 45%;
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
.input-field {
  background-color: rgba(200, 200, 200, 0.7);
  color: black;
  padding: 10px;
  border: none;
  width: 100%;
}
.input-container {
  position: relative;
  display: inline-block;
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
.input-container ul {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background-color: rgba(83, 83, 83, 0.9);
  border-radius: 5px;
  padding: 15px 10px;
  box-sizing: border-box;
  z-index: 1;
  max-height: 20em; /* Set the maximum height for the dropdown */
  overflow-y: auto; /* Enable vertical scrollbar if needed */
}
.input-container ul li {
  list-style: none;
  border-radius: 5px;
  padding: 15px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.input-container ul li:hover {
  background-color: rgba(0, 0, 0, 0.7);
}
.selectedCity {
  display: flex;
  flex-direction: column;
  gap: 1em;
  width: 45%;
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
  /* width: 200px; */
  width: 100%;
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
img {
  width: 40px;
}
.typeCityAction {
  width: 100%;
  display: flex;
}
.buttonCheck {
  flex: 0 0 calc(80% - 5px);
  margin-right: 10px;
}
.buttonAdd {
  flex: 0 0 calc(20% - 5px);
}
</style>
