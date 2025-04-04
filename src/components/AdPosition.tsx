/**
 * 八字合婚 - 广告位组件
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

'use client';

import React, { useEffect, useState } from 'react';

interface AdPositionProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}

export function AdPosition({ position = 'bottom-right' }: AdPositionProps) {
  const [adCode, setAdCode] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchAdCode = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ads/get');
        const data = await response.json();
        
        if (data.success && data.adCode) {
          setAdCode(data.adCode);
          setVisible(true);
        } else {
          setVisible(false);
        }
      } catch (error) {
        console.error('Failed to fetch ad code:', error);
        setVisible(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAdCode();
  }, []);

  // 如果没有广告代码或加载中，不显示任何内容
  if (!visible || loading) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 shadow-lg rounded-lg overflow-hidden bg-white`}>
      <div className="relative">
        <button 
          onClick={() => setVisible(false)}
          className="absolute top-1 right-1 bg-gray-800 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10"
          aria-label="关闭广告"
        >
          ×
        </button>
        <div dangerouslySetInnerHTML={{ __html: adCode }} />
      </div>
    </div>
  );
} 