import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

// react-markdown 插件配置（GFM 表格/任务列表 + 代码高亮）
export const markdownRemarkPlugins = [remarkGfm]
export const markdownRehypePlugins = [rehypeHighlight]

/** 标题项（用于生成目录 TOC） */
export interface Heading {
  id: string
  text: string
  level: number
}

/** 生成标题锚点 id：保留中英文与数字，空格转连字符，去除 markdown 内联语法 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/`([^`]+)`/g, '$1') // 行内代码取内容
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // 链接取文字
    .replace(/[^\w\u4e00-\u9fff\s-]/g, '') // 保留字母数字中文空格连字符
    .replace(/\s+/g, '-')
}

/** 从 Markdown 文本提取标题（忽略代码块内的 #），用于生成目录 */
export function extractHeadings(markdown: string): Heading[] {
  const headings: Heading[] = []
  let inCodeBlock = false

  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock) continue

    const match = /^(#{1,6})\s+(.+)$/.exec(line)
    if (match) {
      const level = match[1].length
      const text = match[2].trim()
      headings.push({ id: slugify(text), text, level })
    }
  }
  return headings
}
