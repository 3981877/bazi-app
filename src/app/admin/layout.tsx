'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userData = localStorage.getItem('adminUser');
    
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUsername(user.username || '管理员');
      } catch (e) {
        setIsLoggedIn(false);
        localStorage.removeItem('adminUser');
      }
    } else {
      setIsLoggedIn(false);
    }
    
    // 如果未登录且不在登录页面，则重定向到登录页
    if (!userData && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [pathname, router]);

  // 在客户端渲染之前不返回任何内容
  if (!mounted) return null;

  // 如果是登录页，不显示侧边栏
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // 如果未登录，不显示内容
  if (!isLoggedIn) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('adminUser');
    setIsLoggedIn(false);
    router.push('/admin/login');
  };

  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 bg-purple-800/90 backdrop-blur-sm text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">八字合婚管理系统</h2>
          <div className="mt-2 text-sm text-purple-200">
            欢迎回来，{username}
          </div>
        </div>
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            <li>
              <Link
                href="/admin/dashboard"
                className={`block py-2 px-4 rounded transition ${
                  pathname === '/admin/dashboard'
                    ? 'bg-purple-700 text-white'
                    : 'hover:bg-purple-700'
                }`}
              >
                仪表盘
              </Link>
            </li>
            <li>
              <Link
                href="/admin/statistics/ip"
                className={`block py-2 px-4 rounded transition ${
                  pathname === '/admin/statistics/ip'
                    ? 'bg-purple-700 text-white'
                    : 'hover:bg-purple-700'
                }`}
              >
                IP统计
              </Link>
            </li>
            <li>
              <Link
                href="/admin/statistics/device"
                className={`block py-2 px-4 rounded transition ${
                  pathname === '/admin/statistics/device'
                    ? 'bg-purple-700 text-white'
                    : 'hover:bg-purple-700'
                }`}
              >
                设备统计
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings"
                className={`block py-2 px-4 rounded transition ${
                  pathname === '/admin/settings'
                    ? 'bg-purple-700 text-white'
                    : 'hover:bg-purple-700'
                }`}
              >
                系统设置
              </Link>
            </li>
            <li>
              <Link
                href="/admin/settings/ads"
                className={`block py-2 px-4 rounded transition ${
                  pathname === '/admin/settings/ads'
                    ? 'bg-purple-700 text-white'
                    : 'hover:bg-purple-700'
                }`}
              >
                广告管理
              </Link>
            </li>
          </ul>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 transition text-white rounded"
          >
            退出登录
          </button>
        </div>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto p-6">
        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-md">
          {children}
        </div>
      </main>
    </div>
  );
} 