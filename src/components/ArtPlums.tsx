import React, { useEffect, useRef, useState } from 'react'

/*
  Designed by antfu, thanks to his work.
    https://github.com/antfu/antfu.me/blob/main/src/components/ArtPlum.vue
*/
const CanvasComponent: React.FC = () => {
  const r180 = Math.PI
  const r90 = Math.PI / 2
  const r15 = Math.PI / 12
  const color = '#88888825'

  const el = useRef<HTMLCanvasElement | null>(null)
  const [size] = useState({ width: window.innerWidth, height: window.innerHeight })
  const [_, setStopped] = useState(false)
  const MIN_BRANCH = 30
  const len = 6

  const randomMiddle = () => Math.random() * 0.6 + 0.2

  const initCanvas = (canvas: HTMLCanvasElement, width = 400, height = 400, _dpi?: number) => {
    const ctx = canvas.getContext('2d')!
    const dpr = window.devicePixelRatio || 1
    // @ts-expect-error new in webkit and moz
    const bsr = ctx.webkitBackingStorePixelRatio || ctx.mozBackingStorePixelRatio || ctx.msBackingStorePixelRatio || ctx.oBackingStorePixelRatio || ctx.backingStorePixelRatio || 1
    const dpi = _dpi || dpr / bsr

    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = dpi * width
    canvas.height = dpi * height
    ctx.scale(dpi, dpi)

    return { ctx, dpi }
  }

  const polar2cart = (x = 0, y = 0, r = 0, theta = 0) => {
    const dx = r * Math.cos(theta)
    const dy = r * Math.sin(theta)
    return [x + dx, y + dy]
  }

  useEffect(() => {
    const canvas = el.current!
    const { ctx } = initCanvas(canvas, size.width, size.height)
    const { width, height } = canvas

    let steps: (() => void)[] = []
    let prevSteps: (() => void)[] = []

    const step = (x: number, y: number, rad: number, counter: { value: number } = { value: 0 }) => {
      const length = Math.random() * len
      counter.value += 1

      const [nx, ny] = polar2cart(x, y, length, rad)

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(nx, ny)
      ctx.stroke()

      const rad1 = rad + Math.random() * r15
      const rad2 = rad - Math.random() * r15

      if (nx < -100 || nx > size.width + 100 || ny < -100 || ny > size.height + 100)
        return

      const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5

      if (Math.random() < rate)
        steps.push(() => step(nx, ny, rad1, counter))
      if (Math.random() < rate)
        steps.push(() => step(nx, ny, rad2, counter))
    }

    const frame = () => {
      prevSteps = steps
      steps = []

      if (!prevSteps.length) {
        setStopped(true)
        return
      }

      prevSteps.forEach((i) => {
        if (Math.random() < 0.5)
          steps.push(i)
        else i()
      })

      requestAnimationFrame(frame)
    }

    const start = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.lineWidth = 1
      ctx.strokeStyle = color
      prevSteps = []
      steps = [
        () => step(randomMiddle() * size.width, -5, r90),
        () => step(randomMiddle() * size.width, size.height + 5, -r90),
        () => step(-5, randomMiddle() * size.height, 0),
        () => step(size.width + 5, randomMiddle() * size.height, r180),
      ]
      if (size.width < 500)
        steps = steps.slice(0, 2)
      setStopped(false)
      requestAnimationFrame(frame)
    }

    start()
  }, [size])

  return (
    <div
      style={{
        position: 'fixed',
        top: '0',
        bottom: '0',
        left: '0',
        right: '0',
        pointerEvents: 'none',
        maskImage: 'radial-gradient(circle, transparent, black)',
        WebkitMaskImage: 'radial-gradient(circle, transparent, black)',
      }}
    >
      <canvas ref={el} width="400" height="400" />
    </div>
  )
}

export default CanvasComponent
