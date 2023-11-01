<template>
  <div class="currentWeatherTable">
    <table>
      <thead>
        <td>
          {{ props.id }}
        </td>
        <td>
          {{ countryCurrent }}
        </td>
        <td>[{{ selectedCity.latitude }}; {{ selectedCity.longitude }}]</td>
      </thead>
      <tbody>
        <tr>
          <td>ico</td>
          <td>humidity</td>
          <td>{{ selectedCity.humidity }}</td>
        </tr>
        <tr>
          <td>ico</td>
          <td>temp</td>
          <td>{{ selectedCity.temp }}</td>
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
          <td>ico</td>
          <td>pressure</td>
          <td>{{ selectedCity.pressure }}</td>
        </tr>
        <tr>
          <td>ico</td>
          <td>description</td>
          <td>{{ selectedCity.description }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const cities = ref([]);
const selectedCity = ref({
  id: "",
  humidity: "",
  temp: "",
  main: "",
  pressure: "",
  description: "",
  icon: "",
  latitude: "",
  longitude: "",
});

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
    });

  const storedCities = JSON.parse(localStorage.getItem("cities")) || [];
  cities.value = storedCities;
});
</script>
<style scoped></style>
