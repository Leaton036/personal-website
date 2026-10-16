# AI 开发代理指令 AGENTS.md

## 一、项目概述

个人作品集网站，包含前台展示（首页、介绍、技能、项目、博客、联系）和后台管理（`/admin` 下）。使用 React 18 + TypeScript + Vite + TailwindCSS 开发，数据层用 localStorage 模拟，后续可切换真实后端。

---

## 二、开发规范

### 2.1 技术约束

- 必须使用 React 18 + TypeScript + Vite + TailwindCSS
- 禁止引入重型 UI 库（如 Ant Design、MUI）
- 可引入轻量库：react-hook-form、zod、lucide-react、react-markdown
- 所有数据读写必须通过 `src/api/` 统一接口层
- 禁止在组件中直接操作 localStorage

### 2.2 目录规范

- 通用组件放 `src/components/`
- 前台页面放 `src/pages/`
- 后台页面放 `src/admin/`
- API 层放 `src/api/`
- 类型定义放 `src/types/`

### 2.3 命名规范

- 组件文件：PascalCase（如 `ProjectCard.tsx`）
- 工具函数：camelCase（如 `formatDate.ts`）
- 类型：PascalCase（如 `Project`）
- 常量：UPPER_SNAKE_CASE

### 2.4 代码风格

- TypeScript 严格模式
- 函数组件 + Hooks，禁止 class 组件
- 优先使用 Tailwind 原子类，避免内联样式
- 关键逻辑写注释
- 组件 props 必须定义类型

---

## 三、测试要求

- 每完成一个功能，手动测试：
  - 功能是否正常工作
  - 是否有控制台报错
  - 界面是否符合预期
  - 移动端是否适配
- 核心功能（登录、增删改查）需重点测试
- 提交前确保 `npm run build` 无报错

---

## 四、安全约束

- 登录密码不明文存 localStorage，只存 token
- 表单校验用 zod
- 所有删除操作需二次确认
- 不使用 `eval`、`innerHTML` 注入不可信内容
- 路由守卫拦截未登录访问 `/admin/*`

---

## 五、注意事项

- 后台路由与前台隔离，后台独立布局（侧边栏 + 顶栏）
- 后台样式与前台一致：深色主题、简洁现代
- 尊重 `prefers-reduced-motion`，星空动画可关闭
- 图片必须加 `alt`
- 键盘可导航，对比度达 AA
- 每完成一个功能用 Git 提交一次

---

## 六、交互风格

- 深色主题：背景 `#0B0F1A`，文字 `#E6EAF2`
- 圆角 12~16px
- 动效统一缓动
- 留白充足，层级清晰
- 按钮、卡片 hover 有反馈

---

## 七、交付要求

- 完整目录结构
- 关键文件代码
- 路由守卫实现
- API 层实现（localStorage 版）
- 可正常 `npm run dev` 启动
- 可正常 `npm run build` 打包