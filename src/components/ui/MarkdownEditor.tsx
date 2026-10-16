import { useState } from 'react'
import { Eye, Pencil } from 'lucide-react'
import { Markdown } from './Markdown'
import { Textarea } from './Input'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  placeholder?: string
}

/** Markdown 编辑器：编辑 / 预览双模式切换 */
export function MarkdownEditor({ value, onChange, label, error, placeholder }: MarkdownEditorProps) {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-muted">{label}</span>
          <div className="flex shrink-0 rounded-lg border border-border p-0.5">
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                mode === 'edit' ? 'bg-surface text-text' : 'text-muted hover:text-text'
              }`}
            >
              <Pencil size={13} aria-hidden="true" />
              编辑
            </button>
            <button
              type="button"
              onClick={() => setMode('preview')}
              className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs transition-colors ${
                mode === 'preview' ? 'bg-surface text-text' : 'text-muted hover:text-text'
              }`}
            >
              <Eye size={13} aria-hidden="true" />
              预览
            </button>
          </div>
        </div>
      )}

      {mode === 'edit' ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={10}
          className="font-mono text-sm"
        />
      ) : (
        <div className="min-h-[220px] rounded-xl border border-border bg-surface px-4 py-3">
          {value.trim() ? (
            <Markdown content={value} />
          ) : (
            <p className="text-sm text-muted">暂无内容，请先在编辑模式输入 Markdown。</p>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  )
}
