"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { stops } from "../data/stops";

const storyNotes: Record<string, { label: string; scene: string; reading: string; prompt: string }> = {
  government: {
    label: "红色政权建设线",
    scene: "从旧址建筑的门厅、展陈与街巷关系出发，辨认一处县级红色政权如何在遂川落脚。",
    reading: "先看空间，再读史料。建筑保留的不只是年代感，也保存着组织群众、处理政务与建立秩序的具体线索。",
    prompt: "建议补充：旧址外观、展陈局部、口述讲解视频。",
  },
  market: {
    label: "红色圩场线",
    scene: "沿草林老街缓慢行走，让圩市的街巷、铺面与来往路径先出现在眼前。",
    reading: "圩场把经济活动与群众生活连在一起。以一段街巷为单位讲述，比单独罗列史实更容易让游客理解现场。",
    prompt: "建议补充：圩场街景、老店铺、赶集口述短视频。",
  },
  residence: {
    label: "现场教学节点",
    scene: "从旧居的门窗、桌案和停留尺度进入一段历史现场。",
    reading: "空间很小，故事可以很近。请把人物活动、行军调查和当地群众生活放在同一段讲解里。",
    prompt: "建议补充：旧居室内、讲解员音频、现场教学片段。",
  },
  street: {
    label: "老街慢行线路",
    scene: "老街的步行节奏，适合把红色文化与民俗记忆一同展开。",
    reading: "不急着把信息讲完。让一段慢行路线串起建筑、展馆和日常生活，游客更容易形成完整记忆。",
    prompt: "建议补充：老街航拍、民俗展品、夜间慢行视频。",
  },
  pending: {
    label: "待核实扩展位",
    scene: "这是为后续乡镇现场保留的内容入口。",
    reading: "完成审定后，补录名称、定位、开放信息与来源，就能加入既有故事线路。",
    prompt: "建议补充：审定名称、现场图片、开放时间、素材来源。",
  },
};

function resolvePoint(point: string | null): string {
  return stops.some((stop) => stop.id === point) ? (point as string) : "government";
}

export default function StoryDetailPage() {
  const searchParams = useSearchParams();
  const pointId = resolvePoint(searchParams.get("point"));
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const storyStop = useMemo(
    () => stops.find((stop) => stop.id === pointId) ?? stops[0],
    [pointId],
  );
  const storyNote = storyNotes[storyStop.id] ?? storyNotes.pending;
  const currentIndex = stops.findIndex((stop) => stop.id === storyStop.id);
  const previousStop = stops[(currentIndex - 1 + stops.length) % stops.length];
  const nextStop = stops[(currentIndex + 1) % stops.length];

  return (
    <main className="story-detail-page" aria-labelledby="detail-title">
      <header className="story-detail-header">
        <Link className="story-detail-brand" href="/#route" aria-label="返回红土寻迹地图">
          <span className="brand-mark">土</span>
          <span><strong>红土寻迹</strong><small>遂川红色遗址导览</small></span>
        </Link>
        <Link className="story-back" href="/#route">← 返回地图</Link>
      </header>

      <section className="story-detail-hero">
        <div className="story-detail-copy">
          <p className="story-detail-kicker">点位故事 / {storyStop.no}</p>
          <p className="story-detail-district">{storyStop.district}</p>
          <h1 id="detail-title">{storyStop.title}</h1>
          <p className="story-detail-lead">{storyStop.short}</p>
          <p className="story-detail-description">{storyStop.description}</p>
          <dl className="story-detail-facts">
            {storyStop.facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <div className="story-detail-actions">
            <button className="button button-primary button-small" type="button" onClick={() => setIsAudioPlaying((value) => !value)} aria-pressed={isAudioPlaying}>
              {isAudioPlaying ? "暂停讲解" : "播放讲解"} <span aria-hidden="true">{isAudioPlaying ? "Ⅱ" : "▶"}</span>
            </button>
            <Link className="button button-quiet button-small" href="/#route">查看地图位置</Link>
          </div>
        </div>

        <div className="story-detail-media media-placeholder" data-slot={`image / points/${storyStop.id}-hero.jpg`}>
          <div className="media-topline"><span>点位主图位置</span><span>IMAGE {storyStop.no}</span></div>
          <div className="story-detail-landscape" aria-hidden="true">
            <span className="detail-ridge detail-ridge-back" />
            <span className="detail-ridge detail-ridge-front" />
            <span className="detail-building" />
            <span className="detail-path" />
          </div>
          <div className="story-detail-caption"><span>{storyNote.prompt}</span><strong>待替换：public/media/points/{storyStop.id}-hero.jpg</strong></div>
        </div>
      </section>

      <section className="story-detail-reading">
        <article className="story-detail-article">
          <p className="story-detail-kicker">现场阅读</p>
          <h2>{storyNote.label}</h2>
          <p>{storyNote.scene}</p>
          <p>{storyNote.reading}</p>
          <div className="story-detail-tags">{storyStop.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </article>

        <aside className="story-detail-video media-placeholder" data-slot={`video / points/${storyStop.id}-story.mp4`}>
          <div className="media-topline"><span>点位视频位置</span><span>VIDEO {storyStop.no}</span></div>
          <div className="story-detail-video-stage">
            <span className="detail-video-horizon" />
            <span className="detail-video-house" />
            <button className={`play-button ${isVideoPlaying ? "is-playing" : ""}`} type="button" onClick={() => setIsVideoPlaying((value) => !value)} aria-label={isVideoPlaying ? "暂停点位演示视频" : "播放点位演示视频"}>
              <span>{isVideoPlaying ? "Ⅱ" : "▶"}</span>
            </button>
            {isVideoPlaying && <span className="play-state">讲解演示中</span>}
          </div>
          <div className="video-meta"><span>建议时长 01:30</span><strong>待替换：public/media/points/{storyStop.id}-story.mp4</strong></div>
        </aside>
      </section>

      <nav className="story-detail-switcher" aria-label="切换点位故事">
        <Link href={`/story?point=${previousStop.id}`}><small>上一处</small><strong>{previousStop.title}</strong><span aria-hidden="true">←</span></Link>
        <Link href={`/story?point=${nextStop.id}`}><small>下一处</small><strong>{nextStop.title}</strong><span aria-hidden="true">→</span></Link>
      </nav>
    </main>
  );
}