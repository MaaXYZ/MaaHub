# MaaHub Meta 协议

本文定义 MaaHub 中各类条目统一使用的 `maahub_meta.json` 协议。

当前正式 schema 文件位于：

- [docs/schema/maahub-meta.schema.json](/docs/schema/maahub-meta.schema.json)

## 基础格式

每个条目目录下都应包含一个 `maahub_meta.json` 文件，用于描述该条目的展示信息、入口文件、维护信息与模块特性。

基础示例如下：

```jsonc
{
  "id": "MaaHub/pr-template",
  "title": "PR Template",
  "description": "A MaaHub-owned pull request template entry for contributors to copy and modify.",
  "author": "MaaHub",
  "source": "MaaHub",
  "sourceGithub": "https://github.com/MaaXYZ/MaaHub",
  "tags": ["template"],
  "createdAt": "2026-05-06",
  "updatedAt": "2026-05-06",
  "version": "0.0.1",
  "mfwVersion": "5.10.4",
  "entry": "README.md",
  "readme": "./README.md",
  "status": "beta",
  "type": "pipeline",
  "category": "template",
  "externalTools": [],
}
```

其中 `type` 用于区分条目所属模块：

- `skill`
- `pipeline`
- `custom`
- `experience`

## 字段说明

> [!TIP]
> 所有路径字段均应填写“相对于当前条目目录”的相对路径。  
> 当前规范中，`id`、`title`、`description`、`author`、`createdAt`、`updatedAt`、`entry`、`readme`、`type` 为公共必填字段。  
> 各模块特有字段是否必填，以后文模块章节为准。

### 公共字段

- `id`: _string_  
   条目唯一标识。必选。  
   格式约定为 `author/slug`，其中：
  - `author` 应与目录中的作者层级一致
  - `slug` 应与条目目录名一致  
    例如目录为 `Storage/pipelines/MaaHub/pr-template/`，则推荐写为 `id: "MaaHub/pr-template"`。

    该字段用于：

- 网站路由生成
- 条目唯一定位
- 下载、安装、复制等命令拼接

- `title`: _string_  
   条目标题。必选。  
   这是面向网站访客展示的标题，不要求与目录名完全一致。  
   推荐写“人能直接读懂”的名称，而不是内部缩写。

- `description`: _string_  
   条目简介。必选。  
   用于列表页摘要、详情页说明、贡献者快速理解条目用途。  
   应优先说明：
  - 这是个什么条目
  - 解决什么问题
  - 适合什么场景

- `author`: _string_  
   作者或维护者标识。必选。  
   一般与目录中的作者层级保持一致，例如 `author: "MaaHub"`。

  推荐使用稳定的 GitHub 用户名、组织名或社区约定标识。

- `tags`: _list<string, >_  
   检索标签。可选，默认空。  
   用于网站分类、筛选与快速理解主题。  
   推荐：
  - 数量控制在 2 到 6 个
  - 尽量使用短词
  - 聚焦条目主题，而不是堆砌宽泛标签

- `source`: _string_
   来源项目名。可选。
   用于标明该条目主要来源于哪个上游项目、生态项目或参考项目。
   例如：
  - `M9A`
  - `MaaFramework`
  - `MaaHub`

- `sourceGithub`: _string_
   来源项目的 GitHub 链接。可选。
   建议填写完整的 `http` 或 `https` URL。
   例如 `sourceGithub: "https://github.com/MAA1999/M9A"`。

- `createdAt`: _string_  
   条目创建日期。必选。  
   格式约定为 `YYYY-MM-DD`。  
   表示该条目首次进入仓库或首次成型的时间。

- `updatedAt`: _string_  
   条目最近更新日期。必选。  
   格式约定为 `YYYY-MM-DD`。  
   表示该条目最近一次实质更新的时间。  
   若仅做错字修正，可按维护习惯决定是否更新。

- `version`: _string_  
   条目自身版本号。可选。  
   用于描述该条目自身的版本演进，而不是 MaaFramework 的版本。  
   常见写法例如：
  - `0.0.1`
  - `0.1.0`
  - `1.0.0`

- `mfwVersion`: _string_  
   目标 MaaFramework 版本或兼容基线。可选。  
   用于说明该条目主要面向哪个 MaaFramework 版本编写、验证或适配。  
   例如 `mfwVersion: "5.10.4"`。

- `entry`: _string_  
   主入口文件。必选。  
   表示“当前条目最核心、最应该先看的文件”的相对路径。  
   虽然不同模块语义略有差异，但统一用这个字段表达“主入口”。

  常见含义如下：
  - `skill`：通常指向 `SKILL.md`
  - `pipeline`：通常指向主 pipeline 文件，如 `pipeline.json`
  - `custom`：通常指向主入口代码文件，如 `main.py`
  - `experience`：通常指向主文档，如 `index.md`

