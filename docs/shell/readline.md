---
sidebar_position: 17
---

# Bash Command Line Editing（行编辑与 Readline）

> 参考：https://www.gnu.org/software/bash/manual/bash.html#Command-Line-Editing-1

## 8.1 简介

- 交互式 shell 默认启用；`bash --noediting` 可关闭。
- `read -e` 让脚本里的 `read` 也走 readline。
- 两套风格：
  - emacs（默认）：`set -o emacs`
  - vi：`set -o vi`
  - 关闭：`set +o emacs` / `set +o vi`
- 记号：`C-x`=Ctrl+x，`M-x`=Meta/Alt+x（或 ESC 后 x），`DEL`=Backspace。

## 8.2 Readline 交互（emacs 模式）

### 光标移动

- `C-a` 行首 / `C-e` 行尾
- `C-f` / `C-b` 前后一字符
- `M-f` / `M-b` 前后一词
- `C-l` 清屏

### 修改

- `C-d` 删当前字符（行空退出 shell）
- `DEL` / `C-h` 删前一字符
- `M-d` 删到词尾 / `M-DEL` 删到词首
- `C-k` 删到行尾 / `C-u` 删到行首
- `C-w` 删前一空白分隔词
- `C-t` 交换字符 / `M-t` 交换词
- `M-u / M-l / M-c` 词转大/小/首字母大写

### Kill & Yank

- 被 kill 的文本入 **kill-ring**
- `C-y` 粘贴最近
- `M-y` 循环取更早（须紧跟 `C-y`）

### 历史

- `C-p` / `C-n` 上下条
- `C-r` 反向增量搜索；`C-s` 正向（可能需 `stty -ixon`）
- `M-<` / `M->` 最旧 / 最新
- `!!`、`!n`、`!string`、`^old^new^`（history expansion）

### 参数与撤销

- `M-<digit>` 或 `C-u N` 重复次数；`M--` 取负
- `C-_` 或 `C-x C-u` 撤销；`M-r` 还原整行

## 8.3 Readline Init File（~/.inputrc）

加载：`~/.inputrc`（`$INPUTRC` 可覆盖），系统级 `/etc/inputrc`；`C-x C-r` 重载。

### 变量（`set name value`）

常用：

- `editing-mode emacs|vi`
- `bell-style none|visible|audible`
- `completion-ignore-case on`
- `show-all-if-ambiguous on`
- `show-all-if-unmodified on`
- `colored-stats on`
- `colored-completion-prefix on`
- `mark-symlinked-directories on`
- `visible-stats on`
- `enable-bracketed-paste on`
- `history-preserve-point on`

### 按键绑定

```inputrc
"\C-o": "> output.log"              # 插入字符串
"\C-x\C-l": clear-screen            # 绑定到命令
Control-Meta-u: universal-argument
```

转义：`\C-`、`\M-`、`\e`、`\\`、`\"`、`\t`、`\n`。

### 条件解析

```inputrc
$if mode=emacs
  "\C-w": backward-kill-word
$endif

$if Bash
  "\C-xp": "printf '%q\n' \"$PWD\""
$endif

$if term=xterm-256color
  "\e[1;5C": forward-word
  "\e[1;5D": backward-word
$endif
```

## 8.4 Bindable Readline Commands（常用命令名）

- 移动：`beginning-of-line`、`end-of-line`、`forward-word`、`backward-word`、`shell-forward-word`、`shell-backward-word`
- 历史：`previous-history`、`reverse-search-history`、`history-search-backward`、`operate-and-get-next`（`C-o`）
- 修改：`delete-char`、`backward-delete-char`、`transpose-chars`、`transpose-words`、`upcase/downcase/capitalize-word`、`overwrite-mode`
- Kill/Yank：`kill-line`、`unix-line-discard`、`kill-word`、`backward-kill-word`、`unix-word-rubout`、`yank`、`yank-pop`
- 补全：`complete`、`possible-completions`、`menu-complete`、`complete-filename`、`complete-hostname`、`complete-variable`、`dynamic-complete-history`、`dabbrev-expand`、`glob-expand-word`
- 宏：`start-kbd-macro`（`C-x (`）、`end-kbd-macro`（`C-x )`）、`call-last-kbd-macro`（`C-x e`）
- 其他：`re-read-init-file`（`C-x C-r`）、`undo`、`revert-line`、`set-mark`、`exchange-point-and-mark`、`insert-comment`、`dump-functions`

