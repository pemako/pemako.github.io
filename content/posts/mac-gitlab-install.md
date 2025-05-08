---
date: '2025-05-09T01:59:28+08:00'
draft: false
title: 'Install Gitlab'
---

- 展示下启动完成后的效果
![gitlab](/images/gitlab.png)

- 依赖 `docker` 环境
- `.env` 文件

```env
GITLAB_HOST_IP=192.168.1.8
GITLAB_PORT=8929
GITLAB_ROOT=/Users/mako/gitlab
GITLAB_WEB_URL=192.168.1.8:8929
GITLAB_SHELL_SSH_PORT=2224
```

- 使用 `docker compose` 进行安装

```yaml
# yaml-language-server: $schema=https://cdn.jsdelivr.net/gh/compose-spec/compose-spec@master/schema/compose-spec.json
services:
  web:
    image: gitlab/gitlab-ce:latest
    restart: always
    container_name: gitlab
    hostname: gitlab
    environment:
      GITLAB_OMNIBUS_CONFIG: |
        external_url 'http://${GITLAB_HOST_IP}:${GITLAB_PORT}'
        gitlab_rails['gitlab_shell_ssh_port'] = ${GITLAB_SHELL_SSH_PORT}
    ports:
      - ${GITLAB_PORT}:${GITLAB_PORT}
      - ${GITLAB_SHELL_SSH_PORT}:22
    volumes:
      - ${GITLAB_ROOT}/config:/etc/gitlab
      - ${GITLAB_ROOT}/logs:/var/log/gitlab
      - ${GITLAB_ROOT}/data:/var/opt/gitlab
    shm_size: 256m
  runner:
    image: gitlab/gitlab-runner:latest
    container_name: gitlab-runner
    restart: always
    volumes:
      - ${GITLAB_ROOT}/runner/config:/etc/gitlab-runner
      - ${GITLAB_ROOT}/runner/docker.sock:/var/run/docker.sock
```

- 控制脚本 `control.sh` 进行自动更新 `.env`及启停

> 在不同网络下本机的 IP 地址变更，只需要 ./control.sh restart 即可，脚本中会自动重新配置 .env 内容

```shell
#!/bin/bash

set -euo pipefail

# 获取 en0 网卡的本机 IP 地址
GITLAB_HOST_IP=$(ipconfig getifaddr en0 || true)
GITLAB_PORT=8929
GITLAB_SHELL_SSH_PORT=2224
EXTERNAL_URL="http://${GITLAB_HOST_IP}:${GITLAB_PORT}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"


init() {
 if [ -z "$GITLAB_HOST_IP" ]; then
  echo "❌ Failed to detect IP on interface en0"
  exit 1
 fi

 echo "✅ Detected IP: ${GITLAB_HOST_IP}"
 echo "🌍 Using external URL: ${EXTERNAL_URL}"
 echo "📁 PROJECT_ROOT: ${PROJECT_ROOT}"

 env_tmp="${PROJECT_ROOT}/.env.tmp"
 cat >"$env_tmp" <<EOF
GITLAB_HOST_IP=${GITLAB_HOST_IP}
GITLAB_PORT=${GITLAB_PORT}
GITLAB_ROOT=${PROJECT_ROOT}
GITLAB_WEB_URL=${GITLAB_HOST_IP}:${GITLAB_PORT}
GITLAB_SHELL_SSH_PORT=${GITLAB_SHELL_SSH_PORT}
EOF
 mv "$env_tmp" "${PROJECT_ROOT}/.env"

 # runner 配置路径
 RUNNER_CONFIG_PATH="${PROJECT_ROOT}/runner/config/config.toml"

 # 兼容 sed（macOS 和 Linux）
 if [[ "$OSTYPE" == "darwin"* ]]; then
  SED_INPLACE="sed -i ''"
 else
  SED_INPLACE="sed -i"
 fi

 if [ -f "$RUNNER_CONFIG_PATH" ]; then
  echo "🔧 Updating runner config.toml with new URL: $EXTERNAL_URL"
  $SED_INPLACE "s|url = \".*\"|url = \"${EXTERNAL_URL}\"|" "$RUNNER_CONFIG_PATH"
 else
  echo "⚠️  Runner config.toml not found at $RUNNER_CONFIG_PATH"
 fi
}

help() {
 echo "Usage: $0 {start|stop|restart|status|log}"
}

web() {
 echo "🌐 Web URL: http://${GITLAB_HOST_IP}:${GITLAB_PORT}"
}

main() {
 local cmd="${1:-}"
 case $cmd in
 start)
  init
  docker-compose up -d
  ;;
 stop)
  init
  docker-compose down
  ;;
 restart)
  init
  docker-compose down
  docker-compose up -d
  ;;
 status)
  init
  docker-compose ps
  ;;
 log)
  docker-compose logs -f
  ;;
 *)
  web
  help
  ;;
 esac
}

main "$@"
```

- 绑定 `/etc/hosts` 指定域名, 执行脚本，存在更新不存在新增

> 修改 `control.sh` 脚本中的 `GITLAB_HOST_IP` 为上面绑定的域名 `web.gitlab.local`，则后续可以直接使用该域名:port 进行访问

```shell
mk::util::gitlab () {
  HOSTNAME="web.gitlab.local" # 需要绑定的域名
  HOSTS_FILE="/etc/hosts"

  # 获取本机局域网 IP（排除 127.* 和 docker 虚拟网卡）
  CURRENT_IP=$(ipconfig getifaddr en0 2>/dev/null || hostname -I | awk '{print $1}')

  if [[ -z "$CURRENT_IP" ]]; then
    echo "无法获取当前 IP 地址"
    exit 1
  fi

  echo "当前 IP: $CURRENT_IP"

  # 检查是否已经存在该主机名
  if grep -q "[[:space:]]$HOSTNAME\$" "$HOSTS_FILE"; then
    # 如果已存在，则更新对应的 IP
    sudo sed -i '' "/[[:space:]]$HOSTNAME$/c\\
$CURRENT_IP $HOSTNAME
" "$HOSTS_FILE"
    echo "✅ 已更新 $HOSTNAME -> $CURRENT_IP"
  else
    # 如果不存在，则添加新行
    echo "$CURRENT_IP $HOSTNAME" | sudo tee -a "$HOSTS_FILE" > /dev/null
    echo "✅ 新增 $HOSTNAME -> $CURRENT_IP"
  fi
}

mk::util::gitlab
```
