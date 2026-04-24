---
title: iTerm2 + tmux 中 fn+左箭头（Home 键）失效问题
date: 2026-04-24
authors: [pemako]
---

# iTerm2 + tmux 中 fn+左箭头（Home 键）失效问题

## 问题描述

在 iTerm2 中使用 tmux 时，按下 `fn+左箭头` 无法跳到命令行开头，只能一个字符一个字符地向左移动。不使用 tmux 时该快捷键正常。

<!--truncate-->

## 原因分析

涉及两层问题：

1. **tmux 未透传键序列**：tmux 默认不会将 xterm 风格的转义序列（如 Home/End）透传给内部 shell。
2. **zsh 未绑定对应序列**：tmux 内部的 `TERM` 为 `screen-256color`，zsh 默认不会为该终端类型绑定 Home/End 键序列，需手动指定。

## 诊断方法

在 tmux 内的 shell 中运行以下命令，然后按 `fn+左箭头`，查看实际发送的转义序列：

```bash
cat -v
```

按 `Ctrl+C` 退出。本例输出为 `^[[1~`，即序列 `\033[1~`。

## 解决方案

### 1. 配置 tmux（`~/.tmux.conf`）

启用 xterm 键位透传：

```bash
set-window-option -g xterm-keys on
```

重新加载配置：

```bash
tmux source-file ~/.tmux.conf
```

### 2. 配置 zsh（`~/.zshrc`）

手动绑定 Home/End 键序列：

```zsh
# Home / End 在 tmux 内
bindkey "^[[H"  beginning-of-line
bindkey "^[[F"  end-of-line
# 兼容 ^[[1~ / ^[[4~ 序列
bindkey "^[[1~" beginning-of-line
bindkey "^[[4~" end-of-line
```

重新加载配置：

```bash
source ~/.zshrc
```

### 3. 如果使用 bash（`~/.bashrc`）

```bash
bind '"\e[H":  beginning-of-line'
bind '"\e[F":  end-of-line'
bind '"\e[1~": beginning-of-line'
bind '"\e[4~": end-of-line'
```

## 结论

两项配置缺一不可：

| 配置项 | 作用 |
|--------|------|
| tmux `xterm-keys on` | 让 tmux 正确透传 xterm 风格的转义序列 |
| zsh `bindkey` | 告诉 zsh 收到对应序列时执行 `beginning-of-line` |
