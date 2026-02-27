import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "Mood Labs",
  description: "Tell me your mood now, to get all you need."
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps): React.JSX.Element {
  return (
    <html lang="zh-CN">
      <body>
        <Providers>{children}</Providers>
        <Analytics/>
      </body>
    </html>
  );
}
