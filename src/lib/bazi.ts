// 天干
export const heavenlyStems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 地支
export const earthlyBranches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 天干对应的五行
export const heavenlyStemsElements = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水"
};

// 地支对应的五行
export const earthlyBranchesElements = {
  "子": "水", "丑": "土",
  "寅": "木", "卯": "木",
  "辰": "土", "巳": "火",
  "午": "火", "未": "土",
  "申": "金", "酉": "金",
  "戌": "土", "亥": "水"
};

// 五行相生关系
export const generatingRelationships = {
  "木": "火",
  "火": "土",
  "土": "金",
  "金": "水",
  "水": "木"
};

// 五行相克关系
export const controllingRelationships = {
  "木": "土",
  "土": "水",
  "水": "火",
  "火": "金",
  "金": "木"
};

// 天干合化关系
export const heavenlyStemsCombinations = [
  { stems: ["甲", "己"], result: "土" },
  { stems: ["乙", "庚"], result: "金" },
  { stems: ["丙", "辛"], result: "水" },
  { stems: ["丁", "壬"], result: "木" },
  { stems: ["戊", "癸"], result: "火" }
];

// 地支六合关系
export const earthlyBranchesCombinations = [
  { branches: ["子", "丑"], result: "土" },
  { branches: ["寅", "亥"], result: "木" },
  { branches: ["卯", "戌"], result: "火" },
  { branches: ["辰", "酉"], result: "金" },
  { branches: ["巳", "申"], result: "水" },
  { branches: ["午", "未"], result: "土" }
];

// 地支相冲关系
export const earthlyBranchesClashes = [
  ["子", "午"], ["丑", "未"], ["寅", "申"], 
  ["卯", "酉"], ["辰", "戌"], ["巳", "亥"]
];

// 定义合婚结果接口
export interface CompatibilityScore {
  totalScore: number;
  dayMasterHarmony: number;
  fiveElementsBalance: number;
  specialCombinations: number;
  clashesAvoidance: number;
  details: {
    dayMasterDetails: string;
    fiveElementsDetails: string;
    specialCombinationsDetails: string;
    clashesDetails: string;
  };
}

/**
 * 计算八字合婚结果
 * @param maleBazi 男方八字
 * @param femaleBazi 女方八字
 * @returns 合婚分数和详细分析
 */
