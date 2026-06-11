# Movie Images

一个用于展示电影画面收藏的极简轮播网页。

项目最初是本地屏保图片库，现在整理成一个可以部署到 Vercel 的静态网站。页面只做一件事：在黑色背景里随机轮播电影截图，保留上下留黑，让画面更接近影院银幕观感。

在线访问：

- <https://movie-images.vercel.app>
- <https://movie.aowugong.top>

## 特性

- 纯静态网站，无后端、无数据库、无前端框架
- 随机播放 `movies/` 里的所有图片
- 6 秒自动切换，0.9 秒淡入淡出
- 自动预加载下一张图片
- 黑底全屏展示，图片上下留黑
- 支持点击、空格键、右方向键切换下一张
- 适合挂在 Vercel、Cloudflare Pages、GitHub Pages 等静态托管平台

## 目录结构

```text
.
├── movies/                         # 电影图片目录，按电影名分文件夹存放
├── scripts/
│   └── generate-images-json.mjs     # 扫描 movies/ 并生成图片清单
├── app.js                           # 轮播逻辑
├── images.json                      # 自动生成的图片清单
├── index.html                       # 页面入口
├── package.json                     # 构建命令
├── styles.css                       # 页面样式
└── vercel.json                      # Vercel 部署配置
```

## 本地预览

先生成图片清单：

```bash
npm run build
```

然后启动一个静态服务：

```bash
python -m http.server 4173 --bind 127.0.0.1
```

打开：

```text
http://127.0.0.1:4173/
```

不要直接双击 `index.html`，因为页面需要通过 `fetch("./images.json")` 读取图片清单，浏览器在本地文件协议下可能会拦截。

## 添加图片

1. 在 `movies/` 下新建或选择一个电影文件夹。
2. 把图片放进去，支持 `.jpg`、`.jpeg`、`.png`、`.webp`、`.avif`。
3. 运行：

```bash
npm run build
```

4. 提交 `movies/` 和更新后的 `images.json`。

## 部署

Vercel 配置已经写在 `vercel.json` 里：

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".",
  "cleanUrls": true
}
```

在 Vercel 导入 GitHub 仓库即可。每次推送到主分支后，Vercel 会自动运行 `npm run build` 并部署。

自定义域名可以在 Vercel 项目的 `Settings -> Domains` 中添加，例如：

```text
movie.aowugong.top
```

Cloudflare DNS 建议使用：

```text
movie  CNAME  cname.vercel-dns.com  DNS only
```

## 版权说明

本项目中的电影截图仅用于个人收藏、审美展示和非商业用途。电影画面版权归对应影片及权利方所有。

如果你是相关权利方，认为某张图片不适合公开展示，请通过 GitHub Issue 联系，我会及时处理。

## 后续可优化

- 给图片做压缩和尺寸分级，提升移动网络加载速度
- 增加 `manifest`，方便把页面安装成全屏网页应用
- 增加可选参数，例如 `?interval=10` 调整切换间隔
- 增加静音设置面板，但默认保持当前的无 UI 沉浸模式
- 清理 `.DS_Store` 并加入 `.gitignore`
- 如果图片继续增多，可以考虑把原图放对象存储或 CDN，只在仓库保留清单