查看全部：`bind -p`（当前键位）、`bind -l`（命令名）、`bind -v`（变量）。

## 8.5 vi 模式

- 进入后默认 insert；`ESC` 进 command；`i a A I s S` 回到 insert。
- 移动：`h j k l w b 0 $`
- 修改：`x dw dd cw cc r R`
- 复制粘贴：`y p P`
- 重复/撤销：`.` / `u U`
- 历史搜索：`/pattern` `n N`
- 自定义：`bind -m vi-command '"\C-l": clear-screen'`

## 8.6 Programmable Completion

Tab 时查找顺序：命令名 compspec → `-D` 默认 compspec → 默认文件名补全。

一个 compspec 的组成：

- 动作标志：`-a -b -c -d -e -f -g -j -k -s -u -v`、`-A action`（`signal`、`helptopic` 等）
- 词表：`-W "w1 w2 w3"`
- Glob：`-G pattern`
- 前后缀：`-P prefix` / `-S suffix`
- 过滤：`-X !pattern`
- 函数：`-F funcname`（结果写入 `COMPREPLY`）
- 外部命令：`-C 'cmd'`（stdout 每行一个候选）
- 选项：`-o default|dirnames|filenames|plusdirs|nospace|bashdefault|noquote|nosort`
- 函数返回 **124**：通知 readline 重新计算（懒加载核心机制）

## 8.7 Programmable Completion Builtins

- **`complete`**：安装/修改/查看
  - `complete [-abcdefgjksuv] [-pr] [-o opt] [-A act] [-G glob] [-W words] [-F func] [-C cmd] [-X pat] [-P pre] [-S suf] name …`
  - `-p` 可重用打印；`-r` 移除
  - `-D` 默认；`-E` 空命令行；`-I` 首词本身
- **`compgen`**：生成候选到 stdout，供 `-F` 函数使用
- **`compopt`**：在函数内动态调整选项，如 `compopt -o nospace`

函数内可读：`COMP_WORDS[@]`、`COMP_CWORD`、`COMP_LINE`、`COMP_POINT`、`COMP_KEY`、`COMP_TYPE`、`COMP_WORDBREAKS`。

## 8.8 示例：为 myapp 写补全

```bash
_myapp() {
  local cur prev
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  case "$prev" in
    --config) COMPREPLY=( $(compgen -f -- "$cur") ); return 0 ;;
  esac

  if [[ "$cur" == -* ]]; then
    COMPREPLY=( $(compgen -W "--config --help --verbose" -- "$cur") )
  else
    COMPREPLY=( $(compgen -W "start stop status restart" -- "$cur") )
  fi
}
complete -F _myapp myapp
```

---

## 经典使用案例

### 1. 编辑超长命令行（拼到 `fc` / `$EDITOR`）

发现一条很长的命令打错了：

```bash
$ docker run --rm -v ...(很长)... image cmd   # 懒得左右箭头改
# 按 C-x C-e                                  # 直接丢到 $EDITOR
# 在编辑器里改好保存退出 → 自动执行
```

对应命令 `edit-and-execute-command`，默认绑 `C-x C-e`。

### 2. operate-and-get-next：批量重放历史

需要连续执行历史中紧邻的几条：

```bash
# C-r 搜到第一条 → 按 C-o
# shell 执行该条后，自动把历史中下一条放到提示符上
# 继续 C-o，即可顺序重放
```

### 3. 用 `C-r` 当"命令收藏夹"

