# Hugo Book Theme Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate pemako.cn from PaperMod to hugo-book theme, moving all content under `content/blog/` to enable sidebar-based topic navigation.

**Architecture:** Initialize the hugo-book submodule, restructure content under `content/blog/` with `_index.md` section files, rewrite `hugo.yaml` for hugo-book, and migrate layout partials to hugo-book's injection points.

**Tech Stack:** Hugo static site generator, hugo-book theme (git submodule), YAML config, Go templates

**Spec:** `docs/superpowers/specs/2026-04-09-hugo-book-migration-design.md`

---

### Task 1: Initialize hugo-book submodule

**Files:**
- `themes/hugo-book/` (populated by submodule init)

- [ ] **Step 1: Initialize the submodule**

```bash
git submodule update --init themes/hugo-book
```

Expected: git fetches the hugo-book repo into `themes/hugo-book/`. The directory should now contain files like `theme.toml`, `layouts/`, `assets/`, etc.

- [ ] **Step 2: Verify the theme loaded**

```bash
ls themes/hugo-book/
```

Expected output includes: `archetypes  assets  i18n  layouts  static  theme.toml`

- [ ] **Step 3: Commit**

```bash
git add .gitmodules themes/hugo-book
git commit -m "feat: initialize hugo-book theme submodule"
```

---

### Task 2: Create content/blog/ section tree with _index.md files

**Files:**
- Create: `content/blog/_index.md`
- Create: `content/blog/posts/_index.md`
- Create: `content/blog/go/_index.md`
- Create: `content/blog/python/_index.md`
- Create: `content/blog/lua/_index.md`
- Create: `content/blog/tools/_index.md`

- [ ] **Step 1: Create directories**

```bash
mkdir -p content/blog/posts content/blog/go content/blog/python content/blog/lua content/blog/tools
```

- [ ] **Step 2: Create content/blog/_index.md**

```yaml
---
title: "Blog"
weight: 1
---
```

- [ ] **Step 3: Create content/blog/go/_index.md**

```yaml
---
title: "Go"
weight: 10
bookCollapseSection: true
---
```

- [ ] **Step 4: Create content/blog/python/_index.md**

```yaml
---
title: "Python"
weight: 20
bookCollapseSection: true
---
```

- [ ] **Step 5: Create content/blog/lua/_index.md**

```yaml
---
title: "Lua"
weight: 30
bookCollapseSection: true
---
```

- [ ] **Step 6: Create content/blog/tools/_index.md**

```yaml
---
title: "Tools"
weight: 40
bookCollapseSection: true
---
```

- [ ] **Step 7: Create content/blog/posts/_index.md**

```yaml
---
title: "Posts"
weight: 50
bookCollapseSection: true
---
```

- [ ] **Step 8: Commit**

```bash
git add content/blog/
git commit -m "feat: add content/blog/ section tree with _index.md files"
```

---

### Task 3: Move content into content/blog/

**Files:**
- Move: `content/go/*.md` → `content/blog/go/`
- Move: `content/python/*.md` → `content/blog/python/`
- Move: `content/lua/*.md` → `content/blog/lua/`
- Move: `content/tools/*.md` → `content/blog/tools/`
- Move: `content/posts/*.md` → `content/blog/posts/`
- Delete: `content/archives.md`
- Delete: `content/search.md`

- [ ] **Step 1: Move all section content**

```bash
mv content/go/*.md content/blog/go/
mv content/python/*.md content/blog/python/
mv content/lua/*.md content/blog/lua/
mv content/tools/*.md content/blog/tools/
mv content/posts/*.md content/blog/posts/
```

- [ ] **Step 2: Delete old empty directories**

```bash
rmdir content/go content/python content/lua content/tools content/posts
```

- [ ] **Step 3: Delete PaperMod-specific root pages**

```bash
rm content/archives.md content/search.md
```

- [ ] **Step 4: Verify file counts**

```bash
find content/blog -name "*.md" | grep -v "_index.md" | wc -l
```

Expected: 59 (35 posts + 9 go + 1 python + 1 lua + 13 tools)

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: move all content into content/blog/ subdirectories"
```

---

### Task 4: Rewrite hugo.yaml for hugo-book

**Files:**
- Modify: `hugo.yaml`

- [ ] **Step 1: Replace hugo.yaml**

Copy the giscus config from the old hugo.yaml first (you'll need it in Step 2):

```bash
grep -A 20 "giscus:" hugo.yaml
```

Save those values. Then replace `hugo.yaml` entirely with:

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
    - SEARCH

params:
  env: production
  BookSection: blog
  BookTheme: auto
  BookToC: true
  BookSearch: true
  BookCollapseSection: true
  BookRepo: https://github.com/pemako/pemako.github.io
  BookDateFormat: "2006-01-02"

  comments:
    giscus:
      repo: "pemako/pemako.github.io"
      repoId: "R_kgDOOf3OGw"
      category: "Announcements"
      categoryId: "DIC_kwDOOf3OG84Cpfhr"
      mapping: "pathname"
      reactionsEnabled: true
      emitMetadata: true
      theme: "preferred_color_scheme"
      lang: "en"
      inputPosition: "bottom"

markup:
  goldmark:
    renderer:
      unsafe: true
  highlight:
    noClasses: false
```

