# 📚 典藏文学日历 Cloud

基于 Next.js + Prisma + PostgreSQL 的云端日历应用。

🔗 **在线访问**: https://calendar-black-nu.vercel.app

---

## ✨ 功能特点

- 📅 **优雅日历** - 超大日期展示 + 传统农历（十二律月名）+ 节气
- 📖 **文学人物** - 每日一位经典文学角色，配有名言摘录
- ✅ **待办清单** - 简洁的 TODO 管理，支持完成状态切换
- 📝 **日程备忘** - 快速记录每日重要事项
- 🔐 **GitHub 登录** - 安全的 OAuth 认证
- ☁️ **云端同步** - 数据自动保存到 PostgreSQL，多设备自动同步

---

## 🎨 UI 设计

完全复刻本地 v0.3 版本的经典设计：

- **左右分栏布局** - 左侧文学画廊 + 右侧日历工具
- **书本式容器** - 圆角卡片设计，类似翻开的书本
- **暖色调配色** - 米色 `#f4f1ea`、深棕 `#5a4d3f`、 cream `#fdfaf5`
- **传统字体** - Noto Serif SC（正文）+ Ma Shan Zheng（书法标题）
- **竖排文字** - 文学人物名字采用传统竖排展示

---

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| **前端** | Next.js 15 + React 19 + TypeScript + Tailwind CSS |
| **认证** | NextAuth.js v5 + GitHub OAuth |
| **数据库** | PostgreSQL (Neon) + Prisma ORM |
| **部署** | Vercel |

---

## 🚀 快速开始

### 本地开发

```bash
# 1. 进入项目目录
cd ~/.openclaw/workspace/projects/calendar/cloud

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 4. 初始化数据库
npx prisma db push

# 5. 启动开发服务器
npm run dev
```

访问 http://localhost:3000

---

## 📋 环境变量

创建 `.env.local` 文件：

```env
# 数据库
DATABASE_URL="postgresql://user:password@host/database?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
```

---

## 📦 部署到 Vercel

### 1. 准备

```bash
git add .
git commit -m "Update"
git push origin main
```

### 2. Vercel 配置

1. 登录 https://vercel.com，导入 GitHub 仓库
2. **Build Command** 设置为：
   ```
   npx prisma generate && npx prisma db push && next build
   ```
3. 添加环境变量（同上）
4. 点击 Deploy

### 3. 配置 GitHub OAuth

在 https://github.com/settings/developers 更新：
- Homepage URL: `https://your-domain.vercel.app`
- Authorization callback URL: `https://your-domain.vercel.app/api/auth/callback/github`

---

## 📁 项目结构

```
cloud/
├── prisma/
│   └── schema.prisma          # 数据库模型定义
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # NextAuth 路由
│   │   │   └── events/              # 日程 CRUD API
│   │   ├── login/             # 登录页面
│   │   ├── page.tsx           # 主页面（左右分栏布局）
│   │   ├── layout.tsx         # 根布局
│   │   └── globals.css        # 全局样式（暖色调主题）
│   ├── components/
│   │   ├── LiteraryView.tsx   # 文学人物展示组件
│   │   └── CalendarView.tsx   # 日历工具组件
│   ├── data/
│   │   └── literaryData.ts    # 文学人物数据库
│   └── lib/
│       ├── auth.ts            # NextAuth 配置
│       ├── db.ts              # Prisma 客户端
│       └── lunar.ts           # 农历计算（十二律月名）
├── .env.example               # 环境变量示例
├── next.config.ts
└── package.json
```

---

## 🗄️ 数据库模型

### User
- `id`: 用户唯一标识
- `email`: 邮箱（GitHub）
- `name`: 昵称
- `image`: 头像

### Event（日程/待办）
- `id`: 唯一标识
- `title`: 内容
- `date`: 日期 (YYYY-MM-DD)
- `isTodo`: true=待办, false=备忘
- `completed`: 完成状态
- `userId`: 所属用户（自动隔离）

---

## ⚠️ 已知限制

### 1. 网络访问（中国大陆）
- Vercel 部署在海外，访问速度可能较慢
- **GitHub OAuth 登录不稳定**，可能需要 VPN
- **解决方案**：添加邮箱登录（待开发）

### 2. 功能限制
- 文学人物数据目前只有示例（5条）
- 图片资源需要手动上传到 `public/assets/daily/`
- 无管理后台，查看数据需直接操作数据库

---

## 📝 使用提示

- **数据自动保存** - 无需手动同步，操作后立即写入数据库
- **多设备同步** - 在不同设备登录同一账号自动同步
- **农历显示** - 采用传统十二律命名（太簇、夹钟、姑洗等）

---

## 📄 License

MIT

---

<p align="center">Made with ❤️ for literary souls</p>
