---
layout: post
title: Composer使用总结
description: Composer使用总结
keywords: php, composer
category: php
tags: [php]
---

# 简介

Composer 是 PHP 的一个依赖管理工具。它允许你声明项目所依赖的代码库，他会在你的项目中为你安装指明的依赖。

Composer 不是一个包管理器。它涉及 "packages" 和 "libraries"，但它在每个项目的基础上进行管理，在你项目的某个目录中
(eg. vender) 进行安装。默认情况下它不会在全局安装任何东西。因此，这仅仅是一个依赖管理。

Composer 受到 node 的 `npm` 和 ruby的 `bundler`的强烈启发。

`Suppose`:

1. 你有一个项目依赖若干个库文件
2. 其中一些库依赖于其它的库

`Composer`:

1. 声明你所依赖的库文件
2. Composer 会找出那个版本的包需要安装，并按照它们（将它们下载到你的项目中）

## ① 系统要求

1. PHP 5.3.2+
2. 一些敏感的 PHP 设置和编译标志也是必须的，但对于任何不兼容项安装程序都会抛出警告

## ② 安装

由于本人使用 OSX 系统软件安装管理基本上都是采用[`homebrew`](http://brew.sh/)进行。所有这里仅列出 OSX 下安装方式其余详细信息[请参考](https://getcomposer.org/doc/00-intro.md)。

直接运行 `brew install composer`

## ③ 基本用法

#### 1. `composer.json`: 项目安装

使用 composer 的时候需要在你的项目目录下面包含 `composer.json` 文件。该文件包含了项目的依赖和其它的一些自定义数据，文件采用[`JSON format`](http://json.org/json-zh.html)编写。

#### 2. `require key`

在`composer.json` 文件中你需要指明项目依赖哪些包，使用 `require` key。格式如下：

```json
{
    "require": {
        "monolog/monolog": "1.0.*"
    }
}
```

#### 3. 包名称

包名称由作者和项目名称构成。通常会产生相同的项目名称，而作者名称很好的解决了命名冲突的问题。它允许两个不同的人创建同样名为`json` 的库，而之后它们将被命名为`igorw/json` 和`seldaek/json`。

这里我们需要引入[`monolog /monolog`](https://packagist.org/packages/monolog/monolog)，作者和项目名称相同，对于一个具有唯一名称的项目，推荐这么做。

`注: 这里把作者理解为供应商(vendor)`

#### 4. 包版本

版本约束可以用一下不同的方式指定

名称    | 实例 | 描述
----------| ----------| ---------|
确切版本号| `1.0.2` | 指定明确的版本号|
范围| `>=1.0` `>=1.0,>2.0` `>=1.0,>1.1`&#124;`>=1.2`| 通过运算符指定有效版本范围可以是自动多个范围用逗号隔开，将被视作 ADN 处理。管道符号&#124;将被视为OR 处理
通配符|`1.0.*` | 使用同配置指定
赋值运算符| `~1.2`| 对于遵循语义化版本号的项目非常有用。`~1.2`相当于`>=1.2,<2.0`

#### 5. 稳定性

默认情况下只有稳定的发行版本才会被包含。如果你想要获取 RC, beta, alpha or dev 版本，你可以使用[稳定标志](https://getcomposer.org/doc/04-schema.md#package-links)。你可以对所有的包做[最小稳定性](https://getcomposer.org/doc/04-schema.md#minimum-stability)设置，而不需逐个设置。

#### 6. 安装依赖包

`composer install` 会按照`composer.json` 文件中指明的依赖进行安装，该命令还会创建一个`composer.lock` 文件到你的项目根目录中。

#### 7. 锁文件 `composer.lock` 

在安装依赖后，`Composer`将把安装时确切的版本号列表写入`composer.lock` 文件。这将锁定该项目的特定版本。

`请把 composer.lock 和 composer.json 加入到你的版本控制中`

这是非常重要的，因为`install` 命令将会监测锁文件是否存在，如果存在，它将下载指定的版本(忽略`composer.json` 文件中的定义)

这意味着，任何人建立项目都将下载与指定版本完全相同的依赖。你的持续集成服务器、生产环境、你团队中的其他开发人员、每件事、每个人都使用相同的依赖，从而减轻潜在的错误对部署的影响。即使你独自开发项目，在六个月内重新安装项目时，你也可以放心的继续工作，即使从那时起你的依赖已经发布了许多新的版本。

如果不存在 `composer.lock` 文件，`Composer` 将读取 `composer.json` 并创建锁文件。

这意味着如果你的依赖更新了新的版本，你将不会获得任何更新。此时要更新你的依赖版本请使用 update 命令。这将获取最新匹配的版本（根据你的 composer.json 文件）并将新版本更新进锁文件。


#### 8. Packagist

[packagist](https://packagist.org/)是 `Composer`的主要资源库。一个`Composer` 的库基本上是一个包的源。`Packageist` 的目标是成为大家使用库资源的中央存储平台。这意味着你可以`require` 哪里的任何包。


#### 9. 自动加载
 
对于库的自动加载信息，`Composer` 生成了一个`vendor/autoload.php` 文件。引用这个文件得到自动加载的支持。

```php
require 'vendor/autoload.php';
```

这使得你可以很容易的使用第三方代码。例如：如果你的项目依赖 monolog，你就可以像这样开始使用这个类库，并且他们将被自动加载。

```php
$log = new Monolog\Logger('name');
$log->pushHandler(new Monolog\Handler\StreamHandler('app.log', Monolog\Logger::WARNING));

$Log->addWarning('Foo');
```

你可以在`composer.json` 的`autoload` 字段中增加自己的`autoloader`。

```json
{
    "autoload": {
        "psr-4": {"Acme\\": "src/"}
    }
}
```

`Composer` 将注册一个`PSR-4` autoloader 到`Acme` 命名空间。

你可以定义一个从命名空间到目录的映射。此时 `src` 会在你项目的根目录，与 `vendor` 文件夹同级。例如 `src/Foo.php` 文件应该包含 `Acme\Foo` 类。

添加`autoload` 字段后，你应该再次运行`install` 命令来生成`vendor/autoload.php` 文件。

引用这个文件也将返回 autoloader 的实例，你可以将包含调用的返回值存储在变量中，并添加更多的命名空间。这对于在一个测试套件中自动加载类文件是非常有用的，例如。

```php
$loader = reuqire_once('vendor/autoload.php');
$loader->add('Acme\\Test\\', __DIR__);
```

`注意：` `Composer` 提供了自己的 `autoloader`。如果你不想使用它，你可以仅仅引入 `vendor/composer/autoload_*.php` 文件，它返回一个关联数组，你可以通过这个关联数组配置自己的 `autoloader`。

## ④  库 (资源包)

### 1. 每一个项目都是一个包

只要你有一个 `composer.json` 文件在目录中，那么整个目录就是一个包。当你添加一个 `require` 到项目中，你就是在创建一个依赖于其它库的包。你的项目和库之间唯一的区别是，你的项目是一个没有名字的包。

为了使它成为一个可安装的包，你需要给它一个名称。你可以通过 `composer.json` 中的 `name` 来定义：

```json
{
    "name": "acme/hello-world",
    "require" : {
        "monolog/monolog": "1.0.*"
    }
}
```

在这种情况下项目的名称为`acme/hello-world`,其中`acme` 是供应商的名称。报名不区分大小写，但是管理是使用小写字母，并用连接符作为单词的分割。

### 2. 平台软件包

`Composer` 将那些已经安装在系统上，但并不是由`Composer` 安装的包视为一个虚拟的平台软件包。这包括`PHP`本身,`PHP`扩展和一些系统库。

- `php` 表示用户的`PHP`版本要求，你可以对其作出限制。例如`>=5.4.0`。如果需要64位版本的 PHP，你可以使用`php-64bit` 进行限制。
- `hhvm` 代表的是 HHVM（也就是 HipHop Virtual Machine） 运行唤醒的版本，并且允许你设置一个版本限制，eg. `>=2.3.3`
- `ext-<name>` 可以帮你指定需要的 PHP 扩展（包括核心扩展）。通常 PHP 拓展的版本可以是不一致的，将它们的版本约束为 `*` 是一个不错的主意。一个 PHP 扩展包的例子：包名可以写成 `ext-gd` 
- `lib-<name>` 允许对 PHP 库的版本进行限制。
    
    以下是可供使用的名称：curl、iconv、icu、libxml、openssl、pcre、uuid、xsl

你可以使用 `composer show --platform` 命令来获取可用的平台软件包的列表。

### 3. 指明版本

你需要一些方法来指明自己开发的包的版本，当你在 `Packagist` 上发布自己的包，它能够从 `VCS (git, svn, hg)` 的信息推断出包的版本，因此你不必手动指明版本号，并且也不建议这样做。请查看[标签](http://docs.phpcomposer.com/02-libraries.html#Tags) 和 [分支](http://docs.phpcomposer.com/02-libraries.html#Branches) 来了解版本号是如何被提取的。

如果你想要手动创建并且真的要明确指定它，你只需要添加一个 `version` 字段:

```json
{
    "version": "1.0.0"
}

// 注意： 应该尽量避免手动设置版本号，因为标签的值必须与标签名相匹配。
```

#### 标签

对于每一个看起来像版本号的标签，都会相应的创建一个包的版本。它应该符合 'X.Y.Z' 或者 'vX.Y.Z' 的形式，`-patch`、`-alpha`、`-beta` 或 `-RC` 这些后缀是可选的。在后缀之后也可以再跟上一个数字。

下面是有效的标签名称的几个例子：

```json
1.0.0
v1.0.0
v.10.5-RC1
v4.4.4beta2
v2.0.0-alpha
v2.0.4-p1
```

`注意：`即使你的标签带有前缀`V`，由于需要`require` 一个版本的约束时不需要前缀的，因此`V`将被忽略（eg. `V1.0.0`将创建`1.0.0`版本）。

#### 分支

对于每一个分支，都会相应的创建一个包的开发版本。如果分支名看起来像一个版本号，那么将创建一个如同`{分支名}-dev`。例如一个分支`2.0`将产生一个`2.0.x-dev` 包版本(加入了`.x`是出于技术的原因，以确保它被识别为一个分支，而`2.0.x` 的分支名称也是允许的，它同样会转换为`2.0.x-dev`)。如果分支名看起来不像一个版本号，它将会创建`dev-{分支名}`形式的版本号。例如`master` 将产生一个`dev-master` 的版本号。

下面是版本分支名称的一些示例：
```
1.x
1.0(equals 1.0.x)
1.1.x
```

`注意：`当你安装一个新的版本时，将会自动从`source` 中拉取。

#### 别名

它表示一个包版本的别名。例如，你可以为 `dev-master` 设置别名 `1.0.x-dev`，这样就可以通过 `require 1.0.x-dev` 来得到 `dev-master` 版本的包。

详细请查看[别名](http://docs.phpcomposer.com/articles/aliases.html)

### 4. 锁文件

如果你愿意，可以在你的项目中提交 `composer.lock` 文件。他将帮助你的团队始终针对同一个依赖版本进行测试。任何时候，这个锁文件都只对于你的项目产生影响。

如果你不想提交锁文件，并且你正在使用 Git，那么请将它添加到 .gitignore 文件中。

### 5. 发布到 VCS/Git

一旦你有一个包含`composer.json`文件的库存储在线上版本控制系统（例如:Git）你的库就可以被`Composer` 所安装。在这个例子中，我盟将`acme/hello-world` 库发布到 `GitHub` 上的`github.com/username/hello-world` 中。

现在测试这个`acme/hello-world`包，我们在本地创建一个新的项目。命名为`acme/blog`。此博客依赖`acme/hello-world`，而后者又依赖`monolog/monolog`。我们可以在某处创建一个新的`blog` 文件夹完成，并且需要包含`composer.json` 文件:

```json
{
    "name": "acme/hello-world",
    "require": {
        "acme/hello-world": "dev-master"
    }
}
```

在这个例子中`name` 不是必须的，因为我们并不想将它发布为一个库。在这里为`composer.json` 文件添加描述。

现在我们需要告诉我们的应用，在哪里可以找到`hello-world` 的依赖。为此我们需要在`composer.json` 中添加`repositories` 来源声明：

```json
{
    "name": "acme/hello-world",
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/username/hello-world"
        }
    ],
    "require": {
        "acme/hello-world": "dev-master"
    }
}
```

这就是全部了。你现在可以使用`Composer` 的 `install` 命令来安装你的依赖包了！

`小结` 任何含有`composer.json`的`Git`、`SVN`、`HG` 存储库，都可以通过`require` 字段指定"包来源" 和"声明依赖"来添加到你的项目中。


### 6. 发布到 packagist

关于如何使用`Github`、`Composer`、`Packagist` 管理公开的`PHP` 包 [请参考](https://rivsen.github.io/post/how-to-publish-package-to-packagist-using-github-and-composer-step-by-step)

具体步骤可以分为以下几步:

1. 在`Github`创建一个`hello-wolrd`项目，`git@github.com:pemako/hello-world.git`
2. `git clone git@github.com:pemako/hello-world.git` 到本地
3. 使用`composer init` 进行创建`composer.json` 文件，添加`readme.md` 文件
4. `git add --all; git commit -m'init hello-world'； git push origin master`
5. 使用`GitHub`登陆`https://packagist.org` 点击最上面导航的`Submit`按钮
6. 在`Repository URL (Git/Svn/Hg)` 下面的输入框中填写具体的`Git`地址，点击`check` 然后`submit` 即可完成发布

## ⑤  命令行

要时常更新`composer` 命令，所有的命令具体使用可以通过`composer 命令 -h` 进行查看


## ⑥  `composer.json` 架构
