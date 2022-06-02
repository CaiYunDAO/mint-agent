import { createApp } from "vue";
import App from "./App.vue";
import "./index.css";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
import Notifications from "@kyvg/vue3-notification";

createApp(App).use(Notifications).mount("#app");
