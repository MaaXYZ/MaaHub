# BBC 进程控制

BBC Server 进程生命周期管理模块，提供智能的启动、停止和状态检测功能。

## 包含的 Action

### 1. StartBbc (`start_bbc`)
**功能**：检测 BBC 状态并智能启动/连接

**执行流程**：
1. 检查 BBC 进程是否存在
2. 如果已存在且 Manager 已连接，验证模拟器参数是否匹配
3. 如果模拟器未就绪或参数不匹配，执行完整重启流程
4. 清理所有残留 BBC 进程
5. 调用 `restart_bbc_and_connect()` 启动并连接模拟器

**支持模拟器类型**：
- MuMu Player（需要 path, index, pkg, app_index）
- 雷电模拟器（需要 path, index）
- ADB 直连（需要 IP 地址）
- Auto 模式（BBC 自动检测）

**使用示例**：
```python
# Pipeline 节点配置
{
  "启动bbc": {
    "action": "start_bbc",
    "attach": {
      "connect": "connect_mumu",
      "mumu_path": "D:/MuMuPlayer-12.0/emulator/nemu/NemuPlayer.exe",
      "mumu_index": 0,
      "mumu_pkg": "com.bilibili.fatego",
      "mumu_app_index": 0
    }
  }
}
```

### 2. StopBbc (`stop_bbc`)
**功能**：强制终止所有 BBC 相关进程

**特点**：
- 使用 `proc.kill()` 而非 `terminate()`，确保能关闭有弹窗的进程
- 遍历所有进程，查找 cmdline 包含 "BBchannel" 的进程
- 输出终止的进程数量和 PID

**使用示例**：
```python
# Pipeline 节点配置
{
  "停止bbc": {
    "action": "stop_bbc"
  }
}
```

## 智能重启逻辑

StartBbc 实现了三层判断：

```
┌─────────────────────────┐
│  BBC 进程是否存在？       │
└──────┬──────────────────┘
       │
   Yes ├──────────────┐
       │              │
       ▼              ▼
  Manager 已连接？   直接重启
       │
   Yes ├──────────────┐
       │              │
       ▼              ▼
  模拟器参数匹配？   重启+连接
       │
   Yes  No
       │   │
       ▼   ▼
     跳过  重启+连接
```

## 依赖

- MaaFramework
- psutil
- bbc_connection_manager（内部依赖）

## 注意事项

1. **端口占用处理**：StopBbc 使用强制杀死，确保下次启动时端口可用
2. **参数验证**：StartBbc 会对比当前连接的模拟器参数与配置是否一致
3. **重试机制**：内部调用 `restart_bbc_and_connect(max_retries=5)`
4. **日志输出**：所有关键步骤都有详细日志，便于排查问题
