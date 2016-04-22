# Fedis

Front-End development integration solution
前端开发集成解决方案

## 概述

fedis 是一个基于 gulp/gulp-plugins 的前端开发集成解决方案。
让你从繁杂无聊的复制、粘贴、压缩、重命名等事务中解脱出来，从而更专注于具体业务的开发实现。

## 特性

集成了常用任务，后期会增加更多功能：

功能  |  描述
---- | ---- 
tmaker		| 模板中间语言解释引擎
doc         | 文档生成
switch      | 项目管理
publish		| 发布项目 
test  		| 测试

## 安装 fedis

安装过程可能会持续一段时间，请耐心等候。

安装方式一：
``` bash
$ git clone https://github.com/Leonkao/fedis.git

$ cd fedis

$ npm install

$ gulp
```

安装方式二：
```
npm install fedis
```

## 如何使用
* 进入 fedis/ 目录
* 新建项目 `gulp --switch project-name`
* 执行 gulp 命令启动 fedis
* 进入 fedis/app/ 开始工作

#### 提醒
* 模板文件 (html) 中引用的预览附件请存放在 `./app/data/` 中
* CSS 中引用的附件请存放在 `./app/scss/` 目录下即可

#### 显示/存档/新建/切换 项目
* `$gulp --show` 显示全部已存档和当前工作项目。
* `$gulp --archive` 存档当前工作项目。
* `$gulp --switch project-name` 切换至 `project-name` 项目，如果 `project-name` 项目不存在则会新建。

#### 修改默认项目模板
每次切换到一个新的不存在的项目时都会创建一个新的项目，新项目内容在 archive/_init 目录中，修改这些文件即可

#### 发布项目
`publish` 任务用以发布当前工作项目到 release 目录。该过程会把项目转换为线上状态。
还可以通过 `--param` 来更新版本号，语义请参考 [semver](https://docs.npmjs.com/misc/semver)
```
$gulp publish --<major|minor|patch>
```
 
## 常见问题
由于网络原因安装过程中极有可能出现下列问题，在后面给出了解决方案。

* 安装 node-sass/gulp-sass 失败
   原因：是无法连接亚马逊云服务器下载二进制文件
   
* 安装 browser-sync 失败
   原因：客户端不具备编译环境，visualstudio

#### 解决方案

1. 下载 [node_modules.7z](http://files.cnblogs.com/files/kelsen/node_modules.7z)
2. 解压 node_modules.7z 到 fedis/node_modules 目录下（fedis/node_modules 下含4个文件夹）
3. 重新尝试 npm install

我们已将这相关软件包安装包并打包在 node_modules.7z 中，解压后你可以在 fedis/node_modules 中找到它们。随着这些软件包的更新 fedis 也会跟着更新，所以你安装的最新版本的 fedis 中的下列软件包可能不是最新的，如果需要最使用它们的新特性你需要自行升级相关软件包。
* node-sass    3.4.2
* libsass      3.3.2@C++
* browser-sync 2.10.0
* browsersync-ssi 0.2.4


## 鸣谢
fedis 用到了很多开源软件，没有这些开源项目就没有fedis，在此对相关开源团队表示由衷的感谢！

## LICENSE

The MIT License (MIT)

Copyright (c) 2016 Gaoliang