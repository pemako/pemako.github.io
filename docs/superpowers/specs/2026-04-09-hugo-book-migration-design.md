# Hugo Book Theme Migration Design

**Date:** 2026-04-09
**Author:** pemako
**Status:** Approved

## Overview

Migrate `pemako.cn` from the PaperMod theme to `hugo-book` (github.com/alex-shpak/hugo-book), and consolidate all existing content under a `content/blog/` directory. The goal is to support structured, topic-based (专题类) writing using hugo-book's sidebar navigation.

## Goals

- Switch Hugo theme from PaperMod to hugo-book
- Move all content into `content/blog/` while preserving existing subdirectory structure
- Enable hugo-book's sidebar navigation for topic series
- Preserve giscus comments and code highlighting
- No URL backward compatibility required

## Content Structure

Before:
```
content/
  posts/       (45 files)
  go/          (9 files)
  python/      (1 file)
  lua/         (1 file)
  tools/       (11 files)
  archives.md  (PaperMod-specific, delete)
  search.md    (PaperMod-specific, delete)
```

After:
```
content/
  blog/
    _index.md
    posts/
      _index.md
      *.md (45 files)
    go/
      _index.md
      *.md (9 files)
    python/
      _index.md
      t.md
    lua/
      _index.md
      day-01-basic.md
    tools/
      _index.md
      *.md (11 files)
```

Each `_index.md` provides the section title and weight for sidebar ordering. Existing article front matter requires no changes; hugo-book ignores PaperMod-specific fields.

## Configuration (hugo.yaml)

Key changes from PaperMod config:

```yaml
baseURL: https://pemako.cn/
languageCode: zh-cn
title: pemako
theme: hugo-book

enableInlineShortcodes: true
enableRobotsTXT: true
enableEmoji: true

outputs:
  home:
    - HTML
    - RSS
    - SEARCH    # required for BookSearch to generate the search index

params:
  env: production   # keep for extend_head.html production guard
  BookSection: blog
  BookTheme: auto
  BookToC: true
  BookSearch: true
  BookCollapseSection: true
  BookRepo: https://github.com/pemako/pemako.github.io
  BookDateFormat: "2006-01-02"

markup:
  goldmark:
    renderer:
      unsafe: true
  highlight:
    noClasses: false
```

Removed: `profileMode`, `homeInfoParams`, `socialIcons`, `mainsections`, `pagination`, PaperMod `params.*` fields (except `env`).

The existing `params.comments.giscus.*` block must be carried over verbatim — it is used by the migrated `content.html` partial.

## Layouts / Partials

hugo-book provides injection points under `layouts/partials/docs/inject/`:

| Old file | New location | Action |
|---|---|---|
| `layouts/partials/comments.html` | `layouts/partials/docs/inject/content.html` | Move (hugo-book injects after article content) |
| `layouts/partials/extend_head.html` | `layouts/partials/docs/inject/head.html` | Move as-is (`params.env` is preserved in new config) |
| `layouts/partials/footer.html` | — | Delete (PaperMod-specific; hugo-book provides its own footer) |

## Archetypes

Remove PaperMod-specific fields (`ShowToc`, `TocOpen`, `summary`, `description`) from all archetypes. Add `weight: 1` for sidebar ordering.

New archetype front matter template:
```yaml
---
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
date: '{{ .Date }}'
draft: true
tags: []
weight: 1
---
```

Section-specific archetypes (go.md, lua.md, tools.md, etc.) keep their relevant tags.

## Section Index Files (_index.md)

Each section under `content/blog/` requires an `_index.md` with hugo-book front matter to control sidebar title, ordering, and collapse behavior:

```yaml
---
title: "Posts"        # displayed in sidebar
weight: 10            # lower weight = higher in sidebar
bookCollapseSection: true   # collapsed by default
---
```

Suggested weights:
| Section | Title | Weight |
|---|---|---|
| blog | Blog | 1 |
| blog/go | Go | 10 |
| blog/python | Python | 20 |
| blog/lua | Lua | 30 |
| blog/tools | Tools | 40 |
| blog/posts | Posts | 50 |

## Git Submodule

hugo-book is already registered in `.gitmodules` but not initialized. Initialize with:
```
git submodule update --init themes/hugo-book
```

## Implementation Steps

1. Initialize hugo-book submodule
2. Create `content/blog/` directory tree with `_index.md` files
3. Move content: `posts/`, `go/`, `python/`, `lua/`, `tools/` → `content/blog/`
4. Delete `content/archives.md` and `content/search.md`
5. Rewrite `hugo.yaml` for hugo-book
6. Update layouts/partials (move comments + head injection, delete footer)
7. Update archetypes (remove PaperMod fields, add weight)
8. Test with `make serve`

## Out of Scope

- Reorganizing content within existing sections
- Adding new content
- Modifying individual article front matter (existing fields are compatible)
