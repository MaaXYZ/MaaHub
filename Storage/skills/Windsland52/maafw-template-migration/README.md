# MaaFW Template Migration

MaaFramework 老项目迁移到 create-maa-project（CMP）脚手架的指南 skill。

## 用途

当需要把一个旧的 MaaFW 项目（`assets/` + `deps/` 结构、`install*.py` 打包脚本、手写 `interface.json`）迁移到 CMP 模板（`maa-project.json` + `interface.json` + `resource/base/` + `tasks/`），或把早前迁移过的项目同步到当前 CMP（add-on、schema v2、自带 Python 运行时的发布包）时使用。

## 内容

- `SKILL.md`: 迁移指南正文，包含 CMP 当前的文件构成（base 与各 add-on）、结构映射、迁移步骤、OCR 两种供应方式、Agent 项目变更、迁移中真实踩到的坑
- `maahub_meta.json`: MaaHub 网站元信息

## 适用场景

- 老项目从 assets/deps 结构迁移到 CMP 模板
- 需要了解新旧目录结构的对应关系
- 迁移过程中遇到 `ocr.files` 方向、`logo.ico` 未提交、macOS bash 3.2 语法、schema v1 迁移等问题时参考
- 判断 `interface.json` 该交给 `--sync` 维护，还是用 `project.interfaceUnmanaged` 自己管

## 校验基准

内容核对至 create-maa-project 3.5.1 与 MaaFramework 5.13.0，迁移案例取自 M9A。CMP 迭代较快（3.3.0 引入 add-on 体系、3.5.0 移除 `agent/bootstrap.py`），更早的迁移笔记可能已失效。

日常维护（新建项目、加 add-on、`--doctor`、`--update`）请用 CMP 自带的 `create-maa-project` skill 或 MCP 模式，本 skill 只覆盖迁移本身。
