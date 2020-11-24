---
layout: post
title: 使用hexo搭建博客过程
category: hexo
tags:
  - hexo
---

# 2017-01-21-use-hexo-setup-blog

今天下午折腾了一下博客，终于可以正常的运作了，对整个搭建的过程做一个记录

## 环境说明

```bash
1. Mac OS 10.12.2
2. 安装工具使用 brew
3. 使用 hexo
4. 代码部署到 github 及 coding 两个平台
```

## 搭建过程

```bash
1. brew install node

2. npm install hexo-cli -g

3. npm install hexo -g --no-optional 在 mac 出现的问题

4. hexo init you_project_name

5. 配置 _config.yml 进行部署
    delpoy:
        type: git
        repo:
            github: git@github.com:<youname>/you_github_project_name
            coding: git@git.coding.net:<youname>/you_coding_project_name
        branch: master

6. 进行 hexo g -d 进行生成静态文件部署

7. 如出现权限等问题，可能是 public key 没有配置，可以进行生成公钥

    - ssh-keygen -t rsa -b 4096 -C "you_github_email@mail.com"

    - 在 ~/.ssh/ 目录下生成id_rsa.pub id_rsa 文件 复制 id_rsa.pub中的内容

    - Github 填写在 https://github.com/settings/keys相应位置即可

    - Coding 填写到 https://coding.net/u/you_name/p/you_project_name/setting/deploy_key 相应位置
```

## 关于主题

本博客搭建使用的[maupassant 主题](https://github.com/tufu9441/maupassant-hexo)

## 关于订阅的设置

需要安装`npm install hexo-generator-feed --save` 插件，然后配置 `_config.yml` 文件

```bash
feed:
    type: atom
    path: atom.xml
    limit: 20
    hub:
    content:
```

## 绑定自己独立域名

```bash
1. 在source文件夹中新建一个CNAME文件（无后缀名），然后用文本编辑器打开

2. 在首行添加你的网站域名，如http://pemako.cn，注意前面没有http://，也没有www

3. hexo g -d 上传部署。

4. 在域名解析提供商，下面以阿里云为例。
    - 先加一个CNAME，主机记录写@，后面记录值写上你的pemako.coding.me
    - 再添加一个CNAME，主机记录写www，后面记录值也是 pemako.coding.me

5. 尽量不要使用 A 记录，应为需要填写 coding 或 gitHub 的 ip 地址，如果 ip 地址变动会导致解析失败

6. 本网站唯一域名为 [https://pemako.cn](https://pemako.cn) 访问请不要加 www
```

## 注意事项

```text
maupassant 主题中的 self_search 插件是基于 jQuery 的本地搜索引擎
需要安装插件`npm install hexo-generator-search --save`支持
```

