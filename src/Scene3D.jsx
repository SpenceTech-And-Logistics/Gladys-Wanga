import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Lake Victoria at dusk: rolling low-poly water, a setting sun, fishing boats and drifting lights.
export default function LakeScene() {
  const mount = useRef(null)

  useEffect(() => {
    const el = mount.current
    if (!el) return
    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' })
    } catch {
      return // no WebGL: the CSS sky behind stays as the fallback
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setClearColor(0x000000, 0)
    el.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0xf0a35a, 18, 52)
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100)
    camera.position.set(0, 2.6, 10)

    scene.add(new THREE.HemisphereLight(0xffc88a, 0x0a4c63, 1.1))
    const sunLight = new THREE.DirectionalLight(0xffb366, 2.4)
    sunLight.position.set(5, 6, -30)
    scene.add(sunLight)

    // Sun with a soft glow
    const glowTex = (() => {
      const c = document.createElement('canvas')
      c.width = c.height = 256
      const g = c.getContext('2d')
      const gr = g.createRadialGradient(128, 128, 0, 128, 128, 128)
      gr.addColorStop(0, 'rgba(255,236,190,1)')
      gr.addColorStop(0.25, 'rgba(255,170,80,0.65)')
      gr.addColorStop(1, 'rgba(255,120,40,0)')
      g.fillStyle = gr
      g.fillRect(0, 0, 256, 256)
      return new THREE.CanvasTexture(c)
    })()
    const sun = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshBasicMaterial({ color: 0xffe2a8, fog: false }))
    sun.position.set(5, 3.4, -38)
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, fog: false }))
    glow.scale.set(30, 30, 1)
    glow.position.copy(sun.position)
    glow.position.z -= 0.5
    scene.add(glow, sun)

    // Water
    const W = 80
    const D = 60
    const geo = new THREE.PlaneGeometry(W, D, 80, 56)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position
    const base = Float32Array.from(pos.array)
    const water = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x0f7a93, roughness: 0.32, metalness: 0.15, flatShading: true }))
    water.position.set(0, 0, -16)
    scene.add(water)
    const waveAt = (x, z, t) => Math.sin(x * 0.45 + t * 0.9) * 0.2 + Math.sin(z * 0.6 + t * 1.2) * 0.16 + Math.sin((x + z) * 0.25 + t * 0.5) * 0.12

    // Boats
    const boats = []
    const sailShape = new THREE.Shape()
    sailShape.moveTo(0, 0)
    sailShape.lineTo(0, 1.9)
    sailShape.lineTo(1.1, 0.15)
    sailShape.closePath()
    const hullMat = new THREE.MeshStandardMaterial({ color: 0x3a2412, roughness: 0.8 })
    const sailMats = [0xfff2d6, 0xf7b267, 0xe8e2d0].map((c) => new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 0.9 }))
    ;[[-5.5, -4, 1], [4.5, -9, 0.8], [-1.5, -17, 0.65]].forEach(([x, z, s], i) => {
      const g = new THREE.Group()
      const hull = new THREE.Mesh(new THREE.ConeGeometry(0.42, 2.2, 4), hullMat)
      hull.rotation.set(0, Math.PI / 4, Math.PI / 2)
      hull.scale.set(1, 1, 0.55)
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.2, 6), hullMat)
      mast.position.set(0.1, 1.05, 0)
      const sail = new THREE.Mesh(new THREE.ShapeGeometry(sailShape), sailMats[i % 3])
      sail.position.set(0.14, 0.18, 0)
      g.add(hull, mast, sail)
      g.scale.setScalar(s)
      g.position.set(x, 0, z)
      scene.add(g)
      boats.push({ g, x, z, speed: 0.12 + i * 0.05, phase: i * 2 })
    })

    // Drifting lights
    const N = 140
    const pp = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pp[i * 3] = (Math.random() - 0.5) * 40
      pp[i * 3 + 1] = 0.6 + Math.random() * 6
      pp[i * 3 + 2] = -Math.random() * 40 + 6
    }
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(pp, 3))
    const motes = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.07, transparent: true, opacity: 0.8, depthWrite: false }))
    scene.add(motes)

    const size = () => {
      const w = el.clientWidth || 1
      const h = el.clientHeight || 1
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    size()
    const ro = new ResizeObserver(size)
    ro.observe(el)

    let mx = 0
    let my = 0
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2
      my = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onMove)

    let visible = true
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting }, { threshold: 0 })
    io.observe(el)

    let raf = 0
    const clock = new THREE.Clock()
    const frame = () => {
      raf = requestAnimationFrame(frame)
      if (!visible || document.hidden) return
      const t = reduce ? 2 : clock.getElapsedTime()
      for (let i = 0; i < pos.count; i++) {
        const x = base[i * 3] + water.position.x
        const z = base[i * 3 + 2] + water.position.z
        pos.setY(i, waveAt(x, z, t))
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
      boats.forEach((b) => {
        const x = b.x + Math.sin(t * b.speed + b.phase) * 3
        const y = waveAt(x, b.z, t)
        b.g.position.set(x, y + 0.05, b.z)
        b.g.rotation.z = Math.sin(t * 1.1 + b.phase) * 0.07
        b.g.rotation.x = Math.sin(t * 0.8 + b.phase) * 0.04
      })
      motes.rotation.y = t * 0.012
      motes.position.y = Math.sin(t * 0.4) * 0.15
      glow.material.opacity = 0.85 + Math.sin(t * 0.7) * 0.08
      camera.position.x += (mx * 1.1 - camera.position.x) * 0.04
      camera.position.y += (2.6 - my * 0.4 - camera.position.y) * 0.04
      camera.lookAt(0, 2.1, -20)
      renderer.render(scene, camera)
    }
    frame()
    if (reduce) { cancelAnimationFrame(raf); frame(); cancelAnimationFrame(raf) }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      ro.disconnect()
      io.disconnect()
      scene.traverse((o) => {
        o.geometry?.dispose?.()
        const m = o.material
        ;(Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { x.map?.dispose?.(); x.dispose() })
      })
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div className="scene" ref={mount} aria-hidden="true" />
}
