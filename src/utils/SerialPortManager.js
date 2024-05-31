class SerialPortManager {
  constructor() {
    if (SerialPortManager.instance) {
      return SerialPortManager.instance;
    }
    this.port = null;
    this.reader = null;
    this.writer = null;
    this.keepReading = false;
    this.onDataReceived = null;
    this.portOptions = null;
    this.readBuffer = []; // 新增一个缓冲区
    SerialPortManager.instance = this;
  }

  async getPorts() {
    const ports = await navigator.serial.getPorts();
    return ports;
  }

  async connect(options) {
    if (this.port) {
      await this.disconnect();
    }
    try {
      this.port = await navigator.serial.requestPort();
      await this.port.open(options);
      this.portOptions = options;
      this.reader = this.port.readable.getReader();
    } catch (error) {
      console.error("Failed to connect to the serial port: ", error);
      this.port = null;
      throw error;
    }
  }

  async disconnect() {
    this.keepReading = false;
    if (this.reader) {
      await this.reader.cancel();
      this.reader.releaseLock();
      this.reader = null;
    }
    if (this.writer) {
      await this.writer.close();
      this.writer = null;
    }
    if (this.port) {
      await this.port.close();
      this.port = null;
    }
    this.portOptions = null;
  }

  getPortStatus() {
    if (this.port) {
      return {
        connected: true,
        portInfo: this.port.getInfo(),
        options: this.portOptions,
      };
    } else {
      return {
        connected: false,
      };
    }
  }

  async read() {
    if (!this.port) throw new Error("Serial port not connected");
    try {
      while (this.keepReading) {
        const { value, done } = await this.reader.read();
        if (done) {
          break;
        }
        if (value) {
          this.readBuffer.push(...value);
          if (this.onDataReceived) {
            this.onDataReceived(new Uint8Array(this.readBuffer));
            this.readBuffer = []; // 清空缓冲区
          }
        }
      }
    } catch (error) {
      console.error("Error during serial port read: ", error);
      if (this.keepReading) {
        // 重试机制
        console.log("Retrying read...");
        this.reader.releaseLock();
        this.reader = this.port.readable.getReader();
        this.read();
      }
    }
  }

  async write(data) {
    if (!this.port || !this.port.writable)
      throw new Error("Serial port not connected or not writable");
    const writer = this.port.writable.getWriter();
    const encoder = new TextEncoder();
    try {
      await writer.write(encoder.encode(data));
    } finally {
      writer.releaseLock();
    }
  }

  startListening() {
    if (!this.port) throw new Error("Serial port not connected");
    this.keepReading = true;
    this.read();
  }

  stopListening() {
    this.keepReading = false;
  }
}

const serialPortManagerInstance = new SerialPortManager();
export default serialPortManagerInstance;
