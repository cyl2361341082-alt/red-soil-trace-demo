# 部署运维手册

## 1. 发布前检查

1. 确认 `public/media/` 中的图片、视频、音频素材已替换为正式版本。
2. 确认点位名称、历史时间、正文、开放信息、坐标和来源经过项目方审定。
3. 执行 `npm run lint` 与 `npm run build`。
4. 在桌面浏览器和手机浏览器各检查一次：首页首屏、地图点位切换、视频位、底部导航和长文案换行。
5. 记录本次发布版本、素材版本和内容审核人。

## 2. 本地预发布

```bash
npm install
npm run build
npm run start
```

`npm run start` 启动的是生产构建，用它做一次上线前冒烟检查。检查结束后按终端提示停止服务。

## 3. Cloudflare Sites / Workers

本项目沿用 starter 的 Vinext 与 Cloudflare Vite 架构，适合发布到 Cloudflare。

首次使用时：

```bash
npm install
npm run build
npx wrangler login
```

再按团队的 Cloudflare 账号与站点命名约定执行发布。正式项目建议将发布命令固定在 CI 中，至少保留以下检查：

```bash
npm ci
npm run lint
npm run build
```

如果使用 Codex Sites Hosting，保留 `.openai/hosting.json`，由 Sites 完成托管配置与发布，不需要在页面代码里写入密钥。

## 4. 其他静态托管

如果部署平台支持 Node 构建与 Cloudflare Worker 产物，使用：

- 安装命令：`npm ci`
- 构建命令：`npm run build`
- Node 版本：22.13 或更高
- 产物目录：以 Vinext/平台生成的产物为准，不手工修改 `.next` 或 `dist`

如果平台只支持纯静态文件，需要先确认平台是否支持本项目的 RSC/Worker 产物。不要直接把开发目录上传到生产。

## 5. 素材运维

- 图片：优先 WebP，宽度建议 1600px 以内，单张尽量小于 500KB。
- 视频：H.264 MP4，首屏视频不自动播放，建议单条小于 30MB。
- 音频：MP3 或 AAC，建议单条小于 8MB。
- 文件命名：使用英文小写、短横线和点位 ID，例如 `government-01.webp`。
- 不覆盖历史素材。正式运营时可按 `yyyy-mm-dd` 建版本目录，并在更新记录里保留旧文件。

## 6. 监控与回滚

建议上线后关注：

- 构建失败与 Worker 错误日志。
- 首页加载耗时、移动端布局溢出、媒体 404。
- 点位内容错误、史实反馈和无障碍问题。

回滚优先使用平台上一版本发布记录。若只出现内容问题，先恢复上一份内容数据或素材；若出现代码问题，再回滚整个版本。

## 7. 安全与权限

- 不在 `app/page.tsx` 或 `public/` 中写入密钥。
- 外部地图、统计、CMS 接口密钥放到平台环境变量。
- 素材上传、内容审核和发布权限分离。
- 正式接入 CMS 后，对历史文案保留审定稿和操作日志。

