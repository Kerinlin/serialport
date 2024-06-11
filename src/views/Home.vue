<template>
  <div class="home-wrapper flex-start">
    <div class="left-content">
      <Card title="串口连接" class="mb-16">
        <div class="connect-wrapper space-between">
          <div class="option-item flex-start">
            <div class="title mr-8">波特率</div>
            <n-select
              v-model:value="serialOptions.baudRate"
              :disabled="isOpen"
              style="width: 200px"
              :options="baudRateOptions"
            />
          </div>
          <n-button v-if="!isOpen" color="#383F3E" @click="handleConnect">
            打开串口
          </n-button>
          <n-button v-else color="#383F3E" @click="handleDisconnect">
            断开串口
          </n-button>
        </div>
      </Card>
      <Card title="入库操作">
        <div class="code-wrapper">
          <div class="sn-wrapper space-between mb-16">
            <div class="option-item flex-start">
              <div class="title mr-8">SN码</div>
              <n-input
                ref="snInput"
                v-model:value="formOptions.sn"
                style="width: 200px"
                type="text"
                placeholder=""
              />
            </div>
            <div class="flex-start">
              <n-button color="#383F3E" @click="handleSetSn"> 设置 </n-button>
              <n-button
                style="margin-left: 16px"
                color="#383F3E"
                @click="handleCheckTerminalData"
              >
                查询
              </n-button>
            </div>
          </div>

          <div class="iccid-wrapper space-between mb-16">
            <div class="option-item flex-start">
              <div class="title mr-8">ICCID</div>
              <n-input
                v-model:value="formOptions.iccid"
                style="width: 200px"
                type="text"
                placeholder=""
              />
            </div>
            <n-button color="#383F3E" @click="handleCheckTerminalData">
              查询
            </n-button>
          </div>
          <div class="store-wrapper space-between">
            <div class="option-item flex-start">
              <div class="title mr-8">查询间隔</div>
              <n-input
                v-model:value="formOptions.interval"
                :disabled="formOptions.isAutoCheck"
                style="width: 200px"
                type="text"
                placeholder=""
              />
              <n-checkbox
                v-model:checked="formOptions.isAutoCheck"
                class="ml-8"
                :on-update:checked="handleAutoCheckData"
              >
                自动查询
              </n-checkbox>
            </div>
            <div class="right-item flex-start">
              <n-checkbox v-model:checked="formOptions.isAutoStore">
                自动导入Excel
              </n-checkbox>
              <!-- <n-button style="margin-left: 16px" color="#383F3E" @click="handleStore"> 入库 </n-button> -->
              <n-button
                style="margin-left: 16px"
                color="#383F3E"
                @click="handleStore"
              >
                导入Excel
              </n-button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="数据设置" class="mt-16">
        <div class="freq-wrapper space-between">
          <div class="left-item flex-start">
            <div class="freq-item flex-start mr-16">
              <div class="title mr-8">上报频度</div>
              <n-input
                v-model:value="formOptions.freq"
                style="width: 60px"
                type="text"
                placeholder=""
              />
            </div>
            <div class="freq-item flex-start mr-16">
              <div class="title mr-8">报警</div>
              <n-input
                v-model:value="formOptions.sosFreq"
                style="width: 60px"
                type="text"
                placeholder=""
              />
            </div>
            <div class="freq-item flex-start mr-16">
              <div class="title mr-8">低电</div>
              <n-input
                v-model:value="formOptions.powerFreq"
                style="width: 60px"
                type="text"
                placeholder=""
              />
            </div>
            <div class="freq-item flex-start">
              <div class="title mr-8">停泊</div>
              <n-input
                v-model:value="formOptions.stopFreq"
                style="width: 60px"
                type="text"
                placeholder=""
              />
            </div>
          </div>
          <div class="right-item flex-start">
            <n-button color="#383F3E" @click="setFreq(formOptions)">
              设置
            </n-button>
            <n-button
              style="margin-left: 16px"
              color="#383F3E"
              @click="handleCheckTerminalData"
            >
              查询
            </n-button>
          </div>
        </div>
        <div class="ip-wrapper space-between mt-16">
          <div class="left-item flex-start">
            <div class="freq-item flex-start mr-16">
              <div class="title mr-8">IP</div>
              <n-input
                v-model:value="formOptions.ip"
                style="width: 150px"
                type="text"
                placeholder=""
              />
            </div>
            <div class="freq-item flex-start mr-16">
              <div class="title mr-8">端口</div>
              <n-input
                v-model:value="formOptions.port"
                style="width: 80px"
                type="text"
                placeholder=""
              />
            </div>
          </div>
          <div class="right-item flex-start">
            <n-button color="#383F3E" @click="setReportAddr(formOptions)">
              设置
            </n-button>
            <n-button
              style="margin-left: 16px"
              color="#383F3E"
              @click="handleCheckTerminalData"
            >
              查询
            </n-button>
          </div>
        </div>
      </Card>

      <Card title="其他数据" class="mt-16 info-wrapper">
        <div class="data-wrapper space-between">
          <div class="data-item flex-start">
            <div class="title">设备SN</div>
            <div v-if="terminalInfo?.sn" class="value">
              {{ terminalInfo?.sn }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">设备ICCID</div>
            <div v-if="terminalInfo?.iccid" class="value">
              {{ terminalInfo?.iccid }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">工作模式</div>
            <div v-if="terminalInfo?.workMode" class="value">
              {{ mapMode[terminalInfo.workMode] }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">正常工作模式上报频度</div>
            <div v-if="terminalInfo?.freq" class="value">
              {{ terminalInfo?.freq }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">报警模式上报频度</div>
            <div v-if="terminalInfo?.sosFreq" class="value">
              {{ terminalInfo?.sosFreq }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">低电量报警模式上报频度</div>
            <div v-if="terminalInfo?.powerFreq" class="value">
              {{ terminalInfo?.powerFreq }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">港口停泊状态上报频度</div>
            <div v-if="terminalInfo?.stopFreq" class="value">
              {{ terminalInfo?.stopFreq }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">IP端口</div>
            <div v-if="terminalInfo?.ip" class="value">
              {{ terminalInfo?.ip }},{{ terminalInfo?.port }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">网络强度</div>
            <div v-if="terminalInfo?.networkStrength" class="value">
              {{ terminalInfo?.networkStrength }}
            </div>
          </div>

          <div class="data-item flex-start">
            <div class="title">电池电压</div>
            <div class="value">{{ terminalInfo?.batteryVoltage }}</div>
          </div>

          <div class="data-item flex-start">
            <div class="title">充电电压</div>
            <div class="value">{{ terminalInfo?.chargeVoltage }}</div>
          </div>

          <div class="data-item flex-start">
            <div class="title">定位卫星数</div>
            <div class="value">{{ terminalInfo?.satellitesNum }}</div>
          </div>
          <div class="data-item flex-start">
            <div class="title">硬件版本</div>
            <div class="value">{{ terminalInfo?.handwareVersion }}</div>
          </div>
          <div class="data-item flex-start">
            <div class="title">软件版本</div>
            <div class="value">{{ terminalInfo?.softwareVersion }}</div>
          </div>
          <div class="data-item flex-start">
            <div class="title">BOOT软件版本</div>
            <div class="value">{{ terminalInfo?.bootVersion }}</div>
          </div>
          <div class="data-item flex-start">
            <div class="title">顶针状态</div>
            <div class="value">{{ terminalInfo?.thimble }}</div>
          </div>
          <div class="data-item flex-start">
            <div class="title">磁吸状态</div>
            <div class="value">{{ terminalInfo?.magneticAttraction }}</div>
          </div>
        </div>
      </Card>
    </div>
    <div class="right-content">
      <div class="table-wrapper">
        <Card title="入库记录">
          <vxe-table
            ref="xTable"
            :data="recordList"
            align="center"
            :row-config="{ isHover: true }"
            :column-config="{ resizable: false }"
            max-height="100%"
            :scroll-y="{ enabled: true }"
            class="table-container"
          >
            <vxe-column title="序号">
              <template #default="{ rowIndex }"> {{ rowIndex + 1 }} </template>
            </vxe-column>
            <vxe-column field="sn" title="SN码"> </vxe-column>
            <vxe-column field="iccid" title="ICCID"></vxe-column>
            <vxe-column>
              <template #default="{ row, rowIndex }">
                <div class="cursor-pointer">
                  <n-popconfirm
                    positive-text="确认"
                    negative-text="取消"
                    @positive-click="confirmDel(rowIndex)"
                  >
                    <template #trigger>
                      <n-icon size="32">
                        <CloseSharp />
                      </n-icon>
                    </template>
                    是否删除此纪录
                  </n-popconfirm>
                </div>
              </template>
            </vxe-column>
          </vxe-table>
        </Card>
      </div>
      <div class="bottom-operation flex-start">
        <n-button color="#383F3E" @click="exportExcel"> 导出Excel </n-button>
        <n-button style="margin-left: 16px" color="#383F3E" @click="clearLog">
          清除记录
        </n-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import {
  useMessage,
  NSelect,
  NButton,
  NInput,
  NCheckbox,
  NIcon,
  NPopconfirm,
} from "naive-ui";
import { CloseSharp } from "@vicons/ionicons5";
import Card from "@/components/Card.vue";
const message = useMessage();
import { useSerial } from "@/hooks/useSerial";
import { prepareExcelData } from "@/hooks/useExcel";
import { sleep } from "@/utils/index";
const {
  connectPort,
  isOpen,
  disconnectPort,
  checkTerminalInfo,
  terminalInfo,
  setSn,
  setReportAddr,
  setFreq,
} = useSerial();
import { useDebounceFn, useDateFormat, useNow } from "@vueuse/core";
import { invoke } from "@tauri-apps/api/tauri";
import * as path from "@tauri-apps/api/path";
let snInput = ref(null);
let xTable = ref(null);
let serialOptions = ref({
  baudRate: 115200,
  bufferSize: 100000,
});
let recordList = ref([]);
let timer = ref(null);
let mapMode = {
  1: "正常模式",
  2: "按键报警模式",
  3: "拆卸报警",
  4: "侧翻报警",
  5: "低电量报警",
  6: "落水报警",
};
let formOptions = ref({
  sn: "",
  iccid: "",
  isAutoStore: true,
  freq: "",
  sosFreq: "",
  powerFreq: "",
  stopFreq: "",
  ip: "",
  port: "",
  interval: "1000",
  isAutoCheck: false,
});

let baudRateOptions = ref([
  {
    label: "9600",
    value: 9600,
  },
  {
    label: "115200",
    value: 115200,
  },
  {
    label: "19200",
    value: 19200,
  },
]);

watch(
  () => terminalInfo.value?.iccid,
  (newVal, oldVal) => {
    console.log("iccid值:", newVal, oldVal);
    formOptions.value.iccid = "";
    setTimeout(() => {
      formOptions.value.iccid = newVal;
    }, 100);
  },
  {
    deep: true,
  }
);

// watch(
//   () => terminalInfo.value?.sn,
//   (newVal, oldVal) => {
//     console.log("监听sn", terminalInfo.value?.sn, newVal, oldVal);
//     formOptions.value.sn = newVal;
//   },
//   {
//     deep: true,
//   }
// );

watch(
  () => formOptions.value?.sn,
  (newVal, oldVal) => {
    handleInput(newVal, oldVal);
  }
);

const focusInput = () => {
  snInput.value?.focus();
};

const handleAutoCheckData = (val) => {
  console.log("handleAutoCheckData ~ val:", val);
  if (!isOpen.value) {
    message.error("请先连接串口");
    return false;
  }
  formOptions.value.isAutoCheck = val;
  if (val) {
    timer.value = setInterval(() => {
      checkTerminalInfo();
    }, formOptions.value.interval);
  } else {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const handleConnect = async () => {
  await connectPort(serialOptions.value);
  focusInput();
};

const handleDisconnect = async () => {
  await disconnectPort();
  formOptions.value.isAutoCheck = false;
  clearInterval(timer.value);
  timer.value = null;
};

const scrollToBottomSmoothly = () => {
  const tableEl = xTable.value.$el; // 获取 vxe-table 的根元素
  const scrollContainer = tableEl.querySelector(".vxe-table--body-wrapper"); // 获取滚动容器
  const containerHeight = scrollContainer.clientHeight; // 获取滚动容器的高度
  const scrollHeight = scrollContainer.scrollHeight + 52; // 获取滚动内容的高度
  scrollToTop(scrollHeight - containerHeight);
};

// 封装一个回到底部或者顶部的函数
const scrollToTop = (position) => {
  const tableEl = xTable.value.$el; // 获取 vxe-table 的根元素
  const scrollContainer = tableEl.querySelector(".vxe-table--body-wrapper"); // 获取滚动容器

  // 获取当前滚动的距离
  let scrollTopDistance = scrollContainer.scrollTop;
  function smoothScroll() {
    const distance = position - scrollTopDistance; // 计算滚动的距离
    scrollTopDistance = scrollTopDistance + distance / 5; // 平滑滚动效果
    if (Math.abs(distance) < 1) {
      scrollContainer.scrollTo({ top: position, behavior: "smooth" });
    } else {
      scrollContainer.scrollTo({ top: scrollTopDistance });
      requestAnimationFrame(smoothScroll);
    }
  }
  smoothScroll();
};

const confirmDel = (index) => {
  console.log("deleteRecord ~ index:", index);
  recordList.value.splice(index, 1);
};

const logMessage = async (message) => {
  await invoke("write_log", { message });
};

const clearLog = async () => {
  try {
    await invoke("clear_log");
    message.success("日志记录已清除");
    focusInput();
  } catch (error) {
    console.log("clearLog ~ error:", error);
  }
};

const handleStore = async () => {
  if (!formOptions.value?.sn || !formOptions.value?.iccid) {
    message.error("请先获取SN与ICCID数据");
    focusInput();
    return;
  }
  if (formOptions.value?.sn && formOptions.value?.iccid) {
    let formatted = useDateFormat(useNow(), "YYYY-MM-DD HH:mm:ss");
    let recordItem = {
      sn: formOptions.value?.sn,
      iccid: formOptions.value?.iccid,
      updateTime: formatted.value,
    };
    recordList.value.push(recordItem);
    scrollToBottomSmoothly();
    let logData = JSON.stringify(recordItem);
    logMessage(`${formatted.value} 入库 ${logData}`);
    focusInput();
    backupExcel();
  }
};

const exportExcel = async () => {
  if (recordList.value?.length == 0) {
    message.error("请先进行入库操作");
    return false;
  }
  const data = prepareExcelData(recordList.value);
  let formatted = useDateFormat(useNow(), "YYYY-MM-DD-HH-mm-ss");
  const homeDir = await path.homeDir();
  const fullPath = `${homeDir}/PN07入库记录_${formatted.value}.xlsx`;
  await invoke("save_excel_file", {
    path: fullPath,
    data: Array.from(new Uint8Array(data)),
  });
  message.success(`导出Excel成功`);
  focusInput();
};

const backupExcel = async () => {
  const data = prepareExcelData(recordList.value);
  let formatted = useDateFormat(useNow(), "YYYY-MM-DD");
  const homeDir = await path.homeDir();
  const fullPath = `${homeDir}/PN07入库记录_${formatted.value}_备份.xlsx`;
  await invoke("save_excel_file", {
    path: fullPath,
    data: Array.from(new Uint8Array(data)),
  });
};

const handleSetSn = async () => {
  await setSn(formOptions.value.sn);
};

const handleCheckTerminalData = async () => {
  await checkTerminalInfo();
};

const handleInput = useDebounceFn(async (newVal, oldVal) => {
  if (newVal?.length > 11) {
    formOptions.value.sn = newVal?.slice(-11);
    formOptions.value.iccid = "";
  }
  if (newVal.length == 11) {
    console.log("读取到数据开始查询-------", newVal);
    await setSn(formOptions.value.sn);
    await sleep(500);
    await checkTerminalInfo();
    await sleep(formOptions.value.interval);
    if (formOptions.value.isAutoStore) {
      handleStore();
    }
  }
}, 10);

onMounted(() => {
  navigator.serial.addEventListener("disconnect", (e) => {
    console.log("串口已断开");
    message.error("串口已断开");
    handleDisconnect();
    setTimeout(() => {
      location.reload();
    }, 2500);
  });
});
</script>

<style lang="scss" scoped>
.home-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 16px;
  &:deep(.n-button) {
    font-size: 12px;
    width: 84px;
    --n-text-color: #f7ebdc !important;
    --n-text-color-hover: #f7ebdc !important;
    --n-text-color-pressed: #f7ebdc !important;
    --n-text-color-focus: #f7ebdc !important;
    --n-text-color-disabled: #f7ebdc !important;
  }
  &:deep(.n-button__content) {
    font-weight: 600;
  }
  .left-content {
    box-sizing: border-box;
    width: 750px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    .option-item {
      .title {
        width: 54px;
        white-space: nowrap;
      }
    }
    .connect-wrapper {
      margin-bottom: 16px;
    }
    .freq-wrapper {
      .freq-item {
        .title {
          white-space: nowrap;
        }
      }
    }
    .info-wrapper {
      flex: 1;
      .data-wrapper {
        width: 100%;
        flex-wrap: wrap;
        .data-item {
          width: 50%;
          margin-bottom: 16px;
          .title {
            white-space: nowrap;
            margin-right: 16px;
          }
        }
      }
    }
  }
  .right-content {
    margin-left: 16px;
    width: calc(100% - 750px);
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &:deep(.card-content) {
      padding: 0;
    }
    &:deep(.card-wrapper) {
      height: 100%;
    }
    &:deep(.vxe-body--column) {
      padding: 8px 0 !important;
    }
    .table-wrapper {
      flex: 1;
    }
    .bottom-operation {
      margin-top: 16px;
      height: 34px;
    }
  }
}
</style>
