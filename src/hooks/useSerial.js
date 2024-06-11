import serialPortManager from "@/utils/SerialPortManager";
import { ref } from "vue";
import { useMessage } from "naive-ui";
import CommandAssembler from "@/utils/dataHandle";
export const useSerial = () => {
  let isOpen = ref(false);
  const message = useMessage();
  let assembler = ref(null);
  let terminalInfo = ref({
    iccid: "",
    sn: "",
    freq: "",
    sosFreq: "",
    powerFreq: "",
    stopFreq: "",
    ip: "",
    port: "",
    power: "",
    batteryVoltage: "",
    chargeVoltage: "",
    satellitesNum: "",
    handwareVersion: "",
    softwareVersion: "",
    bootVersion: "",
    thimble: "",
    magneticAttraction: "",
  });
  // 连接串口
  const connectPort = async (options) => {
    try {
      await serialPortManager.connect(options);
      isOpen.value = true;
      message.success("串口已连接");
      assembler.value = new CommandAssembler(handleCompleteCommand);
      listenData();
    } catch (error) {
      isOpen.value = false;
    }
  };
  // 断开串口
  const disconnectPort = async () => {
    try {
      await serialPortManager.disconnect();
      assembler.value?.clearBuffer();
      assembler.value = null;
      isOpen.value = false;
      message.success("已断开串口连接");
    } catch (error) {
      isOpen.value = false;
    }
  };

  // 监听串口反馈
  const listenData = async () => {
    serialPortManager.onDataReceived = (data) => {
      handleReceiveData(data);
    };
    serialPortManager.startListening();
  };

  const handleReceiveData = (data) => {
    console.log("接收数据", new TextDecoder().decode(data));
    assembler.value?.processData(new TextDecoder().decode(data));
  };

  const writeData = async (data) => {
    try {
      if (!isOpen.value) {
        message.error("请先连接串口");
        return false;
      }
      await serialPortManager.write(data);
      // message.success("指令已发送");
    } catch (error) {
      message.error("指令写入报错");
    }
  };

  const checkTerminalInfo = async () => {
    console.log("读取到数据开始查询-------发送查询数据");
    console.log("查询终端信息");
    // resetData();
    let command = "$CCZDC,0*hh\r\n";
    await writeData(command);
  };

  const splitLastCommand = (command) => {
    const lastData = command[command.length - 1];
    const commandArr = lastData.split("*");
    return commandArr[0];
  };

  const setSn = async (sn) => {
    let command = `$CCSID,1,${sn}*hh\r\n`;
    await writeData(command);
  };

  const setReportAddr = async (option) => {
    let command = `$CCADR,1,${option.ip},${option.port}*hh\r\n`;
    await writeData(command);
  };

  const setFreq = async (option) => {
    let command = `$CCFRE,1,${option.freq},${option.sosFreq},${option.powerFreq},${option.stopFreq}*hh\r\n`;
    await writeData(command);
  };

  const resetData = () => {
    terminalInfo.value = {
      iccid: "",
      sn: "",
      freq: "",
      sosFreq: "",
      powerFreq: "",
      stopFreq: "",
      ip: "",
      port: "",
      power: "",
      batteryVoltage: "",
      chargeVoltage: "",
      satellitesNum: "",
      handwareVersion: "",
      softwareVersion: "",
      bootVersion: "",
      thimble: "",
      magneticAttraction: "",
      workMode: "",
      networkStrength: "",
    };
  };

  const handleZDX = (command) => {
    console.log("handleZDX ~ command:", command);
    if (command) {
      resetData();
    }
    const magneticAttraction = splitLastCommand(command);
    terminalInfo.value.workMode = command[1];
    terminalInfo.value.freq = command[2];
    terminalInfo.value.sosFreq = command[3];
    terminalInfo.value.powerFreq = command[4];
    terminalInfo.value.ip = command[5];
    terminalInfo.value.port = command[6];
    terminalInfo.value.networkStrength = command[7];
    terminalInfo.value.batteryVoltage = command[8];
    terminalInfo.value.chargeVoltage = command[9];
    terminalInfo.value.satellitesNum = command[10];
    terminalInfo.value.handwareVersion = command[11];
    terminalInfo.value.softwareVersion = command[12];
    terminalInfo.value.bootVersion = command[13];
    terminalInfo.value.sn = command[14];
    terminalInfo.value.iccid = command[15];
    terminalInfo.value.stopFreq = command[16];
    terminalInfo.value.thimble = command[19];
    terminalInfo.value.magneticAttraction = magneticAttraction[0];
  };

  const handleIDX = (command) => {
    console.log("handleIDX ~ command:", command);
    let lastData = splitLastCommand(command);
    if (lastData) {
      terminalInfo.value.sn = lastData;
    }
  };
  const handleADR = (command) => {
    console.log("handleADR ~ command:", command);
    let lastData = splitLastCommand(command);
    terminalInfo.value.ip = command[1];
    if (lastData) {
      terminalInfo.value.port = lastData;
    }
  };
  const handleFRE = (command) => {
    console.log("handleFRE ~ command:", command);
    // checkTerminalInfo();
    let lastData = splitLastCommand(command);
    terminalInfo.value.freq = command[1];
    terminalInfo.value.sosFreq = command[2];
    terminalInfo.value.powerFreq = command[3];
    if (lastData) {
      terminalInfo.value.stopFreq = lastData;
    }
  };

  const handleCompleteCommand = (command) => {
    if (command) {
      let commandArr = command.split(",");
      let markCommand = commandArr[0];
      switch (markCommand) {
        case "$BDZDX":
          handleZDX(commandArr);
          break;
        case "$BDIDX":
          handleIDX(commandArr);
          break;
        case "$BDADR":
          handleADR(commandArr);
          break;
        case "$BDFRE":
          handleFRE(commandArr);
          break;

        default:
          break;
      }
    }
  };

  return {
    isOpen,
    connectPort,
    disconnectPort,
    listenData,
    writeData,
    checkTerminalInfo,
    terminalInfo,
    setSn,
    setReportAddr,
    setFreq,
  };
};
