
<template>
  <div class="w-[40vw] h-[55vh]">
    <div class="card flex justify-center w-full h-full">
      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-96" />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { ref, watch, onMounted } from "vue";
import Chart from "primevue/chart";

export default {
  components: {
    Chart,
  },
  props: {
    selectedPeriode: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const chartData = ref(null);
    const chartOptions = ref(null);
    const PercentageCategpry = ref([]);

    const fetchPercentageCategpry = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/analytics/category_sales?days=${props.selectedPeriode.code}`
        );
        const data = response.data.categorySales;

        // Transform API data for chart
        const labels = data.map((item) => item.category);
        const percentages = data.map((item) => item.categoryPercentage);

        chartData.value = {
          labels,
          datasets: [
            {
              data: percentages,
              backgroundColor: [
                "rgba(249, 115, 22, 0.7)",
                "rgba(6, 182, 212, 0.7)",
                "rgba(107, 114, 128, 0.7)",
                "rgba(139, 92, 246, 0.7)",
                "rgba(34, 197, 94, 0.7)",
              ],
              hoverBackgroundColor: [
                "rgba(249, 115, 22, 0.9)",
                "rgba(6, 182, 212, 0.9)",
                "rgba(107, 114, 128, 0.9)",
                "rgba(139, 92, 246, 0.9)",
                "rgba(34, 197, 94, 0.9)",
              ],
            },
          ],
        };
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    const setChartOptions = () => {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue("--p-text-color");

      chartOptions.value = {
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },
      };
    };

    onMounted(() => {
      fetchPercentageCategpry();
      setChartOptions();
    });

    watch(
      () => props.selectedPeriode,
      () => {
        fetchPercentageCategpry();
      }
    );

    return {
      chartData,
      chartOptions,
    };
  },
};
</script>
