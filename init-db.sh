#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 输出标题
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}      八字合婚系统数据库初始化脚本         ${NC}"
echo -e "${BLUE}============================================${NC}"

# 检查MongoDB容器是否运行
if ! docker ps | grep -q "bazi-mongodb"; then
  echo -e "${YELLOW}未发现运行中的MongoDB容器，尝试启动服务...${NC}"
  docker compose up -d mongodb
  
  # 等待MongoDB启动
  echo -e "${YELLOW}等待MongoDB启动...${NC}"
  sleep 10
fi

# 在Next.js容器中运行数据库初始化代码
echo -e "${GREEN}初始化数据库...${NC}"

# 如果容器已经在运行
if docker ps | grep -q "bazi-app"; then
  # 在现有容器中执行初始化
  docker exec -it bazi-app node -e "
    const { setupDatabase } = require('./lib/dbInit');
    setupDatabase().then(success => {
      if (success) {
        console.log('数据库初始化成功');
        process.exit(0);
      } else {
        console.error('数据库初始化失败');
        process.exit(1);
      }
    }).catch(err => {
      console.error('数据库初始化出错:', err);
      process.exit(1);
    });
  "
else
  # 容器不存在，使用Dockerfile创建临时容器执行初始化
  echo -e "${YELLOW}应用容器未运行，构建临时容器进行初始化...${NC}"
  
  # 构建应用镜像（如果需要）
  docker compose build app
  
  # 运行临时容器仅执行初始化
  docker compose run --rm app node -e "
    const { setupDatabase } = require('./lib/dbInit');
    setupDatabase().then(success => {
      if (success) {
        console.log('数据库初始化成功');
        process.exit(0);
      } else {
        console.error('数据库初始化失败');
        process.exit(1);
      }
    }).catch(err => {
      console.error('数据库初始化出错:', err);
      process.exit(1);
    });
  "
fi

# 检查执行结果
if [ $? -eq 0 ]; then
  echo -e "${GREEN}============================================${NC}"
  echo -e "${GREEN}  🎉 数据库初始化成功!                     ${NC}"
  echo -e "${GREEN}============================================${NC}"
else
  echo -e "${RED}============================================${NC}"
  echo -e "${RED}  ❌ 数据库初始化失败!                     ${NC}"
  echo -e "${RED}============================================${NC}"
  exit 1
fi 