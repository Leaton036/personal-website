import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoaderCircle, Pencil, Plus, Trash } from 'lucide-react'
import { createPost, deletePost, getPosts, updatePost } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatDate } from '@/utils/format'
import type { Post } from '@/types'

const postSchema = z.object({
  title: z.string().trim().min(1, '请输入标题'),
  summary: z.string().trim().min(1, '请输入摘要'),
  cover: z.string().trim(),
  tags: z.string().trim(),
  date: z.string().trim().min(1, '请输入日期'),
  content: z.string().trim().min(1, '请输入正文内容'),
})

type PostFormValues = z.infer<typeof postSchema>

const defaultValues: PostFormValues = {
  title: '',
  summary: '',
  cover: '',
  tags: '',
  date: new Date().toISOString().slice(0, 10),
  content: '',
}

/** 新建 / 编辑博客弹窗 */
function PostFormModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean
  initial: Post | null
  onClose: () => void
  onSaved: () => void
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({ resolver: zodResolver(postSchema) })

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              title: initial.title,
              summary: initial.summary,
              cover: initial.cover ?? '',
              tags: initial.tags.join(', '),
              date: initial.date,
              content: initial.content,
            }
          : defaultValues,
      )
    }
  }, [open, initial, reset])

  const onSubmit = async (data: PostFormValues) => {
    const payload: Post = {
      id: initial?.id ?? crypto.randomUUID(),
      title: data.title,
      summary: data.summary,
      cover: data.cover || undefined,
      tags: data.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
      date: data.date,
      content: data.content,
    }
    if (initial) await updatePost(initial.id, payload)
    else await createPost(payload)
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      title={initial ? '编辑博客' : '新建博客'}
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button type="submit" form="post-form" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : null}
            保存
          </Button>
        </>
      }
    >
      <form id="post-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="标题" error={errors.title?.message} {...register('title')} />
        <Textarea label="摘要" rows={2} error={errors.summary?.message} {...register('summary')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="封面图地址" placeholder="https://…（可选）" error={errors.cover?.message} {...register('cover')} />
          <Input label="标签" placeholder="React, 随笔（逗号分隔）" error={errors.tags?.message} {...register('tags')} />
        </div>
        <Input label="日期" type="date" error={errors.date?.message} {...register('date')} />
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MarkdownEditor
              value={field.value}
              onChange={field.onChange}
              label="Markdown 正文"
              placeholder="## 标题 …"
              error={errors.content?.message}
            />
          )}
        />
      </form>
    </Modal>
  )
}

/** 后台博客管理 */
export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Post | null>(null)
  const [deleting, setDeleting] = useState<Post | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const load = () => {
    let cancelled = false
    getPosts()
      .then((data) => {
        if (!cancelled) setPosts(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }

  useEffect(() => {
    return load()
  }, [])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }
  const openEdit = (post: Post) => {
    setEditing(post)
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deletePost(deleting.id)
      setPosts((prev) => prev.filter((p) => p.id !== deleting.id))
      setDeleting(null)
    } catch {
      // 删除失败保持弹窗
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) return <div className="h-64 animate-pulse rounded-card bg-surface" />

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">博客管理</h1>
          <p className="mt-2 text-sm text-muted">共 {posts.length} 篇文章。</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden="true" />
          新建博客
        </Button>
      </div>

      {posts.length === 0 ? (
        <p className="mt-10 text-sm text-muted">暂无博客，点击「新建博客」添加。</p>
      ) : (
        <ul className="mt-6 divide-y divide-border/60 rounded-card border border-border bg-surface/60">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center gap-4 p-4">
              {post.cover ? (
                <img
                  src={post.cover}
                  alt={post.title}
                  loading="lazy"
                  className="h-12 w-20 shrink-0 rounded-lg border border-border/60 object-cover"
                />
              ) : (
                <div className="h-12 w-20 shrink-0 rounded-lg bg-surface" />
              )}
              <div className="min-w-0 flex-1">
                <span className="block truncate font-medium">{post.title}</span>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  <span>{formatDate(post.date)}</span>
                  {post.tags.length > 0 && <span>· {post.tags.join(' / ')}</span>}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(post)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-text"
                  aria-label={`编辑博客 ${post.title}`}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(post)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-red-400"
                  aria-label={`删除博客 ${post.title}`}
                >
                  <Trash size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <PostFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => load()}
      />

      <ConfirmDialog
        open={!!deleting}
        title="删除博客"
        message={`确定要删除博客「${deleting?.title ?? ''}」吗？此操作不可撤销。`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
