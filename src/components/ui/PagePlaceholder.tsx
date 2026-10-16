interface PagePlaceholderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

/** 占位页面骨架：用于尚未实现具体内容的页面 */
export function PagePlaceholder({ title, description, children }: PagePlaceholderProps) {
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-16">
      <h1 className="text-3xl font-bold text-text">{title}</h1>
      {description && <p className="mt-3 text-muted">{description}</p>}
      <div className="mt-8 rounded-card border border-dashed border-border p-12 text-center text-sm text-muted">
        {children ?? '该页面内容开发中…'}
      </div>
    </section>
  )
}
