<template>
  <div class="w-max px-16 py-10 text-sm">
    <DataTable
      :value="products"
      paginator
      :rows="7"
      :rowsPerPageOptions="[4, 5, 7]"
      tableStyle="min-width: 35rem"
    >
      <Column field="ProductName" header="Product Name" style="width: 25%"></Column>
      <Column field="Category" header="Category" style="width: 25%"></Column>
      <Column field="Price" header="Price" style="width: 25%"></Column>
      <Column field="QuantitySold" header="Quantity Sold" style="width: 25%"></Column>
    </DataTable>

    <p v-if="products.length === 0" class="text-center text-xl text-gray-500">No products available</p>
  </div>
</template>


<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const products = ref([]);

const props = defineProps({
  selectedPeriode: {
    type: Number,
    required: true,
  },
});

const fetchProducts = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/products?days=${props.selectedPeriode.code}`);
    
    // If the products array is empty, set it to an empty array
    if (response.data.products && response.data.products.length > 0) {
      // Map the API response to match the table structure
      products.value = response.data.products.map(product => ({
        ProductName: product.ProductName,
        Category: product.Category,
        Price: product.Price,
        QuantitySold: product.QuantitySold,
      }));
      // console.log(products.value)
    } else {
      products.value = [];
    }
  } catch (error) {
    console.error('Error fetching product data:', error);
    products.value = [];
  }
};

onMounted(() => {
  fetchProducts();
});

watch(
  () => props.selectedPeriode,
  (newValue) => {
    fetchProducts();
  }
);
</script>
