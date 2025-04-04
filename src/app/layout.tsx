/**
 * 八字合婚系统 - 主布局文件
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { FloatingElements } from "@/components/FloatingElements";
import { RainbowNavBackground } from "@/components/RainbowNavBackground";
import { AdPosition } from "@/components/AdPosition";

// 引入应用初始化脚本，确保服务器启动时自动连接数据库
import "@/lib/appInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "八字合婚 - 专业命理八字婚姻测算",
  description: "基于中国传统命理学的八字合婚计算方法，提供专业的婚姻配对分析，测算两人八字相合程度，了解您们的婚姻和谐度。",
  keywords: ["八字合婚", "合婚测算", "婚姻配对", "八字算命", "传统命理", "五行相生", "姻缘配对", "星座配对", "结婚测算"],
  authors: [{ name: "八字合婚专业团队" }],
  generator: "Next.js",
  applicationName: "八字合婚",
  referrer: "origin-when-cross-origin",
  creator: "八字合婚专业团队",
  publisher: "八字合婚",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://bazi.1895.cn"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "八字合婚 - 专业命理八字婚姻测算",
    description: "基于中国传统命理学的八字合婚计算方法，提供专业的婚姻配对分析，测算两人八字相合程度。",
    url: "https://bazi.1895.cn",
    siteName: "八字合婚",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "八字合婚系统"
      }
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AnimatedBackground>
          <FloatingElements />
          <div className="min-h-screen flex flex-col">
            <RainbowNavBackground>
              <header className="backdrop-blur-sm shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex justify-between h-16">
                    <div className="flex">
                      <div className="flex-shrink-0 flex items-center">
                        <Link href="/" className="text-xl font-bold text-white">
                          八字合婚
                        </Link>
                      </div>
                      <nav className="ml-6 flex space-x-8">
                        <Link
                          href="/"
                          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-pink-200"
                        >
                          首页
                        </Link>
                        <Link
                          href="/marriage-compatibility"
                          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-pink-200"
                        >
                          合婚测算
                        </Link>
                        <Link
                          href="/about"
                          className="inline-flex items-center px-1 pt-1 text-sm font-medium text-white hover:text-pink-200"
                        >
                          关于八字
                        </Link>
                      </nav>
                    </div>
                  </div>
                </div>
              </header>
            </RainbowNavBackground>
            <main className="flex-grow">{children}</main>
            <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-gray-500">
                  © {new Date().getFullYear()} 八字合婚 - 基于中国传统命理学
                </p>
                <p className="text-center text-xs text-gray-400 mt-2">
                  免责声明：本系统提供的八字合婚结果仅供参考，不应作为婚姻决策的唯一依据
                </p>
              </div>
            </footer>
          </div>
          {/* 悬浮广告位 */}
          <AdPosition position="bottom-right" />
        </AnimatedBackground>
      </body>
    </html>
  );
} 