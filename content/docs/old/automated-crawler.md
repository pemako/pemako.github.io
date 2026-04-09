---
date: '2026-04-09T20:00:00+08:00'
title: '自动化爬虫'
description: ""
summary: ""
tags: ["python", "crawler"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---

## [docker-selenium](https://github.com/SeleniumHQ/docker-selenium)
#### 启动 
`docker run -d -p 4444:4444 -p 7900:7900 --shm-size="2g" selenium/standalone-chromium:latest`

- 暴露 4444 和 7900 端口
	- **4444 是** Selenium WebDriver HTTP API
	- 7900 vpc 端口 
		- 默认的密码是 `secret`
- 启动浏览器 使用下面的浏览器就可以直接启动一个 chrome 在 VNC 中显示

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--start-maximized")

driver = webdriver.Remote(
    command_executor="http://localhost:4444",
    options=options
)

driver.get("https://www.google.com")
```



## chromedp 

## AdsPowser

## Profiles 

## 无GUI的服务器如何启动 chrome 登录

- 机器上安装如下 最后主要是通过 noVNC 访问
```sh
#!/usr/bin/env bash
set -e

sudo apt update

sudo apt install -y \
  xvfb \
  x11vnc \
  xauth \
  x11-utils \
  chromium-browser \
  dbus-x11 \
  git \
  python3 \
  python3-websockify \
  fonts-liberation \
  libnss3 \
  libgbm1 \
  libgtk-3-0 \
  libxrandr2 \
  libxdamage1 \
  libdrm2 \
  psmisc \
  procps \
  net-tools \
  curl \
  wget

if [ ! -d /opt/noVNC ]; then
  sudo git clone https://github.com/novnc/noVNC.git /opt/noVNC
fi

sudo mkdir -p /data/chrome/profile1
sudo chown -R "$USER:$USER" /data/chrome
```

- 控制启停脚本
```sh
#!/usr/bin/env bash
set -e

########################
# ENV
########################

BASE_DIR=$(cd "$(dirname "$0")" && pwd)

# === 基础路径 ===
PID_DIR="$BASE_DIR/pids"
LOG_DIR="$BASE_DIR/logs"

mkdir -p "$PID_DIR" "$LOG_DIR"

# === 显示 & 网络 ===
export DISPLAY=:99
SCREEN_RESOLUTION="1280x800x24"
VNC_PORT=5900
NOVNC_PORT=6080

# === Chrome ===
CHROME_BIN=/usr/bin/chromium-browser
CHROME_PROFILE_DIR=$HOME/Work/chrome/profiles/pemako

# === noVNC ===
NOVNC_DIR=$HOME/Work/noVNC


########################
# 工具函数
########################

is_running() {
  local pidfile=$1
  [ -f "$pidfile" ] && kill -0 "$(cat "$pidfile")" 2>/dev/null
}

start_bg() {
  local name=$1
  local pidfile=$2
  shift 2

  if is_running "$pidfile"; then
    echo "[$name] already running"
    return
  fi

  echo "[$name] starting..."
  "$@" &
  echo $! >"$pidfile"
}

stop_bg() {
  local name=$1
  local pidfile=$2

  if is_running "$pidfile"; then
    kill "$(cat "$pidfile")" && rm -f "$pidfile"
    echo "[$name] stopped"
  else
    echo "[$name] not running"
  fi
}

status_bg() {
  local name=$1
  local pidfile=$2

  if is_running "$pidfile"; then
    echo "[$name] running (pid $(cat "$pidfile"))"
  else
    echo "[$name] stopped"
  fi
}

########################
# Xvfb
########################

xvfb_start() {
  start_bg "xvfb" "$PID_DIR/xvfb.pid" \
    Xvfb "$DISPLAY" -screen 0 "$SCREEN_RESOLUTION" \
      >"$LOG_DIR/xvfb.log" 2>&1
}

xvfb_stop() {
  stop_bg "xvfb" "$PID_DIR/xvfb.pid"
}

xvfb_status() {
  status_bg "xvfb" "$PID_DIR/xvfb.pid"
}

########################
# Chrome
########################

chrome_start() {
  mkdir -p "$CHROME_PROFILE_DIR"

  start_bg "chrome" "$PID_DIR/chrome.pid" \
    env DISPLAY="$DISPLAY" \
    "$CHROME_BIN" \
      --user-data-dir="$CHROME_PROFILE_DIR" \
      --no-sandbox \
      --disable-dev-shm-usage \
      >"$LOG_DIR/chrome.log" 2>&1
}

chrome_stop() {
  stop_bg "chrome" "$PID_DIR/chrome.pid"
}

chrome_status() {
  status_bg "chrome" "$PID_DIR/chrome.pid"
}

########################
# x11vnc
########################

x11vnc_start() {
  start_bg "x11vnc" "$PID_DIR/x11vnc.pid" \
    x11vnc \
      -display "$DISPLAY" \
      -rfbport "$VNC_PORT" \
      -forever \
      -shared \
      -nopw \
      >"$LOG_DIR/x11vnc.log" 2>&1
}

x11vnc_stop() {
  stop_bg "x11vnc" "$PID_DIR/x11vnc.pid"
}

x11vnc_status() {
  status_bg "x11vnc" "$PID_DIR/x11vnc.pid"
}

########################
# noVNC
########################

novnc_start() {
  start_bg "novnc" "$PID_DIR/novnc.pid" \
    "$NOVNC_DIR/utils/novnc_proxy" \
      --vnc "localhost:$VNC_PORT" \
      --listen "$NOVNC_PORT" \
      >"$LOG_DIR/novnc.log" 2>&1
}

novnc_stop() {
  stop_bg "novnc" "$PID_DIR/novnc.pid"
}

novnc_status() {
  status_bg "novnc" "$PID_DIR/novnc.pid"
}

########################
# 总控
########################

start_all() {
  xvfb_start
  sleep 1
  chrome_start
  sleep 1
  x11vnc_start
  sleep 1
  novnc_start
}

stop_all() {
  novnc_stop
  x11vnc_stop
  chrome_stop
  xvfb_stop
}

status_all() {
  xvfb_status
  chrome_status
  x11vnc_status
  novnc_status
}

########################
# CLI
########################

case "$1" in
  start)
    start_all
    ;;
  stop)
    stop_all
    ;;
  status)
    status_all
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
esac

```