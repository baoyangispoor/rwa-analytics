# RWA Analytics - 现实世界资产追踪网站

一个现代化的 RWA（现实世界资产）项目追踪网站，采用 DeFiLlama 风格的深色科技主题设计。

## 功能特点

- 📊 实时显示 BTC 和 ETH 价格
- 🏛️ 40+ RWA 项目追踪
- 🔍 分类筛选（政府证券、稳定币、商品、股票等）
- 📈 实时统计信息（总市值、24h 变化）
- 🎨 现代化深色科技风格 UI
- 📱 完全响应式设计

## 快速开始

### 本地运行

1. 在项目目录下运行：
```bash
python3 -m http.server 8000
```

2. 在浏览器中访问：`http://localhost:8000`

## 部署到服务器

### 方法一：Vercel（最简单，推荐）

1. 访问 https://vercel.com 并登录
2. 点击 "Add New Project"
3. 直接拖拽项目文件夹到页面，或连接 Git 仓库
4. 点击 "Deploy"，等待完成
5. 获得免费 URL（如：your-project.vercel.app）

### 方法二：Netlify

1. 访问 https://www.netlify.com 并登录
2. 直接拖拽项目文件夹到部署区域
3. 自动获得免费 URL

### 方法三：使用命令行

运行部署脚本：
```bash
./deploy.sh
```

或直接使用：
```bash
npx vercel
```

## 项目结构

```
.
├── index.html      # 主页面
├── styles.css      # 样式文件
├── script.js       # JavaScript 逻辑
├── vercel.json     # Vercel 配置
└── README.md       # 说明文档
```

## 数据来源

- 价格数据：CoinGecko API
- RWA 项目信息：基于 RWA.xyz

## 技术栈

- 纯 HTML/CSS/JavaScript
- CoinGecko API
- 响应式设计
- 深色科技主题

## 许可证

MIT License
