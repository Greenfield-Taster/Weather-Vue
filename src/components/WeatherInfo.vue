<template>
  <div class="wrapper">
    <div class="currentWeatherTable">
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
            <td>{{ tempCelsius }} °C = {{ selectedCity.temp }} K</td>
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
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

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

const props = defineProps(["id"]);

onMounted(() => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=${props.id}&appid=7914d5a440960cfd5df3bd0388a7ad0f`
    )
    .then((response) => {
      console.log(response);
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

      tempCelsius.value = (selectedCity.value.temp - 273.15).toFixed(2);
    });

  const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.value = storedCities;
});
</script>
<style scoped>
img {
  width: 40px;
}
</style>