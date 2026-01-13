#!/bin/bash

# 创建GitHub仓库并部署到GitHub Pages
REPO_NAME="rwa-analytics"
USERNAME="baoyangispoor"

echo "正在准备部署到GitHub Pages..."

# 确保所有文件都已提交
git add .
git commit -m "Deploy to GitHub Pages" 2>/dev/null || true

# 创建gh-pages分支
git checkout -b gh-pages 2>/dev/null || git checkout gh-pages

# 添加远程仓库（如果不存在）
if ! git remote | grep -q origin; then
    echo "请先在GitHub上创建仓库: https://github.com/new"
    echo "仓库名: $REPO_NAME"
    echo "然后运行: git remote add origin https://github.com/$USERNAME/$REPO_NAME.git"
    echo "最后运行: git push -u origin gh-pages"
    exit 1
fi

# 推送到GitHub
git push -u origin gh-pages

echo ""
echo "✅ 部署完成！"
echo "访问地址: https://$USERNAME.github.io/$REPO_NAME/"
