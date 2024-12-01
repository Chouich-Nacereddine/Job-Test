<template>
  <p class="font-semibold text-4xl flex items-end gap-1">{{ totalAmount }} <p class="text-lg text-blue-600 font-bold">Dh</p></p>
  
</template>

<script>
import axios from "axios";
import { ref, watch, onMounted } from "vue";

export default {
  props: {
    selectedPeriode: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const totalAmount = ref(0);

    const fetchTotalSales = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/analytics/total_sales?days=${props.selectedPeriode.code}`
        );
        totalAmount.value = response.data.totalAmount;
        // console.log(response)
      } catch (error) {
        console.error("we can't fetch data due to this error :", error);
      }
    };

    onMounted(() => {
      fetchTotalSales();
    });

    watch(
      () => props.selectedPeriode,
      (newValue) => {
        fetchTotalSales();
      }
    );

    return {
      totalAmount,
    };
  },
};
</script>