- `readme`: _string_  
   主说明文档路径。必选。  
   用于告诉贡献者、网站或脚本：“如果想先看说明文档，应打开哪个文件”。  
   一般推荐：
  - `README.md`
  - `./README.md`
  - `index.md`

    `readme` 与 `entry` 可以相同，也可以不同。  
    例如：

  - 对 `experience` 来说，`entry` 和 `readme` 常常都指向 `index.md`
  - 对 `custom` 来说，`entry` 可以是 `main.py`，而 `readme` 是 `README.md`

- `status`: _string_  
   条目状态。可选。  
   用于表达该条目的成熟度或生命周期状态。  
   当前可选值：
  - `stable`
  - `beta`
  - `deprecated`
  - `experimental`

    一般可按以下语义理解：

  - `stable`：接口或内容相对稳定，可正常使用
  - `beta`：可用，但仍可能继续调整
  - `deprecated`：已不推荐继续使用
  - `experimental`：实验性内容，稳定性与兼容性都不保证

- `type`: _string_  
   条目模块类型。必选。  
   当前可选值：
  - `skill`
  - `pipeline`
  - `custom`
  - `experience`

    该字段决定了当前 `maahub_meta.json` 属于哪一个模块子集，并进一步决定允许或推荐出现哪些扩展字段。

- `category`: _string_  
   条目分类。可选。  
   用于在模块内部做更细粒度的主题归类。  
   例如：
  - `template`
  - `ocr`
  - `deployment`
  - `tooling`
  - `tutorial`

    `category` 不要求全仓统一枚举，但同一类内容建议尽量保持命名一致。

- `externalTools`: _list<string, >_  
   外部工具、外部服务或宿主依赖提示。可选，默认空。  
   用于补充说明该条目运行或使用时，可能依赖的外部能力。  
   例如：
  - `python`
  - `adb`
  - `docker`
  - `playwright`
  - `ollama`

    该字段偏“环境提示”，不替代 README 中更详细的安装与使用说明。

## 模块扩展字段

### Skill

`skill` 在公共字段基础上，支持以下扩展字段：

- `inputs`: _list<string, >_  
   skill 的典型输入。可选，默认空。  
   用于说明该 skill 一般接收什么类型的上下文或材料。  
   例如：
  - `repo path`
  - `issue text`
  - `config file`
  - `screenshot`

- `outputs`: _list<string, >_  
   skill 的典型输出。可选，默认空。  
   用于说明该 skill 一般产出什么类型的结果。  
   例如：
  - `patch`
  - `plan`
  - `report`
  - `generated prompt`

推荐约定：

- `type` 应为 `skill`
- `entry` 应指向 `SKILL.md`
- `readme` 通常指向 `README.md`

示例：
`type: "skill"`、`entry: "SKILL.md"`、`readme: "./README.md"`、`inputs: ["repo path"]`、`outputs: ["skill instructions"]`。

### Pipeline

`pipeline` 当前不额外引入专属字段，直接使用公共字段子集即可。

推荐约定：

- `type` 应为 `pipeline`
- `entry` 应指向主 pipeline 文件
- `readme` 应指向说明文档

示例：
`type: "pipeline"`、`entry: "pipeline.json"`、`readme: "./README.md"`。

### Custom

`custom` 在公共字段基础上，支持以下扩展字段：

- `language`: _string_  
   实现语言。可选。  
   例如：
  - `python`
  - `go`
  - `typescript`

- `runtime`: _string_  
   运行时说明。可选。  
   用于补充说明代码预期运行环境。  
   例如：
  - `python 3.12.9`
  - `go 1.24`
  - `node 22`

- `dependencies`: _list<string, >_  
   关键依赖列表。可选，默认空。  
   用于快速提示该模块依赖哪些库、SDK 或框架。  
   例如：
  - `opencv-python`
  - `maa framework sdk`
  - `pydantic`

推荐约定：

- `type` 应为 `custom`
- `entry` 应指向主入口代码文件
- `readme` 应指向说明文档
- `dependencies` 只写关键依赖，不建议把整份锁文件内容平铺到这里

示例：
`type: "custom"`、`entry: "main.py"`、`readme: "./README.md"`、`language: "python"`、`runtime: "python 3.12.9"`、`dependencies: []`。

### Experience

`experience` 在公共字段基础上，支持以下扩展字段：

- `chapters`: _list<object, >_  
   章节列表。可选，默认空。  
   用于为经验文档提供明确的阅读顺序和导航结构。  
   每个章节对象包含：
  - `title`: _string_  
     章节展示名。必选。

  - `path`: _string_  
     章节文件相对路径。必选。

    示例：`chapters: [{ "title": "Overview", "path": "index.md" }, { "title": "Step By Step", "path": "chapter-01.md" }]`。

- `difficulty`: _string_  
   阅读难度。可选。  
   当前建议值：
  - `beginner`
  - `intermediate`
  - `advanced`

    该字段主要用于帮助读者快速判断是否适合自己。

