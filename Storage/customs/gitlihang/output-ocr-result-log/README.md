# PR Send Data wps

在UI日志界面上显示OCR结果

## 功能

 - 通过logger日志模块，将ocr结果输出到UI，方便用户查看关键OCR节点结果。


## 文件说明

 - `logger.py`：日志输出模块。
 - `returnOCR.py`：Python脚本。


## 使用方式
### 输出及click动作（暂时只写了click动作，其他动作暂未写）。
 """
"接受进入的副本名称": {
        "recognition": "OCR",
        "expected": [
            ""
        ],
        "roi": [
            441,
            25,
            411,
            70
        ]
    },

"活动-三界奇缘-结束": {
        "action": "Custom",
        "custom_action": "returnOCR",
        "custom_action_param": {
            "recognition_name": "接受进入的副本名称",
            "action_key": "Click",
            "return_text": "同意进入副本名称：",
            "click_target": [
                727,
                621,
                190,
                64
            ]
        }
    }
    自定义返回ocr识别结果，根据action_key执行不同的动作，
        action_key: 动作名称，用于判断动作类型，如Click、Move等
        recognition_name: task任务名称,用于指定识别任务名称，返回该节点的结果。
        return_text: 输出的描述，用于指定返回的描述
        click_target: 点击坐标，格式为[x1, y1, x2, y2]，仅在action_key为Click时使用。如果不提供click_target，则默认点击识别结果的中心位置。

    """
### 只输出，无动作
```
"活动-三界奇缘-正确率": {
        "recognition": "OCR",
        "expected": [],
        "roi": [
            320,
            69,
            116,
            51
        ]
    },
    "活动-三界奇缘-结束": {
        
        "action": "Custom",
        "custom_action": "returnOCR",
        "custom_action_param": {
            "recognition_name": "活动-三界奇缘-正确率",
            "action_key": "",
            "return_text": "三界奇缘结果正确率："
        }
    },
```
## 依赖

 - json
 - loguru



## 注意事项

 - 注意的值"custom_action_param"


feat(customs): 新增在UI日志界面上显示OCR结果。