import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  radius: number
  alpha: number
  speed: number
  phase: number
  depth: number // 0~1，用于视差
}

interface StarfieldProps {
  className?: string
}

/**
 * 星空背景：Canvas 粒子，缓慢闪烁 + 轻微视差。
 * - 移动端按宽度减少粒子数
 * - 尊重 prefers-reduced-motion，关闭动画
 * - 页面不可见时暂停渲染
 */
export function Starfield({ className = '' }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let stars: Star[] = []
    let animationId = 0
    let width = 0
    let height = 0
    let mouseX = 0
    let mouseY = 0
    const PARALLAX = 20 // 视差最大偏移像素

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = canvas.clientWidth
      height = canvas.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // 移动端（窄屏）减少粒子数，保证性能
      const count = Math.min(100, Math.floor(width / 10))
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random(),
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      for (const star of stars) {
        // 视差偏移：越“深”的星移动越少
        const offsetX = mouseX * PARALLAX * star.depth
        const offsetY = mouseY * PARALLAX * star.depth
        // 缓慢闪烁：正弦波动透明度
        const alpha = star.alpha * (0.5 + 0.5 * Math.sin(star.phase))
        ctx.beginPath()
        ctx.arc(star.x + offsetX, star.y + offsetY, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(230, 234, 242, ${alpha})`
        ctx.fill()
      }
    }

    const animate = () => {
      for (const star of stars) star.phase += star.speed
      draw()
      animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      init()
      if (prefersReducedMotion) draw()
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (width === 0 || height === 0) return
      mouseX = (e.clientX / width) * 2 - 1
      mouseY = (e.clientY / height) * 2 - 1
    }

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId)
      } else if (!prefersReducedMotion) {
        animationId = requestAnimationFrame(animate)
      }
    }

    init()
    if (prefersReducedMotion) {
      draw() // 静态绘制一帧
    } else {
      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 -z-10 h-full w-full ${className}`}
      aria-hidden="true"
    />
  )
}
