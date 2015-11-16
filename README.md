# Fedis

Front-End development integration solution
前端开发集成解决方案

version:1.0.0

## 概述

fedis 是一个基于 gulp/gulp-plugins 的前端开发集成解决方案。fedis 定义了一系列任务，这些自动执行的任务可以把你从繁杂无聊的复制、粘贴、压缩、重命名等事务中解脱出来，从而更专注于具体业务的开发实现。

## 特性

集成了常用任务，后期会增加更多功能：

功能 | 描述
---- | ---- 
server | 本地 http 服务
browsersync | 多浏览器多屏幕同步测试
sass | 文件编译
concat | 文件合并 
minify | 压缩文件
test  | 代码测试 （未实现）

## 安装 fedis
1、获取 fedis 软件包，进入 fedis 目录执行安装命令
```
git clone https://github.com/Leonkao/fedis.git
cd fedis
npm install
```

2、通过 npm 直接安装
```
npm install fedis
```
由于网络问题安装过程会持续一段时间，请耐心等候。

## 常见问题

1. 安装 node-sass/gulp-sass 失败
   原因：是无法连接亚马逊云服务器下载二进制文件
   
2. 安装 browser-sync 失败
   原因：客户端不具备编译环境，visualstudio

解决方案

下载 node_modules.7z 后解压至 fedis/node_modules 目录下，尝试重新 npm install

[node_modules.7z](http://files.cnblogs.com/files/kelsen/node_modules.7z)

下面列出了 node_modules.7z 中已安装好的软件包，下载 fedis 后你可以在  fedis/node_modules 中看到它们。随着这些软件包的更新 fedis 也会跟着更新，所以你安装的最新版本的 fedis 中的下列软件包可能不是最新的，如果需要最使用它们的新特性你需要自行升级相关软件包。
* node-sass    3.4.2
* libsass      3.3.2@C++
* browser-sync 2.10.0
* browsersync-ssi 0.2.4

## 鸣谢
fedis 用到了很多开源软件包，没有这些开源项目就没要fedis，在此对相关开源团队表示由衷的感谢！

## LICENSE

The MIT License (MIT)
Copyright (c) 2015 Leon kao