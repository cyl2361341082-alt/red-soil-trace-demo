import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Red Soil Trace guide", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>红土寻迹 \| 遂川红色遗址网页导览系统<\/title>/i);
  assert.match(html, /红土寻迹/);
  assert.match(html, /遂川县工农兵政府旧址/);
  assert.match(html, /data-slot="image \/ hero-surface\.jpg"/);
  assert.match(html, /data-slot="video \/ route-story\.mp4"/);
  assert.match(html, /class="mobile-nav"/);
  assert.match(html, /营盘圩乡/);
  assert.match(html, /放大地图/);
  assert.match(html, /手绘导览图/);
  assert.match(html, /id="route"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|Starter Project|SkeletonPreview/);
});

test("server-renders the point story second-level page", async () => {
  const response = await render("/story?point=market");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /点位故事/);
  assert.match(html, /返回地图/);
  assert.match(html, /查看地图位置/);
  assert.match(html, /草林红色圩场/);
  assert.match(html, /\/story\?point=/);
  assert.match(html, /data-slot="image \/ points\//);
  assert.match(html, /data-slot="video \/ points\//);
});
test("keeps guide content and responsive hooks in source", async () => {
  const [page, layout, css, readme, guide, stopData, story] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../docs/content-update-guide.md", import.meta.url), "utf8"),
    readFile(new URL("../app/data/stops.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/story/page.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(stopData, /export const stops: Stop\[\] = \[/);
  assert.match(page, /useMemo/);
  assert.match(page, /讲解音频位/);
  assert.doesNotMatch(stopData, /position:/);
  assert.match(page, /useRef/);
  assert.match(page, /aria-controls="stop-card"/);
  assert.match(page, /requestAnimationFrame/);
  assert.match(story, /useSearchParams/);
  assert.match(story, /isAudioPlaying/);
  assert.match(story, /isVideoPlaying/);
  assert.match(page, /\/story\?point=/);
  assert.match(story, /story-detail-page/);
  assert.match(layout, /lang="zh-CN"/);
  assert.match(layout, /红土寻迹/);
  assert.match(css, /@media \(max-width: 620px\)/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /\.media-placeholder/);
  assert.match(readme, /部署运维手册/);
  assert.match(guide, /Demo 当前更新位置/);
});



