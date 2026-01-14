#!/bin/bash

# Bitchain DEX 自动部署脚本

echo "🚀 开始部署 Bitchain DEX..."

# 检查git状态
echo "📋 检查Git状态..."
git status

# 添加所有更改
echo "📦 添加文件到暂存区..."
git add -A

# 提交更改
echo "💾 提交更改..."
git commit -m "更新: $(date '+%Y-%m-%d %H:%M:%S')"

# 推送到GitHub
echo "⬆️  推送到GitHub..."
git push origin main

# 检查推送结果
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 部署成功！"
    echo "🌐 访问地址: https://baoyangispoor.github.io/rwa-analytics/"
    echo "⏱️  GitHub Pages将在2-5分钟内更新"
else
    echo ""
    echo "❌ 推送失败，请检查网络连接和Git配置"
fi
