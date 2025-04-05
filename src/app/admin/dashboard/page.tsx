'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Spin, Select, message } from 'antd';

// 定义API响应数据结构
interface DashboardStats {
  visits: {
    total: number;
    uniqueIPs: number;
    dailyTrend: Array<{
      date: string;
      visits: number;
      uniqueCount: number;
    }>;
  };
  devices: {
    移动?: number;
    桌面?: number;
    [key: string]: number | undefined;
  };
  users: {
    total: number;
    new: number;
  };
  calculations: {
    total: number;
    new: number;
  };
  popularPages: Array<{
    path: string;
    views: number;
    percentage: number;
  }>;
  referrerStats: Array<{
    referrer: string;
    count: number;
    percentage: number;
  }>;
  timePeriod: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalVisits: 0,
    todayVisits: 0,
    uniqueIPs: 0,
    mobileDevices: 0,
    desktopDevices: 0,
    calculationsMade: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30); // 默认30天
  const [systemStatus, setSystemStatus] = useState({
    server: '正常运行',
    version: 'v1.0.0',
    updateDate: new Date().toLocaleDateString(),
    database: '已连接'
  });

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  // 从API获取数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/stats/dashboard?days=${timeRange}`);
      if (!response.ok) {
        throw new Error('获取仪表盘数据失败');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const data = result.data as DashboardStats;
        
        // 计算今日访问量（取最后一天的数据）
        const todayVisits = data.visits.dailyTrend.length > 0 
          ? data.visits.dailyTrend[data.visits.dailyTrend.length - 1].visits 
          : 0;
        
        // 设置统计数据
        setStats({
          totalVisits: data.visits.total,
          todayVisits: todayVisits,
          uniqueIPs: data.visits.uniqueIPs,
          mobileDevices: data.devices.移动 || 0,
          desktopDevices: data.devices.桌面 || 0,
          calculationsMade: data.calculations.total
        });
        
        // 更新系统状态（假设数据库连接状态基于API调用成功）
        setSystemStatus({
          ...systemStatus,
          database: '已连接',
          updateDate: new Date().toLocaleDateString()
        });
      } else {
        throw new Error(result.message || '获取仪表盘数据失败');
      }
    } catch (error) {
      console.error('获取仪表盘数据出错:', error);
      message.error('获取仪表盘数据失败，请稍后再试');
      // 更新数据库状态为未连接
      setSystemStatus({
        ...systemStatus,
        database: '未连接'
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, linkTo, loading }: { title: string; value: number; icon: string; linkTo?: string; loading?: boolean }) => (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-medium text-gray-700">{title}</h3>
        <span className="text-purple-500 text-xl sm:text-2xl">{icon}</span>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-8 sm:h-10">
          <Spin size="small" />
        </div>
      ) : (
        <p className="text-2xl sm:text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
      )}
      {linkTo && (
        <Link href={linkTo} className="mt-3 sm:mt-4 inline-block text-sm text-purple-600 hover:text-purple-800">
          查看详情 &rarr;
        </Link>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">系统仪表盘</h1>
        <div className="flex flex-wrap items-center">
          <span className="mr-2 text-sm sm:text-base">时间范围:</span>
          <Select 
            value={timeRange} 
            onChange={setTimeRange}
            style={{ width: 120 }}
            size="middle"
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard 
          title="总访问量" 
          value={stats.totalVisits} 
          icon="👥" 
          loading={loading}
        />
        <StatCard 
          title="今日访问" 
          value={stats.todayVisits} 
          icon="📅" 
          loading={loading}
        />
        <StatCard 
          title="唯一IP数" 
          value={stats.uniqueIPs} 
          icon="🌐" 
          linkTo="/admin/statistics/ip" 
          loading={loading}
        />
        <StatCard 
          title="移动设备" 
          value={stats.mobileDevices} 
          icon="📱" 
          linkTo="/admin/statistics/device" 
          loading={loading}
        />
        <StatCard 
          title="桌面设备" 
          value={stats.desktopDevices} 
          icon="🖥️" 
          linkTo="/admin/statistics/device" 
          loading={loading}
        />
        <StatCard 
          title="合婚计算次数" 
          value={stats.calculationsMade} 
          icon="💑" 
          loading={loading}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">系统状态</h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-sm sm:text-base text-gray-700">服务器状态</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">{systemStatus.server}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-sm sm:text-base text-gray-700">系统版本</span>
            <span className="text-sm sm:text-base text-gray-900">{systemStatus.version}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-sm sm:text-base text-gray-700">上次更新</span>
            <span className="text-sm sm:text-base text-gray-900">{systemStatus.updateDate}</span>
          </div>
          <div className="flex flex-wrap items-center justify-between">
            <span className="text-sm sm:text-base text-gray-700">数据库状态</span>
            <span className={`px-2 py-1 ${systemStatus.database === '已连接' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full text-xs sm:text-sm`}>
              {systemStatus.database}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 