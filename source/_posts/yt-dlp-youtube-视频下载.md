---
title: yt-dlp youtube 视频下载
date: 2025-12-11 11:02:52
tags: yt-dlp
---


## yt-dlp youtube 视频下载

`yt-dlp` 是 youtube-dl 的一个活跃社区分支，修复速度快、支持的站点更多，且每天都会更新。  
下面给你一份 30 秒上手教程，以及如果你刚在用 docker-compose，也附带容器化用法。

--------------------------------------------------
1. 安装
--------------------------------------------------
macOS（homebrew）
```
brew install yt-dlp/taps/yt-dlp        # 官方源，永远最新
```
或升级
```
brew upgrade yt-dlp
```

Linux（pip）
```
python3 -m pip install -U yt-dlp
```

Windows（scoop）
```
scoop install yt-dlp
```

--------------------------------------------------
2. 快速验证
--------------------------------------------------
```
yt-dlp --version        # 2023.* 或更高
yt-dlp -F "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```
会列出所有可选清晰度，说明安装成功。

--------------------------------------------------
3. 常用一行命令
--------------------------------------------------
最佳画质音视频合一，保存到 ~/Downloads
```
yt-dlp -P ~/Downloads -o "%(title)s.%(ext)s" 网址
```

只要音频（320 k MP3）
```
yt-dlp -x --audio-format mp3 --audio-quality 0 -P ~/Music 网址
```

整播单，独立文件夹，可断点续跑
```
yt-dlp -P ~/Videos:/MyPlaylist -o "%(playlist_index)03d  %(title)s.%(ext)s" \
       --download-archive archive.txt 播单地址
```

限速 5 MB/s、4 线程、断点续传
```
yt-dlp -r 5M -N 4 -c 网址
```

--------------------------------------------------
4. 容器化用法（可选）
--------------------------------------------------
官方镜像（每晚构建）
```
docker run --rm -u $(id -u):$(id -g) \
  -v "$(pwd)":/workdir ghcr.io/yt-dlp/yt-dlp:latest \
  -P /workdir -o "%(title)s.%(ext)s" 网址
```

docker-compose 示例
```
services:
  ytdl:
    image: ghcr.io/yt-dlp/yt-dlp:latest
    volumes:
      - ./downloads:/workdir
    command: ["-P", "/workdir", "-o", "%(title)s.%(ext)s", "网址"]
```
然后
```
docker-compose run --rm ytdl
```

--------------------------------------------------
5. 常见坑
--------------------------------------------------
- “Unable to extract uploader id” → 版本太旧，升级即可。  
- “ERROR: Postprocessing: ffprobe not found” → 装 ffmpeg（`brew install ffmpeg`）。  
- 下载慢 → 加 `-N 4` 或使用代理 `--proxy socks5://127.0.0.1:1080`。  
- 遇到验证码/地区限制 → 导出 cookies：`--cookies-from-browser chrome` 或 cookies.txt。

--------------------------------------------------
6. 查看帮助
--------------------------------------------------
```
yt-dlp --help | less
yt-dlp --list-extractors | grep -i twitch
```

换上网址就能下，祝使用愉快。


yt-dlp -r 5M -N 4 -c "https://www.youtube.com/watch?v=BcqPv3aR0lM" 执行报错

```
yt-dlp -r 5M -N 4 -c "https://www.youtube.com/watch?v=BcqPv3aR0lM "
[youtube] Extracting URL: https://www.youtube.com/watch?v=BcqPv3aR0lM 
[youtube] BcqPv3aR0lM: Downloading webpage
WARNING: [youtube] Unable to download webpage: HTTP Error 429: Too Many Requests (caused by <HTTPError 429: Too Many Requests>)
[youtube] BcqPv3aR0lM: Downloading initial data API JSON
[youtube] BcqPv3aR0lM: Downloading tv client config
[youtube] BcqPv3aR0lM: Downloading player a644926e-main
[youtube] BcqPv3aR0lM: Downloading tv player API JSON
[youtube] BcqPv3aR0lM: Downloading android sdkless player API JSON
[youtube] BcqPv3aR0lM: Downloading web player API JSON
WARNING: [youtube] No title found in player responses; falling back to title from initial data. Other metadata may also be missing
ERROR: [youtube] BcqPv3aR0lM: Sign in to confirm you’re not a bot. Use --cookies-from-browser or --cookies for the authentication. See  https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp   for how to manually pass cookies. Also see  https://github.com/yt-dlp/yt-dlp/wiki/Extractors#exporting-youtube-cookies   for tips on effectively exporting YouTube cookies

```


