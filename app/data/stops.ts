export type Stop = {
  id: string;
  no: string;
  district: string;
  title: string;
  short: string;
  description: string;
  facts: [string, string][];
  tags: string[];
  status: "已录入" | "待补视频" | "待审定";
};

export const stops: Stop[] = [
  {
    id: "government",
    no: "01",
    district: "泉江镇 · 城区",
    title: "遂川县工农兵政府旧址",
    short: "县级红色政权建设的起点",
    status: "已录入",
    description:
      "1928年，遂川县工农兵政府在这里建立。旧址以建筑空间和史料展陈，串起建政、施政与群众工作的线索。",
    facts: [
      ["历史时间", "1928"],
      ["建议停留", "45 min"],
    ],
    tags: ["旧址展陈", "建政线索"],
  },
  {
    id: "market",
    no: "02",
    district: "草林镇 · 红圩",
    title: "草林红色圩场",
    short: "从一处圩场读懂群众工作",
    status: "待补视频",
    description:
      "草林圩场保留着老街店铺与圩市肌理。导览从经济动员、群众生活与今日烟火气三个切面，讲述红色圩场的来路。",
    facts: [
      ["历史时间", "1928"],
      ["建议停留", "60 min"],
    ],
    tags: ["红色圩场", "老街漫游"],
  },
  {
    id: "residence",
    no: "03",
    district: "草林镇 · 红圩",
    title: "草林毛泽东旧居",
    short: "从一间旧居进入现场",
    status: "已录入",
    description:
      "旧居是草林红色圩场线路中的现场节点。建议以门、窗、桌案等生活尺度观察空间，再回到当时的行军与调查语境。",
    facts: [
      ["历史时间", "1928"],
      ["建议停留", "25 min"],
    ],
    tags: ["现场教学", "空间叙事"],
  },
  {
    id: "street",
    no: "04",
    district: "草林镇 · 红圩",
    title: "红圩老街与民俗博物馆",
    short: "红色文化与地方生活的交汇",
    status: "已录入",
    description:
      "老街、展览馆与民俗内容可以组成一段慢行路线。点位内容支持图文、音频与视频并置，让游客边走边听。",
    facts: [
      ["内容类型", "复合导览"],
      ["建议停留", "40 min"],
    ],
    tags: ["民俗记忆", "慢行路线"],
  },
  {
    id: "pending",
    no: "05",
    district: "待补充 · 线路节点",
    title: "待核实点位",
    short: "为乡镇现场保留的扩展位",
    status: "待审定",
    description:
      "这是 Demo 预留的内容槽位。补齐名称、坐标、开放信息与审定文案后，即可和现有点位一起发布到 Web 与 H5。",
    facts: [
      ["当前状态", "待审定"],
      ["更新方式", "内容文件"],
    ],
    tags: ["内容占位", "待补图"],
  },
];
