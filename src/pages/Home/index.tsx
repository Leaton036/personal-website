import { Link } from 'react-router-dom'

/** 首页 Hero 占位 */
export default function Home() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-[1200px] flex-col items-center justify-center px-4 text-center">
      <p className="mb-4 text-sm text-muted">欢迎来到我的作品集</p>
      <h1 className="text-4xl font-bold leading-tight md:text-6xl">
        你好，我是 <span className="text-accent">你的名字</span>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted">
        全栈开发工程师，专注于构建现代化的 Web 应用。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link
          to="/projects"
          className="inline-flex h-12 items-center justify-center rounded-xl bg-accent px-6 text-base font-medium text-white transition-colors hover:bg-accent/85"
        >
          查看项目
        </Link>
        <Link
          to="/contact"
          className="inline-flex h-12 items-center justify-center rounded-xl border border-border bg-surface px-6 text-base font-medium text-text transition-colors hover:bg-border/50"
        >
          联系我
        </Link>
      </div>
    </section>
  )
}