export function calculateCompatibility(maleBazi: string[], femaleBazi: string[]): CompatibilityScore {
  // 提取日柱天干
  const maleDayStem = maleBazi[4];
  const femaleDayStem = femaleBazi[4];
  
  // 1. 日主和谐度 (30分)
  let dayMasterHarmony = 15; // 基础分
  let dayMasterDetails = `男方日主：${maleDayStem}，女方日主：${femaleDayStem}。`;
  
  // 检查天干合化关系
  const dayStemsCombination = heavenlyStemsCombinations.find(
    combo => (combo.stems.includes(maleDayStem) && combo.stems.includes(femaleDayStem))
  );
  
  if (dayStemsCombination) {
    dayMasterHarmony += 15;
    dayMasterDetails += `日主天干${dayStemsCombination.stems[0]}和${dayStemsCombination.stems[1]}相合，形成${dayStemsCombination.result}，关系和谐。`;
  } else {
    // 检查五行生克关系
    const maleStemElement = heavenlyStemsElements[maleDayStem as keyof typeof heavenlyStemsElements];
    const femaleStemElement = heavenlyStemsElements[femaleDayStem as keyof typeof heavenlyStemsElements];
    
    if (generatingRelationships[maleStemElement as keyof typeof generatingRelationships] === femaleStemElement) {
      dayMasterHarmony += 10;
      dayMasterDetails += `男方五行(${maleStemElement})生女方五行(${femaleStemElement})，男方在关系中付出较多。`;
    } else if (generatingRelationships[femaleStemElement as keyof typeof generatingRelationships] === maleStemElement) {
      dayMasterHarmony += 10;
      dayMasterDetails += `女方五行(${femaleStemElement})生男方五行(${maleStemElement})，女方在关系中付出较多。`;
    } else if (controllingRelationships[maleStemElement as keyof typeof controllingRelationships] === femaleStemElement) {
      dayMasterHarmony += 5;
      dayMasterDetails += `男方五行(${maleStemElement})克女方五行(${femaleStemElement})，男方可能在关系中占主导。`;
    } else if (controllingRelationships[femaleStemElement as keyof typeof controllingRelationships] === maleStemElement) {
      dayMasterHarmony += 5;
      dayMasterDetails += `女方五行(${femaleStemElement})克男方五行(${maleStemElement})，女方可能在关系中占主导。`;
    } else {
      dayMasterHarmony += 8;
      dayMasterDetails += `双方五行(${maleStemElement}和${femaleStemElement})关系中性，互不相生相克，关系平淡但稳定。`;
    }
  }
  
  // 2. 五行平衡度 (25分)
  let fiveElementsBalance = 15; // 基础分
  let fiveElementsDetails = "分析双方八字五行分布：";
  
  // 简化处理，实际应用中需要更详细的五行统计和分析
  const maleElements = new Set(maleBazi.map(char => 
    heavenlyStemsElements[char as keyof typeof heavenlyStemsElements] || 
    earthlyBranchesElements[char as keyof typeof earthlyBranchesElements]
  ).filter(Boolean));
  
  const femaleElements = new Set(femaleBazi.map(char => 
    heavenlyStemsElements[char as keyof typeof heavenlyStemsElements] || 
    earthlyBranchesElements[char as keyof typeof earthlyBranchesElements]
  ).filter(Boolean));
  
  // 统计双方五行数量
  const combinedElements = new Set([...Array.from(maleElements), ...Array.from(femaleElements)]);
  
  fiveElementsDetails += `男方五行：${Array.from(maleElements).join("、")}；女方五行：${Array.from(femaleElements).join("、")}。`;
  
  // 根据五行的多样性评分
  if (combinedElements.size >= 5) {
    fiveElementsBalance += 10;
    fiveElementsDetails += "双方八字五行齐全，阴阳平衡，有利于相互补充。";
  } else if (combinedElements.size === 4) {
    fiveElementsBalance += 8;
    fiveElementsDetails += "双方八字五行较为齐全，基本平衡，关系和谐。";
  } else if (combinedElements.size === 3) {
    fiveElementsBalance += 5;
    fiveElementsDetails += "双方八字五行欠缺，平衡性一般，需要相互包容。";
  } else {
    fiveElementsBalance += 2;
    fiveElementsDetails += "双方八字五行单一，平衡性较差，可能在相处中有较多摩擦。";
  }
  
  // 3. 特殊组合 (25分)
  let specialCombinations = 10; // 基础分
  let specialCombinationsDetails = "检查双方八字特殊组合：";
  
  // 检查地支六合关系
  let combinationCount = 0;
  for (const branch1 of maleBazi.filter(char => earthlyBranches.includes(char))) {
    for (const branch2 of femaleBazi.filter(char => earthlyBranches.includes(char))) {
      const combination = earthlyBranchesCombinations.find(
        combo => combo.branches.includes(branch1) && combo.branches.includes(branch2)
      );
      if (combination) {
        combinationCount++;
        specialCombinationsDetails += `地支${branch1}和${branch2}六合，形成${combination.result}。`;
      }
    }
  }
  
  // 根据特殊组合的数量评分
  if (combinationCount >= 3) {
    specialCombinations += 15;
    specialCombinationsDetails += "双方八字中存在多个吉祥组合，婚姻大吉。";
  } else if (combinationCount === 2) {
    specialCombinations += 10;
    specialCombinationsDetails += "双方八字中存在较好组合，婚姻和顺。";
  } else if (combinationCount === 1) {
    specialCombinations += 5;
    specialCombinationsDetails += "双方八字中存在一定组合，婚姻中等。";
  } else {
    specialCombinationsDetails += "双方八字中缺乏特殊组合，婚姻需要经营。";
  }
  
  // 4. 冲克避免 (20分)
  let clashesAvoidance = 20; // 满分开始，有冲克关系则减分
  let clashesDetails = "检查双方八字冲克关系：";
  
  // 检查地支相冲关系
  let clashCount = 0;
  for (const branch1 of maleBazi.filter(char => earthlyBranches.includes(char))) {
    for (const branch2 of femaleBazi.filter(char => earthlyBranches.includes(char))) {
      const clash = earthlyBranchesClashes.find(
        pair => pair.includes(branch1) && pair.includes(branch2)
      );
      if (clash) {
        clashCount++;
        clashesDetails += `地支${branch1}和${branch2}相冲，可能带来矛盾。`;
      }
    }
  }
  
  // 根据冲克关系的数量减分
  if (clashCount >= 3) {
    clashesAvoidance -= 15;
    clashesDetails += "双方八字冲克严重，婚姻中容易产生矛盾。";
  } else if (clashCount === 2) {
    clashesAvoidance -= 10;
    clashesDetails += "双方八字有一定冲克，婚姻中需要相互理解。";
  } else if (clashCount === 1) {
    clashesAvoidance -= 5;
    clashesDetails += "双方八字冲克较少，婚姻基础较好。";
  } else {
    clashesDetails += "双方八字无明显冲克，婚姻和谐。";
  }
  
  // 计算总分
  const totalScore = dayMasterHarmony + fiveElementsBalance + specialCombinations + clashesAvoidance;
  
  return {
    totalScore,
    dayMasterHarmony,
    fiveElementsBalance,
    specialCombinations,
    clashesAvoidance,
    details: {
      dayMasterDetails,
      fiveElementsDetails,
      specialCombinationsDetails,
      clashesDetails
    }
  };
}

