# MaaHub Contribution Guide

This document is intended for contributors preparing to submit a Pull Request to MaaHub.

## Repository Organization

MaaHub currently organizes content around four categories:

- `Storage/skills`: Skills for AI/Agent use.
- `Storage/pipelines`: Pipeline configurations, usually one or more `json` or `jsonc` files.
- `Storage/customs`: Custom code modules to supplement logic that is difficult to express in pipelines.
- `Storage/experiences`: Experiences, tutorials, and case studies.

When submitting a PR, place your content in the following locations:

```text
Storage/
  skills/<your_id>/<your-skill-name>/
  pipelines/<your_id>/<your-pipeline-name>/
  customs/<your_id>/<your-custom-name>/
  experiences/<your_id>/<your-experience-name>/
```

Where:

- `<your_id>` is the user identifier for the submitted content. A stable GitHub username or community-agreed ID is recommended.
- `<your-*-name>` should use lowercase kebab-case naming.
- A single PR may contain multiple entries, but please ensure each entry directory is complete, self-describing, and independently reviewable.

## Basic PR Requirements

All modules should follow these common requirements:

- The directory must be placed under the corresponding module and follow the `Storage/<module>/<author>/<entry>` structure.
- Must include a documentation file (`README.md`), containing as needed: purpose, dependencies, usage, input/output, expected effects, etc.
- Do not submit temporary files, build artifacts, private keys, cache directories, or other files unrelated to the entry.
- If the entry depends on external repositories, models, services, or runtime environments, this must be clearly stated in the documentation.
- `maahub_meta.json` should follow the unified schema:
  - Schema: [docs/schema/maahub-meta.schema.json](/docs/schema/maahub-meta.schema.json)
  - Field guide: [docs/en/maahub-meta.md](/docs/en/maahub-meta.md)
  - Changed `maahub_meta.json` files are automatically validated in pull requests by GitHub Actions

PR titles should be intuitive, for example:

- `feat(skills): add maafw skill`
- `feat(experiences): add maafw deployment notes`
- `docs(pipeline): edit xxx description`

## Module-Specific Requirements

### Skill

The `skills` directory is for collecting skills that can be directly used by Agents/AI. MaaHub's conventions for skills are:

- Directory location: `Storage/skills/<your_id>/<skill-name>/`
- Required files: `maahub_meta.json`, `SKILL.md`
- Optional directories: `scripts/`, `references/`, `assets/`, and other ancillary skill files
- Website display metadata is based on `maahub_meta.json`
- `SKILL.md` handles the skill's own frontmatter and execution instructions

Minimum requirements for a PR:

- `maahub_meta.json` must be completely filled with website-required metadata
- `name` must match the directory name
- `description` must clearly state what the skill does and when it triggers
- The Markdown body must clearly state usage methods or execution steps
- If referencing dependency files, paths must actually exist

### Pipeline

`pipelines` is for collecting MaaFramework pipeline paradigms, including commonly used basic paradigms, clever tricks, show-off techniques, etc. This module only collects pure pipelines; if custom code is required, please submit to the Customs module.

Recommended directory structure:

```text
Storage/pipelines/<your_id>/<your-pipeline-name>/
  maahub_meta.json
  README.md
  pipeline.json
  ... (supports multiple json/jsonc files)
```

Minimum requirements for a PR:

- `maahub_meta.json` must describe what this entry is and what the entry file is
- `README.md` must explain task objectives, applicable scenarios, usage methods, etc.
- At least one readable pipeline configuration file
- Heavy resources like images can be replaced with text placeholders or templates

### Customs

`customs` is for collecting custom code modules, generally used when pure pipelines are insufficient to express logic.

Recommended directory structure:

```text
Storage/customs/<your_id>/<your-custom-name>/
  maahub_meta.json
  README.md
  main.py
  pipeline.json
  ... (supports multiple files)
```

Minimum requirements for a PR:

- State language, runtime, and dependencies
- The entry file must match the README description
- Include a minimum understandable example so others can see the directory and know how to integrate it
- If depending on local environments, third-party SDKs, or MaaFramework-specific interfaces, clearly state this

### Experiences

`experiences` is for accumulating experience articles, tutorials, pitfall records, and case analyses.

Recommended directory structure:

```text
Storage/experiences/<your_id>/<your-experience-name>/
  maahub_meta.json
  index.md
  chapter-01.md
```

Minimum requirements for a PR:

- Have a main document, usually `index.md` (not enforced)
- `chapters` in `maahub_meta.json` must correspond to actual files
- Write as reproducible, actionable experiences rather than just giving conclusions

## How to Reference Examples

The simplest approach is to directly reference example entries in `Storage`:

1. Navigate to the example under the corresponding module: `Storage/<module>/MaaHub/pr-template/`.
2. Copy the entire example to your own `Storage/<module>/<your_id>/<your-name>/`.
3. Replace the author name, slug, title, description, entry file, and body content.
4. Locally self-check directories, filenames, and reference paths for consistency.
5. Then initiate the PR.

It is recommended to build the website locally first and verify with an actual preview before submitting.

Currently available reference example directories:

- `Storage/skills/MaaHub/pr-template/`
- `Storage/pipelines/MaaHub/pr-template/`
- `Storage/customs/MaaHub/pr-template/`
- `Storage/experiences/MaaHub/pr-template/`

## Site Display Conventions

Currently the website reads the four types of content as follows:

- `skills`: reads `maahub_meta.json` as website metadata, reads `SKILL.md` as the skill specification and supplementary fields
- `pipelines`: reads `maahub_meta.json` and files within the directory
- `customs`: reads `maahub_meta.json` and files within the directory
- `experiences`: reads `maahub_meta.json`, the chapter list, and Markdown content
