# 个人作品集网站 技术设计文档

## 一、技术栈选择

| 层 | 选型 | 理由 |
|----|------|------|
| 框架 | React 18 + TypeScript | 组件化、类型安全 |
| 构建 | Vite | 快速热更新，开发体验好 |
| 样式 | TailwindCSS | 快速开发，风格统一 |
| 路由 | React Router v6 | 前台/后台路由隔离 |
| 状态 | Zustand | 轻量，适合中小型项目 |
| 表单 | react-hook-form + zod | 轻量校验，类型安全 |
| Markdown | react-markdown + remark-gfm + rehype-highlight | 渲染 + 代码高亮 |
| 星空背景 | Canvas 原生实现 | 无额外依赖，性能可控 |
| 图标 | lucide-react | 轻量图标库 |
| 数据层 | localStorage（模拟） | 本期无后端，便于后续替换 |
| 部署 | Vercel / Cloudflare Pages | 免费静态托管 |

---

## 二、项目结构

项目采用按职责分层的目录结构，前台、后台、API 层、类型定义各自独立，便于维护和扩展。

```
src/
  components/          # 通用组件
    ui/                # 基础 UI（Button、Card、Input 等）
    layout/            # 布局组件（Navbar、Footer、AdminLayout）
    starfield/         # 星空背景组件
  pages/               # 前台页面
    Home/
    About/
    Skills/
    Projects/
    ProjectDetail/
    Blog/
    BlogDetail/
    Contact/
  admin/               # 后台页面
    Login/
    Dashboard/
    Profile/
    Skills/
    Projects/
    Posts/
    Settings/
  api/                 # 统一接口层
    index.ts           # 导出所有 API
    profile.ts
    skills.ts
    projects.ts
    posts.ts
    auth.ts
  hooks/               # 自定义 hooks
    useAuth.ts
    useLocalStorage.ts
  utils/               # 工具函数
    format.ts
    markdown.ts
  types/               # TypeScript 类型
    index.ts
  data/                # 本地模拟数据
    seed.ts
  App.tsx
  main.tsx
  router.tsx
```

各目录职责说明：

- **components/**：存放所有可复用组件，其中 `ui/` 是基础组件，`layout/` 是布局组件，`starfield/` 是星空背景专用组件。
- **pages/**：前台页面，每个页面一个文件夹，包含该页面的主组件和子组件。
- **admin/**：后台页面，与前台路由隔离，统一挂在 `/admin` 下。
- **api/**：统一接口层，所有数据读写都通过这里，便于后续切换真实后端。
- **hooks/**：自定义 React Hooks，如登录态管理、localStorage 封装。
- **utils/**：工具函数，如日期格式化、Markdown 处理。
- **types/**：TypeScript 类型定义，集中管理数据模型。
- **data/**：本地模拟数据，用于首次加载时初始化 localStorage。

---

## 三、数据模型

系统核心数据模型如下，所有类型定义放在 `src/types/index.ts` 中。

```typescript
// 个人信息
interface Profile {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  email: string;
  social: { platform: string; url: string }[];
  experiences: { company: string; role: string; period: string; desc: string }[];
  education: { school: string; degree: string; period: string }[];
}

// 技能
interface Skill {
  id: string;
  category: string;   // 如 "前端"、"后端"、"工具"
  name: string;
  icon: string;
  level: number;      // 0~100
}

// 项目
interface Project {
  id: string;
  title: string;
  description: string;
  cover: string;
  tags: string[];
  link: string;
  repo?: string;
  content: string;    // Markdown 详情
  date: string;
}

// 博客
interface Post {
  id: string;
  title: string;
  summary: string;
  cover?: string;
  tags: string[];
  date: string;
  content: string;    // Markdown 正文
}

// 站点设置
interface SiteSettings {
  siteName: string;
  accentColor: string;
  footerText: string;
  icp?: string;
}

// 登录态
interface AuthToken {
  token: string;
  expiresAt: number;
}
```

---

## 四、关键技术点

### 4.1 星空 Canvas 性能优化

- 使用 `requestAnimationFrame` 驱动动画
- 移动端根据屏幕宽度动态减少粒子数（如 `Math.min(100, width / 10)`）
- 监听 `prefers-reduced-motion`，若用户偏好减少动效则暂停动画
- 页面不可见时（`document.hidden`）暂停渲染

### 4.2 Markdown 渲染与代码高亮

- 使用 `react-markdown` + `remark-gfm` 支持表格、任务列表
- 使用 `rehype-highlight` 做代码高亮
- 自动生成 TOC（可从标题提取）

### 4.3 路由守卫

- 封装 `<RequireAuth>` 组件
- 检查 localStorage 中 token 是否存在且未过期
- 未登录则 `<Navigate to="/admin/login" />`

### 4.4 API 层抽象

- 所有数据读写统一走 `src/api/`
- 本期用 localStorage 实现，导出一致的异步接口
- 后续切换后端只需改 `api/` 内部实现，页面不动

### 4.5 响应式布局

- Tailwind 断点：`sm:640`、`md:768`、`lg:1024`、`xl:1200`
- 网格：`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

### 4.6 登录态存储

- 不存明文密码，只存 token
- token 含过期时间，过期自动跳登录页

---

## 五、部署方案

- 推送到 GitHub
- Vercel / Cloudflare Pages 导入仓库
- 构建命令：`npm run build`
- 输出目录：`dist`
- 自动分配域名，支持自定义域名

---

## 六、可行性结论

- 技术可行：所有能力均有成熟方案
- 成本可控：纯前端 + localStorage，零服务器成本
- 风险可控：API 层抽象，后续换后端成本低