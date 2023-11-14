<template>
  <div class="back">
    <canvas id="myChartFive"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, watch } from "vue";
import Chart from "chart.js/auto";
import axios from "axios";
import moment from "moment";

const props = defineProps(["city", "country"]);

const myChartFive = ref(null);
const labels = ref([]);
const data = ref([]);
let chartInstance = null;

const createChart = () => {
  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = myChartFive.value.getContext("2d");
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
        x: {
          // type: "time",
          time: {
            displayFormats: {
              quarter: "hh:mm",
            },
          },
        },
        // x: {
        //   ticks: {
        //     callback: function (value, index, values) {
        //       return moment(value).format("HH:mm"); //Only time without date
        //     },
        //   },
        // },
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

const getFiveDayForecast = () => {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${props.city},${props.country}&units=metric&appid=dfa005455b567aa3e83b16a666d56b88`
    )
    .then((response) => {
      console.log("Chart", response.data.list);

      labels.value = response.data.list.map((forecast) =>
        moment(forecast.dt_txt).format("HH:mm")
      );
      data.value = response.data.list.map((forecast) => forecast.main.temp);

      createChart();
    })
    .catch((error) => {
      console.log("Chart:", error);
    });
};
watch(
  () => [props.city, props.country],
  () => {
    getFiveDayForecast();
  }
);
onMounted(() => {
  myChartFive.value = document.getElementById("myChartFive");

  createChart();
  getFiveDayForecast();
});
</script>

<style scoped>
.back {
  display: flex;
  flex-direction: row;
  justify-content: space-around;

  background-color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: auto;
  border-radius: 10px;
  padding: 10px 0;
}
canvas {
  display: flex;
  width: 500px;
  height: auto;
}
</style>
