# 低代码实现多选框应用

> 以《明日方舟：终末地》预刻写属性里的**基础属性 5 选 3**为例：用户在多选框里勾"希望被选上的 3 项"，程序负责在游戏界面上把这 3 项真正点上。本文只讲这一种情况。

---

## 1. 需求

### 1.1 场景

"预刻写属性"面板里，**基础属性**一栏有 5 个词条，必须**恰好选 3 项**：

**主能力 / 力量 / 意志 / 敏捷 / 智识**

面板进来时的选择是上一次留下的（或界面默认的），程序不能假设它是对的。

用户想表达的是"这次我希望预刻写成这三项"——用多选框勾出来。所以这个多选框不是筛选条件，而是**目标状态**：用户选目标，程序把界面改成那个状态。

### 1.2 程序要做的两件事

1. **校验**：面板是不是已经正好是用户勾的那 3 项？是 → 什么都别点，直接继续。
2. **代选**：不是 → 打开属性选择、先清掉已有选择、把勾的 3 项逐个点上、确认，再回到校验复验。

"未勾选"的含义是**不操作、不校验**：不是"必须不选"，也不是"必须出现"。因为清空 + 只点勾选项之后，结果天然只剩勾的那 3 项；而且游戏只允许 3 项，也不会多出来。

### 1.3 校验结果示例

勾「力量、意志、敏捷」：

| 面板当前选择 | 校验 | 程序动作 |
| --- | --- | --- |
| 力量、意志、敏捷 | ✅ 通过 | 不点，直接继续 |
| 力量、意志、智识 | ❌ 缺敏捷 | 清空 → 点三项 → 确认 → 复验 |
| 一项都没选 | ❌ | 清空无事可做 → 点三项 → 确认 → 复验 |

### 1.4 "选目标" 和 "筛画面" 的区别

| 类型 | 多选框的含义 | 命中后 | 未勾项 |
| --- | --- | --- | --- |
| **选目标（本需求）** | 我要程序把这几项选上 | 校验通过就继续，否则去改界面 | 不操作、不校验 |
| 筛画面 | 只有画面出现这几项才继续 | 继续，否则等/跳过 | 通常要求"不许出现" |

两者长得像，但 pipeline 结构完全不同：前者要"修改 + 复验"的闭环，后者只要一次判定。

### 1.5 难点：一份 override 只能表示一项

多选框的每个 case 都是往 `pipeline_override` 里塞字段，而合并规则是**同一节点、同一字段，后写覆盖先写**。

如果 5 个 case 都去改写同一个节点：

```jsonc
"cases": [
    { "name": "Main",     "pipeline_override": { "AffixOCR": { "expected": ["主能力"] } } },
    { "name": "Strength", "pipeline_override": { "AffixOCR": { "expected": ["力量"] } } }
]
```

勾了「主能力 + 力量」，最终生效的只有 `expected: ["力量"]`，另一个被覆盖掉了——多选在这里退化成了"单选最后一项"。

所以不能用一个节点装这 5 个选项，必须**一项一个节点**：每份 override 只碰自己那个节点，5 份互不覆盖；再靠 `And` 把这些独立节点"与"起来，才还原出"这几项都要有"。执行侧同理：5 个选项必须对应 5 个点击节点，否则只会点到最后一项。

---

## 2. 做法：一个 `And` 主节点 + 多选框改里面的子节点

### 2.1 校验部分

`And` 识别器有 **5 个子识别**（不是"一个子识别里塞 5 个关键词"，原因见 1.5），默认全是"直接命中"（`DirectHit`）。多选框里勾一项，就把对应的子节点覆盖成 **OCR 真实线索**。

于是运行时这个 `And` 变成："**3 个真实 OCR + 2 个直接命中**"——即"勾的这三项必须都在，另外两项不关心"。

```jsonc
// 5 个子识别，默认直接命中 = 这一项不校验
"BaseAffixMain":      { "recognition": "DirectHit" },
"BaseAffixStrength":  { "recognition": "DirectHit" },
"BaseAffixWill":      { "recognition": "DirectHit" },
"BaseAffixAgility":   { "recognition": "DirectHit" },
"BaseAffixIntellect": { "recognition": "DirectHit" },

// 主节点：5 个子识别全中才算"已经是用户要的状态"
"BaseAffixesMatched": {
    "recognition": "And",
    "all_of": [
        "BaseAffixMain",
        "BaseAffixStrength",
        "BaseAffixWill",
        "BaseAffixAgility",
        "BaseAffixIntellect"
    ],
    "next": ["StartChallenge"]
}
```

