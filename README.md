# 八字合婚计算系统

这是一个基于Next.js开发的八字合婚计算系统，使用MongoDB数据库存储数据。

## 功能介绍

- 八字合婚计算
- 管理员后台
- 访问统计分析
- 合婚记录查询

## 技术栈

- **前端**: Next.js, React, TailwindCSS
- **后端**: Next.js API Routes
- **数据库**: MongoDB (mongoose)
- **部署**: Docker, Docker Compose

## 🐳 Docker一键部署 (推荐)

只需几个简单的步骤，即可使用Docker部署整个系统：

### 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)

### 一键部署

1. 克隆仓库
```bash
git clone <repository-url>
cd bazi
```

2. 使用部署脚本
```bash
# 给脚本添加执行权限
chmod +x deploy.sh

# 启动应用
./deploy.sh start
```

3. 应用将在 http://localhost:3000 运行
   - 管理员登录地址: http://localhost:3000/admin/login
   - 用户名: admin
   - 密码: admin123

### 其他命令

```bash
# 查看应用状态
./deploy.sh status

# 查看日志
./deploy.sh logs

# 重启应用
./deploy.sh restart

# 停止应用
./deploy.sh stop
```

### 自定义配置

如需自定义配置，可以修改`docker-compose.yml`文件中的环境变量：

```yaml
environment:
  - MONGODB_URI=mongodb://bazi_user:bazi_password@mongodb:27017/bazi_app
  - NEXT_PUBLIC_APP_URL=http://localhost:3000
  - TRACK_VISITS=true
```

## 开发环境设置

如果您想在本地开发环境运行系统，请参考以下步骤：

### 前提条件

- Node.js 18+
- MongoDB (本地或云端)
- npm 或 yarn

### 安装步骤

1. 克隆仓库

```bash
git clone <repository-url>
cd bazi
```

2. 安装依赖

```bash
npm install
```

3. 配置环境变量

复制`.env.local.example`文件为`.env.local`，并按需修改配置：

```bash
cp .env.local.example .env.local
```

主要配置项：
- `MONGODB_URI`: MongoDB连接URI
- `NEXT_PUBLIC_APP_URL`: 应用URL
- `TRACK_VISITS`: 是否跟踪访问统计

4. 初始化数据库

运行以下命令初始化管理员账户：

```bash
npm run seed
```

默认管理员账户：
- 用户名: admin
- 密码: admin123

5. 启动开发服务器

```bash
npm run dev
```

现在可以通过 http://localhost:3000 访问应用。

## 真实数据库连接

本应用使用MongoDB作为数据库。系统已从模拟数据转换为使用真实数据库。主要数据表包括：

1. **用户(User)** - 存储管理员信息
2. **访问记录(Visit)** - 记录网站访问数据
3. **合婚计算(Calculation)** - 存储合婚计算记录

## 手动部署到生产环境

1. 构建应用

```bash
npm run build
```

2. 启动生产服务器

```bash
npm start
```

## 后台管理

管理员可以通过访问 `/admin/login` 登录后台，查看统计数据和合婚记录。

## 功能特点

- 根据双方生辰八字计算婚姻契合度
- 分析五行相生相克关系
- 计算日主和谐度、五行平衡度、特殊组合和冲克避免等指标
- 提供详细的合婚分析报告
- 响应式设计，适配各种设备

## 项目结构

```
bazi-marriage-compatibility/
├── public/              # 静态资源
├── src/
│   ├── app/             # Next.js 应用页面
│   │   ├── about/       # 关于页面
│   │   ├── marriage-compatibility/ # 合婚测算页面
│   │   ├── globals.css  # 全局样式
│   │   ├── layout.tsx   # 布局组件
│   │   └── page.tsx     # 首页
│   ├── components/      # React组件
│   │   ├── ui/          # UI组件
│   │   └── CompatibilityResult.tsx # 合婚结果组件
│   └── lib/             # 工具函数和核心逻辑
│       ├── utils.ts     # 通用工具函数
│       └── bazi.ts      # 八字计算核心逻辑
├── package.json         # 项目依赖
├── tsconfig.json        # TypeScript配置
├── tailwind.config.js   # Tailwind CSS配置
└── README.md            # 项目说明
```

## 八字合婚原理

八字合婚是中国传统文化中预测婚姻的重要方法，通过分析双方的生辰八字，判断两人在五行能量上的相生相克关系，预测婚后的和谐程度。

本系统主要考察以下几个方面：

- **日干合化**：分析男女双方日柱天干的关系，是相合还是相冲
- **五行相生相克**：分析双方八字中五行的互动关系
- **纳音五行**：分析双方八字纳音五行的相合程度
- **神煞组合**：分析双方八字特定神煞的组合情况
- **生肖合婚**：分析双方生肖的相配程度

## 注意事项

- 本系统提供的八字合婚结果仅供参考，不应作为婚姻决策的唯一依据
- 八字合婚是中国传统文化的一部分，现代婚姻更应注重感情基础和相互理解
- 系统使用的八字计算方法为简化版本，可能与传统命理学有差异

## 管理员登录