`HISTSIZE=50000`、`HISTFILESIZE=50000`、`HISTCONTROL=ignoreboth:erasedups`、`shopt -s histappend`——历史够长，`C-r` 输关键词即可捞回半年前的命令。

### 4. 字符串快捷插入

`.inputrc` 里：

```inputrc
"\ep": "| less -R"
"\eg": " | grep "
"\et": " 2>&1 | tee /tmp/out.log"
```

敲 `make all` 后按 `M-t`，一键追加 `2>&1 | tee /tmp/out.log`。

### 5. 键盘宏录制

临时要对十几条命令做相同编辑（比如每条前加 `sudo`、末尾加 `&`）：

```
C-x (              开始录制
C-a  sudo SPC  C-e  SPC &
C-x )              结束
C-x e              每回放一次执行一次；M-10 C-x e 回放 10 次
```

### 6. 把 Alt-. 记牢：取上条命令最后一个词

`M-.`（`yank-last-arg`）：

```bash
$ mv long/path/to/file.txt backup/
$ ls -l M-.            # 展开成 ls -l backup/
$ cat M-. M-.          # 多次按取更早的 arg
```

### 7. 让 Ctrl-S 不冻结终端

在 `~/.bashrc` 里：

```bash
[[ $- == *i* ]] && stty -ixon
```

然后 `C-s` 就能用作正向增量搜索。

### 8. 贴大段代码避免误触发

```inputrc
set enable-bracketed-paste on
```

粘贴时整段按字面插入，不把换行当回车执行，极大降低事故。

### 9. vi 模式下给命令模式加快捷键

```inputrc
set editing-mode vi
$if mode=vi
  set keymap vi-command
  "v": edit-and-execute-command
  "\C-l": clear-screen
  set keymap vi-insert
  "\C-p": previous-history
  "\C-n": next-history
$endif
```

效果：insert 模式仍可用 `C-p/C-n`，command 模式按 `v` 进 `$EDITOR` 改命令。

### 10. 补全懒加载（bash-completion 套路）

包太大，不想启动时全加载：

```bash
_load_myapp() {
  source /usr/share/bash-completion/completions/myapp
  return 124          # 告诉 readline 重新跑补全
}
complete -F _load_myapp myapp
```

第一次对 `myapp` 按 Tab 才加载真正的 compspec。

### 11. 根据上下文切换补全目标

```bash
_deploy() {
  local cur prev
  cur="${COMP_WORDS[COMP_CWORD]}"
  prev="${COMP_WORDS[COMP_CWORD-1]}"

  case "$prev" in
    --env)    COMPREPLY=( $(compgen -W "dev staging prod" -- "$cur") ); return ;;
    --host)   COMPREPLY=( $(compgen -A hostname        -- "$cur") ); return ;;
    --user)   COMPREPLY=( $(compgen -u                 -- "$cur") ); return ;;
    --config) COMPREPLY=( $(compgen -f -X '!*.yaml'    -- "$cur") ); return ;;
  esac
  COMPREPLY=( $(compgen -W "--env --host --user --config" -- "$cur") )
}
complete -F _deploy deploy
```

### 12. 让 `cd` 只补全目录并显示颜色

```bash
complete -o nospace -o dirnames cd pushd
```

加 `.inputrc`：

```inputrc
set colored-stats on
set mark-symlinked-directories on
set visible-stats on
```

### 13. 常见陷阱

- `C-s` 被终端流控吞掉 → `stty -ixon`。
- 自定义 `\e[…` 序列要匹配 `$TERM`，否则在 tmux / screen 里失效，用 `$if term=` 分支。
- `HISTCONTROL=ignoredups` 跨会话去重失效 → 加 `erasedups` 并 `shopt -s histappend`。
- 补全函数写 `COMPREPLY=$(…)` 少了括号 → 必须用数组赋值 `( … )`。
- 函数里忘了 `-- "$cur"` → 候选不会按前缀过滤。
- 改了 `~/.inputrc` 不生效 → `bind -f ~/.inputrc` 或 `C-x C-r` 重载。
