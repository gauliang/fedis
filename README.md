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
SSI         | Server Side Include

## 安装 fedis

安装过程可能会持续一段时间，请耐心等候。

安装方式一：
``` bash
$ git clone https://github.com/gauliang/fedis.git

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

#### 配置

Fedis 根目录中有一个名为 projectInfo 的文件，该文件存储了fedis的配置信息，说明如下：

配置项  | 取值 | 说明
--- | --- | --- | 
language | `cn`或`en` | Tmaker 预览时使用何种语言, `cn` 为中文, `en` 为英文 |
minifyCss | 布尔值 | 是否对输出的 CSS 进行压缩 |
minifyJs | 布尔值 | 是否对输出的 JS 进行压缩 |
hashVersion | 布尔值 | 是否在输出的附件引用末端添加 hash |


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
由于网络原因安装过程中极有可能出现下列问题，在后面给出了解决方案。可以使用 `cnpm` 命令进行安装。


## 鸣谢
fedis 用到了很多开源软件，没有这些开源项目就没有fedis，在此对相关开源团队表示由衷的感谢！

## LICENSE

The MIT License (MIT)

Copyright (c) 2017 Gaoliang