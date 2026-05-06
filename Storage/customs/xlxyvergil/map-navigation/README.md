# Map Navigation

基于 OpenCV 图像匹配的章节关卡自动导航。

## 功能

- OpenCV 模板匹配定位当前在大地图中的位置
- 多边形可视区域检测
- 自动滑动直到目标可见
- 支持所有章节（冬木、奥尔良、卡美洛等）
- 通用导航 + 纳维·米克特兰专用导航

## 文件说明

- `general_navigation_action.py` - 通用大地图导航 Action
- `mictlan_navigation_action.py` - 纳维·米克特兰专用导航
- `utils/map_coordinates.json` - 地图坐标映射数据

## 使用方式

```python
from general_navigation_action import GeneralNavigationAction

action = GeneralNavigationAction()
result = action.run(context, node_name, node_param)
```

## 参数

- `chapter`: 章节名（中文）
- `quest`: 关卡名（中文）

## 依赖

- MaaFramework
- opencv-python
- numpy

## 注意事项

需要对应的章节模板图片（存放在 `resource/base/image/map/`）
