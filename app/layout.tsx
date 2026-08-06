import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "红土寻迹 | 遂川红色遗址网页导览系统",
  description: "遂川红色遗址网页与 H5 导览 Demo，支持点位地图、故事线和内容更新。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

