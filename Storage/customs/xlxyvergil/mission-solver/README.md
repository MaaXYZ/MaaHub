# Mission Solver

FGO 任务求解器，基于 Wiki API 数据进行任务匹配和规划。

## 功能

- 加载主线任务和关卡敌人数据
- 任务匹配算法
- 数据模型定义

## 文件说明

- `solver.py` - 任务求解器主模块
- `matcher.py` - 任务匹配算法
- `data_loader.py` - 数据加载器
- `models.py` - 数据模型定义
- `master_missions_CN.json` - 主线任务数据（中文）
- `quest_enemies_CN.json` - 关卡敌人数据（中文）

## 使用方式

```python
from solver import MissionSolver

solver = MissionSolver()
result = solver.solve(mission_data)
```

## 依赖

无外部依赖
