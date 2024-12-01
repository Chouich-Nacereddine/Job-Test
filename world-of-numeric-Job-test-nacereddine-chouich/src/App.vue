<script setup>
import { ref, onMounted } from "vue";
import TotalSales from "./components/TotalSales.vue";
import Top3 from "./components/Top3.vue";
import PourcentageByCategory from "./components/PourcentageByCategory.vue";
import ProductsTable from "./components/ProductsTable.vue";
import Graph from "./components/Graph.vue";
import Select from "primevue/select";

// This is related to the Top section
// Selected period
const selectedPeriode = ref({ name: "12 Derniers Moisr", code: 365 });
// Period options
const Periods = ref([
  { name: "7 Derniers Jour", code: 7 },
  { name: "30 Derniers Jours", code: 30 },
  { name: "2 Derniers Mois", code: 60 },
  { name: "3 Derniers Mois", code: 90 },
  { name: "6 Derniers Mois", code: 180 },
  { name: "12 Derniers Mois", code: 365 },
  { name: "2 Dernieres Années", code: 730 },
]);
</script>

<template>
  <div
    class="w-screen min-h-screen flex flex-col items-center p-10 bg-white overflow-hidden"
  >
    <h1 class="text-4xl pb-5 font-semibold w-[90%] border-b border-black/20">
      Dashboard
    </h1>
    <!-- top section the contains the TotalSales, Top5 sold products, Category Sold % and the period filter drop downs  -->
    <div
      class="bg-transparent h-max flex flex-row items-center justify-between mt-5 border-b border-black/20 w-[90%]"
    >
      <span class="w-max flex flex-col gap-3 justify-start h-36"
        ><h2 class="text-base tracking-wider flex items-center gap-3">
          <span class="bg-blue-600 rounded-full w-2 h-2"></span>Chiffre
          d'Affaires Total
        </h2>
        <TotalSales :selectedPeriode="selectedPeriode" />
      </span>
      <span class="w-max flex flex-col gap-3 justify-start h-36"
        ><h2 class="text-base tracking-wider flex items-center gap-3">
          <span class="bg-blue-600 rounded-full w-2 h-2"></span>Top 3 Produits
          Vendus
        </h2>
        <Top3 :selectedPeriode="selectedPeriode" />
      </span>

      <span class="w-max flex flex-col gap-3 justify-start h-36"
        ><h2 class="text-base tracking-wider flex items-center gap-3">
          <span class="bg-blue-600 rounded-full w-2 h-2"></span>Période Choisie
        </h2>
        <div class="card flex justify-center">
          <Select
            v-model="selectedPeriode"
            :options="Periods"
            optionLabel="name"
            checkmark
            :highlightOnSelect="true"
            variant="filled"
            placeholder="Sélectionner Une Période"
            class="w-full md:w-56 text-xs mt-1"
          />
        </div>
      </span>
    </div>

    <div class="w-full flex items-start justify-around h-[80vh]">
      <ProductsTable :selectedPeriode="selectedPeriode" />
      <span class="w-max flex flex-col gap-3 justify-start h-max pt-10"
        ><h2 class="text-base tracking-wider flex items-center gap-3">
          <span class="bg-blue-600 rounded-full w-2 h-2"></span>Pourcentage Des
          Ventes
        </h2>
        <PourcentageByCategory :selectedPeriode="selectedPeriode" />
      </span>
    </div>
    <h2 class="text-base tracking-wider flex items-center gap-3 mb-20">
          <span class="bg-blue-600 rounded-full w-2 h-2"></span>Pourcentage Des
          Ventes
        </h2>
    <Graph :selectedPeriode="selectedPeriode" />
    
  </div>
</template>
