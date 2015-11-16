# Fedis

Front-End development integration solution
前端开发集成解决方案

version:1.0.0

# 概述

fedis 是一个基于 gulp/gulp-plugins 的前端开发集成解决方案。fedis 定义了一系列任务，这些自动执行的任务可以把你从繁杂无聊的复制、粘贴、压缩、重命名等事务中解脱出来，从而更专注于具体业务的开发实现。

# 特性

集成了常用任务，后期会增加更多功能：

功能 | 描述
---- | ---- 
server | 本地 http 服务
browsersync | 多浏览器多屏幕同步测试
sass | 文件编译
concat | 文件合并 
minify | 压缩文件
test  | 代码测试 （未实现）

# 为什么使用 fedis

1. 集成了很多常用任务，且使用简单。
2. 解决由于网络原因导致的无法直接通过 npm install 安装 node-sass 的问题。
3. 解决某些 package 在安装过程中需要客户端具备相关的编译软件的问题。比如安装时需要客户端具备 visualstudio 开发环境，而大部分的前端开发人员并不具备这个条件。

# 安装 fedis
1. 获取 fedis 软件包
```
git clone https://github.com/Leonkao/fedis.git
```
2. 进入 fedis 目录执行安装命令
```
npm install
```
或者通过 npm 直接安装
```
npm install fedis
```
由于网络问题安装过程会持续一段时间，请耐心等候。

# 内置的软件包
下面列出的软件包已在 fedis 中安装好，下载 fedis 后你可以在  fedis/node_modules 中看到它们。随着这些软件包的更新 fedis 也会跟着更新，所以你安装的最新版本的 fedis 中的下列软件包可能不是最新的，如果需要最使用它们的新特性你需要自行升级相关软件包。
* node-sass    3.4.2
* libsass      3.3.2
* browser-sync 2.10.0
* browsersync-ssi 0.2.4

# 鸣谢
fedis 用到了很多开源软件包，没有这些开源项目就没要fedis，在此对相关开源团队表示由衷的感谢！

# 协议
MIT 开源协议发布
