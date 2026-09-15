# MaaHub 贡献指南

本文面向准备向 MaaHub 提交 Pull Request 的贡献者。

## 仓库组织

MaaHub 目前围绕四类内容组织：

- `Storage/skills`：给 AI/Agent 使用的 skill
- `Storage/pipelines`：流水线配置，通常是一个或多个 `json` 或 `jsonc`。
- `Storage/customs`：自定义代码模块，用来补足 pipeline 难以表达的逻辑。
- `Storage/experiences`：经验、教程、案例总结。

PR 时需要放置的位置分别如下：

```text
Storage/
  skills/<your_id>/<your-skill-name>/
  pipelines/<your_id>/<your-pipeline-name>/
  customs/<your_id>/<your-custom-name>/
  experiences/<your_id>/<your-experience-name>/
```

其中：

- `<your_id>` 指提交该内容的用户标识，建议使用稳定的 GitHub 用户名或社区约定 id。
- `<your-*-name>` 建议使用小写短横线命名。
- 一个 PR 可以提交多个条目，但请保证每个条目目录完整、自描述、可独立审核。

## PR 基本要求

所有模块都建议遵守这些共性要求：

- 目录必须放在对应模块下，且采用 `Storage/<模块>/<作者>/<条目>` 结构。
- 必须附带说明文档（README.md），按需要包含用途、依赖、使用方式、输入输出、预期效果等内容。
- 不要提交与条目无关的临时文件、编译产物、私有密钥、缓存目录等。
- 如果条目依赖外部仓库、模型、服务或运行环境，必须在说明文档中写清楚。
- `maahub_meta.json` 请遵循统一 schema：
  - 结构定义：[docs/schema/maahub-meta.schema.json](/docs/schema/maahub-meta.schema.json)
  - 字段说明：[docs/zh/maahub-meta.md](/docs/zh/maahub-meta.md)
  - PR 会通过 GitHub Actions 自动校验变更中的 `maahub_meta.json`

建议 PR 标题尽量直观，例如：

- `feat(skills): add maafw skill`
- `feat(experiences): add maafw deployment notes`
- `docs(pipeline): edit xxx description`

## 各模块要求

### Skill

`skills` 目录用于收录可直接给 Agent/AI 使用的 skill。MaaHub 对 skill 的约定是：

- 目录位置：`Storage/skills/<your_id>/<skill-name>/`
- 必需文件：`maahub_meta.json`、`SKILL.md`
- 可选目录：`scripts/`、`references/`、`assets/` 等 skill 附属文件
- 网站展示元信息以 `maahub_meta.json` 为准
- `SKILL.md` 负责 skill 自身的 frontmatter 与执行说明

PR 时至少保证：

- `maahub_meta.json` 完整填写网站所需元信息
- `name` 与目录名一致
- `description` 明确说明 skill 做什么、何时触发
- Markdown 正文要写清楚使用方法或执行步骤
- 如果引用依赖文件，路径必须真实存在

### Pipeline

`pipelines` 用于收录 MaaFramework 的流水线范式，包括常用基础范式、小巧思、炫技等。此模块只收录纯 pipeline，若需 custom 配合请提交至 Customs 模块。

推荐目录结构：

```text
Storage/pipelines/<your_id>/<your-pipeline-name>/
  maahub_meta.json
  README.md
  pipeline.json
  ...（支持多个 json/jsonc 文件）
```

PR 时至少保证：

- `maahub_meta.json` 可描述这个条目是什么、入口文件是什么
- `README.md` 说明任务目标、适用场景、使用方式等
- 至少有一个可读的 pipeline 配置文件
- 图片等重资源可用文案占位 template 省略

### Customs

`customs` 用于收录自定义代码模块，一般在纯 pipeline 不足以表达逻辑时使用。

推荐目录结构：

```text
Storage/customs/<your_id>/<your-custom-name>/
  maahub_meta.json
  README.md
  main.py
  pipeline.json
  ...（支持多个文件）
```

PR 时至少保证：

- 标明语言、运行时、依赖
- 入口文件和 README 描述一致
- 有最小可理解示例，别人看到目录就知道如何接入
- 如果依赖本地环境、第三方 SDK 或 MaaFramework 特定接口，要明确写出

### Experiences

`experiences` 用于沉淀经验文章、教程、踩坑记录、案例拆解。

推荐目录结构：

```text
Storage/experiences/<your_id>/<your-experience-name>/
  maahub_meta.json
  index.md
  chapter-01.md
```

PR 时至少保证：

- 有一篇主文档，通常是 `index.md`（不强制）
- `maahub_meta.json` 中的 `chapters` 与实际文件对应
- 尽量写成可复现、可操作的经验，而不是只给结论

## 参考示例方式

最简单的做法是直接参考 `Storage` 里的示例条目：

1. 进入对应模块下的 `Storage/<module>/MaaHub/pr-template/`。
2. 复制整份示例到你自己的 `Storage/<module>/<your_id>/<your-name>/`。
3. 替换作者名、slug、标题、描述、入口文件和正文内容。
4. 本地自查目录、文件名、引用路径是否一致。
5. 再发起 PR。

建议在本地先构建一遍 website，实机预览验证一下再提交。

当前可直接参考的示例目录：

- `Storage/skills/MaaHub/pr-template/`
- `Storage/pipelines/MaaHub/pr-template/`
- `Storage/customs/MaaHub/pr-template/`
- `Storage/experiences/MaaHub/pr-template/`

## 站点展示约定

目前网站对四类内容的读取方向如下：

- `skills`：读取 `maahub_meta.json` 作为网站元信息，读取 `SKILL.md` 作为 skill 规范与补充字段
- `pipelines`：读取 `maahub_meta.json` 与目录内文件
- `customs`：读取 `maahub_meta.json` 与目录内文件
- `experiences`：读取 `maahub_meta.json`、章节列表与 Markdown 内容
