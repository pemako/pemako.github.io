---
date: '2026-04-09T20:00:00+08:00'
title: 'Mac 使用技巧'
description: ""
summary: ""
tags: ["mac"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---

## mac上的一些操作

- mac上允许任何软件安装

```
sudo spctl --master-disable
```

- mac修改主机名

```
sudo scutil --set HostName servername.example.com
```

- 设置简单密码 

```shell
pwpolicy -clearaccountpolicies
passwd
```

- 重新设置所有的文件打开方式为默认

```
/System/Library/Frameworks/CoreServices.framework/Versions/A/Frameworks/LaunchServices.framework/Versions/A/Support/lsregister -kill -r  local system -domain user
```

### 备份操作

- 列出备份 

```
➜  ~ tmutil listbackups
/Volumes/system/Backups.backupdb/MacBook Pro/2020-03-28-142200
/Volumes/system/Backups.backupdb/MacBook Pro/2020-04-04-125648
/Volumes/system/Backups.backupdb/MacBook Pro/2020-07-04-025359
/Volumes/system/Backups.backupdb/MacBook Pro/2020-07-04-031159
/Volumes/system/Backups.backupdb/MacBook Pro/2020-07-04-041113
```

- 删除备份

```
➜  ~ sudo tmutil delete /Volumes/system/Backups.backupdb/MacBook\ Pro/2020-03-28-142200
Password:
Deleting: /Volumes/system/Backups.backupdb/MacBook Pro/2020-03-28-142200
```

### mac上截图方式

- 屏幕的一部分进行截图

```
Command + shit + 4 截屏会保存在桌面
```

- 对整个屏幕进行截图

```
Command + shift + 3 截屏会保存在桌面
```

- 把截图保存在粘贴板

```
Command + Control + shift + 3 截取整个屏幕
Command + Control + shift + 4 选取部分截取
```

- 对打开的窗口进行截图

```
Command + shfit + 4 + 空格键  保存在桌面可以再次按下空格键 进行调整大小，并可以使用 Command + Tab 进行窗口切换
```

- Grap 实用程序工具


---

## 1、MacOS系统重新安装设置

### U盘安装

> 先格式化电脑硬盘

- 1、 电脑关机状态下，键盘长按command+R键不放，同时按一下开机键松手，此时继续长按command+R键不放
- 2、长按command+R键不放后，出现Mac 使用工具的界面，选择磁盘工具
- 3、选择系统磁盘，点击抹掉。这里可以看到磁盘使用情况，以及剩余情况
- 4、这里一定要注意！注意！注意！磁盘格式一定要选择APFS格式，这个很重要，其它的磁盘格式会对某些软件的安装库不兼容，如：Adobe的pkg格式等
- 5、选择APFS格式，点击抹掉，抹点进程完成，点击完成
- 6、抹掉后可以看到，新的磁盘空空如也，旧磁盘里的东西已经全盘抹除，我们先关掉这个页面

### 启动盘制作过程

- 1、下载镜像完成后解压得到 `Install OS X Yosemite.app` 拷贝到 `Applications` 目录中
    - http://allmacworld.com/downloading/
        - http://85.25.214.244/MAC/OS_X_Yosemite_10.10.5.dmg
- 2、在Mac 的 磁盘工具中，将准备好的U盘划分 `Mac OS 扩展(日志式)`， `GUID 分区表`
- 3、在终端执行以下命令
    ```
    sudo /Applications/Install\ OS\ X\ Yosemite.app/Contents/Resources/createinstallmedia --volume /Volumes/Untitled --applicationpath /Applications/Install\ OS\ X\ Yosemite.app --nointeraction
    ```

> 上面 /Volumes/Untitled 是U盘的名字，注意替换。回车后，系统会提示你输入管理员密码，接下来就是等待系统开始制作启动盘了。

- 4、重启电脑启动时候按住 `option` 按键选择刚制作的启动盘,开始按照指引安装
- 5、安装过程中如果出现 `按照OSX Yosemite 应用程序副本不能验证。它在下载过程中可能遭破坏或篡改` 是因为 那是因为Apple更新开发者证书后导致的问题。这里需要在终端修改时间
    - date 062614102015.30  `默认修改到15年的时间即可` 


### 参考如下

- https://www.jianshu.com/p/c390f46f0530   
- https://blog.csdn.net/nesxiaogu/article/details/82847840
- https://zhuanlan.zhihu.com/p/30209380
- https://support.apple.com/zh-tw/HT201260
- https://support.apple.com/downloads
- https://support.apple.com/kb/DL1712?viewlocale=en_US&locale=en_US
- https://www.xia1ge.com/osx-dmg.html
- http://www.pc6.com/mac/376869.html
- https://www.macworld.co.uk/how-to/mac-software/install-old-mac-os-3679956/


## 2、Git 相关

### 2.1、配置相关

- .gitconfig

```
[core]
	excludesfile = .gitignore_global
[credential]
	helper = store

[user]
    name = makoliang
    email = makoliang@tencent.com

[alias]
	lg = log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit
	st = status
    co = checkout
    ci = commit
    br = branch
    unstage = reset HEAD
    last = log -1
[color]
	ui = true
[filter "lfs"]
	required = true
	clean = git-lfs clean -- %f
	smudge = git-lfs smudge -- %f
	process = git-lfs filter-process
[http "https://git.code.oa.com"]
      proxy = http://127.0.0.1:12639
[http "http://git.code.oa.com"]
      proxy = http://127.0.0.1:12639
[http]
	sslVersion = tlsv1.2
```

- .git-credentials

```
https://makoliang:%21Fudao666@git.code.oa.com
http://makoliang:%21Fudao666@git.code.oa.com
http://EDU_TE_Online:Docker%402017@git.code.oa.com
https://pemako:%24love716424AZLN@github.com
```

- .gitignore_global

```
"#"是.gitignore_global中的注释行
# Compiled source
*.pyc
*.com
*.class
*.dll
*.exe
*.o
*.so
__pycache__/
*.py[cod]
*$py.class

# Packages #
# it's better to unpack these files and commit the raw source
# git has its own built in compression methods
*.7z
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip
# Logs and databases
*.log
*.sql
*.sqlite

# OS generated files
.DS_Store*
ehthumbs.db
Icon?
Thumbs.db
```

### 2.2、工程收藏

- https://github.com/OpenCyberTranslationProject/Linux-Basics-for-Hackers
- https://github.com/TKkk-iOSer/WeChatPlugin-MacOS.git
- https://github.com/appium/appium
- https://github.com/pemako/data.git
- https://github.com/encode/django-rest-framework.git
- https://github.com/pemako/pygenerator.git
- https://github.com/pemako/to.git
- https://github.com/vim/vim
- https://github.com/whyliam/whyliam.workflows.youdao.git
- https://github.com/996icu/996.ICU
- https://github.com/sindresorhus/awesome.git
- https://github.com/composer/composer
- https://github.com/justjavac/free-programming-books-zh_CN
- https://github.com/micro/go-micro.git
- https://github.com/ouqiang/gocron



## 3、oh-my-zshr

```

# zsh-syntax-highlighting 必须添加到最后  https://github.com/zsh-users/zsh-syntax-highlighting/blob/master/INSTALL.md
plugins=(
  git golang tmux extract catimg encode64 urltools web-search systemadmin
  rbenv jenv autojump zsh-autosuggestions zsh-completions cheat-autocompletion
  gitignore jsontools osx zsh-syntax-highlighting
)

# zsh-completions 使用这个插件必须添加下面一句
autoload -U compinit && compinit

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='mvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"



# export PATH=~/.pyenv/bin:$PATH
# export PYENV_ROOT=~/.pyenv
# eval "$(pyenv init -)"

alias mysql='mysql -hlocalhost -uroot -pLiangfj8ifv$ --auto-rehash'
alias _mysql='~/MANP/Library/bin/mysql -hlocalhost -uroot -proot -P8899'
alias _ifconfig='ifconfig | grep -A 1 "en" | grep broadcast | cut -d " " -f 2'
alias _port="netstat -an | grep $1"
alias _sng="ssh makoliang@sng.mnet2.com -p 36000"

```

## 4、安装的软件

- LICEcap
- OmniDiskSweeper
- OmniGraffle
- Sequel Pro
- ShadowsocksX
    - 96.45.190.170 4716
    - aes-256-cfb
- Wireshark
- Tickeys
- The Unarchiver
- NeteaseMusic
- Dash
- https://github.com/ohmyzsh/ohmyzsh/wiki


## 5、smb设置

- smb://tencent.com/tfs/文体协会/腾讯电影协会-影音博物馆


## 6、Brew 安装信息

- Install Brew
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
- aria2c
- alex
- https://github.com/ohmyzsh/ohmyzsh/wiki/Installing-ZSH


```
aria2c -c -s50 -k1M -x16 --enable-rpc=false -o "OS X Yosemite 10.10.5.dmg" --header "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36" --header "Referer: https://pan.baidu.com/disk/home" --header "Cookie: BDUSS=2FpclQydHh0Ym1vR2lBNHAzNDV3bk9BS0lzSzRPV2loclhJS3ZuYjgtYXlvQ2hkSUFBQUFBJCQAAAAAAAAAAAEAAACQHTRGcGVtYWtvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALITAV2yEwFdN; pcsett=1575173682-24143c24c7c2aee2ed5fb0abba51a9ef" "https://pcs.baidu.com/rest/2.0/pcs/file?method=download&app_id=250528&path=%2F04-%E8%BD%AF%E4%BB%B6%E6%95%B4%E7%90%86%2FmacOS%E7%B3%BB%E7%BB%9F%2FOS%20X%20Yosemite%2010.10.5.dmg"
```


## 7、vim 设置

```
curl -fLo ~/.vim/vimrc --create-dirs https://raw.githubusercontent.com/makosonm/notes/master/scripts/vim/vimrc
```

## 全新电脑安装记录

> 20191201 重新安装电脑系统记录

### 安装软件

#### 不采用homebrew安装的软件

- iterm2（10.10的系统不支持最新的，下载2.3_1_7）
- jdk-13.0.1_osx-x64_bin
    
#### 采用homebrew安装的软件

- Install Brew
    - `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" `
- Install ohmyzsh
    - `sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"` 
    - `chsh -s /bin/zsh`
- Sogou Input
    - `brew cask install sogouinput`

- vim 安装
    - `brew install vim` 默认会把lua也给安装
    - `brew install luarocks` 安装lua包管理器

- ShadowsocksX
- licecap
- sequel-pro
- sublime-text 
- youdaodict 
- neteasemusic (需要新版本)
- xmind-zen (不可直接安装破解版本)
- vlc
- iina (需要新系统版本)

- axel php go@1.12 
- google-chrome
- postman


#### 电脑设置

- 设置默认shell
    - brew install zsh
    - add `/usr/local/bin/zsh` /etc/shells 中
    - chsh -s "$(which zsh)"



- Finder 默认显示隐藏文件
	- `defaults write com.apple.finder AppleShowAllFiles TRUE`
	- `killall Finder`


---

## iTerm2 + tmux 文本复制配置

### 问题
在 iTerm2 的 tmux 模式下，默认需要按住 Option + 鼠标选中 + Option+C 才能复制文本，操作繁琐。

### 解决方案

**第一层（推荐）：选中后自动复制，无需再按快捷键**

ITerm2 > Settings > General > Selection，勾选：
- ✅ Copy to pasteboard on selection

这样 Option + 鼠标拖选，松开即自动复制，无需再按 Option+C。

**第二层（可选）：直接拖选即复制，无需按 Option 键**

在 ~/.tmux.conf 中添加鼠标拖选 pipe，配置如下。

---

### 当前完整 ~/.tmux.conf 配置

```bash
### --- 基础设置 ---

# 让 tmux 和 iTerm2 在 macOS 下使用正确的 terminfo（强烈建议）
set -g default-terminal "xterm-256color"
set -ga terminal-overrides ",xterm-256color:Tc"

### --- 鼠标设置 ---
# 如果你想用 iTerm2 的原生选择复制行为，可以关闭 mouse
set -g mouse on

### --- macOS 原生剪贴板支持（tmux 3.2+ 内建） ---
set -g set-clipboard on

### --- 复制模式键位（不再做旧式 mouse-copy hack） ---
setw -g mode-keys vi

# vi copy-mode 下，按 y 可以直接复制到系统剪贴板
bind -T copy-mode-vi y send -X copy-pipe-and-cancel "pbcopy"

# 鼠标拖选结束后自动复制到系统剪贴板
bind -T copy-mode MouseDragEnd1Pane send -X copy-pipe-and-cancel "pbcopy"
bind -T copy-mode-vi MouseDragEnd1Pane send -X copy-pipe-and-cancel "pbcopy"

### --- 插件 ---
set -g @continuum-boot 'on'
set -g @continuum-restore 'on'
set -g @continuum-boot-options 'iterm,fullscreen'

set -g @plugin 'tmux-plugin/tpm'
set -g @plugin 'tmux-plugins/tmux-sensible'
set -g @plugin 'tmux-plugins/tmux-resurrect'
set -g @plugin 'tmux-plugins/tmux-continuum'

run '~/.tmux/plugins/tpm/tpm'
```

### 复制方式汇总

| 方式 | 操作 |
|------|------|
| iTerm2 原生 | Option + 拖选（自动复制，已启用）|
| tmux copy-mode | 直接拖选 → 松开自动复制 |
| vi 键位 | 进入 copy-mode → v 选择 → y 复制 |

配置修改后执行：`tmux source-file ~/.tmux.conf`
