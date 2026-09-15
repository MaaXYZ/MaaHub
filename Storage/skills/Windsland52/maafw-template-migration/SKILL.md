---
name: maafw-template-migration
description: Migrate a legacy MaaFramework project (assets/ + deps/ layout, install_*.py packaging CI, hand-written interface.json) onto the create-maa-project (CMP) scaffold, and re-sync a project that was migrated against an older CMP. Use when moving an old MAA-style project to maa-project.json + add-on managed templates, when enabling add-ons (dev-tools, github, agent, resource-pack) on an existing project, or when a migrated project needs --doctor / --sync / --update. Trigger even when the user just says "迁移到新模板", "换成 create-maa-project 结构", or "CMP 项目升级".
---

# MaaFramework Project Template Migration

Guide for moving legacy MaaFW projects onto the [create-maa-project](https://github.com/Windsland52/create-maa-project)
(CMP) scaffold, and for re-syncing a project that was migrated against an older CMP.

Verified against CMP 3.5.1 and MaaFramework 5.13.0. CMP has restructured repeatedly (add-ons in 3.3.0,
bundled Python runtime in 3.5.0), so treat any migration note older than this file as suspect.

## When to use

- Old project has `assets/` (resource + interface.json), `deps/` (MaaFramework binaries), `install*.py`
  packaging scripts, and a hand-written `interface.json`
- Target is CMP's layout: `maa-project.json` + `interface.json` + `resource/base/` + `tasks/`, maintained
  by `--add` / `--sync` / `--update` / `--doctor`
- A previously migrated project needs to be brought up to the current CMP (add-ons, Python runtime, schema v2)

## What CMP generates now

CMP writes a small always-on **base** plus opt-in **add-ons**. Know which is which before copying files:
`managed` files are refreshed by `--update`/`--sync`; `once` files are written at creation and then belong
to the project.

| Layer | Files |
|---|---|
| base (always) | `maa-project.json`, `interface.json`, `tasks/`, `resource/base/` (`default_pipeline.json`, `pipeline/`, `image/`, `model/ocr/`), `maatools.config.mts`, `.editorconfig`, `.gitattributes`, `.gitignore`, `README*`, `LICENSE` |
| `dev-tools` | `package.json`, `pnpm-workspace.yaml`, `.node-version`, `.prettierrc.mjs`, `.prettierignore`, `tools/validate-schema.mjs`, `tools/schema/*` |
| `vscode` | `.vscode/settings.json`, `extensions.json`, `tasks.json` (+ `launch.json` for agent projects) |
| `github` | `.github/workflows/{release,check,package-smoke}.yml`, `tools/build-release.mjs`, `tools/sync-runtime.mjs`; adds `release:dry-run`, `sync:runtime` scripts |
| `agent` | `agent/` (`main.py`, `agent_runtime.py`, `custom/`, `utils/`), `pyproject.toml`, `requirements.in`, `requirements.txt`, `uv.lock` |
| `resource-pack` | `resource/<slug>/` plus the `resources` entry in `maa-project.json` and `interface.json` |
| optional | `git-cliff`, `auto-format`, `optimize-images`, `community`, `dependabot`, `schema-sync` |

Add-on dependencies resolve automatically: `vscode`, `github`, `agent` require `dev-tools`; `agent` also
requires `vscode`; `git-cliff`, `auto-format`, `optimize-images`, `community`, `dependabot`, `schema-sync`
require `github`. Since 3.3.0 `--add dev-tools` no longer writes `.vscode/` — ask for `--add vscode`.

## Migration workflow

### 1. Scaffold explicitly

CMP requires Node >= 22.13 (`npm i -g create-maa-project`, or `npx create-maa-project@latest`). Run with
explicit flags — never rely on interactive prompts, and never let an agent drive the TUI:

```bash
npx create-maa-project@latest ./my-project --template agent \
  --slug my-project --name "我的项目" --controller Adb,Win32 \
  --add dev-tools --add github --yes --no-interactive
```

- Replace these values with your own project's identity; `--slug` is the ASCII project ID written to
  `project.slug` and to `interface.json` `name`, while `--name` is only the display label.
- `--template pipeline|agent`; `--controller` kinds are `Adb`, `Win32`, `MacOS`, `PlayCover`, `Gamepad`, `Linux`.
- Set `CREATE_MAA_PROJECT_OCR_SOURCE=submodule|download` explicitly. Otherwise the OCR layout depends on
  whether Git is available in the creation directory, so the same command builds different projects on
  different machines.
- Add `--report` on maintenance commands and parse stdout as JSON (`pending`, `suggestedCommands`, `written`,
  `doctor.checks`, `backupId`).
- CMP ships its own agent skill and an MCP mode (`--mcp --root <dir>`). Install the skill for day-to-day
  maintenance instead of recreating its guidance here; this skill only covers the migration itself.

### 2. Map old content into the scaffold

| Old | New | Notes |
|---|---|---|
| `assets/resource/` | `resource/base/` | Drop the `assets/` wrapper |
| `assets/resource_<variant>/` | `resource/<variant>/` | Declare with `--add resource-pack <slug> --label "<label>"` |
| `assets/interface.json` | `interface.json` (root) | Merge, do not blind-copy — see below |
| `tasks/` | `tasks/` | Direct copy, then keep `import` entries in `interface.json` pointing at them |
| `assets/logo.ico` (wherever it lives) | `logo.ico` at repo root | Required for package icons — see pitfalls |
| Old agent code | `agent/` | Update hardcoded paths; the entry point is `agent/main.py` |
| Hot-update data under `resource/` | top-level `data/` | Anything that is not part of the MaaFW bundle leaves `resource/` |
| `deps/` | delete | Runtime assets come from `--update runtime:mfa` / `sync:runtime` |
| `install*.py` | delete | Replaced by `tools/build-release.mjs` from the `github` add-on |

### 3. Decide who owns interface.json

`interface.json` is written `once` by CMP and then only partially maintained:

- **Keep it CLI-managed** when the old file is mostly derived from the configuration. `--sync metadata`
  repairs controller IDs (including the pre-rename `Android` / `WlRoots` spellings) and their `type`, leaves
  `label`, `attach_resource_path`, `icon`, `option`, per-type blocks, tuned `display_short_side`, and
  controllers the config cannot express untouched. `--doctor` reports drift.
- **Set `project.interfaceUnmanaged: true`** when the old file is heavily hand-tuned (M9A does this). CMP
  then never writes it, and you own every edit.

Keep `name` and `version` correct either way. `interface.json` `name` is the ASCII project slug — the same
string as `maa-project.json` `project.slug`, and the value `tools/build-release.mjs` compares it against —
while the display name only goes to `label`. Packaging refuses to run when `name` disagrees with that slug,
or when `version` is not a release tag such as `v0.1.0`. Archive filenames are derived from the display name
(spaces become hyphens), so the two strings differ by design: `--sync version` aligns the version, while
`--sync display-name` rewrites only `label`.

### 4. Configure maa-project.json

`schemaVersion` is 2. A v1 file is never rewritten as a side effect of other commands — migrate it
explicitly with `--sync config`, and roll back with `--restore <backupId>` if needed.

- `controller.kinds`: `Adb`, `Win32`, `MacOS`, `PlayCover`, `Gamepad`, `Linux`. These are MaaFW's own
  controller types and are copied into `interface.json` as `type`; `WlRoots` is still accepted and normalized
  to `Linux`, but the reverse does not hold for older CLIs.
- `maafw.channel` / `maafw.version` and `runtime.mfa` / `runtime.mxu`: non-empty `version` pins the exact
  release, empty `version` takes the newest in `channel` (`stable`, `beta`, `alpha`).
- `resources`: `slug` / `label` / `path` / `enabled`. Paths are written into `interface.json` in config
  order, and later packs win in MaaFW's resource lookup — order the variants deliberately.
- `python`: `requiresPython`, `recommendedPython`, `devCommand`; keep `requiresPython` identical to
  `pyproject.toml`.
- `project.github`: required for release notes and repo links; `--sync github-url` records it.

Packs present on disk but absent from `resources` are left alone by `--sync`, which is a valid way to keep
project-private variants out of CMP's control.

### 5. Clean up and verify

```bash
create-maa-project --doctor --report     # read doctor.checks, fix failures from that evidence
pnpm install && pnpm check               # formatting, schema, maa checks (dev-tools)
pnpm release:dry-run                     # packaging smoke test (github add-on)
```

Treat `pending` entries as follow-up work, not failures: on constrained networks they are the download
commands to run later (`--skip-download` at create time). Every write command snapshots a backup first, so
`--list-backups` → `--show-backup <id>` → `--restore <id> --dry-run` is the rollback path.

## OCR models

Two supply modes, and the layout differs — this is the most common source of "works on my machine" breaks:

| Mode | Config | `resource/base/model/ocr/` |
|---|---|---|
| `submodule` (default when Git is available) | `.gitmodules` + `ocr.submodulePath` (e.g. `MaaCommonAssets/OCR`) | gitignored; copied by `--update ocr-models` |
| `download` | no `ocr` block required | committed, `manifest.json` records sha256 |

- `ocr.files` applies to submodule mode only: `{"destName": "path/inside/submodule"}` — the key is a bare
  filename at the top of `resource/base/model/ocr/`, the value is relative to `ocr.submodulePath`.
  Inverting them fails the update with a missing-file error.
- Creating the project inside a parent Git repository always falls back to download mode; passing
  `CREATE_MAA_PROJECT_OCR_SOURCE=submodule` there is an error, not a fallback.
- In submodule mode a fresh clone needs the submodule initialized before the models exist.

## Agent projects

- `agent/bootstrap.py` does not exist anymore (CMP 3.5.0). Do not recreate it; `--doctor` reports the legacy
  file so you can delete it. The Python interpreter check now lives in `maa-project.json` `python` plus
  `pyproject.toml`.
- Release packages bundle the Python runtime (Windows embeddable, elsewhere python-build-standalone), so
  releases no longer install dependencies at first launch. When migrating a project that was packaged the
  old way: run `--sync` to refresh release tooling, then `--update python-runtime` and
  `--update python-deps` per target platform before tagging.
- Fix hardcoded paths after the move — resource, config, debug and data directories moved out of the old
  `assets/` tree. A `runtime_paths.py`-style module is the usual place; the manifest cache path moves with
  the data directory.

## Pitfalls that actually bit during migration

1. **`logo.ico` not committed.** The release workflow gates its icon step on `hashFiles('logo.ico')`, and
   `build-release.mjs` only copies the icon when it exists at the project root. A generated or gitignored
   ico ships every package without a logo, silently — the step is skipped, not failed.
2. **`${gui^^}` in the generated Package step.** Uppercasing with `^^` is bash 4 syntax, while macOS runners
   resolve `bash` to 3.2. Compute it instead: `gui_upper=$(echo "$gui" | tr '[:lower:]' '[:upper:]')` and use
   `${gui_upper}`. M9A carries exactly this patch over the generated workflow.
3. **`sync:runtime` is a thin wrapper.** It just invokes the CLI's `--update maafw`, `--update ocr-models`,
   `--update runtime:mfa`, `--update runtime:mxu`. Do not reimplement downloads inside it — keep
   project-specific runtime logic in the project's own tooling and let generic fixes be backported.
4. **pnpm delays fresh releases.** Generated projects pin `create-maa-project` in
   `pnpm-workspace.yaml` `minimumReleaseAgeExclude` so the CLI and its auto-update can pick up new versions
   immediately. Keep that entry when migrating; set `CREATE_MAA_PROJECT_AUTO_UPDATE=0` for reproducible or
   offline runs.
5. **Schema v1 stays v1 until you say otherwise.** `--sync config` is the only migration path, and created
   projects carry schema v2 — a mixed pair (old config, new templates) is what `--doctor` complains about.
6. **Package.json scripts follow the add-ons.** `check` gains `format:check` / `check:schema` / `check:maa`
   from dev-tools, `release:dry-run` and `sync:runtime` from `github`, and Agent projects add `format:py`,
   `lint:py`, `typecheck:py`, `check:py`. Migrate hand-written packaging scripts into these targets rather
   than keeping a parallel CI path.

## Backporting to create-maa-project

Generic fixes found during a migration (release-workflow portability, template defaults, add-on file lists)
belong upstream in CMP templates. Project-specific logic — private module downloads, mirrorchyan ids,
manifest cache generation — stays in the project repository.
