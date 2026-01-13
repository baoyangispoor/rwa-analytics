#!/bin/bash

# 自动部署脚本
REPO_NAME="rwa-analytics"
USERNAME="baoyangispoor"
REPO_URL="https://github.com/$USERNAME/$REPO_NAME.git"

echo "🚀 开始自动部署..."
echo ""

# 确保在正确的目录
cd "$(dirname "$0")"

# 检查是否已有远程仓库
if git remote | grep -q origin; then
    echo "✅ 已配置远程仓库"
    REMOTE_URL=$(git remote get-url origin)
    echo "   远程地址: $REMOTE_URL"
else
    echo "📦 配置远程仓库..."
    git remote add origin $REPO_URL 2>/dev/null || {
        echo "❌ 无法添加远程仓库"
        echo ""
        echo "请先创建GitHub仓库："
        echo "1. 访问: https://github.com/new"
        echo "2. 仓库名: $REPO_NAME"
        echo "3. 选择 Public"
        echo "4. 创建后运行此脚本 again"
        exit 1
    }
fi

# 确保所有文件已提交
echo "📝 提交更改..."
git add .
git commit -m "Deploy to GitHub Pages" --allow-empty 2>/dev/null || true

# 切换到main分支
echo "🌿 切换到main分支..."
git checkout -b main 2>/dev/null || git checkout main

# 推送到GitHub
echo "⬆️  推送到GitHub..."
git push -u origin main --force 2>&1

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo ""
    echo "📌 接下来："
    echo "1. 访问: https://github.com/$USERNAME/$REPO_NAME/settings/pages"
    echo "2. Source: 选择 'main' branch"
    echo "3. 点击 Save"
    echo "4. 等待1-2分钟"
    echo ""
    echo "🌐 你的网站URL:"
    echo "   https://$USERNAME.github.io/$REPO_NAME/"
    echo ""
else
    echo ""
    echo "❌ 推送失败"
    echo "请检查："
    echo "1. GitHub仓库是否已创建: https://github.com/$USERNAME/$REPO_NAME"
    echo "2. 是否有推送权限"
    echo ""
fi
