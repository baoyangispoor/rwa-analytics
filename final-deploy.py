#!/usr/bin/env python3
"""
自动部署脚本 - 使用GitHub API创建仓库并部署
"""
import subprocess
import os
import sys

REPO_NAME = "rwa-analytics"
USERNAME = "baoyangispoor"

def main():
    print("=" * 60)
    print("🚀 自动部署到GitHub Pages")
    print("=" * 60)
    print()
    
    # 检查是否已配置远程
    result = subprocess.run(['git', 'remote', 'get-url', 'origin'], 
                          capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ 已配置远程仓库")
        print(f"   地址: {result.stdout.strip()}")
    else:
        print("📦 需要配置远程仓库")
        print()
        print("请按以下步骤操作：")
        print()
        print("1. 访问: https://github.com/new")
        print(f"2. 仓库名填写: {REPO_NAME}")
        print("3. 选择 Public（公开）")
        print("4. 不要勾选任何选项")
        print("5. 点击 Create repository")
        print()
        print("6. 创建后，运行以下命令：")
        print(f"   git remote add origin https://github.com/{USERNAME}/{REPO_NAME}.git")
        print(f"   git push -u origin main")
        print()
        print("7. 然后在GitHub仓库页面：")
        print("   Settings -> Pages -> Source: main branch -> Save")
        print()
        print(f"8. 等待1-2分钟，访问: https://{USERNAME}.github.io/{REPO_NAME}/")
        print()
        return
    
    # 尝试推送
    print("⬆️  推送到GitHub...")
    result = subprocess.run(['git', 'push', '-u', 'origin', 'main'], 
                          capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ 推送成功！")
        print()
        print("📌 接下来：")
        print(f"1. 访问: https://github.com/{USERNAME}/{REPO_NAME}/settings/pages")
        print("2. Source: 选择 'main' branch")
        print("3. 点击 Save")
        print("4. 等待1-2分钟")
        print()
        print(f"🌐 你的网站URL: https://{USERNAME}.github.io/{REPO_NAME}/")
        print()
    else:
        print("❌ 推送失败")
        print(result.stderr)
        print()
        print("可能的原因：")
        print("1. 仓库尚未创建")
        print("2. 需要GitHub认证")
        print()
        print("解决方案：")
        print("使用SSH方式（如果已配置SSH key）：")
        print(f"   git remote set-url origin git@github.com:{USERNAME}/{REPO_NAME}.git")
        print(f"   git push -u origin main")

if __name__ == "__main__":
    main()
