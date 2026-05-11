# PR Send Data wps

解决收集数据问题，将客户端数据发送到云文档中。不用搭建服务器。

## 功能

 - 将数据json格式发送到云文档中。
 - 支持自定义数据数量及格式

## 文件说明

 - `wps.js`：金山文档脚本文件，负责将数据写入云文档。
 - `main.py`：Python脚本，负责将数据转换为json格式并发送到wps.js。
 - `SendKingsoftDocs.py`：发送数据到Kingsoft Docs的函数。

## 使用方式

```python
from utils import SendKingsoftDocs

# 调用函数发送数据
SendKingsoftDocs.send("姓名", "年龄", "123")
```
## 依赖

 - json
 - requests

## 金山脚本配置
将wps.js脚本复制到金山文档脚本中<br>
点击名称后三个点-复制脚本webhook:https://www.kdocs.cn/api/v3/ide/file/{FILE_ID}/script/{SCRIPT_ID}/sync_task<br>
- 1. 你的文件ID
    FILE_ID = ""  
- 2. 你的脚本ID
    SCRIPT_ID = "" 
- 3. 你的脚本令牌 (APIToken)
    AIRSCRIPT_TOKEN = "" 
- 4. 目标工作表名，据实填写
    TARGET_SHEET_NAME = ""   

## 注意事项

 - 确保金山文档脚本已上传并运行。
 - 确保金山文档脚本令牌（APSCRIPT_TOKEN）已正确配置。
 - 确保金山文档脚本工作表名（TARGET_SHEET_NAME）已正确配置。
 - 确保金山文档脚本工作表已创建并配置好。

feat(customs): 新增发送数据到金山文档的功能，免服务器搭建。