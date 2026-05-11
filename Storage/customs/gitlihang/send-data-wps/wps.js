// 从上下文参数中获取工作表名称（通常用于后续操作，本例暂未使用）
const sheetName = Context.argv.sheetName;

// 从上下文参数中获取要写入的行数据（预期是一个包含3个元素的数组）
const rowData = Context.argv.rowData;

// 定位A列第一个空行的行号：
// 1. Range('a5000') 选取A5000单元格
// 2. End(xlUp) 向上查找最后一个非空单元格（类似于按Ctrl+↑）
// 3. Offset(1,0) 向下偏移一行，得到第一个空行
// 4. .Row 获取该空行的行号
var num = Range('a5000').End(xlUp).Offset(1,0).Row;

// 以A列第num行为起点，扩展为1行3列的区域，将rowData写入该区域的Value2属性
// 注意：Value2是单元格值的原始类型（不使用日期等格式化）
Range(`a${num}`).Resize(1,3).Value2 = rowData;