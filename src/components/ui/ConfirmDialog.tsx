import { Modal } from './Modal'
import { Button } from './Button'

interface ConfirmDialogProps {
  open: boolean
  title: string
  message: string
  confirmLabel?: string
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

/** 二次确认弹窗（用于删除等危险操作） */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = '确认删除',
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} maxWidth="max-w-sm">
      <p className="text-sm leading-relaxed text-muted">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          取消
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={loading}>
          {loading ? '删除中…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
