/**
 * 八字合婚 - 首页
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

'use client';

import Link from "next/link";
import Script from "next/script";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { trackPageVisit } from '@/lib/tracking';

export default function Home() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  useEffect(() => {
    // 记录页面访问
    trackPageVisit().catch(err => {
      console.error('Failed to track page visit:', err);
    });
  }, []);

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "八字合婚 - 专业命理八字婚姻测算",
        "url": "https://bazi.1895.cn",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://bazi.1895.cn/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "description": "基于中国传统命理学的八字合婚计算方法，提供专业的婚姻配对分析，测算两人八字相合程度。",
        "inLanguage": "zh-CN"
      })}} />
      
      <div className="h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-purple-900 mb-4">
          八字合婚
        </h1>
        <p className="text-xl text-gray-700 max-w-3xl mb-8">
          基于中国传统命理学，分析您与伴侣的八字相合程度，了解您们的婚姻和谐指数。
        </p>
        <div className="space-x-4">
          <Button
            asChild
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6 px-8"
          >
            <Link href="/marriage-compatibility">立即测算</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-lg py-6 px-8 border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            <Link href="/about">了解更多</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-900 mb-12">
            八字合婚的独特优势
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-5 bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg shadow-sm">
              <div className="text-purple-700 text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">
                传统命理精华
              </h3>
              <p className="text-gray-700">
                汇集数千年中国传统命理学精华，深入解析八字中的五行相生相克关系。
              </p>
            </div>
            <div className="p-5 bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg shadow-sm">
              <div className="text-purple-700 text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">
                精准配对分析
              </h3>
              <p className="text-gray-700">
                通过多维度分析双方八字，精确计算相合度，提供全面的婚姻和谐评估。
              </p>
            </div>
            <div className="p-5 bg-gradient-to-b from-purple-50 to-pink-50 rounded-lg shadow-sm">
              <div className="text-purple-700 text-4xl mb-4">🔮</div>
              <h3 className="text-xl font-semibold text-purple-900 mb-3">
                现代科学结合
              </h3>
              <p className="text-gray-700">
                结合现代心理学和数据分析，让传统命理焕发新生，提供更有价值的参考。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-purple-900 text-center mb-12">
            常见问题解答
          </h2>
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                Q: 八字合婚可信度有多高？
              </h3>
              <p className="text-gray-700">
                A: 八字合婚是中国传统文化的一部分，具有丰富的哲学内涵和历史积淀。虽然不能完全决定婚姻的成功，但可以提供有价值的参考，帮助识别潜在的性格互补或冲突点。现代婚姻更需要沟通、尊重和包容。
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                Q: 需要准确的出生时间吗？
              </h3>
              <p className="text-gray-700">
                A: 是的，八字是根据出生的年、月、日、时来推算的，因此需要较为准确的出生时间。时辰的不同会影响到日柱和时柱的信息，从而影响合婚结果的准确性。
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-purple-800 mb-2">
                Q: 八字合婚结果不理想怎么办？
              </h3>
              <p className="text-gray-700">
                A: 八字合婚结果仅供参考，不应成为决定婚姻的唯一标准。良好的沟通、共同的价值观和相互理解才是幸福婚姻的基础。如果彼此真心相爱，可以通过了解各自的优缺点，互相包容和适应。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-700 text-white py-16 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">
            开始您的八字合婚之旅
          </h2>
          <p className="text-xl mb-8 opacity-90">
            只需填写双方的出生信息，即可获得专业的八字合婚分析报告
          </p>
          <Button 
            asChild
            size="lg" 
            className="bg-white text-purple-700 hover:bg-gray-100 text-lg py-6 px-10"
          >
            <Link href="/marriage-compatibility">立即测算</Link>
          </Button>
        </div>
      </div>
    </>
  );
}