import type { ReactNode } from 'react'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import { markdownRemarkPlugins, markdownRehypePlugins, slugify } from '@/utils/markdown'

/** 从 React 节点中提取纯文本（用于生成标题锚点 id） */
function nodeToText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join('')
  if (typeof node === 'object' && 'props' in node) {
    return nodeToText((node.props as { children?: ReactNode }).children)
  }
  return ''
}

// 为标题添加 id，供 TOC 目录锚点跳转使用
const components: Components = {
  h1: ({ node: _node, children, ...props }) => (
    <h1 {...props} id={slugify(nodeToText(children))}>
      {children}
    </h1>
  ),
  h2: ({ node: _node, children, ...props }) => (
    <h2 {...props} id={slugify(nodeToText(children))}>
      {children}
    </h2>
  ),
  h3: ({ node: _node, children, ...props }) => (
    <h3 {...props} id={slugify(nodeToText(children))}>
      {children}
    </h3>
  ),
  h4: ({ node: _node, children, ...props }) => (
    <h4 {...props} id={slugify(nodeToText(children))}>
      {children}
    </h4>
  ),
  h5: ({ node: _node, children, ...props }) => (
    <h5 {...props} id={slugify(nodeToText(children))}>
      {children}
    </h5>
  ),
  h6: ({ node: _node, children, ...props }) => (
    <h6 {...props} id={slugify(nodeToText(children))}>
      {children}
    </h6>
  ),
}

interface MarkdownProps {
  content: string
  className?: string
}

/** Markdown 渲染组件（GFM 表格/任务列表 + 代码高亮 + 标题锚点） */
export function Markdown({ content, className = '' }: MarkdownProps) {
  return (
    <div className={`markdown ${className}`}>
      <ReactMarkdown
        remarkPlugins={markdownRemarkPlugins}
        rehypePlugins={markdownRehypePlugins}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
