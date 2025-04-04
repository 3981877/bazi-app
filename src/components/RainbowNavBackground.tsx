/**
 * 八字合婚 - 彩虹导航背景组件
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

'use client';

import React, { useEffect, useState, useRef } from 'react';

interface Sparkle {
  id: number;
  left: number;
  top: number;
  size: number;
  opacity: number;
}

export function RainbowNavBackground({ children }: { children: React.ReactNode }) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  // 创建新的星星
  const createSparkle = () => {
    const container = containerRef.current;
    if (!container) return null;
    
    const rect = container.getBoundingClientRect();
    const sparkle: Sparkle = {
      id: Math.random(),
      left: Math.random() * rect.width,
      top: Math.random() * rect.height,
      size: 1 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.7
    };
    
    return sparkle;
  };
  
  // 定期添加和移除星星
  useEffect(() => {
    const addSparkle = () => {
      const sparkle = createSparkle();
      if (sparkle) {
        setSparkles(prev => [...prev, sparkle]);
        
        // 2-3秒后移除星星
        setTimeout(() => {
          setSparkles(prev => prev.filter(s => s.id !== sparkle.id));
        }, 2000 + Math.random() * 1000);
      }
    };
    
    // 初始添加几个星星
    for (let i = 0; i < 5; i++) {
      addSparkle();
    }
    
    // 每隔600-1000ms添加一个新的星星
    const interval = setInterval(() => {
      if (hovered) {
        addSparkle();
      } else if (Math.random() > 0.6) {
        addSparkle();
      }
    }, 600 + Math.random() * 400);
    
    return () => clearInterval(interval);
  }, [hovered]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="rainbow-nav-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div 
        className={`rainbow-nav-background ${hovered ? 'hovered' : ''}`}
        style={{
          backgroundPosition: `${(mousePosition.x * 100) % 100}% 50%`,
          animationDuration: hovered ? '3s' : '6s'
        }}
      >
        {/* 星星效果 */}
        {sparkles.map(sparkle => (
          <div
            key={sparkle.id}
            className="sparkle"
            style={{
              left: `${sparkle.left}px`,
              top: `${sparkle.top}px`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              opacity: sparkle.opacity
            }}
          />
        ))}
      </div>
      {children}
      <style jsx>{`
        .rainbow-nav-wrapper {
          position: relative;
          width: 100%;
        }
        
        .rainbow-nav-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          background: linear-gradient(
            90deg, 
            rgba(255, 0, 0, 0.7) 0%, 
            rgba(255, 154, 0, 0.7) 10%,
            rgba(208, 222, 33, 0.7) 20%,
            rgba(79, 220, 74, 0.7) 30%,
            rgba(63, 218, 216, 0.7) 40%,
            rgba(47, 201, 226, 0.7) 50%,
            rgba(28, 127, 238, 0.7) 60%,
            rgba(95, 21, 242, 0.7) 70%,
            rgba(186, 12, 248, 0.7) 80%,
            rgba(251, 7, 217, 0.7) 90%,
            rgba(255, 0, 0, 0.7) 100%
          );
          background-size: 200% 100%;
          animation: rainbow 6s linear infinite;
          backdrop-filter: blur(6px);
          opacity: 0.85;
          transition: all 0.3s ease;
        }
        
        .rainbow-nav-background.hovered {
          opacity: 0.95;
          backdrop-filter: blur(8px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .sparkle {
          position: absolute;
          border-radius: 50%;
          background-color: white;
          pointer-events: none;
          animation: sparkle-animation 2s ease forwards;
        }
        
        @keyframes rainbow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
        
        @keyframes sparkle-animation {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          25% {
            transform: scale(1);
            opacity: var(--opacity, 1);
          }
          75% {
            transform: scale(1);
            opacity: var(--opacity, 1);
          }
          100% {
            transform: scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
} 