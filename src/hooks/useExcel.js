import * as XLSX from "xlsx";

export const generateTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hour = now.getHours().toString().padStart(2, "0");
  const minute = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  return `${year}_${month}_${day}_${hour}_${minute}_${seconds}`;
};

export const prepareExcelData = (data) => {
  const filteredData = data.map((record) => {
    const { _X_ROW_KEY, ...rest } = record; // 使用解构赋值来排除 _X_ROW_KEY
    return rest;
  });
  // 使用过滤后的数据创建工作表
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  worksheet["!cols"] = [{ wch: 50 }, { wch: 50 }, { wch: 50 }];

  // 设置居中样式
  const centerStyle = {
    alignment: {
      horizontal: "center",
      vertical: "center",
    },
  };

  // 应用样式到所有单元格
  for (let row = 1; row <= filteredData.length; row++) {
    for (let col = 0; col < worksheet["!cols"].length; col++) {
      const cell_ref = XLSX.utils.encode_cell({ c: col, r: row });
      if (!worksheet[cell_ref]) {
        worksheet[cell_ref] = {};
      }
      worksheet[cell_ref].s = centerStyle;
    }
  }
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "入库");
  const wbout = XLSX.write(workbook, { type: "binary" });

  // 创建 ArrayBuffer 并填充数据
  const buffer = new ArrayBuffer(wbout.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < wbout.length; i++) {
    view[i] = wbout.charCodeAt(i) & 0xff;
  }
  return buffer;
};
