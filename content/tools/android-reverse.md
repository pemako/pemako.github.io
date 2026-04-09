---
date: '2026-04-09T20:00:00+08:00'
title: 'Android 逆向'
description: ""
summary: ""
tags: ["android"]
categories: ["tools"]
series: ["Tools"]
ShowToc: true
TocOpen: true
---

1. download tools 
	1. [[apktool]]
	2. [[dex2jar]] 
	3. [[java-decompiler-gui]] 
2. download apk 
	1. `eg: com.baidu.tieba_mini_123205.apk` 
3. decompile 
	1. `apktool d com.baidu.tieba_mini_123205.apk`
	2. `mv com.baidu.tieba_mini_123205.apk com.baidu.tieba_mini_123205.zip`
	3. `unzip com.baidu.tieba_mini_123205.zip`  got `classes.dex` file
	4. `mv classes.dex dex2jar-you-version-dir/` and `d2j-dex2jar.sh classes.dex`
	5. use [[java-decompiler-gui]] open classes-dex2jar.jar

---


## Quick Check

1.  Is at least Java 1.8 installed?
2.  Does executing java -version on command line / command prompt return 1.8 or greater?
3.  If not, please install Java 8+ and make it the default. (Java 7 will also work at this time)

## Installation for Apktool

-   **Windows**:
    1.  Download Windows [wrapper script](https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/windows/apktool.bat) (Right click, Save Link As `apktool.bat`)
    2.  Download apktool-2 ([find newest here](https://bitbucket.org/iBotPeaches/apktool/downloads/))
    3.  Rename downloaded jar to `apktool.jar`
    4.  Move both files (`apktool.jar` & `apktool.bat`) to your Windows directory (Usually `C://Windows`)
    5.  If you do not have access to `C://Windows`, you may place the two files anywhere then add that directory to your Environment Variables System PATH variable.
    6.  Try running apktool via command prompt
    
-   **Linux**:
    1.  Download Linux [wrapper script](https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/linux/apktool) (Right click, Save Link As `apktool`)
    2.  Download apktool-2 ([find newest here](https://bitbucket.org/iBotPeaches/apktool/downloads/))
    3.  Rename downloaded jar to `apktool.jar`
    4.  Move both files (`apktool.jar` & `apktool`) to `/usr/local/bin` (root needed)
    5.  Make sure both files are executable (`chmod +x`)
    6.  Try running apktool via cli

-   **macOS**:
    1.  Download Mac [wrapper script](https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/osx/apktool) (Right click, Save Link As `apktool`)
    2.  Download apktool-2 ([find newest here](https://bitbucket.org/iBotPeaches/apktool/downloads/))
    3.  Rename downloaded jar to `apktool.jar`
    4.  Move both files (`apktool.jar` & `apktool`) to `/usr/local/bin` (root needed)
    5.  Make sure both files are executable (`chmod +x`)
    6.  Try running apktool via cli
    
    Or you can install apktool via _Homebrew_:
    
    1.  Install Homebrew as described [in this page](https://brew.sh/)
    2.  Execute command `brew install apktool` in terminal (no root needed). The latest version will be installed in `/usr/local/Cellar/apktool/[version]/` and linked to `/usr/local/bin/apktool`.
    3.  Try running apktool via cli

**Note** - Wrapper scripts are not needed, but helpful so you don’t have to type java -jar apktool.jar over and over.

## WebSite

- [https://ibotpeaches.github.io/Apktool/install/](https://ibotpeaches.github.io/Apktool/install/ "Apktool")

---


**Project move to [GitHub](https://github.com/pxb1988/dex2jar)**

| _ | Mirror | Wiki | Downloads | Issues |
|--:|:-----|:----:|:---------:|:------:|
| gh | https://github.com/pxb1988/dex2jar | [Wiki](https://github.com/pxb1988/dex2jar/wiki) | [Releases](https://github.com/pxb1988/dex2jar/releases) | [Issues](https://github.com/pxb1988/dex2jar/issues) |
| sf | https://sourceforge.net/p/dex2jar | [old](https://sourceforge.net/p/dex2jar/wiki) | [old](https://sourceforge.net/projects/dex2jar/files/) | [old](https://sourceforge.net/p/dex2jar/tickets/) |
| bb | https://bitbucket.org/pxb1988/dex2jar | [old](https://bitbucket.org/pxb1988/dex2jar/wiki) | [old](https://bitbucket.org/pxb1988/dex2jar/downloads) | [old](https://bitbucket.org/pxb1988/dex2jar/issues) |
| gc | https://code.google.com/p/dex2jar | [old](http://code.google.com/p/dex2jar/w/list) | [old](http://code.google.com/p/dex2jar/downloads/list) | [old](http://code.google.com/p/dex2jar/issues/list)|

Tools to work with android .dex and java .class files

1. dex-reader/writer:
    Read/write the Dalvik Executable (.dex) file. It has a [light weight API similar with ASM](https://sourceforge.net/p/dex2jar/wiki/Faq#markdown-header-want-to-read-dex-file-using-dex2jar).
2. d2j-dex2jar:
    Convert .dex file to .class files (zipped as jar)
3. smali/baksmali:
    disassemble dex to smali files and assemble dex from smali files. different implementation to [smali/baksmali](http://code.google.com/p/smali), same syntax, but we support escape in type desc "Lcom/dex2jar\t\u1234;"
4. other tools:
    [d2j-decrypt-string](https://sourceforge.net/p/dex2jar/wiki/DecryptStrings)

## Usage

1. In the root directory run: ./gradlew distZip
2. cd dex-tools/build/distributions
3. Unzip the file dex-tools-2.1-SNAPSHOT.zip (file size should be ~5 MB)
4. Run d2j-dex2jar.sh from the unzipped directory

### Example usage:
> sh d2j-dex2jar.sh -f ~/path/to/apk_to_decompile.apk

And the output file will be `apk_to_decompile-dex2jar.jar`.


---

# JD-GUI

JD-GUI, a standalone graphical utility that displays Java sources from CLASS files.

![](https://raw.githubusercontent.com/java-decompiler/jd-gui/master/src/website/img/jd-gui.png)

- Java Decompiler projects home page: [http://java-decompiler.github.io](http://java-decompiler.github.io)
- JD-GUI source code: [https://github.com/java-decompiler/jd-gui](https://github.com/java-decompiler/jd-gui)

## Description

JD-GUI is a standalone graphical utility that displays Java source codes of
".class" files. You can browse the reconstructed source code with the JD-GUI
for instant access to methods and fields.

## How to build JD-GUI ?

```
> git clone https://github.com/java-decompiler/jd-gui.git
> cd jd-gui
> ./gradlew build 
```

generate :

- _"build/libs/jd-gui-x.y.z.jar"_
- _"build/libs/jd-gui-x.y.z-min.jar"_
- _"build/distributions/jd-gui-windows-x.y.z.zip"_
- _"build/distributions/jd-gui-osx-x.y.z.tar"_
- _"build/distributions/jd-gui-x.y.z.deb"_
- _"build/distributions/jd-gui-x.y.z.rpm"_

## How to launch JD-GUI ?

- Double-click on _"jd-gui-x.y.z.jar"_
- Double-click on _"jd-gui.exe"_ application from Windows
- Double-click on _"JD-GUI"_ application from Mac OSX
- Execute _"java -jar jd-gui-x.y.z.jar"_ or _"java -classpath jd-gui-x.y.z.jar org.jd.gui.App"_

## How to use JD-GUI ?

- Open a file with menu "File > Open File..."
- Open recent files with menu "File > Recent Files"
- Drag and drop files from your file explorer

## How to extend JD-GUI ?

```
> ./gradlew idea 
```

generate Idea Intellij project

```
> ./gradlew eclipse
```

generate Eclipse project

```
> java -classpath jd-gui-x.y.z.jar;myextension1.jar;myextension2.jar org.jd.gui.App
```

launch JD-GUI with your extensions

## How to uninstall JD-GUI ?

- Java: Delete "jd-gui-x.y.z.jar" and "jd-gui.cfg".
- Mac OSX: Drag and drop "JD-GUI" application into the trash.
- Windows: Delete "jd-gui.exe" and "jd-gui.cfg".

## License

Released under the [GNU GPL v3](LICENSE).

## Donations

Did JD-GUI help you to solve a critical situation? Do you use JD-Eclipse daily? What about making a donation?

[![paypal](https://raw.githubusercontent.com/java-decompiler/jd-gui/master/src/website/img/btn_donate_euro.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=C88ZMVZ78RF22) [![paypal](https://raw.githubusercontent.com/java-decompiler/jd-gui/master/src/website/img/btn_donate_usd.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=CRMXT4Y4QLQGU)