/**
 * 八字计算函数
 * @param year 农历年
 * @param month 农历月
 * @param day 农历日
 * @param time 时辰（地支）
 * @param isLeapMonth 是否闰月
 * @returns 八字（年干支、月干支、日干支、时干支）
 */
export function calculateBazi(year: number, month: number, day: number, time: string, isLeapMonth = false): string[] {
  // 推算年干支
  const yearStemIndex = (year - 4) % 10; // 1984年为甲子年，4为基础偏移
  const yearBranchIndex = (year - 4) % 12;
  const yearStem = heavenlyStems[yearStemIndex];
  const yearBranch = earthlyBranches[yearBranchIndex];
  
  // 推算月干支（根据五虎遁口诀）
  // 月支固定：正月寅、二月卯...十二月丑
  const monthBranchIndex = (month + 1) % 12;
  const monthBranch = earthlyBranches[monthBranchIndex];
  
  // 月干根据年干，按五虎遁口诀确定
  // 五虎遁口诀：甲己之年丙作首，乙庚之岁戊为头，
  // 丙辛必定寻庚起，丁壬壬位顺行流，
  // 若问戊癸何方发，甲寅之上好追求
  let monthStemIndex = 0;
  if (yearStemIndex === 0 || yearStemIndex === 5) { // 甲己年
    monthStemIndex = (2 + month - 1) % 10; // 丙作首
  } else if (yearStemIndex === 1 || yearStemIndex === 6) { // 乙庚年
    monthStemIndex = (4 + month - 1) % 10; // 戊为头
  } else if (yearStemIndex === 2 || yearStemIndex === 7) { // 丙辛年
    monthStemIndex = (6 + month - 1) % 10; // 庚起
  } else if (yearStemIndex === 3 || yearStemIndex === 8) { // 丁壬年
    monthStemIndex = (8 + month - 1) % 10; // 壬位
  } else if (yearStemIndex === 4 || yearStemIndex === 9) { // 戊癸年
    monthStemIndex = (0 + month - 1) % 10; // 甲寅
  }
  const monthStem = heavenlyStems[monthStemIndex];
  
  // 推算日干支
  // 使用更准确的算法，基于农历日期计算日柱
  
  // 定义农历年的天数和闰月信息
  // 这是一个简化的农历数据表，实际应用中应使用更完整的农历数据
  // 数据格式：[0-3位: 闰月月份(0表示无闰月), 4-15位: 1-12月大小月标记(1为大月30天，0为小月29天)]
  const lunarInfo = [
    0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, // 1900-1909
    0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, // 1910-1919
    0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, // 1920-1929
    0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, // 1930-1939
    0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, // 1940-1949
    0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, // 1950-1959
    0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, // 1960-1969
    0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, // 1970-1979
    0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, // 1980-1989
    0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, // 1990-1999
    0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, // 2000-2009
    0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, // 2010-2019
    0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, // 2020-2029
    0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, // 2030-2039
    0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0  // 2040-2049
  ];
  
  // 计算从1900年1月31日（农历1900年正月初一）到目标日期的天数
  let offset = 0;
  
  // 计算年份差异带来的天数
  for (let i = 1900; i < year; i++) {
    offset += getLunarYearDays(i, lunarInfo);
  }
  
  // 处理闰月
  let leapMonth = getLeapMonth(year, lunarInfo);
  let isAfterLeapMonth = false;
  
  if (leapMonth > 0) {
    if (month > leapMonth || (month === leapMonth && isLeapMonth)) {
      isAfterLeapMonth = true;
    }
  }
  
  // 加上当年月份的天数
  for (let i = 1; i < month; i++) {
    // 计算大小月的天数
    let monthDays = getMonthDays(year, i, lunarInfo);
    offset += monthDays;
  }
  
  // 如果是闰月，加上前一个月的天数
  if (isLeapMonth && month === leapMonth) {
    offset += getMonthDays(year, month, lunarInfo);
  }
  
  // 加上当月的天数
  offset += day - 1;
  
  // 1900年1月31日是农历1900年正月初一，也是甲子日
  // 甲子日的干支索引为0
  const dayGanZhiIndex = (offset + 40) % 60; // 加40是因为1900年1月31日距离甲子日的偏移
  const dayStem = heavenlyStems[dayGanZhiIndex % 10];
  const dayBranch = earthlyBranches[dayGanZhiIndex % 12];
  
  // 推算时干支
  // 时干与日干相关：甲己日起甲子时，乙庚日起丙子时...
  const timeBranchIndex = earthlyBranches.indexOf(time);
  const dayMasterIndex = heavenlyStems.indexOf(dayStem);
  
  // 根据日干确定时干起始
  // 甲己日起甲子时、乙庚日起丙子时、丙辛日起戊子时、丁壬日起庚子时、戊癸日起壬子时
  let timeStemStartIndex = 0;
  if (dayMasterIndex === 0 || dayMasterIndex === 5) { // 甲己日
    timeStemStartIndex = 0; // 甲子时
  } else if (dayMasterIndex === 1 || dayMasterIndex === 6) { // 乙庚日
    timeStemStartIndex = 2; // 丙子时
  } else if (dayMasterIndex === 2 || dayMasterIndex === 7) { // 丙辛日
    timeStemStartIndex = 4; // 戊子时
  } else if (dayMasterIndex === 3 || dayMasterIndex === 8) { // 丁壬日
    timeStemStartIndex = 6; // 庚子时
  } else if (dayMasterIndex === 4 || dayMasterIndex === 9) { // 戊癸日
    timeStemStartIndex = 8; // 壬子时
  }
  
  // 计算时干索引
  // 子时对应的地支索引为0，每个时辰递增，但天干需要按照规则循环
  const timeStemIndex = (timeStemStartIndex + timeBranchIndex) % 10;
  const timeStem = heavenlyStems[timeStemIndex];
  
  // 返回八字（年干支、月干支、日干支、时干支）
  return [yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch, timeStem, time];
}

