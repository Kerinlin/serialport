<template>
  <div class="head-operation space-between" data-tauri-drag-region>
    <div class="left-item">
      <n-dropdown trigger="hover" :options="options" @select="handleSelect">
        <div class="menu-wrapper flex-start">
          <span>菜单</span>
          <n-icon size="16">
            <ChevronDownOutline />
          </n-icon>
        </div>
      </n-dropdown>
    </div>

    <div class="operation-wrapper">
      <n-icon size="24" @click="onMenuClick('min')">
        <RemoveCircleOutline />
      </n-icon>
      <n-icon size="24" class="ml-8" @click="onMenuClick('close')">
        <CloseCircleOutline />
      </n-icon>
    </div>
  </div>
</template>

<script setup>
import { appWindow } from "@tauri-apps/api/window";
import { ref } from "vue";
import { NDropdown, NIcon, useMessage } from "naive-ui";
const message = useMessage();
import {
  ChevronDownOutline,
  CloseCircleOutline,
  RemoveCircleOutline,
} from "@vicons/ionicons5";
import { invoke } from "@tauri-apps/api/tauri";
let options = ref([
  {
    label: "打开Excel目录",
    key: "excel",
  },
  {
    label: "打开日志目录",
    key: "log",
  },
  {
    label: "管理平台账号",
    key: "account",
  },
]);

const onMenuClick = (type) => {
  let mapActions = {
    close: () => {
      appWindow.close();
    },
    min: () => {
      appWindow.minimize();
    },
  };
  mapActions[type] && mapActions[type]();
};

const handleSelect = async (val) => {
  if (val == "excel" || val == "log") {
    await invoke("open_home_directory");
  } else {
    message.info("暂未实现");
  }
  console.log("handleSelect ~ val:", val);
};
</script>

<style lang="scss" scoped>
.head-operation {
  width: 100%;
  height: 48px;
  background-color: #4c5557;
  cursor: grab;
  color: #f7ebdc;
  padding: 0 16px;
  .left-item {
    letter-spacing: 1.5px;
    font-weight: 600;
  }
  .operation-wrapper {
    svg {
      cursor: pointer;
    }
  }
}
</style>
