# 网站部署指南

## 方法一：使用 Vercel（推荐 - 最简单）

### 步骤：

1. **访问 Vercel 网站**
   - 打开 https://vercel.com
   - 使用 GitHub、GitLab 或邮箱注册/登录

2. **部署项目**
   - 点击 "Add New Project"
   - 选择 "Import Git Repository"（如果使用 Git）
   - 或者直接拖拽整个项目文件夹到 Vercel 页面

3. **配置项目**
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: 留空
   - Output Directory: ./

4. **完成部署**
   - 点击 "Deploy"
   - 等待几分钟，Vercel 会自动生成一个 URL（如：your-project.vercel.app）
   - 分享这个 URL 给你的朋友即可！

## 方法二：使用 Netlify（同样简单）

### 步骤：

1. **访问 Netlify**
   - 打开 https://www.netlify.com
   - 注册/登录账号

2. **部署项目**
   - 直接拖拽项目文件夹到 Netlify 的部署区域
   - 或者点击 "Add new site" -> "Deploy manually"

3. **完成**
   - Netlify 会自动生成一个 URL
   - 分享给你的朋友！

## 方法三：使用命令行（需要 Node.js）

如果你已经安装了 Node.js 18+，可以运行：

```bash
npx vercel
```

然后按照提示操作即可。

## 注意事项

- 网站是完全静态的，不需要服务器
- 所有数据都通过 CoinGecko API 实时获取
- 部署后会自动获得 HTTPS 证书
- 可以免费使用自定义域名