- [ ] **Step 2: Verify the config parses**

```bash
hugo config | grep -E "theme|BookSection|baseURL"
```

Expected: shows `hugo-book` as theme, `blog` as BookSection.

- [ ] **Step 3: Commit**

```bash
git add hugo.yaml
git commit -m "feat: rewrite hugo.yaml for hugo-book theme"
```

---

### Task 5: Migrate layouts/partials to hugo-book injection points

**Files:**
- Create: `layouts/partials/docs/inject/content.html` (from comments.html)
- Create: `layouts/partials/docs/inject/head.html` (from extend_head.html)
- Delete: `layouts/partials/comments.html`
- Delete: `layouts/partials/extend_head.html`
- Delete: `layouts/partials/footer.html`

- [ ] **Step 1: Create inject directory**

```bash
mkdir -p layouts/partials/docs/inject
```

- [ ] **Step 2: Move comments partial to inject/content.html**

```bash
cp layouts/partials/comments.html layouts/partials/docs/inject/content.html
```

- [ ] **Step 3: Move head partial to inject/head.html**

```bash
cp layouts/partials/extend_head.html layouts/partials/docs/inject/head.html
```

- [ ] **Step 4: Delete old partials**

```bash
rm layouts/partials/comments.html
rm layouts/partials/extend_head.html
rm layouts/partials/footer.html
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: migrate partials to hugo-book inject points"
```

---

### Task 6: Update archetypes

**Files:**
- Modify: `archetypes/default.md`
- Modify: `archetypes/go.md`
- Modify: `archetypes/python.md`
- Modify: `archetypes/lua.md`
- Modify: `archetypes/tools.md`
- Delete: `archetypes/tianshu.md` (unused section)

- [ ] **Step 1: Update archetypes/default.md**

```yaml
---
date: '{{ .Date }}'
draft: true
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
weight: 1
---
```

- [ ] **Step 2: Update archetypes/go.md**

Remove `description`, `summary`, `categories`, `series`, `ShowToc`, `TocOpen`. Keep `tags`.

```yaml
---
date: '{{ .Date }}'
draft: true
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
tags: ["go"]
weight: 1
---
```

- [ ] **Step 3: Update archetypes/python.md**

```yaml
---
date: '{{ .Date }}'
draft: true
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
tags: ["python"]
weight: 1
---
```

- [ ] **Step 4: Update archetypes/lua.md**

```yaml
---
date: '{{ .Date }}'
draft: true
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
tags: ["lua"]
weight: 1
---
```

- [ ] **Step 5: Update archetypes/tools.md**

```yaml
---
date: '{{ .Date }}'
draft: true
title: '{{ replace .File.ContentBaseName "-" " " | title }}'
tags: ["tools"]
weight: 1
---
```

- [ ] **Step 6: Delete tianshu.md archetype**

```bash
rm archetypes/tianshu.md
```

- [ ] **Step 7: Commit**

```bash
git add archetypes/
git commit -m "feat: update archetypes for hugo-book (remove PaperMod fields)"
```

---

### Task 7: Verify the site builds and renders correctly

- [ ] **Step 1: Start local dev server**

```bash
make serve
```

Open http://localhost:1313 in a browser.

- [ ] **Step 2: Check sidebar navigation**

Verify:
- Left sidebar shows: Go, Python, Lua, Tools, Posts sections
- Each section is collapsed by default
- Clicking a section expands it and shows articles

- [ ] **Step 3: Check an article renders**

Navigate to any article (e.g., `http://localhost:1313/blog/go/code-style/`).

Verify:
- Article content renders
- Table of contents appears on the right
- Code blocks have syntax highlighting
- Giscus comment box appears at the bottom

- [ ] **Step 4: Check search**

Click the search icon. Type a keyword that appears in articles (e.g., "docker").

Expected: search results appear.

- [ ] **Step 5: Build for production**

```bash
make build
```

Expected: exits with no errors, `public/` is populated.

- [ ] **Step 6: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: hugo-book migration verification fixes"
```
