<template>
  <div>
    <div class="flex flex-col">
      <div
        v-for="(item, index) in trendingProducts"
        :key="index"
        class="flex flex-col"
      >
        <span class="font-bold text-sm flex items-center gap-2 justify-between">
          {{ item.productName }} 
          <p class="text-sm text-blue-600">{{ item.totalQuantity }} sold</p>
        </span>
      </div>
    </div>
  </div>
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
    const trendingProducts = ref(0);

    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/analytics/trending_products?days=${props.selectedPeriode.code}`
        );
        trendingProducts.value = response.data.trendingProducts;
        // console.log(response.data);
      } catch (error) {
        console.error("we can't fetch data due to this error :", error);
      }
    };

    onMounted(() => {
      fetchTrendingProducts();
    });

    watch(
      () => props.selectedPeriode,
      (newValue) => {
        fetchTrendingProducts();
      }
    );

    return {
      trendingProducts,
    };
  },
};
</script>
