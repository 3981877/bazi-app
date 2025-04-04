'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

// 系统信息接口
interface SystemInfo {
  version: string;
  updateDate: string;
  serverStartTime: string;
  serverStatus: string;
  databaseStatus: string;
  databaseName: string;
  nodeVersion: string;
  environment: string;
}

export default function Settings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [systemInfoLoading, setSystemInfoLoading] = useState(true);
  const router = useRouter();

  // 获取用户信息
  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    if (!userData) {
      router.push('/admin/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUsername(parsedUser.username || '');
      setNewUsername(parsedUser.username || '');
      setUserId(parsedUser.id || '');
      setUserDataLoaded(true);
    } catch (error) {
      console.error('解析用户数据失败:', error);
      router.push('/admin/login');
    }
  }, [router]);

  // 获取系统信息
  useEffect(() => {
    const fetchSystemInfo = async () => {
      try {
        setSystemInfoLoading(true);
        const response = await fetch('/api/admin/system-info');
        if (!response.ok) {
          throw new Error('获取系统信息失败');
        }
        const data = await response.json();
        if (data.success && data.data) {
          setSystemInfo(data.data);
        } else {
          throw new Error(data.message || '获取系统信息失败');
        }
      } catch (error) {
        console.error('获取系统信息错误:', error);
      } finally {
        setSystemInfoLoading(false);
      }
    };

    fetchSystemInfo();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // 输入验证
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: 'error', text: '请填写所有密码字段' });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: '新密码和确认密码不匹配' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: '新密码长度必须至少为6个字符' });
      return;
    }
    
    // 发送修改密码请求
    setLoading(true);
    try {
      const response = await fetch('/api/admin/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: '密码修改成功' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        // 更新本地存储的用户信息
        const userData = localStorage.getItem('adminUser');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          localStorage.setItem('adminUser', JSON.stringify({
            ...parsedUser,
            // 不存储密码在本地
          }));
        }
      } else {
        setMessage({ type: 'error', text: data.message || '密码修改失败' });
      }
    } catch (error) {
      console.error('修改密码错误:', error);
      setMessage({ type: 'error', text: '服务器错误，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  const handleUsernameChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    
    // 输入验证
    if (!newUsername) {
      setMessage({ type: 'error', text: '请填写新用户名' });
      return;
    }
    
    if (newUsername === username) {
      setMessage({ type: 'error', text: '新用户名与当前用户名相同' });
      return;
    }
    
    // 发送修改用户名请求
    setLoading(true);
    try {
      const response = await fetch('/api/admin/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username: newUsername,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: '用户名修改成功' });
        setUsername(newUsername);
        
        // 更新本地存储的用户信息
        const userData = localStorage.getItem('adminUser');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          const updatedUser = {
            ...parsedUser,
            username: newUsername,
          };
          localStorage.setItem('adminUser', JSON.stringify(updatedUser));
        }
      } else {
        setMessage({ type: 'error', text: data.message || '用户名修改失败' });
      }
    } catch (error) {
      console.error('修改用户名错误:', error);
      setMessage({ type: 'error', text: '服务器错误，请稍后再试' });
    } finally {
      setLoading(false);
    }
  };

  if (!userDataLoaded) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  // 格式化日期函数
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">系统设置</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">账户信息</h2>
          <p className="text-gray-600 mt-2">管理您的用户名和个人信息</p>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">修改用户名</h3>
          
          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <form onSubmit={handleUsernameChange} className="max-w-md space-y-4">
            <div>
              <label htmlFor="current-username" className="block text-sm font-medium text-gray-700 mb-1">
                当前用户名
              </label>
              <input
                id="current-username"
                type="text"
                value={username}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              />
            </div>
            
            <div>
              <label htmlFor="new-username" className="block text-sm font-medium text-gray-700 mb-1">
                新用户名
              </label>
              <input
                id="new-username"
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                {loading ? '提交中...' : '更改用户名'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">账户安全</h2>
          <p className="text-gray-600 mt-2">管理您的账户密码和安全设置</p>
        </div>
        
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">修改密码</h3>
          
          {message && (
            <div
              className={`mb-4 p-3 rounded-md ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
          
          <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
            <div>
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                当前密码
              </label>
              <input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                新密码
              </label>
              <input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">密码必须至少6个字符</p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                确认新密码
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <div className="pt-2">
              <Button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={loading}
              >
                {loading ? '提交中...' : '修改密码'}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">系统信息</h2>
        </div>
        
        <div className="p-6">
          {systemInfoLoading ? (
            <div className="text-center py-4">
              <div className="text-gray-500">加载系统信息中...</div>
            </div>
          ) : systemInfo ? (
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">系统版本</span>
                <span className="font-medium">{systemInfo.version}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">上次更新时间</span>
                <span className="font-medium">{formatDate(systemInfo.updateDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">服务器状态</span>
                <span className={`px-2 py-1 ${systemInfo.serverStatus === 'running' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full text-xs`}>
                  {systemInfo.serverStatus === 'running' ? '正常运行' : '异常'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">数据库状态</span>
                <span className={`px-2 py-1 ${systemInfo.databaseStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full text-xs`}>
                  {systemInfo.databaseStatus === 'connected' ? '已连接' : '未连接'}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">数据库名称</span>
                <span className="font-medium">{systemInfo.databaseName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">服务器时间</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Node版本</span>
                <span className="font-medium">{systemInfo.nodeVersion}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">管理员账号</span>
                <span className="font-medium">{username}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="text-red-500">无法加载系统信息</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 