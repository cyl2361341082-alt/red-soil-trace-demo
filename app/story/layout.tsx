import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "点位故事 | 红土寻迹",
  description: "遂川红色遗址点位故事详情页。",
};

export default function StoryLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}