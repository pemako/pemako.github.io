---
sidebar_position: 19
---

# Bash `bind` 命令详解

## 语法

```bash
bind [-m keymap] [-lsvSVX]
bind [-m keymap] [-q function] [-u function] [-r keyseq]
bind [-m keymap] -f filename
bind [-m keymap] -x keyseq[:] shell-command
bind [-m keymap] keyseq:function-name
bind [-m keymap] keyseq:readline-command
bind [-m keymap] -p|-P [readline-command]
bind readline-command-line
```

---

## 核心概念

`bind` 用于配置 **Readline** 的键位绑定和变量，作用于交互式 bash 的命令行编辑。

Readline 是 bash 命令行输入的底层库，负责处理光标移动、历史记录、补全等所有编辑行为。`bind` 的效果等同于编辑 `~/.inputrc`，但立即生效且无需重启 shell。

---

## Keymap（键位图）

| Keymap 名称 | 说明 |
|-------------|------|
| `emacs` / `emacs-standard` | 默认，Emacs 风格编辑模式 |
| `emacs-meta` | Emacs Meta 键（Alt）绑定 |
| `emacs-ctlx` | Emacs Ctrl-X 前缀绑定 |
| `vi` / `vi-command` / `vi-move` | Vi 命令模式 |
| `vi-insert` | Vi 插入模式 |

---

## 选项说明

### 查看类

| 选项 | 说明 | 输出格式 |
|------|------|----------|
| `-l` | 列出所有 Readline 函数名 | 纯列表 |
| `-p` | 显示函数名及其绑定的键序列 | 可复用格式（适合写入 `.inputrc`） |
| `-P` | 同 `-p`，但输出更易读 | 人类可读格式 |
| `-s` | 显示绑定到宏的键序列及宏内容 | 可复用格式 |
| `-S` | 同 `-s`，但输出更易读 | 人类可读格式 |
| `-v` | 显示 Readline 变量名和当前值 | 可复用格式 |
| `-V` | 同 `-v`，但输出更易读 | 人类可读格式 |
| `-X` | 列出所有绑定到 shell 命令的键序列 | 可复用格式 |
| `-q function` | 查询指定函数绑定的键序列 | — |

### 修改类

| 选项 | 说明 |
|------|------|
| `-m keymap` | 指定后续操作作用的 keymap |
| `-f filename` | 从文件中读取键位绑定 |
| `-r keyseq` | 删除指定键序列的绑定 |
| `-u function` | 解绑指定函数的所有键序列 |
| `-x keyseq:cmd` | 将键序列绑定到 shell 命令 |

---

## 键序列表示法

| 表示法 | 含义 |
|--------|------|
| `\C-a` | Ctrl+A |
| `\M-a` | Meta/Alt+A |
| `\M-\C-a` | Alt+Ctrl+A |
| `\e` | Escape |
| `\t` | Tab |
| `\n` | 换行 |
| `"seq"` | 字面字符序列 |

---

## 特殊变量（`-x` 绑定时可用）

执行 shell 命令时，bash 自动设置以下变量：

| 变量 | 内容 |
|------|------|
| `$READLINE_LINE` | 当前命令行缓冲区内容 |
| `$READLINE_POINT` | 光标当前位置（字符索引） |
| `$READLINE_MARK` | 标记点位置 |
| `$READLINE_ARGUMENT` | 用户提供的数字前缀参数 |

修改这些变量后，编辑状态会同步更新。

---

## 实际使用场景

### 1. 查看当前所有键位绑定

```bash
# 可复用格式（适合导出到 .inputrc）
bind -p | grep -v "^#\|^$"

# 人类可读格式
bind -P

# 只看某个函数绑定了哪些键
bind -q backward-kill-word    # 输出：backward-kill-word can be invoked via "\C-w", "\M-\C-?"
```

---

### 2. 绑定键到 Readline 函数

```bash
# 将 Alt+. 绑定为插入上一条命令的最后一个参数
bind '"\e.":yank-last-arg'

# 将 Ctrl+L 绑定为清屏
bind '"\C-l":clear-screen'

# Ctrl+← 和 Ctrl+→ 按单词跳转（终端通常发送的转义序列）
bind '"\e[1;5C":forward-word'
bind '"\e[1;5D":backward-word'
```

---

### 3. 绑定键到宏（输出固定字符串）

```bash
# Ctrl+O 自动输入常用路径前缀
bind '"\C-o":"cd /var/log && ls -lht | head\n"'

# Alt+G 插入 grep 命令框架
bind '"\eg":"grep -rn \"\" . --include=\"*.\"'

# F2 快速插入 sudo（在命令行开头加 sudo）
bind '"\eOQ":"sudo "'
```

---

### 4. 绑定键到 shell 命令（`-x`，最强用法）

`-x` 允许执行任意 shell 命令，并可通过 `$READLINE_LINE` 读写当前命令行内容。

**在当前命令行前插入 sudo：**

