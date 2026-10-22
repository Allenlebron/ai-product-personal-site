# AI Product Personal Site

基于 `Sac-Y/sac-ai.com` 的静态站结构改造而来，保留原有 editorial manifesto 风格，替换为 ZW 的个人品牌内容和新生成图片资产。

## 本地运行

```bash
npm run dev
```

需要 Node.js 24+ 和 Python 3。命令先构建，再仅提供 `dist/` 中的公开文件；修改源文件后重新运行。

默认地址：

```text
http://127.0.0.1:5173
```

## 构建与部署

```bash
npm test
npm run build
```

Cloudflare Pages 设置：构建命令 `npm run build`，输出目录 `dist`。仓库中的 `wrangler.jsonc` 也将 Pages 输出目录限定为 `dist`。如使用 Wrangler 直接上传，执行 `npx wrangler pages deploy dist`。不要上传仓库根目录；`.gitignore` 不能代替发布目录隔离。

构建只复制明确列出的 HTML 页面和 `css/`、`js/`、`assets/` 中允许的文件类型，跳过隐藏文件及 source map，并拒绝符号链接、source map 引用和常见私钥特征（包括旧版 Supabase service-role JWT）。命中时停止构建，错误只显示文件名。该扫描是启发式检查，不能识别所有编码、拆分或未知格式的密钥；前端只能放公开 key。

安全检查结论与验证边界见 [SECURITY_REVIEW.md](SECURITY_REVIEW.md)。

## 内容入口

- `index.html`：页面结构、文案、链接
- `intel.html`：破局情报站首期导读，原文链接指向破局官方
- `css/tokens.css`：颜色、字体、间距变量
- `css/base.css`、`css/sections.css`、`css/work-split.css`、`css/intel.css`：页面样式
- `js/main.js`：滚动动效、导航高亮、链接常量
- `js/build.js`：Build 区块终端动画
- `assets/`：头像、文章封面、项目封面和视频背景

## 待补充

- 替换 `ZW` 为最终个人品牌名
- 将写作和项目卡片链接到真实文章、产品或仓库
