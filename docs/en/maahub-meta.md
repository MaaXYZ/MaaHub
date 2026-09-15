# MaaHub Meta Specification

This document defines the `maahub_meta.json` specification used by all MaaHub entries.

The canonical schema file is located at:

- [docs/schema/maahub-meta.schema.json](/docs/schema/maahub-meta.schema.json)

## Basic Format

Each entry directory should contain a `maahub_meta.json` file describing its display metadata, entry file, maintenance information, and module-specific fields.

A basic example:

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
  "externalTools": []
}
```

`type` identifies the module kind:

- `skill`
- `pipeline`
- `custom`
- `experience`

## Field Notes

> [!TIP]
> All path fields should be relative to the current entry directory.  
> In the current specification, `id`, `title`, `description`, `author`, `createdAt`, `updatedAt`, `entry`, `readme`, and `type` are common required fields.  
> Whether a module-specific field is required depends on the later module sections.

### Common Fields

- `id`: _string_  
   Unique entry identifier. Required.  
   The format is `author/slug`, where:
  - `author` should match the author directory segment
  - `slug` should match the entry directory name  
    For example, if the directory is `Storage/pipelines/MaaHub/pr-template/`, the recommended value is `id: "MaaHub/pr-template"`.

    This field is used for:

- route generation
- unique entry lookup
- download, install, and copy command composition

- `title`: _string_  
   Entry title. Required.  
   This is the human-facing title shown on the website. It does not need to exactly match the directory name.  
   Prefer a readable title over an internal shorthand.

- `description`: _string_  
   Entry summary. Required.  
   Used in list-page summaries, detail pages, and contributor-facing context.  
   It should primarily answer:
  - what this entry is
  - what problem it solves
  - what scenario it is meant for

- `author`: _string_  
   Author or maintainer identifier. Required.  
   It should usually stay consistent with the author directory segment, for example `author: "MaaHub"`.

    A stable GitHub username, organization name, or community identifier is recommended.

- `tags`: _list<string, >_  
   Search tags. Optional. Default empty.  
   Used for website filtering, grouping, and quick topic recognition.  
   Recommended:
  - keep it around 2 to 6 tags
  - prefer short terms
  - focus on the entry topic instead of stuffing generic tags

- `source`: _string_
   Source project name. Optional.
   Used to indicate which upstream project, ecosystem project, or reference project this entry mainly comes from.
   Examples:
  - `M9A`
  - `MaaFramework`
  - `MaaHub`

- `sourceGithub`: _string_
   GitHub link of the source project. Optional.
   A full `http` or `https` URL is recommended.
   For example `sourceGithub: "https://github.com/MAA1999/M9A"`.

- `createdAt`: _string_  
   Entry creation date. Required.  
   The expected format is `YYYY-MM-DD`.  
   It represents when the entry was first created or first became a real repository item.

- `updatedAt`: _string_  
   Entry last updated date. Required.  
   The expected format is `YYYY-MM-DD`.  
   It represents the latest substantive update.  
   For typo-only edits, whether to update it depends on maintenance policy.

- `version`: _string_  
   Entry version. Optional.  
   This describes the version of the entry itself, not the MaaFramework version.  
   Common examples:
  - `0.0.1`
  - `0.1.0`
  - `1.0.0`

- `mfwVersion`: _string_  
   Target MaaFramework version or compatibility baseline. Optional.  
   Used to indicate which MaaFramework version the entry is mainly written for, validated against, or intended to support.  
   For example `mfwVersion: "5.10.4"`.

- `entry`: _string_  
   Primary entry file. Required.  
   This is the relative path of the most important file of the entry.  
   The exact meaning varies slightly by module, but the field is always used to express the main entry point.

  Common meanings:
  - `skill`: usually `SKILL.md`
  - `pipeline`: usually the main pipeline file, such as `pipeline.json`
  - `custom`: usually the main code entry file, such as `main.py`
  - `experience`: usually the main article file, such as `index.md`

- `readme`: _string_  
   Primary documentation path. Required.  
   This tells contributors, the website, or tooling which file should be treated as the main explanatory document.  
   Common values:
  - `README.md`
  - `./README.md`
  - `index.md`

    `readme` and `entry` may be the same file, or they may differ.  
    For example:

  - for an `experience`, both often point to `index.md`
  - for a `custom`, `entry` may be `main.py` while `readme` is `README.md`

- `status`: _string_  
   Entry status. Optional.  
   Used to indicate maturity or lifecycle state.  
   Current allowed values:
  - `stable`
  - `beta`
  - `deprecated`
  - `experimental`

    A practical interpretation:

  - `stable`: relatively stable and ready for normal use
  - `beta`: usable, but likely to keep evolving
  - `deprecated`: no longer recommended for new use
  - `experimental`: experimental content with no stability or compatibility guarantee

- `type`: _string_  
   Entry module type. Required.  
   Current allowed values:
  - `skill`
  - `pipeline`
  - `custom`
  - `experience`

    This field determines which module subset the current `maahub_meta.json` belongs to, and therefore which extension fields are allowed or recommended.

- `category`: _string_  
   Entry category. Optional.  
   Used for finer-grained grouping inside a module.  
   Examples:
  - `template`
  - `ocr`
  - `deployment`
  - `tooling`
  - `tutorial`

    `category` does not need to be a globally fixed enum, but similar content should use consistent naming where possible.

- `externalTools`: _list<string, >_  
   External tools, services, or host-environment hints. Optional. Default empty.  
   Used to indicate outside capabilities the entry may rely on.  
   Examples:
  - `python`
  - `adb`
  - `docker`
  - `playwright`
  - `ollama`

    This field is an environment hint, not a replacement for detailed setup instructions in the README.

## Module Extension Fields

### Skill

On top of the common fields, `skill` supports the following extension fields:

- `inputs`: _list<string, >_  
   Typical inputs for the skill. Optional. Default empty.  
   Used to describe what kinds of context or materials the skill usually consumes.  
   Examples:
  - `repo path`
  - `issue text`
  - `config file`
  - `screenshot`

- `outputs`: _list<string, >_  
   Typical outputs for the skill. Optional. Default empty.  
   Used to describe what kinds of results the skill usually produces.  
   Examples:
  - `patch`
  - `plan`
  - `report`
  - `generated prompt`

Recommended conventions:

- `type` should be `skill`
- `entry` should point to `SKILL.md`
- `readme` usually points to `README.md`

Example: `type: "skill"`, `entry: "SKILL.md"`, `readme: "./README.md"`, `inputs: ["repo path"]`, `outputs: ["skill instructions"]`.

### Pipeline

`pipeline` currently does not define extra module-specific fields beyond the common subset.

Recommended conventions:

- `type` should be `pipeline`
- `entry` should point to the main pipeline file
- `readme` should point to the explanatory document

Example: `type: "pipeline"`, `entry: "pipeline.json"`, `readme: "./README.md"`.

### Custom

On top of the common fields, `custom` supports the following extension fields:

- `language`: _string_  
   Implementation language. Optional.  
   Examples:
  - `python`
  - `go`
  - `typescript`

- `runtime`: _string_  
   Runtime description. Optional.  
   Used to explain the intended runtime environment.  
   Examples:
  - `python 3.12.9`
  - `go 1.24`
  - `node 22`

- `dependencies`: _list<string, >_  
   Key dependency list. Optional. Default empty.  
   Used to quickly indicate major libraries, SDKs, or framework dependencies.  
   Examples:
  - `opencv-python`
  - `maa framework sdk`
  - `pydantic`

Recommended conventions:

- `type` should be `custom`
- `entry` should point to the main code entry file
- `readme` should point to the explanatory document
- `dependencies` should list only key dependencies, not replicate a full lockfile

Example: `type: "custom"`, `entry: "main.py"`, `readme: "./README.md"`, `language: "python"`, `runtime: "python 3.12.9"`, `dependencies: []`.

### Experience

On top of the common fields, `experience` supports the following extension fields:

- `chapters`: _list<object, >_  
   Chapter list. Optional. Default empty.  
   Used to provide an explicit reading order and navigation structure for experience content.  
   Each chapter object contains:
  - `title`: _string_  
     Chapter display title. Required.

  - `path`: _string_  
     Relative path to the chapter file. Required.

    Example: `chapters: [{ "title": "Overview", "path": "index.md" }, { "title": "Step By Step", "path": "chapter-01.md" }]`.

- `difficulty`: _string_  
   Reading difficulty. Optional.  
   Suggested values:
  - `beginner`
  - `intermediate`
  - `advanced`

    This mainly helps readers quickly judge whether the content fits them.

- `estimatedTime`: _string_  
   Estimated reading or completion time. Optional.  
   Prefer human-readable values such as:
  - `10min`
  - `30min`
  - `1h`

Recommended conventions:

- `type` should be `experience`
- `entry` usually points to the main article, such as `index.md`
- `readme` usually also points to the main article
- files listed in `chapters` should exist, and their order is the display order

Example: `type: "experience"`, `entry: "index.md"`, `readme: "./index.md"`, `chapters: [{ "title": "Overview", "path": "index.md" }, { "title": "Step By Step", "path": "chapter-01.md" }]`, `difficulty: "beginner"`, `estimatedTime: "10min"`.

## Field Combination Constraints

### Relationship Between `type` and Extension Fields

- when `type` is `skill`, `inputs` and `outputs` may be used
- when `type` is `pipeline`, no module-specific extension fields are used
- when `type` is `custom`, `language`, `runtime`, and `dependencies` may be used
- when `type` is `experience`, `chapters`, `difficulty`, and `estimatedTime` may be used

It is not recommended to mix module-specific fields into another module.  
For example:

- `pipeline` should not contain `chapters`
- `experience` should not contain `runtime`
- `skill` should not use `dependencies` with custom-module semantics

### Relationship Between `entry` and `readme`

- `entry` means the primary entry point
- `readme` means the primary explanatory document

These two fields have different responsibilities and should not be conflated.  
If they happen to be the same file, using the same path is fine. Otherwise, they should be filled separately.

### Date Field Conventions

- `createdAt` means the first creation date
- `updatedAt` means the most recent substantive update date

Both should use `YYYY-MM-DD`. Avoid timestamps or natural-language dates here.

## Recommended Examples

### Skill Example

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
  "outputs": ["skill instructions"]
}
```

### Pipeline Example

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
  "externalTools": []
}
```

### Custom Example

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
  "dependencies": []
}
```

### Experience Example

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
    { "title": "Step By Step", "path": "chapter-01.md" }
  ],
  "status": "beta",
  "type": "experience",
  "category": "template",
  "difficulty": "beginner",
  "estimatedTime": "10min"
}
```
