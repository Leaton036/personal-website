import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface LoginFormValues {
  username: string
  password: string
}

/** 后台登录页（占位：基础校验，后续接入 zod） */
export default function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>()

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.username, data.password)
      navigate('/admin', { replace: true })
    } catch (err) {
      alert(err instanceof Error ? err.message : '登录失败')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-card border border-border bg-surface/60 p-8"
      >
        <div>
          <h1 className="text-xl font-semibold text-text">管理员登录</h1>
          <p className="mt-1 text-sm text-muted">请输入账号密码进入后台</p>
        </div>

        <Input
          label="用户名"
          autoComplete="username"
          placeholder="admin"
          error={errors.username?.message}
          {...register('username', { required: '请输入用户名' })}
        />
        <Input
          label="密码"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password', { required: '请输入密码' })}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? '登录中…' : '登录'}
        </Button>
      </form>
    </div>
  )
}
