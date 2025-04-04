/**
 * 八字合婚 - 浮动元素背景组件
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */
'use client';

import React, { useEffect, useState } from 'react';

interface FloatingElement {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  element: string;
  rotation: number;
  rotationSpeed: number;
}

export function FloatingElements() {
  const [elements, setElements] = useState<FloatingElement[]>([]);

  // 五行元素和八卦符号
  const symbols = [
    '☵', // 水
    '☲', // 火
    '☴', // 木
    '☷', // 土
    '☰', // 金
    '☳', // 震
    '☱', // 兑
    '☶', // 艮
    '☴', // 巽
  ];

  useEffect(() => {
    // 创建10-15个随机浮动元素
    const count = 10 + Math.floor(Math.random() * 6);
    const newElements: FloatingElement[] = [];
    
    for (let i = 0; i < count; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 20 + Math.random() * 30,
        opacity: 0.2 + Math.random() * 0.3,
        speed: 0.3 + Math.random() * 0.7,
        element: symbols[Math.floor(Math.random() * symbols.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2
      });
    }
    
    setElements(newElements);
    
    // 添加动画帧
    let animationFrameId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      const deltaTime = time - lastTime;
      lastTime = time;
      
      if (deltaTime > 0) {
        setElements(prevElements => 
          prevElements.map(element => {
            // 更新位置
            let newY = element.y - (element.speed * deltaTime) / 100;
            // 超出顶部后从底部重新进入
            if (newY < -10) {
              newY = 110;
              // 在水平位置也做一些随机变化
              return {
                ...element,
                y: newY,
                x: Math.random() * 100,
                rotation: element.rotation + element.rotationSpeed * deltaTime / 50,
                opacity: 0.2 + Math.random() * 0.3,
                size: 20 + Math.random() * 30
              };
            }
            
            return {
              ...element,
              y: newY,
              rotation: element.rotation + element.rotationSpeed * deltaTime / 50
            };
          })
        );
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="floating-elements-container">
      {elements.map(element => (
        <div
          key={element.id}
          className="floating-element"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
            fontSize: `${element.size}px`,
            opacity: element.opacity,
            transform: `rotate(${element.rotation}deg)`,
          }}
        >
          {element.element}
        </div>
      ))}
      <style jsx>{`
        .floating-elements-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: -1;
          overflow: hidden;
        }
        
        .floating-element {
          position: absolute;
          color: rgba(138, 43, 226, 0.3);
          font-size: 30px;
          transition: opacity 1s ease;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
} 