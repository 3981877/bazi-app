/**
 * 八字合婚 - 动态背景组件
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

'use client';

import React, { useEffect, useState } from 'react';

export function AnimatedBackground({ children }: { children: React.ReactNode }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="animated-background-wrapper">
      <div 
        className="animated-background"
        style={{
          backgroundPosition: `${mousePosition.x * 100}% ${mousePosition.y * 100}%`,
        }}
      />
      <div className="animated-overlay" />
      <div className="content-container">
        {children}
      </div>
      <style jsx>{`
        .animated-background-wrapper {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow-x: hidden;
        }
        
        .animated-background {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -2;
          background: linear-gradient(
            135deg, 
            #f5e6ff 0%, 
            #e5ccff 25%, 
            #d4b3ff 50%, 
            #c299ff 75%, 
            #b380ff 100%
          );
          background-size: 400% 400%;
          animation: gradientAnimation 15s ease infinite;
          transition: background-position 0.3s ease-out;
        }
        
        .animated-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: -1;
          background: radial-gradient(
            circle at center,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.8) 70%
          );
        }
        
        .content-container {
          position: relative;
          z-index: 1;
        }
        
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
} 