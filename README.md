# 红土寻迹 · 遂川红色遗址网页导览系统

“红土寻迹”是一个面向遂川红色遗址导览场景的 Web 与 H5 双端 Demo。

## Demo 已包含

- 响应式首页，同一套代码覆盖桌面 Web 与手机 H5。
- 手绘旅游地图风格的导览地图，覆盖遂川 23 个乡镇/乡、红色点位、山水肌理、罗盘和图例，支持地名点击、点位联动、地图放大和定位县城。
- 遂川县工农兵政府旧址、草林红色圩场、草林毛泽东旧居、红圩老街与民俗博物馆等示例点位。
- 图片位、路线故事视频位、讲解音频位的明确占位标注。
- 故事时间线、点位内容清单和内容更新提示。
- 移动端底部导航、键盘焦点样式、减少动效偏好支持。
- 配套部署运维手册和点位内容更新指南。

> 当前为 Demo。页面内史实、开放时间、坐标和素材路径都应在正式发布前由主管部门或项目方审定。

## 本地运行

环境要求：Node.js 22.13+、npm。

```bash
npm install
npm run dev
```

浏览器打开终端输出的本地地址即可。生产构建：

```bash
npm run build
npm run start
```

质量检查：

```bash
npm run lint
npm test
```

## 目录说明

- `app/page.tsx`：首页结构、Demo 点位数据与交互。
- `app/globals.css`：视觉系统、地图示意、响应式和 H5 样式。
- `public/media/`：正式图片、视频、音频素材目录，当前只有占位说明。
- `docs/deployment-ops.md`：部署与运维手册。
- `docs/content-update-guide.md`：点位内容更新指南。
- `docs/content-sources.md`：Demo 文案参考来源与审定说明。
- `.openai/hosting.json`：Sites/Cloudflare 部署配置入口，当前未启用 D1 与 R2。
- `db/`、`worker/`：Drizzle/D1 预留脚手架。`db/schema.ts` 当前为空，启用 D1 绑定前 `getDb()` 不可用，见 `docs/deployment-ops.md`。

## 替换素材

将素材放到 `public/media/`，并按内容更新指南替换页面中的路径：

- `hero-surface.jpg`：首页主视觉图片位。
- `route-story.mp4`：故事线视频位。
- `government-01.jpg`、`market-01.jpg`：点位图片示例位。
- `government-audio.mp3`：讲解音频示例位。

推荐图片使用 WebP 或压缩后的 JPG，视频使用 H.264 MP4，并为视频准备一张同名封面图。

## 交付范围

这份目录就是完整源代码，可在有 Node.js 的环境中安装依赖后直接运行。正式项目可在此 Demo 基础上继续接入真实地图、CMS、统计、预约和音频播放服务。


