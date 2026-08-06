"use client";

import { useMemo, useRef, useState } from "react";
import { stops, type Stop } from "./data/stops";

type PlaceLabel = {
  id: string;
  name: string;
  kind: "town" | "scene" | "red";
  top: string;
  left: string;
  note: string;
  stopId?: string;
  number?: string;
};

const filters = ["全部", "泉江镇", "草林镇", "待补充"];

const placeLabels: PlaceLabel[] = [
  { id: "泉江镇", name: "泉江镇", kind: "town", top: "49%", left: "21%", note: "县城 / 遂川县工农兵政府旧址" },
  { id: "雩田镇", name: "雩田镇", kind: "town", top: "58%", left: "43%", note: "东南片区 / 乡镇节点" },
  { id: "碧洲镇", name: "碧洲镇", kind: "town", top: "58%", left: "76%", note: "东部片区 / 乡镇节点" },
  { id: "草林镇", name: "草林镇", kind: "town", top: "37%", left: "50%", note: "红色圩场线路入口" },
  { id: "堆子前镇", name: "堆子前镇", kind: "town", top: "25%", left: "65%", note: "北部片区 / 乡镇节点" },
  { id: "左安镇", name: "左安镇", kind: "town", top: "33%", left: "76%", note: "东南山地线路节点" },
  { id: "高坪镇", name: "高坪镇", kind: "town", top: "34%", left: "74%", note: "东部片区 / 乡镇节点" },
  { id: "大汾镇", name: "大汾镇", kind: "town", top: "19%", left: "56%", note: "西北片区 / 乡镇节点" },
  { id: "衙前镇", name: "衙前镇", kind: "town", top: "75%", left: "83%", note: "东南片区 / 乡镇节点" },
  { id: "禾源镇", name: "禾源镇", kind: "town", top: "85%", left: "58%", note: "南部片区 / 乡镇节点" },
  { id: "汤湖镇", name: "汤湖镇", kind: "town", top: "32%", left: "49%", note: "南部山地 / 乡镇节点" },
  { id: "枚江镇", name: "枚江镇", kind: "town", top: "66%", left: "72%", note: "东南片区 / 乡镇节点" },
  { id: "珠田镇", name: "珠田镇", kind: "town", top: "74%", left: "54%", note: "南部片区 / 乡镇节点" },
  { id: "巾石乡", name: "巾石乡", kind: "town", top: "76%", left: "20%", note: "西南片区 / 乡镇节点" },
  { id: "大坑乡", name: "大坑乡", kind: "town", top: "45%", left: "35%", note: "中部片区 / 乡镇节点" },
  { id: "双桥乡", name: "双桥乡", kind: "town", top: "57%", left: "24%", note: "西部片区 / 乡镇节点" },
  { id: "新江乡", name: "新江乡", kind: "town", top: "49%", left: "84%", note: "东部片区 / 乡镇节点" },
  { id: "五斗江乡", name: "五斗江乡", kind: "town", top: "31%", left: "24%", note: "西北片区 / 红色线路节点" },
  { id: "西溪乡", name: "西溪乡", kind: "town", top: "27%", left: "38%", note: "西北片区 / 山地线路节点" },
  { id: "南江乡", name: "南江乡", kind: "town", top: "68%", left: "29%", note: "西南片区 / 乡镇节点" },
  { id: "黄坑乡", name: "黄坑乡", kind: "town", top: "40%", left: "12%", note: "西部片区 / 乡镇节点" },
  { id: "戴家埔乡", name: "戴家埔乡", kind: "town", top: "13%", left: "34%", note: "北部片区 / 山地线路节点" },
  { id: "营盘圩乡", name: "营盘圩乡", kind: "town", top: "12%", left: "15%", note: "西北边缘 / 山地线路节点" },
  { id: "red-government", name: "遂川县工农兵政府旧址", kind: "red", top: "52%", left: "31%", note: "泉江镇 / 红色政权建设线", stopId: "government", number: "01" },
  { id: "red-market", name: "草林红色圩场", kind: "red", top: "42%", left: "58%", note: "草林镇 / 红色圩场线", stopId: "market", number: "02" },
  { id: "red-residence", name: "草林毛泽东旧居", kind: "red", top: "49%", left: "64%", note: "草林镇 / 现场教学节点", stopId: "residence", number: "03" },
  { id: "red-street", name: "红圩老街", kind: "red", top: "56%", left: "64%", note: "草林镇 / 民俗与慢行线路", stopId: "street", number: "04" },
  { id: "red-pending", name: "待补充点位", kind: "red", top: "42%", left: "87%", note: "待核实 / 线路扩展位", stopId: "pending", number: "05" },
  { id: "huang-ao", name: "黄坳方向", kind: "scene", top: "22%", left: "18%", note: "井冈山方向 / 山地线路入口" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("全部");
  const [activeStopId, setActiveStopId] = useState("government");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [activePlaceId, setActivePlaceId] = useState("red-government");
  const [mapZoom, setMapZoom] = useState(false);
  const [showTownLabels, setShowTownLabels] = useState(false);
  const filterRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const visibleStopIds = useMemo(
    () => new Set(
      (activeFilter === "全部" ? stops : stops.filter((stop) => stop.district.startsWith(activeFilter)))
        .map((stop) => stop.id),
    ),
    [activeFilter],
  );


  const activeStop = stops.find((stop) => stop.id === activeStopId) ?? stops[0];
  const activePlace = placeLabels.find((place) => place.id === activePlaceId) ?? placeLabels[0];

  function selectStop(stop: Stop) {
    setActiveStopId(stop.id);
    const relatedPlace = placeLabels.find((place) => place.stopId === stop.id);
    if (relatedPlace) setActivePlaceId(relatedPlace.id);
    setActiveFilter(
      stop.district.startsWith("泉江镇")
        ? "泉江镇"
        : stop.district.startsWith("草林镇")
          ? "草林镇"
          : "待补充",
    );
  }

  function selectFilter(filter: string, moveFocus = false) {
    setActiveFilter(filter);
    const next = filter === "全部" ? stops[0] : stops.find((stop) => stop.district.startsWith(filter));
    if (next) {
      setActiveStopId(next.id);
      const relatedPlace = placeLabels.find((place) => place.stopId === next.id);
      if (relatedPlace) setActivePlaceId(relatedPlace.id);
    }
    if (moveFocus) {
      requestAnimationFrame(() => filterRefs.current[filter]?.focus());
    }
  }

  function onFilterKeyDown(event: React.KeyboardEvent) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const index = filters.indexOf(activeFilter);
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const nextFilter = filters[(index + delta + filters.length) % filters.length];
    selectFilter(nextFilter, true);
  }

  function selectPlace(place: PlaceLabel) {
    setActivePlaceId(place.id);
    if (place.stopId) {
      const stop = stops.find((item) => item.id === place.stopId);
      if (stop) selectStop(stop);
    }
  }

  return (
    <main className="site-shell" id="top">
      <header className="site-header">
        <a className="brand-lockup" href="#top" aria-label="红土寻迹首页">
          <span className="brand-mark">土</span>
          <span>
            <strong>红土寻迹</strong>
            <small>SUICHUAN FIELD GUIDE</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="主导航">
          <a href="#route">点位导览</a>
          <a href="#story">故事线</a>
          <a href="#content">内容更新</a>
        </nav>
        <button className="header-action" type="button" onClick={() => scrollToId("route")}>
          开始导览 <span aria-hidden="true">↗</span>
        </button>
      </header>

      <section className="hero-section field-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="hero-kicker">遂川红色遗址导览</p>
          <h1 id="hero-title">走进红土，<span>看见历史发生的地方。</span></h1>
          <p className="hero-intro">沿遂川的山路、老街与旧址，循着地图把红色现场重新走一遍。</p>
          <div className="hero-actions">
            <button className="button button-primary" type="button" onClick={() => scrollToId("route")}>
              打开导览地图 <span aria-hidden="true">→</span>
            </button>
            <button className="button button-quiet" type="button" onClick={() => scrollToId("story")}>
              了解路线故事
            </button>
          </div>
        </div>

        <div className="hero-media media-placeholder" data-slot="image / hero-surface.jpg">
          <div className="media-topline"><span>主视觉图片位置</span><span>红土山野</span></div>
          <div className="hero-image-graphic" aria-hidden="true">
            <span className="graphic-sun" />
            <span className="graphic-ridge graphic-ridge-back" />
            <span className="graphic-ridge graphic-ridge-front" />
            <span className="graphic-path" />
          </div>
          <div className="media-caption">
            <span>建议素材：旧址建筑、红土道路、山野远景</span>
            <strong>待替换：public/media/hero-surface.jpg</strong>
          </div>
        </div>
      </section>

      <section className="trail-summary" aria-label="导览概览">
        <div><strong>1928</strong><span>红色叙事的时间锚点</span></div>
        <div><strong>{stops.filter((stop) => stop.id !== "pending").length} 处</strong><span>已整理的重点点位</span></div>
        <div><strong>Web 与 H5</strong><span>一套内容，两端可访问</span></div>
      </section>

      <section className="route-section section-wrap" id="route" aria-labelledby="route-title">
        <div className="route-intro">
          <p className="route-kicker">地图导览</p>
          <h2 id="route-title">从县城出发，沿着山水找到红色现场。</h2>
          <p>选择地图上的红色点位，查看概览后进入独立故事页。乡镇地名保留为路线判断与现场抵达的参照。</p>
        </div>

        <div className="route-layout">
          <div className="map-panel" aria-label="遂川红色遗址导览地图">
            <div className="map-topline"><span>SUICHUAN / 26°N</span><span>RED SOIL GUIDE</span></div>
            <div className="map-toolbar">
              <span className="map-view-label"><span>手绘导览图 / 示意位置</span><b>当前 · {activePlace.name} / {visibleStopIds.size} 处</b></span>
              <div className="map-tool-group">
                <button className="map-tool-button" type="button" onClick={() => setMapZoom((value) => !value)}>{mapZoom ? "恢复视图" : "放大地图"}</button>
                <button className="map-tool-button" type="button" onClick={() => { setActivePlaceId("泉江镇"); setMapZoom(false); }}>定位县城</button>
                <button className="map-tool-button map-town-toggle" type="button" onClick={() => setShowTownLabels((value) => !value)} aria-pressed={showTownLabels}>{showTownLabels ? "收起地名" : "显示地名"}</button>
              </div>
            </div>
            <div className={"map-surface " + (mapZoom ? "is-zoomed " : "") + (showTownLabels ? "show-towns" : "")}>
              <span className="map-contour contour-one" />
              <span className="map-contour contour-two" />
              <span className="map-contour contour-three" />
              <span className="map-river river-one" />
              <span className="map-river river-two" />
              <span className="map-label label-north">井冈山方向</span>
              <span className="map-label label-south">遂川江</span>
              <span className="map-hill hill-one" aria-hidden="true" />
              <span className="map-hill hill-two" aria-hidden="true" />
              <span className="map-hill hill-three" aria-hidden="true" />
              <span className="map-hill hill-four" aria-hidden="true" />
              <span className="map-water water-main" aria-hidden="true" />
              <span className="map-water water-branch" aria-hidden="true" />
              <span className="map-route route-red" aria-hidden="true" />
              <span className="map-route route-blue" aria-hidden="true" />
              <span className="map-forest forest-one" aria-hidden="true" />
              <span className="map-forest forest-two" aria-hidden="true" />
              {placeLabels.map((place) => (
                <button
                  className={"map-place " + place.kind + (activePlaceId === place.id ? " is-active" : "")}
                  key={place.id}
                  style={{ top: place.top, left: place.left }}
                  type="button"
                  onClick={() => selectPlace(place)}
                  aria-label={"查看 " + place.name}
                  aria-pressed={activePlaceId === place.id}
                >
                  {place.number ? <span className="place-number" aria-hidden="true">{place.number}</span> : <span className="place-pin" aria-hidden="true" />}
                  <span>{place.name}</span>
                </button>
              ))}
              <div className="map-scale"><span /> <span /> <span /> <b>约 23 km</b></div>
            </div>
            <div className="map-compass" aria-hidden="true"><span className="compass-n">北</span><span className="compass-e">东</span><span className="compass-s">南</span><span className="compass-w">西</span><i>◆</i></div>
            <div className="map-legend"><span><i className="legend-dot legend-town" />行政地名</span><span><i className="legend-dot legend-red" />红色点位</span><span><i className="legend-dot legend-route" />推荐线路</span></div>
          </div>

          <aside className="stop-panel">
            <div className="filter-row" role="tablist" aria-label="点位筛选" onKeyDown={onFilterKeyDown}>
              {filters.map((filter) => (
                <button
                  className={`filter-button ${activeFilter === filter ? "is-active" : ""}`}
                  id={`filter-tab-${filter}`}
                  ref={(element) => { filterRefs.current[filter] = element; }}
                  key={filter}
                  type="button"
                  onClick={() => selectFilter(filter)}
                  aria-selected={activeFilter === filter}
                  aria-controls="stop-card"
                  role="tab"
                  tabIndex={activeFilter === filter ? 0 : -1}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="stop-card" id="stop-card" role="tabpanel" aria-labelledby={`filter-tab-${activeFilter}`} aria-live="polite">
              <div className="stop-card-topline"><span>当前点位 / {activeStop.no}</span><span className="status-label">{activeStop.status}</span></div>
              <p className="stop-district">{activeStop.district}</p>
              <h3>{activeStop.title}</h3>
              <p className="stop-short">{activeStop.short}</p>
              <p className="stop-description">{activeStop.description}</p>
              <div className="fact-grid">
                {activeStop.facts.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
              </div>
              <div className="tag-row">{activeStop.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="stop-card-actions">
                <a className="button button-primary button-small" href={`/story?point=${activeStop.id}`}>进入点位故事 <span aria-hidden="true">→</span></a>
                <button className="audio-button" type="button" onClick={() => setIsAudioPlaying((value) => !value)} aria-pressed={isAudioPlaying}>
                  <span className={`audio-bars ${isAudioPlaying ? "is-playing" : ""}`} aria-hidden="true"><i /><i /><i /><i /></span>
                  {isAudioPlaying ? "演示播放中" : "讲解音频位"}
                </button>
              </div>
            </div>
            <p className="panel-footnote">内容字段：标题、摘要、正文、图片、视频、语音、开放信息、来源。</p>
          </aside>
        </div>
      </section>

      <section className="story-section section-wrap" id="story" aria-labelledby="story-title">
        <div className="story-intro">
          <p className="route-kicker">路线故事</p>
          <h2 id="story-title">不把历史锁在展板里。</h2>
          <p>图像、短视频、口述与地图坐标一起工作，让每处旧址都能被读成一段可抵达的现场经验。</p>
        </div>

        <div className="story-layout">
          <div className="video-placeholder media-placeholder" data-slot="video / route-story.mp4">
            <div className="media-topline"><span>路线故事视频位</span><span>VIDEO 01</span></div>
            <div className="video-stage">
              <span className="video-horizon" />
              <span className="video-house" />
              <span className="video-tree tree-one" />
              <span className="video-tree tree-two" />
              <button className={`play-button ${isVideoPlaying ? "is-playing" : ""}`} type="button" onClick={() => setIsVideoPlaying((value) => !value)} aria-label={isVideoPlaying ? "暂停演示视频" : "播放演示视频"}>
                <span>{isVideoPlaying ? "Ⅱ" : "▶"}</span>
              </button>
              {isVideoPlaying && <span className="play-state">DEMO PREVIEW / 播放演示</span>}
            </div>
            <div className="video-meta"><span>建议时长 01:45</span><strong>待替换：public/media/route-story.mp4</strong></div>
          </div>

          <div className="timeline-panel">
            <div className="timeline-item is-current"><span className="timeline-year">1928</span><div><h3>红色政权</h3><p>旧址从一座建筑开始，留下政权建设与群众工作的早期线索。</p></div></div>
            <div className="timeline-item"><span className="timeline-year">圩场</span><div><h3>红色经济</h3><p>从草林老街进入圩市，看见历史如何落在米铺、布店与日常生活里。</p></div></div>
            <div className="timeline-item"><span className="timeline-year">今天</span><div><h3>红色更新</h3><p>把保护、讲解与内容运营接到同一条线路，让现场持续被看见。</p></div></div>
            <div className="quote-note"><span>导览提示</span><p>“先看一处建筑，再走一段街巷，最后把故事带回今天。”</p></div>
          </div>
        </div>
      </section>

      <section className="content-section section-wrap" id="content" aria-labelledby="content-title">
        <div className="content-intro">
          <p className="route-kicker">内容更新</p>
          <h2 id="content-title">一次录入，Web 与 H5 同步。</h2>
          <p>素材、讲解和来源分别维护。审定后的内容对象可以直接同时服务网页与移动端导览。</p>
        </div>
        <div className="content-ledger">
          <div className="ledger-main">
            <div className="ledger-header"><span>点位内容清单</span><span>LAST EDIT · 2026.08</span></div>
            {stops.slice(0, 4).map((stop) => (
              <button className="ledger-row" type="button" key={stop.id} onClick={() => { selectStop(stop); scrollToId("route"); }}>
                <span className="ledger-number">{stop.no}</span>
                <span className="ledger-name"><strong>{stop.title}</strong><small>{stop.district}</small></span>
                <span className={`ledger-status ${stop.status === "待补视频" ? "status-image" : ""}`}>{stop.status}</span>
                <span className="ledger-arrow" aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
          <div className="content-note">
            <span className="note-kicker">UPDATE GUIDE</span>
            <h3>让现场素材更容易被维护。</h3>
            <p>每个点位对应一份内容对象。图片、视频、语音和来源都保留独立入口，更新时只需替换素材与字段。</p>
            <a className="text-link" href="#footer">查看交付手册 <span aria-hidden="true">→</span></a>
          </div>
        </div>
      </section>

      <footer className="site-footer" id="footer">
        <div className="footer-brand"><span className="brand-mark">土</span><div><strong>红土寻迹</strong><span>遂川红色遗址网页导览系统 Demo</span></div></div>
        <div className="footer-links"><a href="#route">点位导览</a><a href="#story">故事线</a><a href="#content">内容更新</a></div>
        <p>素材与史实以正式审定版本为准 · 2026</p>
      </footer>

      <nav className="mobile-nav" aria-label="移动端导航">
        <a href="#top"><span>01</span>首页</a>
        <a href="#route"><span>02</span>点位</a>
        <a href="#story"><span>03</span>故事</a>
        <a href="#content"><span>04</span>更新</a>
      </nav>
    </main>
  );
}

