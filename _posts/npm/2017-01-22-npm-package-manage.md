---
layout: post
title: NPM包管理器使用
description: npm, nodejs
tags: [javascript, nodejs]
category: nodejs
---

OSX use `brew install node` 目前安装的版本是 `v7.4.0`。安装完成 `nodejs` 后就可以使用 `npm` 进行相应的包管理。

### Updating npm

如有需要把 `npm` 更新为最新的版本可以使用 `npm install npm@latest -g`

### Installing package

`npm install <package_name>`
这个命令会在当前的目录下创建 `node_modules` 文件夹。如果需要全局安装包的话加上 `-g` 参数 

### Using a package.json

通过 `package.json` 来管理本地安装的 npm packages 是一种最好的方式。

#### Requirements

最小版本的 `package.json` 必须包含 `name`和`version` 

```
- name
    - 允许全部小写
    - 单词中不能有空格
    - 允许破折号和下滑下
- version
    - 版本的为 x.x.x
    - 遵循语义版本，如一个新版创建的时候应为 1.0.0
    
For example:
{
    "name": "my-awesome-package",
    "version": "1.0.0"
}
```

#### Creating a package.json

`npm init [--yes|-y]` 创建默认的 `package.json`


### Uninstall packages

删除 node_modules 中的模块可以直接是用 `npm uninstall <package>`

删除 package.json 中的依赖可以使用 `npm uninstall --save <package>`

注意：如果安装的包的是`devDependency`版本 `--save`不起作用的情况下可以使用 `--save-dev` unistall it.

### Publishing npm packages

1. 必须在 `https://www.nmpjs.com/` 进行注册过
2. `npm init` 创建一个 package.json
3. 创建对应的 `index.js` 文件 内容如下

```js
exports.printMsg = function() { 
    console.log("This is a message from the demo package");
}
```

4. `npm adduser`
5. `npm login`
6. `npm publish` 发布完成可以在`https://www.nmpjs.com` 中查看
7. 使用刚发布的包 `npm install npm-demo-pkg424`
8. `echo "var demo = require("npm-demo-pkg424"); demo.printMsg();"> test.js && node test.js`

### 注意事项

#### Semver for publishers

如果你的版本将要发布供其他人使用的话，版本应该从 `1.0.0` 开始。
当你的包有需要升级时，按照下面的原则修改版本号

1. Bug fixes and other minor changes: Patch release 修改最后一位版本号 eg. `1.0.1`
2. New features which don't break existing feature: Minor release, 修改中间版本号 eg.`1.1.0`
3. Changes which break backwards compatibility: Major relese,修改第一位版本号 eg. `2.0.0`

#### Semver for consumers

作为使用者你必须指定需要更新的版本的。如果你想使用一个包的版本为 `1.0.4` 必须如下进行严格指定

1. Patch release: `1.0` or `1.0.x` or `~1.0.4`
2. Minor release: `1` or `1.x` or `^1.0.4`
3. Major release: `*` or `x`
