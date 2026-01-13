#!/bin/bash

echo "🚀 RWA Analytics 网站部署工具"
echo "================================"
echo ""
echo "请选择部署方式："
echo "1. 使用 Vercel（推荐）"
echo "2. 使用 Netlify"
echo "3. 查看部署说明"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo ""
        echo "正在使用 Vercel 部署..."
        echo "如果未安装 Vercel CLI，将自动下载..."
        npx --yes vercel
        ;;
    2)
        echo ""
        echo "正在使用 Netlify 部署..."
        echo "如果未安装 Netlify CLI，将自动下载..."
        npx --yes netlify-cli deploy --prod --dir=.
        ;;
    3)
        echo ""
        cat DEPLOY.md
        ;;
    *)
        echo "无效选项"
        ;;
esac