YouTube 已经把你这台 IP 标记成“可疑流量”，所以：

1. 所有匿名请求都返回 429 / “Sign in to confirm you’re not a bot”  
2. yt-dlp 再换客户端（web/tv/android）也拿不到完整数据，只能强制你登录。

要解决，就得让 yt-dlp“假装”你是浏览器里的已登录用户——把浏览器 Cookie 塞给它。下面给出最简三步，macOS 示例，其他系统同理。

--------------------------------------------------
① 安装浏览器导出插件（一次就行）
--------------------------------------------------
Chrome/Edge  
• Get “Get cookies.txt LOCALLY” （https://chrome.google.com/webstore/detail/get-cookiestxt-locally/cclelndahbckbenkjhflpdbgdldlbecc）  
• 打开 YouTube 并登录账号 → 点插件 → “Export as Netscape” → 保存为 `youtube.com_cookies.txt`

Firefox  
• 装 “Export Cookies” （https://addons.mozilla.org/firefox/addon/export-cookies-txt/） → 同样导出 Netscape 格式。

--------------------------------------------------
② 用 cookies 重新下载
--------------------------------------------------
把刚才导出的文件放在当前目录，运行  
```
yt-dlp --cookies youtube.com_cookies.txt -r 5M -N 4 -c "https://www.youtube.com/watch?v=BcqPv3aR0lM"
```
通常就能直接拿到 1080p/720p 无需验证码。

--------------------------------------------------
③（可选）更懒的办法：直接读浏览器数据库
--------------------------------------------------
如果你不想每次手动导出，可以让 yt-dlp 自己抽 Cookie（macOS 示例）  
```
yt-dlp --cookies-from-browser chrome -r 5M -N 4 -c "https://www.youtube.com/watch?v=BcqPv3aR0lM"
```
• 会弹框要钥匙串权限，允许即可。  
• 支持 chrome, chromium, firefox, safari, edge。

--------------------------------------------------
还报错？再加一层伪装
--------------------------------------------------
```
yt-dlp \
  --cookies youtube.com_cookies.txt \
  -r 5M -N 4 -c \
  --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  --proxy socks5://127.0.0.1:1080   # 如果你有代理
  "https://www.youtube.com/watch?v=BcqPv3aR0lM"
```

--------------------------------------------------
短期应急方案
--------------------------------------------------
• 换个网络（手机热点、隔壁 Wi-Fi）往往就解除 429，可暂时不用 Cookie。  
• 降低并发：把 `-N 4` 改成 `-N 1` 并加长间隔 `--sleep-requests 1 --sleep-interval 5`。

--------------------------------------------------
总结
--------------------------------------------------
YouTube 429 ≠ yt-dlp 坏了，只是 IP/账号被限。  
“登录 + 塞 Cookie”是目前最稳的通用解法；导出一次后就能批量下。



## yt-dlp + UI界面

Media Downloader（Qt 外壳，功能最全）
仓库  https://github.com/mhogomchungu/media-downloader
特点
同时支持 yt-dlp、gallery-dl、aria2、wget…
内嵌“格式选择器”，可预览所有清晰度、帧率、码率。
自带“引擎管理”：一键更新 yt-dlp 可执行文件。
支持“订阅”——定时把播单增量拉到本地。
安装
Windows：Releases 里 MediaDownloader-Setup.exe
macOS：brew install --cask media-downloader
Linux：AppImage / flatpak 都有。

```
yt-dlp --cookies-from-browser chrome -r 5M -N 4 -c yt-dlp -r 5M -N 4 -c "https://www.bilibili.com/video/BV1u8mcBBEZT/?spm_id_from=333.1007.tianma.1-1-1.click"

```