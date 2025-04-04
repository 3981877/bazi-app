'use client';

import { useEffect, useState } from 'react';
import { Spin, Select, message } from 'antd';

interface DeviceStats {
  type: string;
  count: number;
  percentage: number;
}

interface BrowserStats {
  name: string;
  count: number;
  percentage: number;
}

interface OSStats {
  name: string;
  count: number;
  percentage: number;
}

interface DailyVisit {
  date: string;
  total: number;
  mobile: number;
  desktop: number;
}

// 定义API响应数据结构
interface ApiResponse {
  success: boolean;
  data?: {
    deviceStats: DeviceStats[];
    browserStats: BrowserStats[];
    osStats: OSStats[];
    dailyVisits: DailyVisit[];
    totalVisits: number;
    timePeriod: string;
  };
  message?: string;
}

export default function DeviceStatistics() {
  const [deviceStats, setDeviceStats] = useState<DeviceStats[]>([]);
  const [browserStats, setBrowserStats] = useState<BrowserStats[]>([]);
  const [osStats, setOsStats] = useState<OSStats[]>([]);
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
  const [timeRange, setTimeRange] = useState(30); // 默认30天
  const [loading, setLoading] = useState(true);
  const [totalVisits, setTotalVisits] = useState(0);

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // 从API获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats/device?days=${timeRange}`);
      if (!response.ok) {
        throw new Error('获取设备统计数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // 安全地访问数据
        const responseData = result.data;
        
        // 处理设备类型数据
        setDeviceStats(Array.isArray(responseData.deviceStats) ? responseData.deviceStats : []);
        
        // 处理浏览器数据
        setBrowserStats(Array.isArray(responseData.browserStats) ? responseData.browserStats : []);
        
        // 处理操作系统数据
        setOsStats(Array.isArray(responseData.osStats) ? responseData.osStats : []);
        
        // 处理每日访问数据
        setDailyVisits(Array.isArray(responseData.dailyVisits) ? responseData.dailyVisits : []);
        
        // 设置总访问量
        setTotalVisits(typeof responseData.totalVisits === 'number' ? responseData.totalVisits : 0);
      } else {
        throw new Error(result.message || '获取设备统计数据失败');
      }
    } catch (error) {
      console.error('获取设备统计数据出错:', error);
      message.error('获取设备统计数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 渲染进度条统计图
  const renderBarChart = (data: { name: string; count: number; percentage: number }[], colorClass: string) => {
    return (
      <div className="space-y-4">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">暂无数据</p>
          </div>
        ) : (
          data.map((item) => (
            <div key={item.name} className="relative">
              <div className="flex justify-between mb-1">
                <span className="text-gray-700">{item.name}</span>
                <div>
                  <span className="text-gray-900 font-medium">{item.count.toLocaleString()}</span>
                  <span className="text-gray-500 ml-2">({item.percentage}%)</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`${colorClass} h-2.5 rounded-full`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  };

  // 渲染设备类型图表
  const renderDeviceTypeChart = () => {
    return (
      <div className="h-64 flex items-center justify-center">
        {loading ? (
          <Spin tip="加载中..." />
        ) : !deviceStats || deviceStats.length === 0 ? (
          <p className="text-gray-500">暂无数据</p>
        ) : (
          <div className="w-full flex gap-6 items-center">
            <div className="flex-1 h-56 flex items-end justify-center gap-6">
              {deviceStats.map((device) => (
                <div
                  key={device.type}
                  className="relative flex flex-col items-center w-28"
                >
                  <div
                    className={`w-28 ${
                      device.type === '移动' ? 'bg-green-500' : 'bg-blue-500'
                    } rounded-t-lg`}
                    style={{ height: `${((device.percentage || 0) / 100) * 200}px` }}
                  ></div>
                  <div className="mt-2 text-center">
                    <div className="font-medium text-gray-800">{device.type || '未知'}</div>
                    <div className="text-sm text-gray-500">{device.percentage || 0}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-64 space-y-4 text-sm">
              {deviceStats.map((device) => (
                <div key={device.type} className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      device.type === '移动' ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  ></div>
                  <div className="flex-1 flex justify-between">
                    <span>{device.type || '未知'}</span>
                    <span className="font-medium">{(device.count || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>总计</span>
                  <span className="font-medium">
                    {(totalVisits || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // 渲染每日访问趋势图
  const renderDailyTrend = () => {
    if (!dailyVisits || dailyVisits.length === 0) {
      return (
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">暂无数据</p>
        </div>
      );
    }

    const maxValue = Math.max(...dailyVisits.map(day => day.total || 0));
    
    return (
      <div className="relative h-80">
        {/* 图表部分 */}
        <div className="absolute inset-0 flex items-end">
          {dailyVisits.map((day, index) => (
            <div 
              key={day.date} 
              className="relative flex-1 flex flex-col items-center justify-end h-64 group"
              title={`${day.date}: 总访问 ${day.total || 0}, 移动设备 ${day.mobile || 0}, 桌面设备 ${day.desktop || 0}`}
            >
              {/* 移动设备柱状图 */}
              <div 
                className="w-5/6 bg-green-500 transition-all duration-300 group-hover:opacity-90"
                style={{ 
                  height: `${maxValue > 0 ? ((day.mobile || 0) / maxValue) * 100 : 0}%`,
                  minHeight: (day.mobile || 0) > 0 ? '1px' : '0'
                }}
              ></div>
              
              {/* 桌面设备柱状图 */}
              <div 
                className="w-5/6 bg-blue-500 transition-all duration-300 group-hover:opacity-90"
                style={{ 
                  height: `${maxValue > 0 ? ((day.desktop || 0) / maxValue) * 100 : 0}%`,
                  minHeight: (day.desktop || 0) > 0 ? '1px' : '0'
                }}
              ></div>

              {/* 日期标签 - 每隔几天显示一次 */}
              {index % 5 === 0 && (
                <div className="absolute bottom-0 left-0 right-0 text-center transform translate-y-full pt-1">
                  <span className="text-xs text-gray-500">{day.date.substring(5)}</span>
                </div>
              )}
              
              {/* 悬停提示 */}
              <div className="absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                日期: {day.date}<br/>
                总访问: {day.total || 0}<br/>
                移动: {day.mobile || 0} ({(day.total || 0) > 0 ? (((day.mobile || 0) / (day.total || 1)) * 100).toFixed(1) : 0}%)<br/>
                桌面: {day.desktop || 0} ({(day.total || 0) > 0 ? (((day.desktop || 0) / (day.total || 1)) * 100).toFixed(1) : 0}%)
              </div>
            </div>
          ))}
        </div>
        
        {/* 图表底部轴线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">设备统计</h1>
        <div className="flex items-center">
          <span className="mr-2">时间范围:</span>
          <Select 
            value={timeRange} 
            onChange={setTimeRange}
            style={{ width: 120 }}
            options={[
              { value: 7, label: '最近7天' },
              { value: 14, label: '最近14天' },
              { value: 30, label: '最近30天' },
              { value: 90, label: '最近90天' },
              { value: 180, label: '最近180天' },
              { value: 365, label: '最近一年' },
            ]}
          />
        </div>
      </div>

      {/* 每日访问趋势 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">访问趋势 - 按设备类型</h2>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Spin tip="加载中..." />
          </div>
        ) : (
          renderDailyTrend()
        )}
        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">移动设备</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-700">桌面设备</span>
          </div>
        </div>
      </div>

      {/* 设备类型统计 */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">设备类型分布</h2>
        {renderDeviceTypeChart()}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 浏览器统计 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">浏览器分布</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spin tip="加载中..." />
            </div>
          ) : (
            renderBarChart(browserStats, 'bg-purple-600')
          )}
        </div>

        {/* 操作系统统计 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">操作系统分布</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spin tip="加载中..." />
            </div>
          ) : (
            renderBarChart(osStats, 'bg-indigo-600')
          )}
        </div>
      </div>
    </div>
  );
} 