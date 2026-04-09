---
date: '2026-04-09T20:00:00+08:00'
title: '小工具集合'
description: ""
summary: ""
tags: ["tools"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---


## Reference
- https://ffmpeg.org/documentation.html

## Usage

- `flac to mp3`
	- `ffmpeg -i input.flac -ab 320k -map_metadata 0 -id3v2_version 3 output.mp3`
- ffplay
	- https://www.jianshu.com/p/c7c6871a8b7c
	- https://www.jianshu.com/p/fd3c6d02a625

---

# VLC

VLC 命令行播放音乐 参考 https://wiki.videolan.org/Console/

```
 ✗ vlc -I rc
VLC media player 3.0.16 Vetinari (revision 3.0.16-0-g5e70837d8d)
[00007fe29244ebe0] main playlist: playlist is empty
[00007fe292712650] [cli] lua interface: Listening on host "*console".
VLC media player 3.0.16 Vetinari
Command Line Interface initialized. Type `help' for help.
> help
+----[ CLI commands ]
| add XYZ  . . . . . . . . . . . . . . . . . . . . add XYZ to playlist
| enqueue XYZ  . . . . . . . . . . . . . . . . . queue XYZ to playlist
| playlist . . . . . . . . . . . . .  show items currently in playlist
| search [string]  . .  search for items in playlist (or reset search)
| delete [X] . . . . . . . . . . . . . . . . delete item X in playlist
| move [X][Y]  . . . . . . . . . . . . move item X in playlist after Y
| sort key . . . . . . . . . . . . . . . . . . . . . sort the playlist
| sd [sd]  . . . . . . . . . . . . . show services discovery or toggle
| play . . . . . . . . . . . . . . . . . . . . . . . . . . play stream
| stop . . . . . . . . . . . . . . . . . . . . . . . . . . stop stream
| next . . . . . . . . . . . . . . . . . . . . . .  next playlist item
| prev . . . . . . . . . . . . . . . . . . . .  previous playlist item
| goto, gotoitem . . . . . . . . . . . . . . . . .  goto item at index
| repeat [on|off]  . . . . . . . . . . . . . .  toggle playlist repeat
| loop [on|off]  . . . . . . . . . . . . . . . .  toggle playlist loop
| random [on|off]  . . . . . . . . . . . . . .  toggle playlist random
| clear  . . . . . . . . . . . . . . . . . . . . .  clear the playlist
| status . . . . . . . . . . . . . . . . . . . current playlist status
| title [X]  . . . . . . . . . . . . . . set/get title in current item
| title_n  . . . . . . . . . . . . . . . .  next title in current item
| title_p  . . . . . . . . . . . . . .  previous title in current item
| chapter [X]  . . . . . . . . . . . . set/get chapter in current item
| chapter_n  . . . . . . . . . . . . . .  next chapter in current item
| chapter_p  . . . . . . . . . . . .  previous chapter in current item
|
| seek X . . . . . . . . . . . seek in seconds, for instance `seek 12'
| pause  . . . . . . . . . . . . . . . . . . . . . . . .  toggle pause
| fastforward  . . . . . . . . . . . . . . . . . . set to maximum rate
| rewind . . . . . . . . . . . . . . . . . . . . . set to minimum rate
| faster . . . . . . . . . . . . . . . . . .  faster playing of stream
| slower . . . . . . . . . . . . . . . . . .  slower playing of stream
| normal . . . . . . . . . . . . . . . . . .  normal playing of stream
| rate [playback rate] . . . . . . . . . .  set playback rate to value
| frame  . . . . . . . . . . . . . . . . . . . . . play frame by frame
| fullscreen, f, F [on|off]  . . . . . . . . . . . . toggle fullscreen
| info [X] . .  information about the current stream (or specified id)
| stats  . . . . . . . . . . . . . . . .  show statistical information
| get_time . . . . . . . . .  seconds elapsed since stream's beginning
| is_playing . . . . . . . . . . . .  1 if a stream plays, 0 otherwise
| get_title  . . . . . . . . . . . . . the title of the current stream
| get_length . . . . . . . . . . . .  the length of the current stream
|
| volume [X] . . . . . . . . . . . . . . . . . .  set/get audio volume
| volup [X]  . . . . . . . . . . . . . . .  raise audio volume X steps
| voldown [X]  . . . . . . . . . . . . . .  lower audio volume X steps
| achan [X]  . . . . . . . . . . . .  set/get stereo audio output mode
| atrack [X] . . . . . . . . . . . . . . . . . . . set/get audio track
| vtrack [X] . . . . . . . . . . . . . . . . . . . set/get video track
| vratio [X] . . . . . . . . . . . . . . .  set/get video aspect ratio
| vcrop, crop [X]  . . . . . . . . . . . . . . . .  set/get video crop
| vzoom, zoom [X]  . . . . . . . . . . . . . . . .  set/get video zoom
| vdeinterlace [X] . . . . . . . . . . . . . set/get video deinterlace
| vdeinterlace_mode [X]  . . . . . . .  set/get video deinterlace mode
| snapshot . . . . . . . . . . . . . . . . . . . . take video snapshot
| strack [X] . . . . . . . . . . . . . . . . .  set/get subtitle track
|
| vlm  . . . . . . . . . . . . . . . . . . . . . . . . .  load the VLM
| description  . . . . . . . . . . . . . . . . .  describe this module
| help, ? [pattern]  . . . . . . . . . . . . . . . . .  a help message
| longhelp [pattern] . . . . . . . . . . . . . . a longer help message
| lock . . . . . . . . . . . . . . . . . . . .  lock the telnet prompt
| logout . . . . . . . . . . . . . .  exit (if in a socket connection)
| quit . . . . . . . .  quit VLC (or logout if in a socket connection)
| shutdown . . . . . . . . . . . . . . . . . . . . . . .  shutdown VLC
+----[ end of help ]
>
```



---

https://github.com/pemako/beancount

复式记账

- https://beancount.github.io/docs/
- https://life.nunumick.cn/blog/2025/01/04/beancount.html
- https://sspai.com/post/59777
- 

---

文件浏览器 

Github：

- https://github.com/filebrowser/filebrowser 


---

虚拟机管理 

- https://mp.weixin.qq.com/s/7g7Gtmrjj_gaj7RSRkBMqg
- https://multipass.run/

---

# MacPorts安装使用

## 下载和系统匹配的版本

- [https://www.macports.org/](https://www.macports.org/)

## 修改配置

修改 `/opt/local/etc/macports/sources.conf`下的配置文件，把最后一句注释修改为

```
# rsync://rsync.macports.org/macports/release/tarballs/ports.tar [default]
http://www.macports.org/files/ports.tar.gz [default]
```

## 执行命令

```
sudo port -d sync
```

## 常用命令

- 查看当前可用软件包及版本 `port list`
- 查看有更新的软件以及版本 `port outdated`
- 升级可以更新的软件 `sudo port upgrade outdated`
- 搜索需要安装的软件包 `port search graphviz`
- 查看具体软件包的内容和说明 `port info graphviz`
- 查看软件包的依赖关系 `port deps graphviz`
- 查看允许客户定制的参数 `port variants graphviz`
- 安装软件 `sudo port install graphviz`
- 下载使用Mac Port安装的软件 `sudo port uninstall graphviz`
- MacPorts卸载删除 `删除/opt/local目录`

## 附录

- 更多详细内容参考 [https://guide.macports.org/#introduction](https://guide.macports.org/#introduction)
- 软件包搜索 [https://ports.macports.org/](https://ports.macports.org/)


---

## Ngrok
- https://ngrok.com/docs/

1. Unzip to install

On Linux or Mac OS X you can unzip ngrok from a terminal with the following command. On Windows, just double click ngrok.zip to extract it.

```
unzip /path/to/ngrok.zip
```

```
brew install ngrok
```

2. Connect your account

Running this command will add your authtoken to the default `ngrok.yml` configuration file. This will grant you access to more features and longer session times. Running tunnels will be listed on the [endpoints page](https://dashboard.ngrok.com/cloud-edge/endpoints) of the dashboard.

```
ngrok config add-authtoken 2FNYOvemnFc3JsKKPCRgYM4uIgs_4s88ButRQi5wE5sEzK78o
```

3. Fire it up

Read [the documentation](https://ngrok.com/docs) on how to use ngrok. Try it out by running it from the command line:

```
ngrok help
```

To start a HTTP tunnel forwarding to your local port 80, run this next:

```
ngrok http 80
```

---

## mpg123

```
brew install mpg123
```

## Usage
在`play`文件中包含所有的需要播放音乐列表地址
```
http://xxxx1.mp3
http://xxxx2.mp3
http://xxxx3.mp3
```

直接在命令行模式下全部播放 `mpg123 -C -@ play`
-   `-C` 命令行下控制播放
-   `-Z` 随机播放
-    空格键暂定
-   `f` 下一首
-   `d` 上一首
-   `l` 查看播放列表
-   `q` 静默模式不输出内容
-   `h` 查看帮助信息
## WebSite

- https://www.mpg123.de/