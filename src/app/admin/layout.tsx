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
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // 关闭侧边栏的函数 - 在点击导航项目后调用
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* 移动端顶部导航栏 */}
      <div className="md:hidden bg-purple-800 text-white flex items-center justify-between p-4">
        <h2 className="text-xl font-bold">八字合婚管理系统</h2>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* 侧边栏 - 使用移动端条件显示 */}
      <aside 
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } md:block fixed md:static inset-0 z-20 md:z-auto bg-purple-800/90 backdrop-blur-sm text-white w-64 md:h-screen overflow-y-auto`}
      >
        {/* 移动端关闭按钮 */}
        <div className="md:hidden flex justify-end p-4">
          <button 
            onClick={() => setSidebarOpen(false)}
            className="text-white focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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
                onClick={closeSidebar}
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

      {/* 侧边栏打开时的半透明背景遮罩 - 仅在移动端显示 */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-10 bg-black/50" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto p-3 md:p-6">
        <div className="bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-lg shadow-md">
          {children}
        </div>
      </main>
    </div>
  );
} 