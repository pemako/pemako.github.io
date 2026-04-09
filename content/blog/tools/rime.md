---
date: '2026-04-09T20:00:00+08:00'
title: 'Rime 输入法'
description: ""
summary: ""
tags: ["rime"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---

https://ssnhd.com/2022/01/06/rime/



---

# Rime 输入法使用指南

## 基本概念

Rime 在 macOS 上叫 **鼠须管（Squirrel）**，是一个高度可定制的输入法框架。所有配置通过 YAML 文件完成。

**配置目录：** `~/Library/Rime/`

---

## 一、基本使用

### 切换输入方案
- `F4` 或 `` Ctrl+` `` — 呼出方案选单
- 默认内置：朙月拼音、仓颉五代、粤拼等

### 切换中英文
- `Shift` — 切换中英文（默认）
- `Caps Lock` — 也可切换

### 翻页
- `-` / `=` 或 `[` / `]` — 翻候选页

### 特殊输入
- `/` 开头 — 输入符号（如 `/jt` → 箭头符号）
- `v` 开头 — 部分方案支持输入特殊字符

---

## 二、配置文件结构

```
~/Library/Rime/
├── squirrel.yaml          # 外观配置（皮肤、字体）
├── default.yaml           # 全局配置（方案列表、快捷键）
├── default.custom.yaml    # ★ 你的全局自定义（推荐在这里改）
├── squirrel.custom.yaml   # ★ 你的外观自定义
├── luna_pinyin.schema.yaml        # 朙月拼音方案
├── luna_pinyin.custom.yaml        # ★ 朙月拼音自定义
└── user.db / *.userdb/    # 用户词库
```

> **关键原则：** 不要直接改 `*.yaml`，要建对应的 `*.custom.yaml` 文件来覆盖，这样升级不会丢失配置。

---

## 三、常用自定义

### 1. 切换候选方案（修改 default.custom.yaml）

```yaml
patch:
  schema_list:
    - schema: luna_pinyin        # 朙月拼音
    - schema: luna_pinyin_simp   # 朙月拼音·简化字
    - schema: double_pinyin      # 双拼
```

### 2. 修改候选词数量

```yaml
# default.custom.yaml
patch:
  menu/page_size: 9   # 每页显示 9 个候选词
```

### 3. 修改中英文切换键

```yaml
# default.custom.yaml
patch:
  ascii_composer/switch_key:
    Shift_L: commit_code    # 左 Shift：上屏字母
    Shift_R: inline_ascii   # 右 Shift：临时英文
```

`switch_key` 可选值：
- `clear` — 清除已输入
- `commit_code` — 上屏字母原文
- `commit_text` — 上屏候选文字
- `inline_ascii` — 临时切英文
- `noop` — 无操作

### 4. 修改翻页键

```yaml
# default.custom.yaml
patch:
  key_binder/bindings:
    - { when: paging, accept: comma, send: Page_Up }
    - { when: paging, accept: period, send: Page_Down }
```

### 5. 设置模糊音（luna_pinyin.custom.yaml）

```yaml
patch:
  speller/algebra:
    - erase/^xx$/
    - abbrev/^([a-z]).+$/$1/
    - abbrev/^([zcs]h).+$/$1/
    # 模糊音
    - derive/^([zcs])h/$1/       # zh→z, sh→s, ch→c
    - derive/^([zcs])([^h])/$1h$2/
    - derive/n/l/
    - derive/l/n/
    - derive/([ei])n$/$1ng/
    - derive/([ei])ng$/$1n/
```

---

## 四、外观自定义（squirrel.custom.yaml）

```yaml
patch:
  style:
    font_face: "PingFang SC"    # 字体
    font_point: 16               # 字号
    candidate_list_layout: stacked  # stacked(竖排) 或 linear(横排)
    color_scheme: clean_white    # 主题

  preset_color_schemes:
    clean_white:
      name: 简白
      author: me
      back_color: 0xFFFFFF       # 背景色 (BGR格式)
      border_color: 0xDDDDDD     # 边框色
      text_color: 0x333333       # 已输入文字色
      hilited_text_color: 0x000000
      hilited_back_color: 0xEEEEEE
      candidate_text_color: 0x333333
      hilited_candidate_text_color: 0xFFFFFF
      hilited_candidate_back_color: 0x0066CC  # 选中项背景
```

> 注意：颜色格式是 **0xBBGGRR**（蓝绿红），与常见 RGB 相反。

---

## 五、词库扩展

### 导入自定义词库

1. 新建文件 `my_dict.dict.yaml`：

```yaml
---
name: my_dict
version: "1.0"
sort: by_weight
...
苟利国家生死以	gou li guo jia sheng si yi
岂因祸福避趋之	qi yin huo fu bi qu zhi
```

2. 在方案中引用（`luna_pinyin.custom.yaml`）：

```yaml
patch:
  translator/dictionary: luna_pinyin
  "translator/colleges":
    - luna_pinyin
    - my_dict
```

更简单的方式——直接用 `luna_pinyin.extended.dict.yaml`：

```yaml
---
name: luna_pinyin.extended
version: "1.0"
sort: by_weight
import_tables:
  - luna_pinyin
  - my_dict
...
```

---

## 六、生效方式

每次修改配置后，需要**重新部署**：

- 点击菜单栏 Rime 图标 → **重新部署**
- 或快捷键 `Ctrl+Alt+\`` （部分版本）

---

## 七、推荐进阶方案

| 需求 | 推荐方案 |
|------|----------|
| 全拼 | `luna_pinyin_simp`（简体） |
| 双拼 | `double_pinyin_flypy`（小鹤） |
| 五笔 | `wubi86` |
| 粤语 | `jyutping` |
| 台湾繁体 | `luna_pinyin_tw` |

安装更多方案推荐用 [东风破（plum）](https://github.com/rime/plum)：

```bash
cd ~/.config   # macOS 用 ~/Library/Rime
curl -fsSL https://git.io/rime-install | bash
# 然后：
bash rime-install double-pinyin  # 安装双拼
```

---

## 八、常见问题

**Q: 改了配置不生效？**
→ 检查 YAML 缩进（必须用空格，不能用 Tab），然后重新部署。

**Q: 候选词乱序？**
→ 用户词频学习会调整顺序，`右键菜单 → 用户词典管理` 可清理。

**Q: 如何备份配置？**
→ 备份整个 `~/Library/Rime/` 目录即可，`.userdb` 是词频数据库。
