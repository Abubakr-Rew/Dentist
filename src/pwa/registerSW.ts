import { registerSW } from "virtual:pwa-register";

registerSW({
  immediate: true,
  onOfflineReady() {
    console.info("Dentist is ready to work offline.");
  },
  onNeedRefresh() {
    console.info("New Dentist version available. Refresh to update.");
  },
});
