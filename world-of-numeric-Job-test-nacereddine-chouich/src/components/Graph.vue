<template>
  <div class="flex items-center justify-center h-[67vh] w-full p-16">
    <Chart type="bar" :data="chartData" :options="chartOptions" class="w-full h-max" />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import Chart from "primevue/chart";

const props = defineProps({
  selectedPeriode: {
    type: Number,
    required: true,
  },
});

const chartData = ref(null);
const chartOptions = ref(null);

const fetchChartData = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/products?days=${props.selectedPeriode.code}`);
    const products = response.data.products;

    const labels = products.map(product => product.ProductName);
    const data = products.map(product => product.QuantitySold);

    chartData.value = {
      labels,
      datasets: [
        {
          label: "Quantity Sold",
          data,
          backgroundColor: labels.map(() => "rgba(54, 162, 235, 0.2)"), // Dynamic colors if needed
          borderColor: labels.map(() => "rgba(54, 162, 235, 1)"),
          borderWidth: 1,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching chart data:", error);
    chartData.value = {
      labels: [],
      datasets: [],
    };
  }
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue("--p-text-color");
  const textColorSecondary = documentStyle.getPropertyValue("--p-text-muted-color");
  const surfaceBorder = documentStyle.getPropertyValue("--p-content-border-color");

  return {
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

onMounted(() => {
  chartOptions.value = setChartOptions();
  fetchChartData();
});

watch(() => props.selectedPeriode, () => {
  fetchChartData();
});
</script>
