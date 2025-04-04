#!/bin/sh
echo "将最新代码推送到GitHub..."
git add .
git commit -m "自动更新: $(date)"
git push -u origin main
echo "推送完成!"
