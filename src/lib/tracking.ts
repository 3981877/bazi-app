/**
 * 八字合婚 - 用户访问跟踪工具
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

// 更高级的用户代理解析函数
const parseUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  
  // 检测设备类型
  let device = '未知';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    device = '移动'; // 平板归类为移动设备
  } else if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    device = '移动';
  } else {
    device = '桌面';
  }
  
  // 检测浏览器
  let browser = '未知';
  if (ua.indexOf('micromessenger') > -1) {
    browser = '微信浏览器';
  } else if (ua.indexOf('firefox') > -1) {
    browser = 'Firefox';
  } else if (ua.indexOf('edg') > -1 || ua.indexOf('edge') > -1) {
    browser = 'Edge';
  } else if (ua.indexOf('opr') > -1 || ua.indexOf('opera') > -1) {
    browser = 'Opera';
  } else if (ua.indexOf('chrome') > -1) {
    browser = 'Chrome';
  } else if (ua.indexOf('safari') > -1) {
    browser = 'Safari';
  } else if (ua.indexOf('ucbrowser') > -1) {
    browser = 'UC浏览器';
  } else if (ua.indexOf('qqbrowser') > -1) {
    browser = 'QQ浏览器';
  }
  
  // 检测操作系统
  let os = '未知';
  if (ua.indexOf('windows') > -1) {
    os = 'Windows';
  } else if (ua.indexOf('mac os') > -1) {
    os = 'macOS';
  } else if (ua.indexOf('android') > -1) {
    os = 'Android';
  } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) {
    os = 'iOS';
  } else if (ua.indexOf('linux') > -1) {
    os = 'Linux';
  } else if (ua.indexOf('harmony') > -1) {
    os = '鸿蒙OS';
  }
  
  return { device, browser, os };
};

// 使用IP-API.com获取IP和位置信息
const getIPAndLocation = async (): Promise<{ ip: string; location: string }> => {
  try {
    // 使用IP-API.com的免费API获取IP和位置
    // 注意: 免费版限制为每分钟45个请求，商业用途需付费
    const response = await fetch('http://ip-api.com/json/?fields=status,message,country,regionName,city,query&lang=zh-CN', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    const data = await response.json();
    
    if (data.status === 'success') {
      // 组合位置信息: 国家 + 地区 + 城市
      let location = data.country || '';
      if (data.regionName) {
        location += (location ? ' ' : '') + data.regionName;
      }
      if (data.city && data.city !== data.regionName) {
        location += (location ? ' ' : '') + data.city;
      }
      
      return {
        ip: data.query,
        location: location || '未知',
      };
    } else {
      // 备用方案: 使用ipify只获取IP
      console.warn('IP-API.com请求失败，使用备用方案...');
      const backupResponse = await fetch('https://api.ipify.org?format=json');
      const backupData = await backupResponse.json();
      return {
        ip: backupData.ip,
        location: '未知',
      };
    }
  } catch (error) {
    console.error('获取IP和位置信息失败:', error);
    return {
      ip: '0.0.0.0', // 无法获取IP时的默认值
      location: '未知',
    };
  }
};

// 跟踪访问记录
export const trackPageVisit = async () => {
  try {
    // 解析用户代理
    const userAgent = navigator.userAgent;
    const { device, browser, os } = parseUserAgent(userAgent);
    
    // 获取当前路径和引荐来源
    const path = window.location.pathname;
    const referrer = document.referrer || null;
    
    // 获取IP和位置信息
    const { ip, location } = await getIPAndLocation();
    
    // 发送数据到跟踪API
    const response = await fetch('/api/track-visit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ip,
        location,
        device,
        browser,
        os,
        userAgent,
        path,
        referrer,
      }),
    });
    
    const result = await response.json();
    
    if (!result.success) {
      console.error('Failed to track visit:', result.message);
    }
    
    return result;
  } catch (error) {
    console.error('Error tracking visit:', error);
    return { success: false, message: '跟踪访问失败' };
  }
};