/**
 * 八字合婚 - SEO头部组件
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

'use client';

import React from 'react';
import Script from 'next/script';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  jsonLd?: Record<string, any>;
}

/**
 * SEOHead组件仅用于设置客户端元数据，比如JSON-LD结构化数据
 * 注意：页面的主要元数据应该在服务端组件中使用metadata导出
 */
export function SEOHead({
  title,
  description,
  keywords = [],
  jsonLd,
}: SEOHeadProps) {
  return (
    <>
      {/* 结构化数据 */}
      {jsonLd && (
        <Script
          id="json-ld-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </>
  );
} 