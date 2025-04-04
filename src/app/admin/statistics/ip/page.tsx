'use client';

import { useEffect, useState } from 'react';
import { Spin, Select, message } from 'antd';

interface IPData {
  ip: string;
  location: string;
  visits: number;
  lastVisit: string;
  device: string;
  browser?: string;
  os?: string;
}

// 定义API响应数据结构
interface ApiResponse {
  success: boolean;
  data?: {
    ipStats: IPData[];
    locationStats: Record<string, number>;
    totalUniqueIPs: number;
    timePeriod: string;
  };
  message?: string;
}

export default function IPStatistics() {
  const [ipData, setIpData] = useState<IPData[]>([]);
  const [loading, setLoading] = useState(true);
  const [locationStats, setLocationStats] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [totalIPs, setTotalIPs] = useState(0);
  const [timeRange, setTimeRange] = useState(30); // 默认30天
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IPData;
    direction: 'ascending' | 'descending';
  }>({ key: 'visits', direction: 'descending' });

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // 从API获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats/ip?days=${timeRange}`);
      if (!response.ok) {
        throw new Error('获取IP统计数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        // 安全地访问数据
        const responseData = result.data;
        // 使用类型安全的赋值
        setIpData(Array.isArray(responseData.ipStats) ? responseData.ipStats : []);
        setLocationStats(responseData.locationStats ? responseData.locationStats : {});
        setTotalIPs(typeof responseData.totalUniqueIPs === 'number' ? responseData.totalUniqueIPs : 0);
      } else {
        throw new Error(result.message || '获取IP统计数据失败');
      }
    } catch (error) {
      console.error('获取IP统计数据出错:', error);
      message.error('获取IP统计数据失败，请稍后再试');
    } finally {
      setLoading(false);
    }
  };

  // 排序处理
  const requestSort = (key: keyof IPData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // 应用排序和搜索过滤
  const filteredAndSortedData = () => {
    let filtered = [...ipData];
    
    // 应用搜索过滤
    if (searchTerm) {
      filtered = filtered.filter(
        item =>
          item.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.browser && item.browser.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.os && item.os.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // 应用排序
    filtered.sort((a, b) => {
      // 确保a和b都存在，并且sortConfig.key对应的值存在
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      // 安全地比较值
      if (aValue !== undefined && bValue !== undefined) {
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
      }
      return 0;
    });
    
    return filtered;
  };

  const getSortIndicator = (key: keyof IPData) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? '↑' : '↓';
    }
    return '';
  };

  // 计算总访问量 - 添加安全检查
  const totalVisits = ipData?.length > 0 
    ? ipData.reduce((sum, item) => sum + (item.visits || 0), 0)
    : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">IP访问统计</h1>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* IP来源地区统计 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">来源地区统计</h2>
          <div className="h-80 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Spin tip="加载中..." />
              </div>
            ) : Object.keys(locationStats || {}).length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">暂无数据</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(locationStats || {})
                  .sort((a, b) => b[1] - a[1])
                  .map(([location, count]) => (
                    <div key={location} className="relative">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{location}</span>
                        <span className="text-gray-900 font-medium">
                          {count} ({totalVisits > 0 ? ((count / totalVisits) * 100).toFixed(1) : '0'}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-purple-600 h-2.5 rounded-full"
                          style={{
                            width: `${Object.values(locationStats || {}).length > 0 
                              ? (count / Math.max(...Object.values(locationStats || {}))) * 100 
                              : 0}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* 访问统计概要 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">访问概要</h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Spin tip="加载中..." />
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-600 mb-2">总IP数</h3>
                <p className="text-3xl font-bold text-gray-900">{totalIPs.toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">总访问量</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {totalVisits.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">平均每IP访问次数</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {totalIPs ? (totalVisits / totalIPs).toFixed(2) : '0'}
                </p>
              </div>
              <div>
                <h3 className="text-gray-600 mb-2">地区覆盖</h3>
                <p className="text-3xl font-bold text-gray-900">{Object.keys(locationStats).length}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IP详细列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">IP详细列表</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="搜索 IP、地区、浏览器或操作系统..."
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('ip')}
                >
                  IP地址 {getSortIndicator('ip')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('location')}
                >
                  地区 {getSortIndicator('location')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('visits')}
                >
                  访问次数 {getSortIndicator('visits')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('lastVisit')}
                >
                  最后访问 {getSortIndicator('lastVisit')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => requestSort('device')}
                >
                  设备类型 {getSortIndicator('device')}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  浏览器/操作系统
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center">
                      <Spin tip="加载中..." />
                    </div>
                  </td>
                </tr>
              ) : ipData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    暂无数据
                  </td>
                </tr>
              ) : filteredAndSortedData().length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 whitespace-nowrap text-center text-gray-500">
                    没有找到匹配的记录
                  </td>
                </tr>
              ) : (
                filteredAndSortedData().map((item) => (
                  <tr key={item.ip} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.ip}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.location || '未知'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.visits}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.lastVisit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.device === '移动' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.device || '未知'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.browser && item.os 
                        ? `${item.browser} / ${item.os}` 
                        : item.browser || item.os || '未知'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 