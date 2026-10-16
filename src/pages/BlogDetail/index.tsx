import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

/** 博客详情页占位 */
export default function BlogDetail() {
  const { id } = useParams<{ id: string }>()
  return <PagePlaceholder title="博客详情" description={`当前文章 ID：${id ?? '未知'}`} />
}
