/**
 * 八字合婚 - 关于页面
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

'use client';

import React, { useEffect } from 'react';
import Script from 'next/script';
import { trackPageVisit } from '@/lib/tracking';

export default function About() {
  // 记录页面访问
  useEffect(() => {
    trackPageVisit().catch(err => {
      console.error('Failed to track page visit:', err);
    });
  }, []);

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "关于八字合婚 - 传统命理学的婚姻配对方法",
        "description": "了解八字合婚的历史渊源、原理和现代意义。八字合婚是基于中国传统命理学的婚姻配对方法。",
        "image": "https://bazi.1895.cn/about-image.jpg",
        "author": {
          "@type": "Organization",
          "name": "八字合婚专业团队"
        },
        "publisher": {
          "@type": "Organization",
          "name": "八字合婚",
          "logo": {
            "@type": "ImageObject",
            "url": "https://bazi.1895.cn/logo.png"
          }
        },
        "datePublished": "2023-01-01",
        "dateModified": "2023-07-01"
      })}} />

      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-purple-900 mb-4">关于八字合婚</h1>
            <p className="text-gray-700">
              了解中国传统命理学中的八字合婚历史与原理
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">八字合婚的历史渊源</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                八字合婚源于中国传统命理学，是古代婚姻配对的重要方法之一。
                早在汉代，八字合婚已经开始应用于婚姻匹配中，到了唐宋时期更加系统化和完善。
              </p>
              <p>
                传统的婚姻观念中，"父母之命，媒妁之言"是主要的婚配方式，
                而八字合婚则是这一过程中的重要参考依据。通过分析双方的生辰八字，
                测算两人的命理相合程度，以期获得和谐美满的婚姻。
              </p>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-purple-800 mb-4" id="principles">八字合婚的原理</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                八字，又称四柱，是指一个人出生时的年、月、日、时四个时间单位，
                每个时间单位用天干和地支来表示，合计八个字，故称"八字"。
              </p>
              <p>
                八字合婚的核心原理是分析双方八字中五行的相生相克关系，以及特定的命理组合：
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  <span className="font-medium">天干合化</span>：
                  分析男女双方日柱天干的关系，如甲己合土、乙庚合金、丙辛合水、丁壬合木、戊癸合火。
                </li>
                <li>
                  <span className="font-medium">地支六合</span>：
                  地支中的子丑合、寅亥合、卯戌合、辰酉合、巳申合、午未合。
                </li>
                <li>
                  <span className="font-medium">地支三合</span>：
                  申子辰三合水局、亥卯未三合木局、寅午戌三合火局、巳酉丑三合金局。
                </li>
                <li>
                  <span className="font-medium">五行生克</span>：
                  分析双方八字中五行的相生（金生水、水生木、木生火、火生土、土生金）
                  和相克（金克木、木克土、土克水、水克火、火克金）关系。
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-purple-800 mb-4" id="modern-relevance">现代意义</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                在现代社会，虽然婚姻的选择更加自由和开放，但八字合婚作为中国传统文化的重要组成部分，
                仍然受到不少人的重视和咨询。
              </p>
              <p>
                我们认为，八字合婚可以作为婚姻参考的一种方式，但不应是决定婚姻的唯一标准。
                良好的沟通、共同的价值观、相互尊重和理解，才是构建幸福婚姻的基石。
              </p>
              <p>
                本网站提供的八字合婚测算服务，旨在传承中国传统文化，为有兴趣了解命理学的朋友提供参考，
                但最终的婚姻决定权仍在您手中。
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 