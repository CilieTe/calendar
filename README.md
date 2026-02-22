# 典藏文学日历 Cloud

基于 Next.js + Prisma + PostgreSQL 的云端日历应用。

## 功能

- 📅 日历视图（支持农历和节气）
- 📖 每日文学人物展示
- ✅ 待办事项（TODO）
- 📝 日程备忘
- 🔐 GitHub OAuth 登录
- ☁️ 云端数据持久化

## 技术栈

- **前端**: Next.js 14 + React 19 + TypeScript + Tailwind CSS
- **后端**: Next.js API Routes + NextAuth.js
- **数据库**: PostgreSQL (Neon) + Prisma ORM
- **部署**: Vercel

## 本地开发

### 1. 安装依赖

```bash
cd ~/.openclaw/workspace/projects/calendar/cloud
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件（已创建，包含以下内容）：

```env
DATABASE_URL="postgresql://neondb_owner:npg_8xPjBAlC9qYg@ep-billowing-poetry-a1oxoq4w-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
GITHUB_CLIENT_ID="Ov23liMe3mrXhDx03Qok"
GITHUB_CLIENT_SECRET="90cd6fc2e12eb675272b74333cca910f2a8ef87a"
```

### 3. 初始化数据库

```bash
npx prisma db push
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到 Vercel

### 1. 推送代码到 GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/calendar.git
git push -u origin main
```

### 2. 在 Vercel 部署

1. 登录 https://vercel.com
2. 点击 "Add New Project"
3. 导入你的 GitHub 仓库
4. 配置环境变量：
   - `DATABASE_URL`: Neon 的连接字符串
   - `NEXTAUTH_SECRET`: 随机字符串（可用 `openssl rand -base64 32` 生成）
   - `GITHUB_CLIENT_ID`: GitHub OAuth App 的 Client ID
   - `GITHUB_CLIENT_SECRET`: GitHub OAuth App 的 Client Secret
5. 点击 Deploy

### 3. 配置 GitHub OAuth Callback URL

部署完成后，在 GitHub OAuth App 设置中更新：
- Homepage URL: `https://your-project.vercel.app`
- Authorization callback URL: `https://your-project.vercel.app/api/auth/callback/github`

## 项目结构

```
cloud/
├── prisma/
│   └── schema.prisma      # 数据库模型
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/  # 认证路由
│   │   │   └── events/              # 事件 API
│   │   ├── login/          # 登录页面
│   │   ├── page.tsx        # 主页
│   │   └── layout.tsx      # 根布局
│   ├── components/
│   │   └── CalendarView.tsx # 日历组件
│   ├── data/
│   │   └── literaryData.ts # 文学人物数据
│   └── lib/
│       ├── auth.ts         # NextAuth 配置
│       ├── db.ts           # Prisma 客户端
│       └── lunar.ts        # 农历工具
├── .env.local              # 环境变量（不提交）
├── next.config.ts
├── package.json
└── README.md
```

## 数据库模型

### User
- 用户表，存储 GitHub 登录信息

### Event
- 事件表，存储 TODO 和备忘
- `isTodo`: true = 待办事项, false = 备忘
- `completed`: 完成状态
- `date`: 日期 (YYYY-MM-DD)

## 注意事项

1. **NEXTAUTH_SECRET**: 生产环境必须设置随机密钥
2. **数据库**: Neon 免费额度 500MB，足够个人使用
3. **GitHub OAuth**: 确保回调 URL 配置正确

## License

MIT
