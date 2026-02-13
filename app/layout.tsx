import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mood Labs",
  description: "Pick your mood and get a movie recommendation."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
