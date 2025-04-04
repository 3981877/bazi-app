/**
 * 八字合婚 - 合婚结果组件
 * Copyright © 2023-present C&L_3981877
 * 未经授权，禁止复制、修改或分发本代码
 */
import React from 'react';
import { type CompatibilityScore } from '@/lib/bazi';

interface Person {
  name: string;
  bazi: string[];
}

export interface CompatibilityResultProps {
  result: CompatibilityScore;
  male: Person;
  female: Person;
}

// 根据分数获取颜色
const getScoreColor = (score: number, max: number): string => {
  const percentage = (score / max) * 100;
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

// 根据分数获取进度条颜色
const getProgressBarColor = (score: number, max: number): string => {
  const percentage = (score / max) * 100;
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const CompatibilityResult: React.FC<CompatibilityResultProps> = ({ result, male, female }) => {
  // 确保数据存在
  if (!result || !male || !female) {
    return null;
  }

  const { totalScore, dayMasterHarmony, fiveElementsBalance, specialCombinations, clashesAvoidance } = result;
  const { dayMasterDetails, fiveElementsDetails, specialCombinationsDetails, clashesDetails } = result.details;

  // 计算总分百分比
  const totalPercentage = Math.round((totalScore / 100) * 100);
  
  const renderBazi = (bazi: string[]) => {
    return (
      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="font-bold">{bazi[0]}{bazi[1]}</div>
          <div className="text-xs text-gray-500">年柱</div>
        </div>
        <div>
          <div className="font-bold">{bazi[2]}{bazi[3]}</div>
          <div className="text-xs text-gray-500">月柱</div>
        </div>
        <div>
          <div className="font-bold">{bazi[4]}{bazi[5]}</div>
          <div className="text-xs text-gray-500">日柱</div>
        </div>
        <div>
          <div className="font-bold">{bazi[6]}{bazi[7]}</div>
          <div className="text-xs text-gray-500">时柱</div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-md overflow-hidden">
      <div className="bg-purple-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white">八字合婚结果分析</h2>
      </div>
      
      <div className="p-6">
        {/* 双方八字信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-gray-200 bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">{male.name}的八字</h3>
            {renderBazi(male.bazi)}
          </div>
          <div className="border border-gray-200 bg-white/80 backdrop-blur-sm rounded-lg p-4">
            <h3 className="text-lg font-semibold text-purple-800 mb-3">{female.name}的八字</h3>
            {renderBazi(female.bazi)}
          </div>
        </div>
        
        {/* 总体评分 */}
        <div className="mb-8">
          <div className="flex justify-between items-end mb-2">
            <h3 className="text-xl font-bold text-gray-800">合婚总评分</h3>
            <div className={`text-3xl font-bold ${getScoreColor(totalScore, 100)}`}>
              {totalScore}分
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className={`h-4 rounded-full ${getProgressBarColor(totalScore, 100)}`}
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
          <p className="mt-3 text-gray-600">
            {totalScore >= 90 ? '非常理想的婚配，天作之合' :
             totalScore >= 80 ? '良好的婚配，相处和谐' :
             totalScore >= 70 ? '中上等婚配，有较好基础' :
             totalScore >= 60 ? '一般婚配，需要互相包容' :
             totalScore >= 50 ? '勉强婚配，婚后可能有较多磨合' :
                               '不建议的婚配，可能面临较大挑战'}
          </p>
        </div>
        
        {/* 分项评分 */}
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4">分项评分</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">日主和谐度</span>
                <span className={`font-bold ${getScoreColor(dayMasterHarmony, 30)}`}>{dayMasterHarmony}/30</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full ${getProgressBarColor(dayMasterHarmony, 30)}`}
                  style={{ width: `${(dayMasterHarmony / 30) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">五行平衡度</span>
                <span className={`font-bold ${getScoreColor(fiveElementsBalance, 25)}`}>{fiveElementsBalance}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full ${getProgressBarColor(fiveElementsBalance, 25)}`}
                  style={{ width: `${(fiveElementsBalance / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">特殊组合</span>
                <span className={`font-bold ${getScoreColor(specialCombinations, 25)}`}>{specialCombinations}/25</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full ${getProgressBarColor(specialCombinations, 25)}`}
                  style={{ width: `${(specialCombinations / 25) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">冲克避免</span>
                <span className={`font-bold ${getScoreColor(clashesAvoidance, 20)}`}>{clashesAvoidance}/20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`h-3 rounded-full ${getProgressBarColor(clashesAvoidance, 20)}`}
                  style={{ width: `${(clashesAvoidance / 20) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 详细分析 */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">详细分析</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 pl-4 py-2">
              <h4 className="font-semibold text-purple-800 mb-2">日主和谐度分析</h4>
              <p className="text-gray-700">{dayMasterDetails}</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-semibold text-blue-800 mb-2">五行平衡度分析</h4>
              <p className="text-gray-700">{fiveElementsDetails}</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4 py-2">
              <h4 className="font-semibold text-green-800 mb-2">特殊组合分析</h4>
              <p className="text-gray-700">{specialCombinationsDetails}</p>
            </div>
            
            <div className="border-l-4 border-red-500 pl-4 py-2">
              <h4 className="font-semibold text-red-800 mb-2">冲克关系分析</h4>
              <p className="text-gray-700">{clashesDetails}</p>
            </div>
          </div>
          
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">注意事项</h4>
            <p className="text-gray-700">
              本合婚结果仅供参考，现代婚姻应以感情基础、价值观契合和相互理解为主要考量因素。
              八字合婚作为传统文化的一部分，可以作为参考，但不应作为婚姻决策的唯一依据。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 