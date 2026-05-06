# BBC TCP 连接管理器

BBC Server TCP 通信基础设施模块，提供进程级单例的 TCP 连接管理、回调监听和消息队列功能。

## 核心功能

### 1. TCP 命令通道（端口 25001）
- `connect_tcp()` - 建立 TCP 连接
- `send_command()` - 发送命令并等待响应
- `ensure_connected()` - 确保连接有效，自动重连
- `disconnect_tcp()` - 断开连接

### 2. 回调监听服务器（端口 25002）
- 永久后台线程监听 BBC Server 推送事件
- 自动触发 BBC 就绪信号（`server_started`, `disclaimer_closed`）
- 弹窗事件回调机制

### 3. 消息队列管理
- `get_message()` - 阻塞获取单条消息
- `get_messages_by_title()` - 按标题关键词过滤消息
- `clear_message_queue()` - 清空历史消息

### 4. BBC 进程管理
- `_launch_bbc()` - 启动 BBC.exe 进程
- `_kill_bbc_process()` - 终止指定进程
- `find_bbc_process()` - 查找运行中的 BBC 进程

### 5. 模拟器连接封装
- `connect_emulator()` - 连接 MuMu/雷电/ADB 模拟器
- `check_emulator_params_match()` - 验证模拟器参数匹配
- `restart_bbc_and_connect()` - 完整重启流程（杀进程→启动→等待就绪→连接模拟器）

### 6. 进程级单例
```python
from bbc_connection_manager import get_manager

manager = get_manager()  # 每个 agent 进程只有一个实例
```

## 使用示例

```python
from bbc_connection_manager import get_manager

# 获取单例
manager = get_manager()

# 设置弹窗回调
def on_popup(msg):
    print(f"收到弹窗: {msg['popup_title']}")

manager.set_popup_callback(on_popup)

# 发送命令
result = manager.send_command('get_status', {}, timeout=5)
if result.get('success'):
    print("BBC 状态正常")

# 完整重启流程
success = manager.restart_bbc_and_connect(
    connect_cmd='connect_mumu',
    connect_args={
        'path': 'D:/MuMuPlayer-12.0/emulator/nemu/NemuPlayer.exe',
        'index': 0,
        'pkg': 'com.bilibili.fatego',
        'app_index': 0
    },
    max_retries=5
)
```

## 架构设计

```
┌─────────────────────────────────────┐
│   Agent Process (MaaFramework)      │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  BbcConnectionManager        │  │
│  │  (进程级单例)                 │  │
│  │                              │  │
│  │  - TCP Socket (25001)       │  │
│  │  - Callback Server (25002)  │  │
│  │  - Message Queue            │  │
│  │  - Popup Callback           │  │
│  └──────────────────────────────┘  │
└──────────┬──────────────────────────┘
           │ TCP
           ▼
┌─────────────────────────────────────┐
│   BBC Server (BBchannel.exe)        │
│                                     │
│  - Command Handler                  │
│  - Event Dispatcher                 │
│  - Emulator Controller              │
└─────────────────────────────────────┘
```

## 依赖

- MaaFramework
- psutil

## 注意事项

1. **进程级单例**：每个 MaaFramework agent 进程只创建一个 Manager 实例，避免端口冲突
2. **端口清理**：初始化时自动清理 25002 端口的旧监听进程
3. **异步就绪信号**：通过 `threading.Event` 实现非阻塞的 BBC 就绪等待
4. **心跳检查**：建议在战斗循环中定期调用 `send_command('get_status')` 验证连接
