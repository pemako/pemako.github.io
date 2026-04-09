---
date: '2026-04-09T20:00:00+08:00'
title: 'XAPK 转 APK 安装'
description: ""
summary: ""
tags: ["android"]
categories: ["android"]
series: ["Android"]
ShowToc: true
TocOpen: true
---

# XAPK 转 APK 安装到 Android 手机

> XAPK 是包含主 APK 和 Split APK（语言包、架构包等）的压缩包格式，不能直接用 `adb install` 安装，需要解压后用 `adb install-multiple` 安装。

---

## 前置条件

- macOS 已安装 `adb`（Android Debug Bridge）
- 手机开启**开发者模式**并启用 **USB 调试**
- 手机通过 USB 连接电脑

---

## 步骤一：确认设备已连接

```bash
adb devices
```

输出示例：

```
List of devices attached
MPX0223213001305    device
```

> 若显示 `unauthorized`，在手机上弹出的「允许 USB 调试」对话框点击**允许**（建议勾选「始终允许」）。

---

## 步骤二：解压 XAPK

XAPK 本质是 ZIP 文件，直接解压即可：

```bash
mkdir -p /tmp/xapk_extracted
cd /tmp/xapk_extracted
unzip /path/to/your.xapk -d extracted/
```

解压后结构示例：

```
extracted/
├── com.example.app.apk          # 主 APK
├── config.armeabi_v7a.apk       # 架构包
├── config.zh.apk                # 中文语言包
├── config.en.apk                # 英文语言包
├── config.mdpi.apk              # 屏幕密度包
├── manifest.json
└── icon.png
```

---

## 步骤三：确认手机架构

```bash
adb shell getprop ro.product.cpu.abi
```

常见输出：
- `arm64-v8a`：现代 64 位 ARM（兼容 armeabi_v7a 包）
- `x86_64`：模拟器常用

---

## 步骤四：安装 Split APK

使用 `adb install-multiple` 将主 APK 和所需的 config APK 一起安装：

```bash
cd /tmp/xapk_extracted/extracted
adb install-multiple \
  com.example.app.apk \
  config.armeabi_v7a.apk \
  config.zh.apk \
  config.en.apk \
  config.mdpi.apk
```

输出 `Success` 即安装成功。

---

## Config APK 选择建议

| 类型 | 文件名示例 | 说明 |
|------|-----------|------|
| 主包 | `com.xxx.apk` | 必选 |
| 架构 | `config.armeabi_v7a.apk` | 按手机架构选，arm64 可用 armeabi_v7a |
| 语言 | `config.zh.apk`、`config.en.apk` | 按需选择 |
| 屏幕 | `config.mdpi.apk`、`config.xhdpi.apk` | 按屏幕密度选，不确定可都装 |

---

## 完整示例（GitSync 1.8.38）

```bash
# 1. 解压 XAPK
mkdir -p /tmp/gitsync_xapk
unzip GitSync_1.8.38_apkcombo.com.xapk -d /tmp/gitsync_xapk/extracted/

# 2. 确认设备
adb devices

# 3. 查看手机架构
adb shell getprop ro.product.cpu.abi   # 输出: arm64-v8a

# 4. 安装
cd /tmp/gitsync_xapk/extracted
adb install-multiple \
  com.viscouspot.gitsync.apk \
  config.armeabi_v7a.apk \
  config.zh.apk \
  config.en.apk \
  config.mdpi.apk

# 5. 清理临时文件
rm -rf /tmp/gitsync_xapk
```

---

## 常见问题

**Q: 为什么不能直接 `adb install xxx.xapk`？**  
A: `adb install` 只支持单个 APK，XAPK 是包含多个 split APK 的压缩包，必须用 `adb install-multiple`。

**Q: 所有 config APK 都需要安装吗？**  
A: 不需要。建议只装：主包 + 对应架构包 + 需要的语言包 + 屏幕密度包。装多了不影响功能但会占用更多空间。

**Q: 提示 `INSTALL_FAILED_INVALID_APK`？**  
A: 检查是否漏装了必要的 config APK，或者架构包不匹配。