```bash
bind -x '"\C-s":"READLINE_LINE=\"sudo $READLINE_LINE\"; READLINE_POINT=$((READLINE_POINT+5))"'
# Ctrl+S：给当前输入的命令加上 sudo 前缀，光标位置同步右移 5 位
```

**快速在新窗口用 vim 编辑当前命令：**

```bash
bind -x '"\C-e":"
  tmpfile=$(mktemp)
  echo \"$READLINE_LINE\" > \"$tmpfile\"
  vim \"$tmpfile\"
  READLINE_LINE=$(cat \"$tmpfile\")
  READLINE_POINT=${#READLINE_LINE}
  rm -f \"$tmpfile\"
"'
# Ctrl+E：将当前命令行内容放入 vim 编辑，保存后回填到命令行
```

**Ctrl+T 快速切换目录（结合 fzf）：**

```bash
bind -x '"\C-t":"
  dir=$(find ~ -type d 2>/dev/null | fzf --height 40%)
  if [ -n \"$dir\" ]; then
    READLINE_LINE=\"cd $dir\"
    READLINE_POINT=${#READLINE_LINE}
  fi
"'
```

---

### 5. 针对 Vi 模式设置键位

```bash
# 启用 vi 模式
set -o vi

# 在 vi 插入模式下也能用 Ctrl+P/N 翻历史（默认只有命令模式有）
bind -m vi-insert '"\C-p":previous-history'
bind -m vi-insert '"\C-n":next-history'

# vi 插入模式下 Ctrl+L 清屏
bind -m vi-insert '"\C-l":clear-screen'

# vi 命令模式下 # 注释当前行并执行（类似 bash 默认行为）
bind -m vi-command '"#":insert-comment'
```

---

### 6. 从文件批量加载键位

```bash
# 将常用绑定写入文件
cat > ~/.bash_bindings << 'EOF'
"\C-o": "cd /var/log\n"
"\eg": "grep -rn "
"\C-p": previous-history
"\C-n": next-history
set completion-ignore-case on
set show-all-if-ambiguous on
EOF

# 加载
bind -f ~/.bash_bindings

# 在 ~/.bashrc 中永久加载
echo 'bind -f ~/.bash_bindings' >> ~/.bashrc
```

---

### 7. 修改 Readline 变量

```bash
# 忽略大小写补全（输入 cd dow → 补全 Downloads）
bind 'set completion-ignore-case on'

# 有多个补全候选时直接全部列出，不需要按两次 Tab
bind 'set show-all-if-ambiguous on'

# 补全时将符号链接后面加 /
bind 'set mark-symlinked-directories on'

# 历史搜索时只匹配已输入的前缀（比默认的 Ctrl+R 更精准）
bind '"\e[A":history-search-backward'   # ↑ 键
bind '"\e[B":history-search-forward'    # ↓ 键

# 查看当前所有变量值
bind -V
```

---

### 8. 删除 / 解绑键位

```bash
# 删除某个键序列的绑定
bind -r '\C-s'              # 解绑 Ctrl+S

# 解绑某个函数的所有键序列
bind -u forward-search-history   # 解绑所有触发前向历史搜索的键

# 验证是否解绑成功
bind -q forward-search-history
```

---

### 9. 将绑定永久写入 `~/.inputrc`

`bind` 的效果只在当前 shell 会话有效，永久生效需写入 `~/.inputrc`：

```bash
# 导出当前所有绑定到 .inputrc（覆盖）
bind -p > ~/.inputrc
bind -v >> ~/.inputrc   # 追加变量设置

# 手动写入 .inputrc 示例
cat >> ~/.inputrc << 'EOF'

# 忽略大小写补全
set completion-ignore-case on

# 方向键按已输入前缀搜索历史
"\e[A": history-search-backward
"\e[B": history-search-forward

# Alt+. 插入上条命令最后参数
"\e.": yank-last-arg
EOF
```

---

## 常用 Readline 函数速查

```bash
# 历史
previous-history          # 上一条历史（↑）
next-history              # 下一条历史（↓）
history-search-backward   # 按前缀向前搜索历史
history-search-forward    # 按前缀向后搜索历史
reverse-search-history    # 增量反向搜索（Ctrl+R）

# 光标移动
forward-char              # 右移一字符（→）
backward-char             # 左移一字符（←）
forward-word              # 右移一单词（Alt+F）
backward-word             # 左移一单词（Alt+B）
beginning-of-line         # 行首（Ctrl+A）
end-of-line               # 行尾（Ctrl+E）

# 删除
backward-kill-word        # 删除光标前一个单词（Ctrl+W）
kill-line                 # 删除光标到行尾（Ctrl+K）
backward-kill-line        # 删除光标到行首（Ctrl+U）
unix-word-rubout          # 删除光标前单词（同 Ctrl+W）

# 其他
clear-screen              # 清屏（Ctrl+L）
yank-last-arg             # 插入上条命令最后参数（Alt+.）
insert-comment            # 注释当前行（Alt+#）
```

---

## 返回值

| 情况 | 返回值 |
|------|--------|
| 成功 | `0` |
| 无效选项或发生错误 | 非零 |
