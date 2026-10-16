import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// react-markdown 插件配置（GFM 表格/任务列表 + 代码高亮）
export const markdownRemarkPlugins = [remarkGfm]
export const markdownRehypePlugins = [rehypeHighlight]

/** 从 Markdown 文本提取标题，用于生成目录（TOC） */
export function extractHeadings(markdown: string): { id: string; text: string; level: number }[] {
  const headings: { id: string; text: string; level: number }[] = []
  const regex = /^(#{1,6})\s+(.+)$/gm
  let match: RegExpExecArray | null
  while ((match = regex.exec(markdown)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    headings.push({ id: text, text, level })
  }
  return headings
}
