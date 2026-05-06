# Chaldea Import

从 Chaldea 网站导入队伍配置并转换为 BBC 配置文件。

## 功能

- 支持 Chaldea 分享链接/ID/压缩数据
- 自动调用 Chaldea API 获取队伍数据
- 转换为 BBC 配置文件格式
- 保存到 BBchannel/settings 目录

## 文件说明

- `chaldea_import_action.py` - Chaldea 导入 Action 主模块
- `chaldea/` - Chaldea API 客户端
  - `chaldea_client.py` - API 调用
  - `bbc_formatter.py` - BBC 配置格式化
  - `game_data.py` - 游戏数据模型
  - `servant_types.py` - 从者类型定义
  - `config_checker.py` - 配置检查器
- `chaldea_converter.py` - Chaldea 队伍转换工具
- `utils/Chaldea/` - Chaldea 数据文件
  - `servant_names_CN.json` - 从者中文名映射
  - `equip_names_CN.json` - 概念礼装中文名映射

## 使用方式

```python
from chaldea_import_action import ChaldeaImportAction

action = ChaldeaImportAction()
result = action.run(context, node_name, node_param)
```

## 依赖

- MaaFramework
- 网络连接（访问 Chaldea API）
