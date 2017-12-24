---
layout: post
title: 用 brew配置 mac 环境
category: brew
tags: [brew, mac]
---

使用`brew` 环境要求, 已经安装`ruby`, `git` 这里假设环境已 OK，只需要在命令行终端输入一下命令，即开始进行安装`brew`.

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

使用 `brew config` 查看自己的环境, 我的环境配置如下

```
HOMEBREW_VERSION: 1.4.1-11-g583b61f
ORIGIN: https://github.com/Homebrew/brew
HEAD: 583b61fd324643f15bb8017a6b652afbbbfe7cbc
Last commit: 2 days ago
Core tap ORIGIN: https://github.com/Homebrew/homebrew-core
Core tap HEAD: e1f84c3a98b856e0868734cefeb19047d4e2a3f7
Core tap last commit: 14 hours ago
HOMEBREW_PREFIX: /usr/local
HOMEBREW_DEV_CMD_RUN: 1
CPU: octa-core 64-bit haswell
Homebrew Ruby: 2.3.3 => /usr/local/Homebrew/Library/Homebrew/vendor/portable-ruby/2.3.3/bin/ruby
Clang: 9.0 build 900
Git: 2.14.3 => /Applications/Xcode.app/Contents/Developer/usr/bin/git
Curl: 7.54.0 => /usr/bin/curl
Perl: /usr/bin/perl
Python: /usr/local/opt/python/libexec/bin/python => /usr/local/Cellar/python/2.7.14/Frameworks/Python.framework/Versions/2.7/bin/python2.7
Ruby: /Users/lena/.rvm/rubies/ruby-2.4.0/bin/ruby
Java: 1.8.0_144, 1.8.0_121, 1.8.0_74
macOS: 10.13.2-x86_64
Xcode: 9.2
CLT: 9.2.0.0.1.1510905681
X11: 2.7.11 => /opt/X11
```


1. 安装需要的软件

```
# 安装 mysql 为例
brew install mysql

# 按照提示进行设置
mysql_secure_installation

# 起停
mysql.server  {start|stop|restart|reload|force-reload|status}

# 设置 my.cnf
/usr/local/etc/my.cnf

# 查看软件的详细信息
brew info mysql

# 查看软件的官网
brew home mysql

# 查看软件安装选项
brew options mysql

# 升级软件
brew upgrade mysql

# 卸载软件
brew uninstall mysql

# 搜索软件
brew search mysql

```

2. 安装 app brew cask

```
# 安装 sequel-pro 数据库管理软件为例
brew cask install sequel-pro
brew cask info sequel-pro
brew cask home sequel-pro
brew cask uninstall sequel-pro
......
```

更多的参数命令可以查看相关的帮助文档,如下

```
brew cask

Commands:

    --version              displays the Homebrew-Cask version
    audit                  verifies installability of Casks
    cat                    dump raw source of the given Cask to the standard output
    cleanup                cleans up cached downloads and tracker symlinks
    create                 creates the given Cask and opens it in an editor
    doctor                 checks for configuration issues
    edit                   edits the given Cask
    fetch                  downloads remote application files to local cache
    home                   opens the homepage of the given Cask
    info                   displays information about the given Cask
    install                installs the given Cask
    list                   with no args, lists installed Casks; given installed Casks, lists staged files
    outdated               list the outdated installed Casks
    reinstall              reinstalls the given Cask
    search                 searches all known Casks
    style                  checks Cask style using RuboCop
    uninstall              uninstalls the given Cask
    upgrade                upgrades all outdated casks
    zap                    zaps all files associated with the given Cask
```
