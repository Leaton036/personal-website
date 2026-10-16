import { useParams } from 'react-router-dom'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

/** 项目详情页占位 */
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  return <PagePlaceholder title="项目详情" description={`当前项目 ID：${id ?? '未知'}`} />
}
