import { createApp } from "vue";
import { router } from "@/router";
import App from "@/App.vue";
import VxeUITable from "vxe-table";
import "@unocss/reset/tailwind.css";
import "uno.css";
import "@/style/index.scss";
import "@/style/vxe-table.scss";
const app = createApp(App);
app.use(router);
app.use(VxeUITable);

router.isReady().then(() => {
  const meta = document.createElement("meta");
  meta.name = "naive-ui-style";
  document.head.appendChild(meta);
  app.mount("#app");
});
