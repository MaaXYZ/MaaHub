# ColorMatch + OCR only_rec 精准识文

## 适用场景

某些界面 OCR 直接扫整块 ROI 时，容易出现：

- 识别准确率低
- 把背景文字、相邻数字一起读入
- 固定显示 `0` 与有效数值难以区分

本范式先用 **ColorMatch** 按文字颜色圈出目标区域，再对该区域开 **OCR + only_rec** 做纯识别，缩小干扰范围。

## 核心思路

```
ColorMatch 找到文字颜色区域（sub_name 锚点）
        ↓
OCR.roi 引用锚点，only_rec: true 只识别不检测
        ↓
expected 正则区分「有数值」与「无数值（0）」
```

`And` 组合两步：颜色匹配命中 **且** OCR 结果符合预期，节点才算识别成功。

## 节点示例

### 检查是否存在数值

ColorMatch 定位白色文字区域，OCR 匹配**非 0** 的任意内容：

```json
"检查是否存在数值": {
    "recognition": {
        "type": "And",
        "param": {
            "all_of": [
                {
                    "sub_name": "_文字颜色",
                    "recognition": {
                        "type": "ColorMatch",
                        "param": {
                            "roi": [884, 162, 260, 55],
                            "lower": [240, 240, 240],
                            "upper": [255, 255, 255],
                            "count": 10
                        }
                    }
                },
                {
                    "recognition": {
                        "type": "OCR",
                        "param": {
                            "roi": "_文字颜色",
                            "expected": "^(?!^0$).+$",
                            "only_rec": true
                        }
                    }
                }
            ]
        }
    }
}
```

| 字段                      | 作用                                           |
| ------------------------- | ---------------------------------------------- |
| `sub_name`                | 给 ColorMatch 子结果命名，供 OCR 的 `roi` 引用 |
| `lower` / `upper`         | 文字颜色的 RGB 范围                            |
| `count`                   | 符合颜色的最少像素数，过滤噪点                 |
| `roi: "_文字颜色"`        | OCR 只在颜色匹配到的区域内识别                 |
| `only_rec: true`          | 跳过文字检测，直接识别（需 ROI 已精确）        |
| `expected: "^(?!^0$).+$"` | 匹配任意非 `0` 字符串                          |

### 没有数值

结构相同，OCR 改为只认 **`0`**：

```json
"没有数值": {
    "recognition": {
        "type": "And",
        "param": {
            "all_of": [
                {
                    "sub_name": "_文字颜色",
                    "recognition": {
                        "type": "ColorMatch",
                        "param": {
                            "roi": [884, 162, 260, 55],
                            "lower": [240, 240, 240],
                            "upper": [255, 255, 255],
                            "count": 10
                        }
                    }
                },
                {
                    "recognition": {
                        "type": "OCR",
                        "param": {
                            "roi": "_文字颜色",
                            "expected": "^0$",
                            "only_rec": true
                        }
                    }
                }
            ]
        }
    }
}
```

## 组合使用

两个节点通常配合 `Or` / `And` 做流程分支：

```json
"最终状态但没有数值": {
    "recognition": {
        "type": "And",
        "param": {
            "all_of": [
                "检查是否是最终状态",
                "没有数值"
            ]
        }
    }
},
"需要进行任务": {
    "recognition": {
        "type": "Or",
        "param": {
            "any_of": [
                "不是最终状态",
                "最终状态但没有数值"
            ]
        }
    }
}
```

完整可引用示例见同目录 `pipeline.json`。

## 调参建议

- **颜色范围**：用截图工具取目标文字 RGB，适当放宽 `lower` / `upper`，或者使用HSV或者灰度
- **`count`**：文字较小时适当降低，背景噪点多时适当提高
- **`roi`**：ColorMatch 的 ROI 应覆盖文字可能出现范围，不必与 OCR 最终区域完全相同，如果发生文字边缘颜色不一致，可以使用`roi_offset`对识别区进行微调
- **`only_rec`**：依赖 ROI 足够准；若 ColorMatch 锚点偏移，OCR 结果会不稳定
