---
title: "Waline 评论系统部署备忘"
weight: 999
---

# Waline 评论系统部署备忘

hugo-book 主题集成 Waline 评论系统，使用 MongoDB Atlas + Vercel 免费部署。

## 架构

- **评论前端**：Waline JS SDK，嵌入页面
- **评论后端**：Waline 服务，部署在 Vercel
- **数据库**：MongoDB Atlas（免费 M0，512MB）

---

## 第一步：MongoDB Atlas 数据库

1. 注册 [cloud.mongodb.com](https://cloud.mongodb.com)
2. 创建集群：Free tier (M0) → 选 Singapore 区域
3. 创建数据库用户：Database Access → Add New User → 记录用户名和密码
4. 开放网络访问：Network Access → Add IP Address → `0.0.0.0/0`
5. 获取连接字符串：Connect → Drivers → 复制，格式：
   ```
   mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/waline
   ```

---

## 第二步：Vercel 部署 Waline 服务

1. 访问以下链接一键部署：
   ```
   https://vercel.com/new/clone?repository-url=https://github.com/walinejs/waline/tree/main/example
   ```
2. 在 Vercel 部署时添加环境变量：
   ```
   MONGODB_URI = mongodb+srv://用户名:密码@cluster0.xxxxx.mongodb.net/waline
   ```
3. 部署完成后得到服务地址：`https://xxx.vercel.app`

---

## 第三步：更新 hugo.yaml

```yaml
params:
  comments:
    waline:
      serverURL: "https://xxx.vercel.app"  # 替换为实际地址
      lang: "zh-CN"
    # giscus:  # 已注释，如需切换回来取消注释
    #   repo: "pemako/pemako.github.io"
    #   ...
```

---

## 评论模板（layouts/partials/docs/comments.html）

Waline 主题跟随 `BookTheme` 参数自动切换：
- `BookTheme: light` → Waline light
- `BookTheme: dark` → Waline dark
- `BookTheme: auto` → 跟随系统

---

## 备选方案

| 方案 | 免费额度 | 说明 |
|------|----------|------|
| MongoDB Atlas | 512MB | 当前使用 |
| LeanCloud 国际版 | 有限免费 | 已停止注册新用户 |
| Supabase | PostgreSQL 500MB | 需配置 `PG_*` 环境变量 |
| Neon | PostgreSQL 0.5GB | Vercel Postgres 底层 |
