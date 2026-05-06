# MFA Log Utils

适配 MFA GUI 的标准输出日志模块。

## 功能

- 适配 MFA GUI 日志协议（info:/warn:/error:/debug:/focus: 前缀）
- 支持 info、warning、error、debug 四个日志等级
- 自动配置 UTF-8 编码，防止中文乱码
- 强制 flush 确保实时输出

## 文件说明

- `mfaalog.py` - 日志模块主文件

## 使用方式

```python
import mfaalog

mfaalog.info("普通日志消息")
mfaalog.warning("警告消息")
mfaalog.error("错误消息")
mfaalog.debug("调试消息")
mfaalog.focus("task_id")  # 聚焦特定任务
```

## 日志协议

MFA GUI 监听标准输出，需要特定前缀：
- `info:` - 普通日志
- `warn:` - 警告日志
- `error:` - 错误日志
- `debug:` - 调试日志
- `focus:` - 聚焦指令

## 依赖

无外部依赖
