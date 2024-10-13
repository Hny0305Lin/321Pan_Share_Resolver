# 中国大陆某321网盘分享链接限制绕过

[在线示例](https://sharelink-resolver.what-the-fuck.sbs/)

通过 Android 版本的网盘APP请求方法来获取分享链接内的文件列表，并解析出下载地址，绕过分享链接的下载流量限制。

完全基于 React 前端实现，0 后端请求，甚至无需登录

## 使用方法

1. 打开解析器
2. 登录账号，以防止被拦截
3. 复制链接中的 `s` 后面的字符串，如 `1d8a-3zj9`；或直接粘贴 `https://www.321pan.com/s/1d8a-3zj9`
4. 点击 `获取分享文件列表` 按钮
5. 等待获取
6. 勾选需要下载的文件，点击 `获取勾选文件的下载链接` 按钮
7. 可以选择复制或直接打开

### API 调用
[api.what-the-fuck.sbs](https://api.what-the-fuck.sbs) 目前已经可用

/get-link?config=[base64 encoded], 内容为一个文件的参数类似下面的内容

```json
{"FileId":1111,"FileName":"sss.aaa","Type":0,"Size":111,"ContentType":"0","S3KeyFlag":"1111","CreateAt":"2021-11-11T01:05:27+08:00","UpdateAt":"2023-05-27T10:12:17+08:00","Etag":"11111","DownloadUrl":"","Status":2,"ParentFileId":1111,"Category":0,"PunishFlag":0,"StorageNode":"m4","PreviewType":0}
```

### 提示事项与API部署方法
**API部署在 Cloudflare Worker 后，在 设置->变量和机密 中添加 `USERNAME` 和 `PASSWORD` 两个变量，分别填写某321网盘的用户名和密码以解决无鉴权问题。**

## 注意事项
**本项目秉承免费使用，开源分享的精神。做到无隐藏统计代码，无任何存储信息的设计，隐私 100% Secure。为保护用户隐私，本网站不对任何用户使用期间的某321网盘账号进行记录行为，且接受任何人对本网站的源代码进行无条件审查。**

**仅限用于学习和研究目的；不得将上述内容用于商业或者非法用途，否则，一切后果请用户自负。版权争议与本站无关，您必须在下载后的24个小时之内，从您的电脑中彻底删除上述内容。访问和下载本站内容，说明您已同意上述条款。**

**本站仅提供工具，不存储任何文件，所有文件均来自互联网，请勿用于商业用途，否则后果自负。**

LICENSE: GPL-3.0 license, Haohanyh Computer Software Products Open Source LICENSE, see LICENSE file.
