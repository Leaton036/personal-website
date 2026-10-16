import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoaderCircle, Pencil, Plus, Trash } from 'lucide-react'
import { createProject, deleteProject, getProjects, updateProject } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { MarkdownEditor } from '@/components/ui/MarkdownEditor'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { formatDate } from '@/utils/format'
import type { Project } from '@/types'

const projectSchema = z.object({
  title: z.string().trim().min(1, '请输入标题'),
  description: z.string().trim().min(1, '请输入描述'),
  cover: z.string().trim(),
  tags: z.string().trim(),
  link: z.string().trim(),
  repo: z.string().trim(),
  date: z.string().trim().min(1, '请输入日期'),
  content: z.string().trim().min(1, '请输入详情内容'),
})

type ProjectFormValues = z.infer<typeof projectSchema>

const defaultValues: ProjectFormValues = {
  title: '',
  description: '',
  cover: '',
  tags: '',
  link: '',
  repo: '',
  date: new Date().toISOString().slice(0, 10),
  content: '',
}

/** 新建 / 编辑项目弹窗 */
function ProjectFormModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean
  initial: Project | null
  onClose: () => void
  onSaved: () => void
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectSchema) })

  useEffect(() => {
    if (open) {
      reset(
        initial
          ? {
              title: initial.title,
              description: initial.description,
              cover: initial.cover,
              tags: initial.tags.join(', '),
              link: initial.link,
              repo: initial.repo ?? '',
              date: initial.date,
              content: initial.content,
            }
          : defaultValues,
      )
    }
  }, [open, initial, reset])

  const onSubmit = async (data: ProjectFormValues) => {
    const payload: Project = {
      id: initial?.id ?? crypto.randomUUID(),
      title: data.title,
      description: data.description,
      cover: data.cover,
      tags: data.tags.split(/[,，]/).map((t) => t.trim()).filter(Boolean),
      link: data.link,
      repo: data.repo || undefined,
      date: data.date,
      content: data.content,
    }
    if (initial) await updateProject(initial.id, payload)
    else await createProject(payload)
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      title={initial ? '编辑项目' : '新建项目'}
      onClose={onClose}
      maxWidth="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button type="submit" form="project-form" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : null}
            保存
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input label="标题" error={errors.title?.message} {...register('title')} />
        <Textarea label="描述" rows={2} error={errors.description?.message} {...register('description')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="封面图地址" placeholder="https://…" error={errors.cover?.message} {...register('cover')} />
          <Input label="标签" placeholder="React, TypeScript（逗号分隔）" error={errors.tags?.message} {...register('tags')} />
          <Input label="外链" placeholder="https://…" error={errors.link?.message} {...register('link')} />
          <Input label="GitHub 仓库" placeholder="https://github.com/…" error={errors.repo?.message} {...register('repo')} />
        </div>
        <Input label="日期" type="date" error={errors.date?.message} {...register('date')} />
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MarkdownEditor
              value={field.value}
              onChange={field.onChange}
              label="Markdown 详情"
              placeholder="## 项目简介 …"
              error={errors.content?.message}
            />
          )}
        />
      </form>
    </Modal>
  )
}

/** 后台项目管理 */
export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [deleting, setDeleting] = useState<Project | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const load = () => {
    let cancelled = false
    getProjects()
      .then((data) => {
        if (!cancelled) setProjects(data)
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
  const openEdit = (project: Project) => {
    setEditing(project)
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deleteProject(deleting.id)
      setProjects((prev) => prev.filter((p) => p.id !== deleting.id))
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
          <h1 className="text-2xl font-bold">项目管理</h1>
          <p className="mt-2 text-sm text-muted">共 {projects.length} 个项目。</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden="true" />
          新建项目
        </Button>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 text-sm text-muted">暂无项目，点击「新建项目」添加。</p>
      ) : (
        <ul className="mt-6 divide-y divide-border/60 rounded-card border border-border bg-surface/60">
          {projects.map((project) => (
            <li key={project.id} className="flex items-center gap-4 p-4">
              {project.cover ? (
                <img
                  src={project.cover}
                  alt={project.title}
                  loading="lazy"
                  className="h-12 w-20 shrink-0 rounded-lg border border-border/60 object-cover"
                />
              ) : (
                <div className="h-12 w-20 shrink-0 rounded-lg bg-surface" />
              )}
              <div className="min-w-0 flex-1">
                <span className="block truncate font-medium">{project.title}</span>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  <span>{formatDate(project.date)}</span>
                  {project.tags.length > 0 && <span>· {project.tags.join(' / ')}</span>}
                </div>
              </div>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(project)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-text"
                  aria-label={`编辑项目 ${project.title}`}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(project)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-red-400"
                  aria-label={`删除项目 ${project.title}`}
                >
                  <Trash size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ProjectFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => load()}
      />

      <ConfirmDialog
        open={!!deleting}
        title="删除项目"
        message={`确定要删除项目「${deleting?.title ?? ''}」吗？此操作不可撤销。`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
