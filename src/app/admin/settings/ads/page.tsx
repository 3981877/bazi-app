'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";

export default function AdsSettingsPage() {
  const [adCode, setAdCode] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [position, setPosition] = useState('bottom-right');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 加载广告设置
    const fetchAdSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/ads/get');
        const data = await response.json();
        
        if (data.success && data.adCode) {
          setAdCode(data.adCode);
          setEnabled(true);
          setPosition(data.position || 'bottom-right');
        }
      } catch (err) {
        console.error('Error loading ad settings:', err);
        setError('加载广告设置失败');
      } finally {
        setLoading(false);
      }
    };

    fetchAdSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      setError('');
      
      const response = await fetch('/api/ads/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adCode,
          enabled,
          position,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('广告设置保存成功');
      } else {
        setError(data.error || '保存失败');
      }
    } catch (err) {
      console.error('Error saving ad settings:', err);
      setError('保存广告设置失败');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">广告设置</h1>
      
      {message && (
        <div className="bg-green-100 p-3 rounded-md text-green-700">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 p-3 rounded-md text-red-700">
          {error}
        </div>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-2 mb-2">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-gray-700">启用广告</span>
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            广告位置
          </label>
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="bottom-right">右下角</option>
            <option value="bottom-left">左下角</option>
            <option value="top-right">右上角</option>
            <option value="top-left">左上角</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            广告代码
          </label>
          <textarea
            value={adCode}
            onChange={(e) => setAdCode(e.target.value)}
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="在此粘贴HTML广告代码"
          />
          <p className="mt-1 text-sm text-gray-500">
            请粘贴第三方广告服务商提供的HTML代码，或自定义广告内容。
          </p>
        </div>
        
        <div className="pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
          >
            {saving ? '保存中...' : '保存设置'}
          </Button>
        </div>
      </div>
    </div>
  );
} 