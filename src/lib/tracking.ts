/**
 * 八字合婚 - 用户访问跟踪工具
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */

// 更高级的用户代理解析函数
const parseUserAgent = (userAgent: string) => {
  if (!userAgent) {
    return { device: '未知', browser: '未知', os: '未知' };
  }
  
  const ua = userAgent.toLowerCase();
  
  // 检测设备类型 - 使用更准确的检测逻辑
  let device = '未知';
  
  // 针对微信等中国常见App的特殊处理
  if (/(micromessenger|weibo|qq|qzone|tieba|alipay)/i.test(ua)) {
    device = '移动';
  }
  // 针对平板设备 - 注意某些平板在user agent中可能同时包含mobile和tablet字样
  else if (/(ipad|tablet|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    device = '移动';
  }
  // 针对手机设备 - 包含更多移动设备标识
  else if (/(mobile|phone|android|iphone|ipod|ios|blackberry|iemobile|opera mini|opera mobi|webos|symbian|windows phone|kindle|silk|maemo|midp|cldc|up.browser|up.link|blazer|vodafone|huawei|xiaomi|oppo|vivo|miui|harmonyos)/i.test(ua)) {
    device = '移动';
  }
  // 检查屏幕尺寸 - 这里只能在客户端执行时检测
  else if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    device = '移动';
  }
  // 其他情况默认为桌面设备
  else {
    device = '桌面';
  }
  
  // 检测浏览器 - 顺序很重要，因为某些UA包含多个浏览器标识
  let browser = '未知';
  if (ua.indexOf('micromessenger') > -1) {
    browser = '微信浏览器';
  } else if (ua.indexOf('ucbrowser') > -1 || ua.indexOf('ucweb') > -1) {
    browser = 'UC浏览器';
  } else if (ua.indexOf('qqbrowser') > -1) {
    browser = 'QQ浏览器';
  } else if (ua.indexOf('miuibrowser') > -1) {
    browser = '小米浏览器';
  } else if (ua.indexOf('huaweibrowser') > -1) {
    browser = '华为浏览器';
  } else if (ua.indexOf('baiduboxapp') > -1) {
    browser = '百度App';
  } else if (ua.indexOf('edg') > -1 || ua.indexOf('edge') > -1) {
    browser = 'Edge';
  } else if (ua.indexOf('firefox') > -1) {
    browser = 'Firefox';
  } else if (ua.indexOf('opr') > -1 || ua.indexOf('opera') > -1) {
    browser = 'Opera';
  } else if (ua.indexOf('chrome') > -1) {
    browser = 'Chrome';
  } else if (ua.indexOf('safari') > -1) {
    browser = 'Safari';
  } else if (ua.indexOf('trident') > -1 || ua.indexOf('msie') > -1) {
    browser = 'Internet Explorer';
  }
  
  // 检测操作系统
  let os = '未知';
  if (ua.indexOf('harmonyos') > -1) {
    os = '鸿蒙OS';
  } else if (ua.indexOf('android') > -1) {
    // 提取Android版本
    const match = ua.match(/android\s([0-9.]+)/);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) {
    // 提取iOS版本
    const match = ua.match(/os\s([0-9_]+)/);
    const version = match ? match[1].replace(/_/g, '.') : '';
    os = version ? `iOS ${version}` : 'iOS';
  } else if (ua.indexOf('mac') > -1) {
    os = 'macOS';
  } else if (ua.indexOf('win') > -1) {
    // 提取Windows版本
    if (ua.indexOf('windows nt 10') > -1) {
      os = 'Windows 10/11';
    } else if (ua.indexOf('windows nt 6.3') > -1) {
      os = 'Windows 8.1';
    } else if (ua.indexOf('windows nt 6.2') > -1) {
      os = 'Windows 8';
    } else if (ua.indexOf('windows nt 6.1') > -1) {
      os = 'Windows 7';
    } else {
      os = 'Windows';
    }
  } else if (ua.indexOf('linux') > -1) {
    os = 'Linux';
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