# macOS 安装包构建

Apple Silicon，macOS 15+。Swift 启动器打开默认浏览器的 127.0.0.1:4180，内置 Node 与原生 Word/钥匙串组件，无 Python 运行依赖。

## 构建

需要 macOS、Xcode Command Line Tools、Python 3（仅构建使用）、/usr/local/bin/node（含 arm64）。仓库根目录需有 local/ 与 LICENSE。内置的 NODE-LICENSE.txt 对应 Node v26.13.0；换用其他 Node 版本时同步官方许可证。

在仓库根目录运行：

```sh
python3 macos-package/build.py
python3 macos-package/package-dmg.py
```

打包使用保留权限的文件复制，并检查挂载后可执行位、签名及内置 Node。程序为 ad-hoc 签名，未经过 Developer ID 签名或 Apple 公证。

## 数据与运行方式

首次启动可以复制所选旧项目的 .local-data 到 ~/Library/Application Support/CloseRead/data；原文件不删除。笔记、生词、阅读位置仍在浏览器，需沿用原浏览器和地址。旧服务运行时会打开现有服务并提示先关闭旧程序。关闭网页不停止服务，退出 CloseRead 才停止安装版启动的服务。

运行检查包括页面/API 无密钥访问、DOCX 提取与损坏文件拒绝；没有包含私人文章或密钥，不声称跨机器全面测试。
