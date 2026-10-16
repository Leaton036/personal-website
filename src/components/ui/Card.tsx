import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /** 是否显示 hover 浮起效果 */
  interactive?: boolean
}

/** 基础卡片容器 */
export function Card({ children, interactive = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-card border border-border bg-surface/60 p-6 ${
        interactive ? 'transition-transform duration-200 hover:-translate-y-1 hover:border-accent/40' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
