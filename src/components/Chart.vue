<template>
  <div class="back">
    <canvas id="myChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";
import moment from "moment";

const props = defineProps(["city", "country"]);

const myChart = ref(null);
const labels = ref([]);
const data = ref([]);
let chartInstance = null;

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = myChart.value.getContext("2d");
  chartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.value,
      datasets: [
        {
          data: data.value,
          borderWidth: 2,
          borderColor: " rgba(255, 255, 255, 0.8)",
          pointBackgroundColor: "rgba(0, 0, 0, 1)",
          fill: {
            target: "origin",
            above: " rgba(255, 255, 255, 0.3)",
          },
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
};

const getForecastFor24Hours = () => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast/?q=${props.city},${props.country}&units=metric&appid=dfa005455b567aa3e83b16a666d56b88`
    )
    .then((response) => {
      console.log("Chart getForecastFor24Hours", response.data.list);

      const filteredData = response.data.list.filter(
        (forecast) =>
          moment(forecast.dt_txt).isBetween(
            moment(),
            moment().add(24, "hours"),
            "hour",
            "[)"
          ) && moment(forecast.dt_txt).hour() % 3 === 0
      );

      labels.value = filteredData.map((forecast) =>
        moment(forecast.dt_txt).format("HH:mm")
      );
      data.value = filteredData.map((forecast) => forecast.main.temp);

      createChart();
    })
    .catch((error) => {
      console.log("Chart getForecastFor24Hours:", error);
    });
};
watch(
  () => [props.city, props.country],
  () => {
    getForecastFor24Hours();
  }
);
onMounted(() => {
  myChart.value = document.getElementById("myChart");

  createChart();
  getForecastFor24Hours();
});
</script>

<style scoped>
.back {
  display: flex;
  /* flex-direction: row;
  justify-content: space-around; */

  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: auto;
  border-radius: 10px;
  padding: 10px 0;
}
/* canvas {
  width: 100%;
  height: auto;
} */
</style>