勾选时，case 只改一个子节点：

```jsonc
"BaseAffixStrength": { "recognition": "OCR", "expected": ["力量"] }
```

三个 case 生效后，`BaseAffixesMatched` 等价于：`And(OCR 力量, OCR 意志, OCR 敏捷, DirectHit, DirectHit)`。

### 2.2 选择部分

同一套思路：**5 个执行节点默认"直接命中 + 什么都不做"**，勾一项就把它覆盖成"OCR 找到就点"。

```jsonc
// 默认直通：未勾选时什么都不做，链继续往下走
"SelectMain":      { "recognition": "DirectHit", "action": "DoNothing", "next": ["SelectStrength"] },
"SelectStrength":  { "recognition": "DirectHit", "action": "DoNothing", "next": ["SelectWill"] },
"SelectWill":      { "recognition": "DirectHit", "action": "DoNothing", "next": ["SelectAgility"] },
"SelectAgility":   { "recognition": "DirectHit", "action": "DoNothing", "next": ["SelectIntellect"] },
"SelectIntellect": { "recognition": "DirectHit", "action": "DoNothing", "next": ["ConfirmAffixes"] },

// 确认 → 回到入口复验
"ConfirmAffixes": {
    "recognition": "OCR",
    "expected": ["确认"],
    "action": "Click",
    "next": ["CheckBaseAffixes"]
}
```

勾选时的那条 override：

```jsonc
"SelectStrength": { "recognition": "OCR", "expected": ["力量"], "action": "Click" }
```

所以勾了 3 项时，这条链等价于：3 个节点"找到就点" + 2 个节点"直通不点"。

### 2.3 界面：一个 case 改两个节点

```jsonc
"WantedBaseAffixes": {
    "type": "checkbox",
    "label": "$option.WantedBaseAffixes.label",
    "description": "勾选 3 项希望被选上的基础属性",
    "min_count": 3,
    "max_count": 3,
    "default_case": ["Strength", "Will", "Agility"],
    "cases": [
        {
            "name": "Strength",
            "label": "$option.WantedBaseAffixes.cases.Strength.label",
            "pipeline_override": {
                "BaseAffixStrength": { "recognition": "OCR", "expected": ["力量"] },
                "SelectStrength": { "recognition": "OCR", "expected": ["力量"], "action": "Click" }
            }
        }
        // Main / Will / Agility / Intellect 同理，各改自己那两个节点
    ]
}
```

一个 case 只碰自己的两个节点（校验侧 + 执行侧），互不干扰，合并顺序、勾选先后都不影响结果。

### 2.4 入口、清空、复验

```jsonc
// 入口：校验不通过就去改界面
"CheckBaseAffixes": {
    "next": ["BaseAffixesMatched", "EnterAffixPanel"]
},

"EnterAffixPanel": {
    "recognition": "OCR",
    "expected": ["属性选择"],
    "action": "Click",
    "next": ["AffixPanelOpened"]
},

// 面板已打开：反复点掉"已选中"的条目，直到没有
"AffixPanelOpened": {
    "recognition": "OCR",
    "expected": ["预刻写属性"],
    "next": ["[JumpBack]ClearSelectedAffix", "SelectMain"]
},

"ClearSelectedAffix": {
    "recognition": "ColorMatch",
    "roi": [43, 125, 904, 540],
    "method": 40,
    "lower": [0, 0, 40],
    "upper": [0, 0, 50],
    "count": 200,
    "action": "Click",
    "post_delay": 500
}
```

`[JumpBack]` 让它成环："点掉一个 → 回跳重判 → 还有就再点"，直到 `ClearSelectedAffix` 不再命中，落到 `SelectMain` 开始选。

闭环：

```text
CheckBaseAffixes
├─ BaseAffixesMatched 命中 → StartChallenge
└─ 不命中 → EnterAffixPanel → AffixPanelOpened
              ├─ [JumpBack] ClearSelectedAffix（清空旧选择）
              └─ SelectMain → … → ConfirmAffixes → 回到 CheckBaseAffixes 复验
```

> `roi`、颜色阈值都是 720p 示例值，按实际界面取。上面代码用 v1 简写（`recognition` 直接写字符串、`all_of` / `expected` 挂在节点上）；用 v2 写法时把它们挪进 `recognition.param` 即可，语义一样。
