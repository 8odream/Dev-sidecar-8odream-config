# Devsidecar-8odream-config

## Devsidecar个人远程配置

使用方式：个人远程配置填入 https://raw.githubusercontent.com/8odream/Devsidecar-8odream-config/refs/heads/main/config.json

如果无法直接连接到GitHub,也可以使用第三方镜像(https://ghproxy.net/https://raw.githubusercontent.com/8odream/Devsidecar-8odream-config/refs/heads/main/config.json)

1.支持直连大部分Sheas ◁ Cealer中配置的文件。

不支持的主流站点列表（由于当前版本DS无法空置SNI域名/无法处理WSS或其它原因）：

大流量建议自建代理,不要使用内置的代理服务器

- twitch (开启彩蛋解决,但是无聊天)
- nicovideo (开启彩蛋解决)
- discord
- audiomask (开启彩蛋解决)
- googlevideo(YouTube视频播放) (开启彩蛋解决)

3.允许通过本地127.0.0.1访问本地UDP的DNS，用以支持AdGuardHome去广告或配置IP、支持更加丰富的DNS加密类型

## Devsidecar使用过程可能遇到的问题

1. 微软账号管理器(WAP)相关功能失效/我的世界基岩版无法正常联网获取内容
   - 设置Loopback : 微软相关的"你的账户","Microsoft Store",Xbox相关"Gamebar","Minecraft for Windows",等等

2. Vscode无法正常联网
   - Github等需要联网的相关插件失效 : 在设置中搜索"代理"/"Proxy",禁用对插件的代理.
  