- `estimatedTime`: _string_  
   预计阅读或实践耗时。可选。  
   推荐使用人可读格式，例如：
  - `10min`
  - `30min`
  - `1h`

推荐约定：

- `type` 应为 `experience`
- `entry` 通常指向主文档，例如 `index.md`
- `readme` 通常也指向主文档
- `chapters` 中列出的文件应真实存在，且顺序即展示顺序

示例：
`type: "experience"`、`entry: "index.md"`、`readme: "./index.md"`、`chapters: [{ "title": "Overview", "path": "index.md" }, { "title": "Step By Step", "path": "chapter-01.md" }]`、`difficulty: "beginner"`、`estimatedTime: "10min"`。

## 字段组合约束

### `type` 与扩展字段的关系

- 当 `type` 为 `skill` 时，可使用 `inputs`、`outputs`
- 当 `type` 为 `pipeline` 时，不使用模块专属扩展字段
- 当 `type` 为 `custom` 时，可使用 `language`、`runtime`、`dependencies`
- 当 `type` 为 `experience` 时，可使用 `chapters`、`difficulty`、`estimatedTime`

不建议在某一模块下混入其他模块专属字段。  
例如：

- `pipeline` 中不应出现 `chapters`
- `experience` 中不应出现 `runtime`
- `skill` 中不应出现 `dependencies` 作为 custom 语义使用

### `entry` 与 `readme` 的关系

- `entry` 表达“主入口”
- `readme` 表达“主说明文档”

这两个字段职责不同，不建议混为一个概念。  
若两者刚好是同一个文件，可以写成相同路径；若不是，则应分别填写。

### 日期字段约定

- `createdAt` 表示首次创建时间
- `updatedAt` 表示最近实质更新的时间

两者都使用 `YYYY-MM-DD` 格式，不建议混入时间戳或自然语言。

## 推荐示例

### Skill 示例

```jsonc
{
  "id": "MaaHub/pr-template",
  "title": "PR Template",
  "description": "A MaaHub-owned pull request template skill entry for contributors to copy and modify.",
  "author": "MaaHub",
  "source": "MaaHub",
  "sourceGithub": "https://github.com/MaaXYZ/MaaHub",
  "tags": ["template", "skill"],
  "createdAt": "2026-05-06",
  "updatedAt": "2026-05-06",
  "version": "0.0.1",
  "mfwVersion": "5.10.4",
  "entry": "SKILL.md",
  "readme": "./README.md",
  "status": "beta",
  "type": "skill",
  "category": "template",
  "inputs": ["repo path"],
  "outputs": ["skill instructions"],
}
```

### Pipeline 示例

```jsonc
{
  "id": "MaaHub/pr-template",
  "title": "PR Template",
  "description": "A MaaHub-owned pull request template pipeline entry for contributors to copy and modify.",
  "author": "MaaHub",
  "source": "MaaHub",
  "sourceGithub": "https://github.com/MaaXYZ/MaaHub",
  "tags": ["template", "pipeline"],
  "createdAt": "2026-05-06",
  "updatedAt": "2026-05-06",
  "version": "0.0.1",
  "mfwVersion": "5.10.4",
  "entry": "pipeline.json",
  "readme": "./README.md",
  "status": "beta",
  "type": "pipeline",
  "category": "template",
  "externalTools": [],
}
```

### Custom 示例

```jsonc
{
  "id": "MaaHub/pr-template",
  "title": "PR Template",
  "description": "A MaaHub-owned pull request template custom entry for contributors to copy and modify.",
  "author": "MaaHub",
  "source": "MaaHub",
  "sourceGithub": "https://github.com/MaaXYZ/MaaHub",
  "tags": ["template"],
  "createdAt": "2026-05-06",
  "updatedAt": "2026-05-06",
  "version": "0.0.1",
  "mfwVersion": "5.10.4",
  "entry": "main.py",
  "readme": "./README.md",
  "status": "beta",
  "type": "custom",
  "language": "python",
  "runtime": "python 3.12.9",
  "dependencies": [],
}
```

### Experience 示例

```jsonc
{
  "id": "MaaHub/pr-template",
  "title": "PR Template",
  "description": "A MaaHub-owned pull request template experience entry for contributors to copy and modify.",
  "author": "MaaHub",
  "source": "MaaHub",
  "sourceGithub": "https://github.com/MaaXYZ/MaaHub",
  "tags": ["template"],
  "createdAt": "2026-05-06",
  "updatedAt": "2026-05-06",
  "version": "0.0.1",
  "mfwVersion": "5.10.4",
  "entry": "index.md",
  "readme": "./index.md",
  "chapters": [
    { "title": "Overview", "path": "index.md" },
    { "title": "Step By Step", "path": "chapter-01.md" },
  ],
  "status": "beta",
  "type": "experience",
  "category": "template",
  "difficulty": "beginner",
  "estimatedTime": "10min",
}
```
