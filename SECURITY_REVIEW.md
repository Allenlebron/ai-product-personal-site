# 安全 review · 2026-10-22

范围：当前 `website` 工作区的源码、配置、静态资源、本地可达 Git 历史和已有 Cloudflare Pages 地址的只读抽查。修复基于 `305ce47` 工作区，保留原有 `.gitignore` 中用户新增的 `.codex/rules/`。未修改其他项目，未部署。

## 结论

当前是纯静态站：`index.html`、`intel.html`、`trial.html` 为公开页面，`js/main.js` 和 `js/particles.js` 仅处理导航、动效及 canvas。没有后台、业务 API、账户系统、订单服务、数据库客户端或 AI 调用。

确认 1 项 P2 风险并已修复：原开发服务将整个仓库作为 HTTP 根目录，可以读取 `.git/HEAD`。生产发布缺少明确的目录隔离，也已补齐。未发现指定的密钥特征；不能据此保证所有未知格式秘密都不存在。

## 六项检查

| 项目 | 检查结果 | 修复 / 证据 |
| --- | --- | --- |
| 1. 后台页面和 API 在服务端校验登录与权限 | 当前不适用 | 源码没有后台路由、API handler、登录页面或前端登录跳转。三个业务页面均为公开内容。没有可补写鉴权的服务端入口。 |
| 2. 接口信任前端 `userId`、`role`、`price` | 未发现此类接口 | 没有网络请求、表单提交、订单或权限写入。`trial.html` 的 ¥2399 是展示文案，付款发生在二维码指向的第三方系统；该系统的价格计算与鉴权不在本次范围。 |
| 3. 构建产物含 secret key | 当前扫描未命中；已增加构建拦截 | 检查了本地源文件、资源及本地可达 Git 历史中的 `sk_live_`、`sk-`、`sb_secret_`、`service_role` 和私钥标记。新增构建器扫描所有待发布文件，并额外识别 payload 中 role 为 `service_role` 的 JWT；公开 publishable / anon key 不拦截。最终 28 个公开文件构建通过。 |
| 4. Supabase / Firebase 每张表的安全策略 | 当前不适用；未验证任何云数据库 | 仓库没有相关 SDK、连接配置、SQL migration 或规则文件。Supabase 使用 RLS / policy；Firebase 使用 Security Rules，并非 PostgreSQL 式逐表 RLS。本次没有云端账户或数据库清单，不能推断其他项目和云端控制台的策略状态。 |
| 5. `.env`、`.git`、source map 上公网 | 本地确认风险，已修复；线上抽查未观察到文件泄露 | 原 `python3 -m http.server` 默认提供仓库根目录。现在只提供构建后的 `dist/`，构建按白名单输出，隐藏文件、`.map`、仓库元数据和配置不进入产物。详见下方复现。 |
| 6. 登录、注册、AI 等付费接口限流 | 当前不适用 | 没有登录、注册、AI 代理、支付或其他计费 API，所以没有对应限流实现。未为不存在的接口添加占位限流。第三方服务不在本次范围。 |

## P2：开发 HTTP 服务暴露仓库文件

位置：原 `package.json` 的 `scripts.dev`。

原命令在仓库根目录启动 Python 静态服务，其文件服务不会根据 `.gitignore` 排除文件。默认绑定 `127.0.0.1` 限制了远程访问；如果设置 `HOST=0.0.0.0` 或通过隧道暴露，其他人也能读取仓库文件。即使只在本机，也没有必要把 Git 元数据放入服务目录。

用临时回环服务复现原目录与修复后目录（测试结束后均关闭）：

| 请求 | 修复前（仓库根目录） | 修复后（`dist/`） |
| --- | --- | --- |
| `/`、`/intel.html`、`/trial.html` | 200 | 200 |
| `/.git/HEAD` | 200，可读取文件 | 404 |
| `/%2e%2e/.git/HEAD` | 200，可读取文件 | 404 |
| `/package.json`、`/README.md` | 200 | 404 |
| `/.env`、`/js/main.js.map` | 404（本来不存在） | 404 |

修复后的关键命令：

```json
{
  "build": "node scripts/build.mjs",
  "test": "node --test scripts/build.test.mjs",
  "dev": "npm run build && python3 -m http.server ${PORT:-5173} --bind ${HOST:-127.0.0.1} --directory dist"
}
```

`scripts/build.mjs` 仅复制四个明确列出的页面（含新增 `404.html`）和 `css/`、`js/`、`assets/` 的允许类型；拒绝符号链接，排除隐藏路径及 source map。每次先移除旧产物，验证内容后写入；命中密钥或 source map 引用时退出失败，错误不打印命中的值。

`.gitignore` 补充 `.env*`、`.dev.vars*`、`.wrangler/`、`*.map` 和 `dist/`，减少误提交。这只是提交防线，真正的发布边界由构建目录控制。

## 现有公网抽查

目标：`https://ai-product-personal-site.pages.dev`。使用 curl 对首页及以下路径发送只读 GET，并比较正文 SHA-256：

```text
/.env
/.git/HEAD
/.git/config
/package.json
/README.md
/js/main.js.map
/portless.json
/.gitignore
```

这些路径均为 HTTP 200、`text/html`、27030 字节，正文与首页完全一致，SHA-256 为 `54293f97765e11dcdc31b8a8c0349b7a9779449ffbcda76221505f298d4aed90`。这是首页回退，未观察到所请求的文件内容，不能把 200 本身判作秘密泄露。

新增 `404.html` 用于关闭 Pages 对不存在路径的默认首页回退，让上线后的检查获得真实 404。它不是鉴权或秘密隔离机制；部署目录白名单负责避免上传敏感文件。Pages 的这项行为见 [官方 Serving Pages 文档](https://developers.cloudflare.com/pages/configuration/serving-pages/)。

## 验证与上线边界

- `npm test`：10/10 通过，覆盖白名单、隐藏文件、旧产物清理、六类模拟密钥、公开 key、内联及外部 source map、文件与目录符号链接。
- `npm run build`：28 个公开文件，未包含源码仓库、环境文件、配置、测试和报告。
- 解析产物 HTML：50 处本地资源引用均存在。
- 两个现有浏览器 JS 文件通过 `node --check`；`git diff --check` 通过。
- HTTP 修复前后对比见上表；未进行云数据库策略审计、第三方收款流程测试或任何生产写入。

下次部署须使用构建命令 `npm run build`、输出目录 `dist`；Wrangler 配置已指向 `./dist`，直接上传命令为 `npx wrangler pages deploy dist`。Cloudflare 的输出目录配置依据见 [官方 Build configuration 文档](https://developers.cloudflare.com/pages/configuration/build-configuration/)。此次未读取或修改 Cloudflare 控制台构建设置；若使用 Git 自动部署，仍需确认其构建命令正确设置。

密钥扫描是启发式防线，不能识别所有编码、拆分或未知格式的秘密。Git 历史检查仅覆盖本地可达对象，不覆盖远端独有分支、已删除且不可达的对象或历史部署。未来新增后台、数据库或 AI 接口时，应对实际服务端入口、所有权检查、数据库策略和分布式限流重新做审计，不能沿用本次“不适用”结论。
