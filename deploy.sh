#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 输出标题
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}      八字合婚系统一键部署脚本            ${NC}"
echo -e "${BLUE}============================================${NC}"

# 检查Docker和Docker Compose是否已安装
if ! [ -x "$(command -v docker)" ]; then
  echo -e "${RED}错误: Docker未安装.${NC}" >&2
  echo -e "请先安装Docker: https://docs.docker.com/get-docker/"
  exit 1
fi

if ! [ -x "$(command -v docker compose)" ]; then
  echo -e "${RED}错误: Docker Compose未安装.${NC}" >&2
  echo -e "请先安装Docker Compose: https://docs.docker.com/compose/install/"
  exit 1
fi

# 拉取最新代码（如果使用git）
if [ -d ".git" ]; then
  echo -e "${GREEN}拉取最新代码...${NC}"
  git pull
fi

# 构建并启动容器
echo -e "${GREEN}构建并启动容器...${NC}"
docker compose up -d --build

# 检查容器是否成功启动
if [ $? -eq 0 ]; then
  echo -e "${GREEN}============================================${NC}"
  echo -e "${GREEN}  🎉 恭喜! 八字合婚系统已成功部署!        ${NC}"
  echo -e "${GREEN}  访问地址: http://localhost:3000          ${NC}"
  echo -e "${GREEN}============================================${NC}"
else
  echo -e "${RED}部署失败，请检查错误信息.${NC}"
  exit 1
fi 