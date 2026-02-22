# 📚 典藏文学日历 Cloud - PWA 测试版

基于 Next.js + Prisma + PostgreSQL 的云端日历应用，**PWA 版本**。

🔗 **在线访问**: https://calendar-black-nu.vercel.app

---

## ✨ PWA 特性（测试版新增）

- 📱 **添加到主屏幕** - 像原生 App 一样从桌面启动
- 🌐 **离线可用** - 缓存静态资源，无网也能查看（基础版）
- 🎨 **全屏体验** - 隐藏浏览器地址栏，沉浸式使用
- 📲 **响应式优化** - 适配手机/平板/桌面

---

## 🆚 与主版本区别

| 特性 | 主版本 (cloud) | PWA 测试版 (cloud-pwa-dev) |
|------|----------------|---------------------------|
| PWA 支持 | ❌ | ✅ |
| 离线功能 | ❌ | 基础版（静态资源缓存） |
| 安装到桌面 | ❌ | ✅ |
| 图标 | 无 | SVG 占位图标 |

---

## 🛠️ 技术栈

- **前端**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **认证**: NextAuth.js v5 + GitHub OAuth
- **数据库**: PostgreSQL (Neon) + Prisma ORM
- **PWA**: next-pwa (Workbox)
- **部署**: Vercel

---

## 🚀 本地开发

```bash
# 进入项目目录
cd ~/.openclaw/workspace/projects/calendar/cloud-pwa-dev

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 填入你的配置

# 初始化数据库
npx prisma db push

# 启动开发服务器
npm run dev
```

**注意**: PWA 功能只在生产构建中启用（`next dev` 时自动禁用）。

---

## 📱 测试 PWA 功能

### 1. 构建生产版本

```bash
npm run build
```

### 2. 本地测试

```bash
npx serve out
```

访问 http://localhost:3000

### 3. 安装到桌面/手机

**桌面 (Chrome/Edge)**:
1. 打开网站
2. 地址栏右侧点击「安装」图标
3. 或使用菜单 → 更多工具 → 创建快捷方式

**iOS (Safari)**:
1. 打开网站
2. 点击分享按钮
3. 选择「添加到主屏幕」

**Android (Chrome)**:
1. 打开网站
2. 点击菜单 → 添加到主屏幕
3. 或等待底部弹窗提示

---

## 📋 环境变量

同主版本：

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
```

---

## ⚠️ PWA 限制（本版本）

1. **离线功能 - 基础版**
   - ✅ 缓存：HTML/CSS/JS/图标
   - ❌ 动态数据（需要联网才能获取/保存日程）
   - 原因：离线情况不多，简化实现

2. **图标为占位符**
   - 使用 SVG 生成的「文」字图标
   - 后续可替换为设计好的图标

3. **推送通知**
   - 本版本未启用
   - 需要额外配置和权限申请

---

## 📝 后续优化方向

- [ ] 设计正式版图标（多尺寸 PNG）
- [ ] 完整离线功能（IndexedDB 缓存日程数据）
- [ ] 推送通知（任务提醒）
- [ ] 后台同步（离线操作联网后自动同步）

---

## 📄 License

MIT
