#!/bin/bash

# 显示彩色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# 输出标题
echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}       八字合婚生产环境一键部署脚本        ${NC}"
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

# 解析命令行参数
REBUILD=false
UPDATE_CODE=true
SHOW_LOGS=false
CLEAN_ALL=false

for arg in "$@"
do
  case $arg in
    --rebuild)
    REBUILD=true
    shift
    ;;
    --no-update)
    UPDATE_CODE=false
    shift
    ;;
    --logs)
    SHOW_LOGS=true
    shift
    ;;
    --clean-all)
    CLEAN_ALL=true
    shift
    ;;
  esac
done

# 检查是否存在.env.production文件
if [ ! -f ".env.production" ]; then
  echo -e "${YELLOW}警告: 未找到.env.production文件, 将创建一个新文件.${NC}"
  
  # 生成安全的MongoDB密码
  MONGO_PASSWORD=$(openssl rand -base64 12)
  
  # 创建.env.production文件
  cat > .env.production << EOF
MONGO_PASSWORD=$MONGO_PASSWORD
EOF
  
  echo -e "${GREEN}已创建.env.production文件并生成随机MongoDB密码.${NC}"
  echo -e "${YELLOW}注意: 请妥善保存.env.production文件，其中包含重要的密码信息!${NC}"
else
  echo -e "${GREEN}已找到.env.production文件.${NC}"
fi

# 拉取最新代码（如果使用git且UPDATE_CODE=true）
if [ -d ".git" ] && [ "$UPDATE_CODE" = true ]; then
  echo -e "${GREEN}拉取最新代码...${NC}"
  git pull
  if [ $? -ne 0 ]; then
    echo -e "${YELLOW}警告: 拉取代码时出现问题，可能是本地有未提交的修改.${NC}"
    echo -e "继续使用当前代码部署..."
  fi
fi

# 加载环境变量
set -a
source .env.production
set +a

# 如果指定了完全清理，则移除所有相关容器、镜像和卷
if [ "$CLEAN_ALL" = true ]; then
  echo -e "${YELLOW}正在完全清理Docker环境...${NC}"
  
  # 停止并移除所有容器
  docker compose -f docker-compose.prod.yml down
  
  # 删除所有bazi相关的容器
  CONTAINERS=$(docker ps -a | grep bazi | awk '{print $1}')
  if [ ! -z "$CONTAINERS" ]; then
    echo -e "${YELLOW}移除所有bazi相关容器...${NC}"
    docker rm -f $CONTAINERS
  fi
  
  # 删除所有bazi相关的镜像
  IMAGES=$(docker images | grep bazi | awk '{print $3}')
  if [ ! -z "$IMAGES" ]; then
    echo -e "${YELLOW}移除所有bazi相关镜像...${NC}"
    docker rmi -f $IMAGES
  fi
  
  # 删除所有bazi相关的卷
  VOLUMES=$(docker volume ls | grep bazi | awk '{print $2}')
  if [ ! -z "$VOLUMES" ]; then
    echo -e "${YELLOW}移除所有bazi相关数据卷...${NC}"
    docker volume rm $VOLUMES
  fi
  
  echo -e "${GREEN}完全清理完成.${NC}"
# 如果指定了重新构建，则先停止并移除旧容器
elif [ "$REBUILD" = true ]; then
  echo -e "${YELLOW}正在停止并移除旧容器...${NC}"
  docker compose -f docker-compose.prod.yml down
  echo -e "${YELLOW}清理未使用的Docker资源...${NC}"
  docker system prune -f
fi

# 构建并启动容器
echo -e "${GREEN}构建并启动容器...${NC}"
if [ "$REBUILD" = true ] || [ "$CLEAN_ALL" = true ]; then
  docker compose -f docker-compose.prod.yml up -d --build --force-recreate
else
  docker compose -f docker-compose.prod.yml up -d --build
fi

# 检查容器是否成功启动
if [ $? -eq 0 ]; then
  echo -e "${GREEN}============================================${NC}"
  echo -e "${GREEN}  🎉 恭喜! 八字合婚应用已成功部署!         ${NC}"
  echo -e "${GREEN}  请确保已配置域名解析和反向代理            ${NC}"
  echo -e "${GREEN}============================================${NC}"
  
  # 等待MongoDB和应用启动
  echo -e "${YELLOW}等待服务启动...${NC}"
  sleep 10
  
  # 检查数据库服务健康状态
  echo -e "${YELLOW}检查MongoDB服务健康状态...${NC}"
  MONGO_HEALTH=$(docker compose -f docker-compose.prod.yml ps -a | grep mongodb | grep healthy)
  if [ -z "$MONGO_HEALTH" ]; then
    echo -e "${RED}警告: MongoDB可能尚未完全启动，可能需要稍后检查.${NC}"
  else
    echo -e "${GREEN}MongoDB服务健康状态正常.${NC}"
  fi
  
  # 检查应用容器健康状态
  echo -e "${YELLOW}检查应用服务健康状态...${NC}"
  APP_HEALTH=$(docker compose -f docker-compose.prod.yml ps -a | grep app | grep healthy)
  if [ -z "$APP_HEALTH" ]; then
    echo -e "${RED}警告: 应用可能尚未完全启动，可能需要稍后检查.${NC}"
  else
    echo -e "${GREEN}应用服务健康状态正常.${NC}"
  fi
  
  echo -e "${YELLOW}重要提示:${NC}"
  echo -e "1. 您应该设置Nginx或其他反向代理以启用HTTPS"
  echo -e "2. MongoDB凭据已保存在.env.production文件中"
  echo -e "3. 可使用以下命令管理服务:"
  echo -e "   - 查看日志: ./deploy-prod.sh --logs"
  echo -e "   - 重建容器: ./deploy-prod.sh --rebuild"
  echo -e "   - 完全清理: ./deploy-prod.sh --clean-all"
  echo -e "   - 不更新代码部署: ./deploy-prod.sh --no-update"
  
  # 如果指定了显示日志，则显示日志
  if [ "$SHOW_LOGS" = true ]; then
    echo -e "${GREEN}显示应用日志...${NC}"
    docker compose -f docker-compose.prod.yml logs -f app
  fi
else
  echo -e "${RED}部署失败，请检查错误信息.${NC}"
  exit 1
fi 