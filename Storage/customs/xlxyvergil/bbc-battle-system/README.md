# BBC 战斗系统

FGO 自动化战斗执行模块，基于 BBC Server TCP 接口实现事件驱动的战斗流程。

## 核心功能

### 1. 战斗类型支持
- `CONTINUOUS` (0) - 连续出击/强化本
- `TOWER_AUTO_SEQUENCE` (1) - 自动编队爬塔（应用操作序列）
- `TOWER_AUTO_AI` (2) - 自动编队爬塔（程序自主技能宝具）
- `INTERLUDE` (3) - 幕间物语
- `FREE_QUEST` (4) - 清自由本
- `MAIN_LIKE` (5) - 类主线
- `MAIN_STORY` (6) - 主线物语·大奥

### 2. 事件驱动弹窗处理
- **助战排序不符合**：根据配置选择继续或停止
- **队伍配置错误**：根据配置选择继续或停止
- **脚本停止**：检测游戏异常（闪退、模拟器崩溃）并标记重启
- **其他提示弹窗**：自动关闭并结束战斗

### 3. 自动重试机制
- 最多重试 2 次，每次失败后重启 BBC 进程
- 检测游戏异常时自动触发重启
- 通过 `need_restart` 标志控制重启逻辑

### 4. 心跳检查
- 每 30 秒发送 `get_status` 命令验证 BBC 服务状态
- 无响应时标记为错误并需要重启

### 5. 参数验证
- 从 Pipeline 节点提取：队伍配置、运行次数、苹果类型、战斗类型
- 验证模拟器连接状态和参数匹配
- 启动前清空消息队列，避免历史弹窗干扰

## 文件说明

- `bbc_action.py` - 战斗任务执行主模块（ExecuteBbcTask Action）

**注意**：以下模块已拆分为独立 customs：
- `bbc_connection_manager.py` → [bbc-connection-manager](../bbc-connection-manager/)
- `bbc_start.py` / `bbc_stop.py` → [bbc-process-control](../bbc-process-control/)

## 使用方式

```python
# Pipeline 节点配置
{
  "执行BBC任务": {
    "action": "execute_bbc_task",
    "attach": {
      "bbc_team_config": "team_config.json",
      "run_count": 10,
      "apple_type": "gold",
      "battle_type": 0,
      "support_order_mismatch": true,
      "team_config_error": false,
      "connect": "connect_mumu",
      "mumu_path": "D:/MuMuPlayer/emulator/nemu/NemuPlayer.exe",
      "mumu_index": 0,
      "mumu_pkg": "com.bilibili.fatego",
      "mumu_app_index": 0
    }
  }
}
```

## 依赖

- MaaFramework
- bbc-connection-manager（内部依赖）
- bbc-process-control（内部依赖）

## 注意事项

1. **前置条件**：需要先调用 `start_bbc` 确保 BBC 进程运行且模拟器已连接
2. **配置文件**：`bbc_team_config` 必须是 BBchannel/settings 目录下的 JSON 文件名
3. **弹窗回调**：内部自动设置弹窗监听线程，无需手动干预
4. **错误输出**：失败时通过 `pipeline_override` 将错误信息显示到 GUI