- 登录地址：[/admin/login](/admin/login)
- 默认账号：admin
- 默认密码：admin123

## 许可证

MIT

## 联系方式

如有问题或建议，请联系：[a@1895.cn](mailto:a@1895.cn)

# 八字合婚系统

基于中国传统命理学的八字合婚计算方法，提供专业的婚姻配对分析，测算两人八字相合程度。

## 功能特点

- 基于个人生辰八字的婚姻配对分析
- 详细的合婚结果和分项评分
- 响应式设计，支持各种设备
- 传统命理与现代技术的完美结合
- 自动连接数据库和初始化系统

## 一键部署指南

### 前提条件

- 安装 [Docker](https://docs.docker.com/get-docker/)
- 安装 [Docker Compose](https://docs.docker.com/compose/install/)

### 开发环境部署

1. 克隆代码仓库（或直接下载代码）：
   ```bash
   git clone https://your-repository-url.git
   cd bazi
   ```

2. 使用一键部署脚本：
   ```bash
   ./deploy.sh
   ```

3. 访问应用：
   - 网站前台：http://localhost:3000
   - 管理后台：http://localhost:3000/admin/login
   - 默认管理员账号：admin
   - 默认管理员密码：admin123

### 数据库自动连接

系统具有自动数据库连接和初始化功能：

1. 应用启动时会自动尝试连接到MongoDB数据库
2. 连接失败时会自动重试，最多重试5次
3. 首次启动时会自动创建必要的数据库集合
4. 如果没有管理员账号，会自动创建默认管理员账号

如需手动初始化数据库，可以运行：
```bash
./init-db.sh
```

### 生产环境部署

对于生产环境，请使用专门的部署脚本：

```bash
./deploy-prod.sh
```

生产环境部署脚本会：

1. 自动生成安全的MongoDB密码并保存到.env.production文件中
2. 使用docker-compose.prod.yml配置文件启动服务
3. 配置MongoDB安全认证
4. 设置适当的日志轮转策略
5. 确保MongoDB启动后才启动应用服务

部署后，建议：

1. 配置反向代理（如Nginx）并启用HTTPS
2. 确保域名bazi.1895.cn已正确解析到您的服务器
3. 定期备份MongoDB数据

### 手动部署

如果您想手动控制部署过程，可以直接使用以下命令：

```bash
# 开发环境
docker compose up -d --build

# 生产环境
docker compose -f docker-compose.prod.yml up -d --build

# 查看容器状态
docker compose ps

# 查看应用日志
docker compose logs -f app

# 停止服务
docker compose down
```

### 配置说明

- 应用默认在3000端口运行
- MongoDB数据库默认在27017端口运行
- 数据持久化存储在Docker卷中

## 技术栈

- 前端：Next.js, React, TailwindCSS
- 后端：Next.js API Routes
- 数据库：MongoDB
- 部署：Docker, Docker Compose

## 许可证

Copyright © 2023-present C&L_3981877
未经授权，禁止复制、修改或分发本代码

# 部署说明

## Docker一键部署

本系统支持使用Docker进行一键部署，非常适合生产环境使用。

### 前提条件

- 已安装 Docker 和 Docker Compose
- 服务器内存至少2GB (推荐4GB或更高)
- 磁盘空间至少1GB

### 快速部署步骤

1. 确保你已经安装了Docker和Docker Compose

2. 执行部署脚本
```bash
./deploy-prod.sh
```

该脚本会自动：
- 检查环境并创建必要的配置文件
- 生成安全的MongoDB密码
- 构建并启动应用和数据库容器
- 设置自动数据库备份（每24小时一次）
- 配置健康检查以确保服务可靠性

### 部署脚本选项

脚本支持以下参数：

```bash
# 完全重建容器
./deploy-prod.sh --rebuild

# 不更新代码直接部署
./deploy-prod.sh --no-update

# 部署后显示日志
./deploy-prod.sh --logs

# 组合使用
./deploy-prod.sh --rebuild --logs
```

### 自动备份功能

系统会自动进行数据库备份：
- 每24小时自动备份一次数据库
- 备份保存在项目根目录的`backups`文件夹中
- 自动保留最近10个备份，删除更早的备份

### 健康检查功能

系统集成了健康检查API，可通过以下地址访问：
```
http://your-domain.com/api/healthcheck
```

此API提供：
- 应用运行状态
- 数据库连接状态
- 系统运行时间
- 内存使用情况

Docker容器也配置了健康检查，确保服务可靠运行。

### 部署后管理

部署完成后，可以通过以下命令管理服务：

```bash
# 查看容器状态
docker compose -f docker-compose.prod.yml ps

# 查看应用日志
docker compose -f docker-compose.prod.yml logs -f app

# 查看数据库日志
docker compose -f docker-compose.prod.yml logs -f mongodb

# 停止服务
docker compose -f docker-compose.prod.yml down

# 重启服务
docker compose -f docker-compose.prod.yml restart
```

### 初始管理员账户

系统会自动创建默认管理员账户：
- 用户名：admin
- 密码：admin123

**重要：** 首次登录后请立即修改默认密码！
