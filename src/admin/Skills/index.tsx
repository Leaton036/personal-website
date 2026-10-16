import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LoaderCircle, Pencil, Plus, Trash } from 'lucide-react'
import { createSkill, deleteSkill, getSkills, updateSkill } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import type { Skill } from '@/types'

const skillSchema = z.object({
  category: z.string().trim().min(1, '请输入分类'),
  name: z.string().trim().min(1, '请输入名称'),
  icon: z.string().trim(),
  level: z.number().int('请输入整数').min(0, '最低 0').max(100, '最高 100'),
})

type SkillFormValues = z.infer<typeof skillSchema>

const defaultValues: SkillFormValues = { category: '', name: '', icon: '', level: 80 }

/** 新建 / 编辑技能弹窗 */
function SkillFormModal({
  open,
  initial,
  onClose,
  onSaved,
}: {
  open: boolean
  initial: Skill | null
  onClose: () => void
  onSaved: () => void
}) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({ resolver: zodResolver(skillSchema) })

  const level = watch('level')

  // 打开弹窗时回填表单
  useEffect(() => {
    if (open) {
      reset(initial ? { category: initial.category, name: initial.name, icon: initial.icon, level: initial.level } : defaultValues)
    }
  }, [open, initial, reset])

  const onSubmit = async (data: SkillFormValues) => {
    const payload: Skill = {
      id: initial?.id ?? crypto.randomUUID(),
      category: data.category,
      name: data.name,
      icon: data.icon,
      level: data.level,
    }
    if (initial) await updateSkill(initial.id, payload)
    else await createSkill(payload)
    onSaved()
    onClose()
  }

  return (
    <Modal
      open={open}
      title={initial ? '编辑技能' : '新建技能'}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>取消</Button>
          <Button type="submit" form="skill-form" disabled={isSubmitting}>
            {isSubmitting ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : null}
            保存
          </Button>
        </>
      }
    >
      <form id="skill-form" onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="名称" placeholder="React" error={errors.name?.message} {...register('name')} />
          <Input label="分类" placeholder="前端" error={errors.category?.message} {...register('category')} />
        </div>
        <Input label="图标" placeholder="lucide 图标名或 emoji（如 atom / 🚀）" error={errors.icon?.message} {...register('icon')} />
        <div>
          <label htmlFor="skill-level" className="text-sm text-muted">
            熟练度（{level ?? 0}%）
          </label>
          <input
            id="skill-level"
            type="range"
            min={0}
            max={100}
            className="mt-2 w-full accent-accent"
            {...register('level', { valueAsNumber: true })}
          />
          {errors.level && <p className="mt-1 text-sm text-red-400">{errors.level.message}</p>}
        </div>
      </form>
    </Modal>
  )
}

/** 后台技能管理 */
export default function AdminSkills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Skill | null>(null)
  const [deleting, setDeleting] = useState<Skill | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const load = () => {
    let cancelled = false
    getSkills()
      .then((data) => {
        if (!cancelled) setSkills(data)
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
  const openEdit = (skill: Skill) => {
    setEditing(skill)
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!deleting) return
    setDeleteLoading(true)
    try {
      await deleteSkill(deleting.id)
      setSkills((prev) => prev.filter((s) => s.id !== deleting.id))
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
          <h1 className="text-2xl font-bold">技能管理</h1>
          <p className="mt-2 text-sm text-muted">共 {skills.length} 项技能。</p>
        </div>
        <Button onClick={openCreate}>
          <Plus size={16} aria-hidden="true" />
          新建技能
        </Button>
      </div>

      {skills.length === 0 ? (
        <p className="mt-10 text-sm text-muted">暂无技能，点击「新建技能」添加。</p>
      ) : (
        <ul className="mt-6 divide-y divide-border/60 rounded-card border border-border bg-surface/60">
          {skills.map((skill) => (
            <li key={skill.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{skill.name}</span>
                  <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent">
                    {skill.category}
                  </span>
                </div>
                {skill.icon && <p className="mt-1 truncate text-xs text-muted">图标：{skill.icon}</p>}
              </div>
              <span className="shrink-0 text-sm text-muted">{skill.level}%</span>
              <div className="flex shrink-0 gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(skill)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-text"
                  aria-label={`编辑技能 ${skill.name}`}
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(skill)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-surface hover:text-red-400"
                  aria-label={`删除技能 ${skill.name}`}
                >
                  <Trash size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <SkillFormModal
        open={modalOpen}
        initial={editing}
        onClose={() => setModalOpen(false)}
        onSaved={() => load()}
      />

      <ConfirmDialog
        open={!!deleting}
        title="删除技能"
        message={`确定要删除技能「${deleting?.name ?? ''}」吗？此操作不可撤销。`}
        loading={deleteLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
