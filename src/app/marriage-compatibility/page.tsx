/**
 * 八字合婚 - 合婚测算页面
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { CompatibilityResult } from "@/components/CompatibilityResult";
import { calculateBazi, calculateCompatibility, type CompatibilityScore } from "@/lib/bazi";
import { trackPageVisit } from '@/lib/tracking';
import Script from 'next/script';

// 农历年份选项（1940-2030）
const yearOptions = Array.from({ length: 91 }, (_, i) => 1940 + i);

// 农历月份选项
const monthOptions = [
  { value: "1", label: "正月" },
  { value: "2", label: "二月" },
  { value: "3", label: "三月" },
  { value: "4", label: "四月" },
  { value: "5", label: "五月" },
  { value: "6", label: "六月" },
  { value: "7", label: "七月" },
  { value: "8", label: "八月" },
  { value: "9", label: "九月" },
  { value: "10", label: "十月" },
  { value: "11", label: "冬月" },
  { value: "12", label: "腊月" }
];

// 农历日期选项
const dayOptions = [
  { value: "1", label: "初一" }, { value: "2", label: "初二" },
  { value: "3", label: "初三" }, { value: "4", label: "初四" },
  { value: "5", label: "初五" }, { value: "6", label: "初六" },
  { value: "7", label: "初七" }, { value: "8", label: "初八" },
  { value: "9", label: "初九" }, { value: "10", label: "初十" },
  { value: "11", label: "十一" }, { value: "12", label: "十二" },
  { value: "13", label: "十三" }, { value: "14", label: "十四" },
  { value: "15", label: "十五" }, { value: "16", label: "十六" },
  { value: "17", label: "十七" }, { value: "18", label: "十八" },
  { value: "19", label: "十九" }, { value: "20", label: "二十" },
  { value: "21", label: "廿一" }, { value: "22", label: "廿二" },
  { value: "23", label: "廿三" }, { value: "24", label: "廿四" },
  { value: "25", label: "廿五" }, { value: "26", label: "廿六" },
  { value: "27", label: "廿七" }, { value: "28", label: "廿八" },
  { value: "29", label: "廿九" }, { value: "30", label: "三十" }
];

// 时辰选项
const timeOptions = [
  { value: "子", label: "子时 (23:00-01:00)" },
  { value: "丑", label: "丑时 (01:00-03:00)" },
  { value: "寅", label: "寅时 (03:00-05:00)" },
  { value: "卯", label: "卯时 (05:00-07:00)" },
  { value: "辰", label: "辰时 (07:00-09:00)" },
  { value: "巳", label: "巳时 (09:00-11:00)" },
  { value: "午", label: "午时 (11:00-13:00)" },
  { value: "未", label: "未时 (13:00-15:00)" },
  { value: "申", label: "申时 (15:00-17:00)" },
  { value: "酉", label: "酉时 (17:00-19:00)" },
  { value: "戌", label: "戌时 (19:00-21:00)" },
  { value: "亥", label: "亥时 (21:00-23:00)" }
];

// 闰月选项
const leapMonthOptions = [
  { value: "false", label: "否" },
  { value: "true", label: "是" }
];

const BaziForm = () => {
  const [maleName, setMaleName] = useState('');
  const [maleYear, setMaleYear] = useState('');
  const [maleMonth, setMaleMonth] = useState('');
  const [maleDay, setMaleDay] = useState('');
  const [maleTime, setMaleTime] = useState('');
  const [maleLeapMonth, setMaleLeapMonth] = useState('false');
  
  const [femaleName, setFemaleName] = useState('');
  const [femaleYear, setFemaleYear] = useState('');
  const [femaleMonth, setFemaleMonth] = useState('');
  const [femaleDay, setFemaleDay] = useState('');
  const [femaleTime, setFemaleTime] = useState('');
  const [femaleLeapMonth, setFemaleLeapMonth] = useState('false');
  
  const [result, setResult] = useState<CompatibilityScore | null>(null);
  const [maleBazi, setMaleBazi] = useState<string[] | null>(null);
  const [femaleBazi, setFemaleBazi] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 页面加载时记录访问信息
  useEffect(() => {
    trackPageVisit().catch(err => {
      console.error('Failed to track page visit:', err);
    });
  }, []);

  const handleCalculate = async () => {
    if (!maleName || !maleYear || !maleMonth || !maleDay || !maleTime || 
        !femaleName || !femaleYear || !femaleMonth || !femaleDay || !femaleTime) {
      alert('请填写完整的信息');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // 计算八字
      const maleBaziResult = calculateBazi(
        parseInt(maleYear),
        parseInt(maleMonth),
        parseInt(maleDay),
        maleTime,
        maleLeapMonth === 'true'
      );
      
      const femaleBaziResult = calculateBazi(
        parseInt(femaleYear),
        parseInt(femaleMonth),
        parseInt(femaleDay),
        femaleTime,
        femaleLeapMonth === 'true'
      );
      
      // 计算合婚结果
      const compatibilityResult = calculateCompatibility(maleBaziResult, femaleBaziResult);
      
      // 保存结果到数据库
      const response = await fetch('/api/calculations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          maleName,
          maleYear,
          maleMonth,
          maleDay,
          maleTime,
          maleLeapMonth,
          femaleName,
          femaleYear,
          femaleMonth,
          femaleDay,
          femaleTime,
          femaleLeapMonth,
          ipAddress: null, // 服务端会处理IP地址
          userAgent: navigator.userAgent
        }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        console.error('保存计算结果失败:', data.message);
      }
      
      // 更新状态
      setMaleBazi(maleBaziResult);
      setFemaleBazi(femaleBaziResult);
      setResult(compatibilityResult);
    } catch (err) {
      console.error('计算出错:', err);
      setError('计算过程中出错，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* JSON-LD 结构化数据 */}
      <Script id="json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "八字合婚测算",
        "description": "通过中国传统命理学的八字合婚计算方法，分析双方八字的相合程度，提供详细的婚姻和谐度评估。",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CNY"
        },
        "screenshot": "https://bazi.1895.cn/calculator-screenshot.jpg"
      })}} />

      <div className="max-w-4xl mx-auto p-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-purple-900 mb-6">填写八字信息</h2>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 男方信息 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-800">男方信息</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入姓名"
                value={maleName}
                onChange={(e) => setMaleName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生年份（农历）
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={maleYear}
                onChange={(e) => setMaleYear(e.target.value)}
              >
                <option value="">请选择年份</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生月份（农历）
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={maleMonth}
                onChange={(e) => setMaleMonth(e.target.value)}
              >
                <option value="">请选择月份</option>
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                是否闰月
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={maleLeapMonth}
                onChange={(e) => setMaleLeapMonth(e.target.value)}
              >
                {leapMonthOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生日期（农历）
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={maleDay}
                onChange={(e) => setMaleDay(e.target.value)}
              >
                <option value="">请选择日期</option>
                {dayOptions.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生时辰
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={maleTime}
                onChange={(e) => setMaleTime(e.target.value)}
              >
                <option value="">请选择时辰</option>
                {timeOptions.map(time => (
                  <option key={time.value} value={time.value}>{time.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* 女方信息 */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-800">女方信息</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="请输入姓名"
                value={femaleName}
                onChange={(e) => setFemaleName(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生年份（农历）
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={femaleYear}
                onChange={(e) => setFemaleYear(e.target.value)}
              >
                <option value="">请选择年份</option>
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}年</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生月份（农历）
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={femaleMonth}
                onChange={(e) => setFemaleMonth(e.target.value)}
              >
                <option value="">请选择月份</option>
                {monthOptions.map(month => (
                  <option key={month.value} value={month.value}>{month.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                是否闰月
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={femaleLeapMonth}
                onChange={(e) => setFemaleLeapMonth(e.target.value)}
              >
                {leapMonthOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生日期（农历）
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={femaleDay}
                onChange={(e) => setFemaleDay(e.target.value)}
              >
                <option value="">请选择日期</option>
                {dayOptions.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                出生时辰
              </label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={femaleTime}
                onChange={(e) => setFemaleTime(e.target.value)}
              >
                <option value="">请选择时辰</option>
                {timeOptions.map(time => (
                  <option key={time.value} value={time.value}>{time.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Button 
            onClick={handleCalculate} 
            className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md"
            disabled={loading}
          >
            {loading ? '计算中...' : '计算八字合婚'}
          </Button>
        </div>
      </div>
      
      {result && maleBazi && femaleBazi && (
        <div className="mt-12">
          <CompatibilityResult 
            result={result} 
            male={{ name: maleName, bazi: maleBazi }} 
            female={{ name: femaleName, bazi: femaleBazi }} 
          />
        </div>
      )}
    </>
  );
};

export default function MarriageCompatibility() {
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
        "@type": "WebApplication",
        "name": "八字合婚测算",
        "description": "通过中国传统命理学的八字合婚计算方法，分析双方八字的相合程度，提供详细的婚姻和谐度评估。",
        "applicationCategory": "LifestyleApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "CNY"
        },
        "screenshot": "https://bazi.1895.cn/calculator-screenshot.jpg"
      })}} />

      <main className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto mt-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-purple-900 mb-4">八字合婚测算</h1>
            <p className="text-gray-700">
              通过传统八字命理，分析二人婚姻相合度，了解你们的缘分深浅
            </p>
          </div>
          
          <BaziForm />
          
          <div className="mt-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-purple-900 mb-4">八字合婚的意义</h2>
            <div className="space-y-4 text-gray-700">
              <p>
                八字合婚是中国传统文化中评估男女双方婚姻契合度的重要方法。它基于阴阳五行理论，
                通过分析双方生辰八字，测算在五行、神煞、日主等方面的相互影响，从而评估婚姻和谐程度。
              </p>
              <p>
                虽然现代婚姻以感情为基础，但了解彼此在命理层面的契合度，有助于我们更全面地认识与伴侣的关系，
                预见可能的挑战，珍视彼此的优势互补。
              </p>
              <p>
                本测算仅供参考，希望能为您的幸福婚姻提供一份来自中华传统智慧的参考。无论结果如何，沟通理解、包容尊重始终是婚姻幸福的关键。
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
} 