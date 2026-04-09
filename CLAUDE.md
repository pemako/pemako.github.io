# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal blog/portfolio site at `pemako.cn` built with Hugo and the PaperMod theme, deployed to GitHub Pages.

## Common Commands

```bash
make serve          # Start local dev server with drafts (http://localhost:1313)
make build          # Build minified static site to ./public
make new PATH=posts/my-article.md   # Create new post from archetype
make clean          # Delete ./public
make deploy         # Build and push public/ to GitHub Pages
```

## Content Structure

Content lives in `content/` organized by section:
- `posts/` — general articles
- `go/`, `python/`, `lua/` — language-specific content
- `tools/` — tool guides

Each section has a corresponding archetype in `archetypes/` that defines front matter templates for new content.

## Architecture

- **Config**: `hugo.yaml` is the active config (ignore `config.yml`, which is an unused template)
- **Theme**: PaperMod (git submodule at `themes/PaperMod/`). Customizations go in `layouts/` or `assets/` to override theme files without modifying the submodule.
- **Deployment**: `public/` is a separate git worktree pointing to the `gh-pages` branch. `make deploy` commits and pushes from within `public/`. GitHub Actions (`.github/workflows/hugo.yaml`) also auto-builds and deploys on push to `main`.
- **Comments**: Giscus (GitHub Discussions) configured in `hugo.yaml` under `params.giscus`.
- **Search**: JSON-based, enabled via `outputs` in `hugo.yaml`.

## Adding Content

New posts require front matter with at minimum `title`, `date`, and `draft` fields. Use `make new` to generate from the appropriate archetype. Set `draft: false` when ready to publish.