/**
 * 获取农历年的总天数
 * @param year 农历年
 * @param lunarInfo 农历数据
 * @returns 该农历年的总天数
 */
function getLunarYearDays(year: number, lunarInfo: number[]): number {
  let yearIndex = year - 1900;
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) {
    return 365; // 默认返回平年天数
  }
  
  let days = 0;
  // 计算12个月的天数
  let lunarData = lunarInfo[yearIndex];
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    days += (lunarData & i) ? 30 : 29;
  }
  
  // 加上闰月天数
  let leapMonth = getLeapMonth(year, lunarInfo);
  if (leapMonth > 0) {
    days += getMonthDays(year, leapMonth, lunarInfo, true);
  }
  
  return days;
}

/**
 * 获取农历月的天数
 * @param year 农历年
 * @param month 农历月
 * @param lunarInfo 农历数据
 * @param isLeapMonth 是否闰月
 * @returns 该农历月的天数
 */
function getMonthDays(year: number, month: number, lunarInfo: number[], isLeapMonth = false): number {
  let yearIndex = year - 1900;
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) {
    return 30; // 默认返回大月
  }
  
  // 如果是闰月且该年有闰月
  if (isLeapMonth) {
    let leapMonth = getLeapMonth(year, lunarInfo);
    if (leapMonth === month) {
      // 闰月的天数
      return (lunarInfo[yearIndex] & 0x10000) ? 30 : 29;
    }
    return 0; // 该年没有对应的闰月
  }
  
  // 正常月份的天数
  let bit = 0x8000 >> (month - 1);
  return (lunarInfo[yearIndex] & bit) ? 30 : 29;
}

/**
 * 获取农历年的闰月月份
 * @param year 农历年
 * @param lunarInfo 农历数据
 * @returns 闰月月份，0表示无闰月
 */
function getLeapMonth(year: number, lunarInfo: number[]): number {
  let yearIndex = year - 1900;
  if (yearIndex < 0 || yearIndex >= lunarInfo.length) {
    return 0; // 默认无闰月
  }
  
  // 取农历数据的低4位
  return lunarInfo[yearIndex] & 0xf;
}