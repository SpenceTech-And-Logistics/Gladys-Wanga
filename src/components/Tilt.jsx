import { useRef } from 'react'

/** Gentle 3D tilt that follows the pointer. Does nothing for reduced-motion or touch. */
export default function Tilt({ children, className = '', max = 9 }) {
  const ref = useRef(null)
  const move = (e) => {
    if (e.pointerType === 'touch' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--ry', `${x * max * 2}deg`)
    ref.current.style.setProperty('--rx', `${-y * max * 2}deg`)
  }
  const leave = () => {
    ref.current.style.setProperty('--ry', '0deg')
    ref.current.style.setProperty('--rx', '0deg')
  }
  return (
    <div className={`tilt ${className}`} ref={ref} onPointerMove={move} onPointerLeave={leave}>
      {children}
    </div>
  )
}
