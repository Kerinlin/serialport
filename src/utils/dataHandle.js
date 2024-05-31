class CommandAssembler {
  constructor(callback) {
    this.buffer = "";
    this.callback = callback; // 添加一个回调函数
  }

  processData(data) {
    this.buffer += data;
    let completeCommand = this.extractCompleteCommand();

    while (completeCommand) {
      this.callback(completeCommand); // 使用回调函数处理完整的指令
      completeCommand = this.extractCompleteCommand();
    }
  }

  extractCompleteCommand() {
    const commandPattern = /\$[^\$]*\*[\dA-F]{2}/i;
    const match = this.buffer.match(commandPattern);

    if (match) {
      const completeCommand = match[0];
      this.buffer = this.buffer.slice(
        this.buffer.indexOf(completeCommand) + completeCommand.length
      );
      return completeCommand;
    }
    return null;
  }

  clearBuffer() {
    this.buffer = "";
  }
}

export default CommandAssembler;
