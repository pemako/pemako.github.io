---
layout: post
title: Linux实现自动登陆远程机器
description: 'linux, 自动登陆'
tags:
  - linux
category: linux
---

# 2017-01-24-linux-autologin

在 Linux 下进行远程登陆的时候，总是要进行 ssh 输入账号，密码等操作，比较繁琐。 而且在工作中总是会先登陆到公司的中间机器\(跳板机\)然后才能登陆线上的机器，每次操作更加繁琐。 写了一个通过配置可以免输密码，直接到达指定机器并执行相应的指令。理论上可以配置 N 个中间机器。 [autologin Git源码](https://github.com/pemako/LearnShell/blob/master/lib/autologin)

`注意：使用时 Bash version >= 4.0 ,应为配置中需要使用关联数组`

`在第一次使用的时候需要输入密码，后续就可以直接 运行 autologin 机器名登陆`

`全局使用 mv autologin /usr/local/bin/to(改为自己任意想要的名字) 进行全局使用`

废话不说上代码

```bash
#!/usr/local/bin/bash
# @Version 0.3.1
# @filename to
# 修复等不需要要配置跳板机的时候执行命令，在配置跳板机位置默认填 no 即可
# @Author pemakoa@gmail.com
# Bash version >= 4.0 使用关联数组

# Usage: host user passwd port jump_host command 
# 四种情况如下：
# 1. 直接登录目标机器 如 A 
# 2. 需要中间机器登陆到目标机器 如 C， 其中 B 为中间机器，会先登录 B在从 B登陆到 C然后执行 command
# 3. 直接登录目标机器并执行相应的命令 如 D

declare -A _server_config

_server_config['A']="a_host a_user a_passwd a_port"
_server_config['B']="b_host b_user b_passwd b_port"
_server_config['C']="c_host c_user c_passwd c_port B '(command eg) ls .'"
_server_config['D']="d_host d_user d_passwd d_port no 'cd /home && ll'"

_config_keys=(${!_server_config[@]})
_length=${#_server_config[@]}
_login_server=$1
_config_status=false

# 是否输入登陆机器
if [ "$_login_server" == "" ];then
    echo -e "\033[40m\033[31m Please input login server, you can choose one follows list \033[0m"
    for i in "${_config_keys[@]}";do
        echo -e "\033[41;37m $i \033[0m "
    done
    exit
fi

# 检查登陆的机器是否配置
for i in "${_config_keys[@]}";do
    if [ "$_login_server" == "$i" ];then
        _config_status=true
    fi
done

if [ "${_config_status}" == "false" ];then
    echo -ne "\033[40m\033[31m
        Not config server info ...
        Please config in _server_config like
        Host User Passwd Port Jump Command\033[0m"
    exit
fi

# 登陆 如果配置跳板机，先登陆跳板机在登陆到目标机器
_host=$(echo ${_server_config["${_login_server}"]} | awk '{print $1}')
_user=$(echo ${_server_config["${_login_server}"]} | awk '{print $2}')
_passwd=$(echo ${_server_config["${_login_server}"]} | awk '{print $3}')
_port=$(echo ${_server_config["${_login_server}"]} | awk '{print $4}')
_jump=$(echo ${_server_config["${_login_server}"]} | awk '{print $5}')
_command=$(echo ${_server_config["${_login_server}"]} | awk -F"'" '{print $2}')

if [ "${_command}" != "" ]; then
    _command="expect \"*]*\"
    send \"${_command}\r\""
fi

if [ "${_jump}" != "" ] && [ "${_jump}" != "no" ]; then
    _jump_host=$(echo ${_server_config["${_jump}"]} | awk '{print $1}')
    _jump_user=$(echo ${_server_config["${_jump}"]} | awk '{print $2}')
    _jump_passwd=$(echo ${_server_config["${_jump}"]} | awk '{print $3}')
    _jump_port=$(echo ${_server_config["${_jump}"]} | awk '{print $4}')

    expect -c "
    set timeout 30
    spawn ssh -p${_jump_port} ${_jump_user}@${_jump_host}
    expect {
        \"yes/no\" { send \"yes\r\"; exp_continue }
        \"assword\" { send \"${_jump_passwd}\r\" }
    }

    expect \"*]*\" 
    send \"ssh -p${_port} ${_user}@${_host}\r\"
    expect \"assword:\" 
    send \"${_passwd}\r\"
    ${_command}
    interact"
else
    expect -c "
    set timeout 30
    spawn ssh -p${_port} ${_user}@${_host}
    expect {
        \"yes/no\" {send \"yes\r\"; exp_continue }
        \"*assword:\" { send \"$_passwd\r\" }
    }
    ${_command}
    interact
    "
fi
```

