import ReactMarkdown from 'react-markdown'
import { markdownRemarkPlugins, markdownRehypePlugins } from '@/utils/markdown'

interface MarkdownProps {
  content: string
  className?: string
}

/** Markdown 渲染组件（GFM 表格/任务列表 + 代码高亮） */
export function Markdown({ content, className = '' }: MarkdownProps) {
  return (
    <div className={`markdown ${className}`}>
      <ReactMarkdown remarkPlugins={markdownRemarkPlugins} rehypePlugins={markdownRehypePlugins}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
