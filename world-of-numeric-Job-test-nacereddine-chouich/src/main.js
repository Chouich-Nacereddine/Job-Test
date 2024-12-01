import { createApp } from "vue";
import PrimeVue from "primevue/config";
import Aura from '@primevue/themes/aura';
import App from "./App.vue";
import "./index.css";

createApp(App)
  .use(PrimeVue, {
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: "false",
        cssLayer: false,
      },
    },
  }) // First use the plugin
  .mount("#app"); // Then mount the app
