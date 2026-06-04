import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Stagger animado de hijos al entrar en viewport.
 * Retorna una ref que debes asignar al contenedor.
 */
export function useGSAPReveal(opts = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const {
      selector = ':scope > *',
      stagger  = 0.07,
      y        = 40,
      duration = 0.72,
      ease     = 'power3.out',
      delay    = 0,
      start    = 'top 88%',
    } = opts

    const targets = Array.from(el.querySelectorAll(selector))
    if (!targets.length) return

    /* will-change en el DOM directamente, no via GSAP */
    targets.forEach(t => { t.style.willChange = 'transform, opacity' })
    gsap.set(targets, { opacity: 0, y })

    let st
    const anim = gsap.to(targets, {
      opacity:  1,
      y:        0,
      duration,
      ease,
      delay,
      stagger:  { each: stagger, ease: 'none' },
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
        onEnter() {},    // dummy — evita warning de ScrollTrigger
      },
      onComplete() {
        targets.forEach(t => { t.style.willChange = 'auto' })
      },
    })

    return () => {
      anim.kill()
      if (anim.scrollTrigger) anim.scrollTrigger.kill()
      gsap.set(targets, { clearProps: 'all' })
    }
  }, [])   // eslint-disable-line

  return containerRef
}

/**
 * Anima un único elemento al entrar en viewport.
 */
export function useGSAPRevealItem(opts = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const {
      y        = 30,
      x        = 0,
      duration = 0.65,
      ease     = 'power3.out',
      delay    = 0,
      start    = 'top 90%',
    } = opts

    el.style.willChange = 'transform, opacity'
    gsap.set(el, { opacity: 0, y, x })

    const anim = gsap.to(el, {
      opacity:  1,
      y:        0,
      x:        0,
      duration,
      ease,
      delay,
      scrollTrigger: {
        trigger: el,
        start,
        toggleActions: 'play none none none',
      },
      onComplete() { el.style.willChange = 'auto' },
    })

    return () => {
      anim.kill()
      if (anim.scrollTrigger) anim.scrollTrigger.kill()
      gsap.set(el, { clearProps: 'all' })
    }
  }, [])   // eslint-disable-line

  return ref
}
