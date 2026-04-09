---
date: '2026-04-09T20:00:00+08:00'
title: 'Git'
description: ""
summary: ""
tags: ["git"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---

## rebase 使用

> https://juejin.cn/post/6844903895160881166

场景说明：

A B两个同学同时开发，A修改了 one.md 文件并提交； B 这边没有pull直接修改了 two.md 文件然后提交，提示需要pull下来，这里采用 git pull --rebase 的话生成的log为线性的
![](https://raw.githubusercontent.com/pemako/imgs/master/public/20210720100053.png)

A 再次修改提交，需要pull同步分支变更；这里不用rebase的情况下产生的log为下面情形。
![](https://raw.githubusercontent.com/pemako/imgs/master/public/20210720100353.png)


## 多帐号配置

- 进入 `~/.ssh` 目录下依次使用命令生成对应的秘钥文件
  - `ssh-keygen -t rsa -C "makosonm@gmail.com"` 命名为 `id_rsa_makosonm`
  - `ssh-keygen -t rsa -C "pemako@gmail.com"` 命名为 `id_rsa_pemako`
- 在 github.com 的setting上添加对应的 `id_rsa_xx.pub`文件内容到 SSH KEY
- 在 `~/.ssh/config` 文件中添加如内容

```text
Host makosonm
    HostName github.com
    User makosonm@gmail.com
    IdentityFile ~/.ssh/id_rsa_makosonm

Host pemako
    HostName github.com
    User pemakoa@gmail.com
    IdentityFile ~/.ssh/id_rsa_pemako
```

> 不配置 global 的 user email 可以在不同的仓库配置不同的账号进行提交代码

```
git config user.name "makosonm"
git config user.email "makosonm@gmail.com"
```

### Mac 下  orbstack 下的虚拟机拉取 github 代码的 token

`<YOUR_GITHUB_TOKEN>`
