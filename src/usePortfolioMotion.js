import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const motion = '(prefers-reduced-motion: no-preference)'
const finePointer = '(hover: hover) and (pointer: fine)'

function smoothScroll(root) {
  const lenis = new Lenis({
    autoRaf: false,
    lerp: 0.125,
    syncTouch: false,
    stopInertiaOnNavigate: true,
  })
  const listeners = new AbortController()

  // Wall-clock time keeps scroll interpolation independent of GSAP lag smoothing.
  const tick = () => lenis.raf(performance.now())
  const unsubscribe = lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(tick)

  root.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[data-smooth-anchor]')
    if (!anchor || event.defaultPrevented || event.button !== 0
      || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

    const target = document.getElementById(anchor.hash.slice(1))
    if (!target) return

    event.preventDefault()
    if (location.hash !== anchor.hash) history.pushState(null, '', anchor.hash)
    target.focus({ preventScroll: true })
    lenis.scrollTo(target, {
      immediate: anchor.classList.contains('skip-link'),
      duration: 0.85,
      easing: (progress) => 1 - Math.pow(1 - progress, 4),
    })
  }, { signal: listeners.signal })

  window.addEventListener('popstate', () => {
    // Cancel in-flight momentum and let the browser restore the saved position.
    if (!lenis.isStopped) {
      lenis.stop()
      lenis.start()
    }
  }, { signal: listeners.signal })

  const dialog = root.querySelector('dialog')
  const observer = new MutationObserver(() => {
    if (dialog.open) lenis.stop()
    else lenis.start()
  })
  if (dialog) observer.observe(dialog, { attributes: true, attributeFilter: ['open'] })

  return () => {
    listeners.abort()
    observer.disconnect()
    gsap.ticker.remove(tick)
    unsubscribe()
    lenis.destroy()
  }
}

function heroEntrance(hero) {
  if (!hero || window.scrollY > 80 || location.hash) return

  const find = gsap.utils.selector(hero)
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo(find('.hero-art'), { opacity: 0.45, '--hero-scale': 1.045 },
      { opacity: 1, '--hero-scale': 1, duration: 1.18, clearProps: 'opacity,--hero-scale' }, 0)
    .fromTo(find('.hero-main > .availability'), { y: 8, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.48, clearProps: 'opacity,transform' }, 0.04)
    .fromTo(find('.name-line > span'), { yPercent: 110 },
      { yPercent: 0, stagger: 0.105, duration: 0.88, clearProps: 'transform' }, 0.07)
    .fromTo(find('.hero-caption > *, .hero-bottom > *'), { y: 13, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.065, duration: 0.53, clearProps: 'opacity,transform' }, 0.43)
}

function sectionEntrances(root) {
  const listeners = new AbortController()
  const selectors = '.about-lead, .approach article, .tech-header, .tech-directory, .contact-main, .section-heading, .project-row, .project-preview'

  for (const section of root.querySelectorAll(selectors)) {
    if (section.getClientRects().length === 0 && section.matches('.project-preview')) continue

    const timeline = gsap.timeline({
      paused: true,
      defaults: { duration: 0.62, ease: 'power3.out', immediateRender: false },
    })
    const heading = section.querySelector('.heading-inner')

    if (heading) {
      timeline.fromTo(heading, { yPercent: 108 }, { yPercent: 0, duration: 0.82, clearProps: 'transform' })
      const supporting = section.querySelectorAll('.about-intro, .tech-header > p, .section-heading > p, .contact-links, .contact-description')
      if (supporting.length) {
        timeline.fromTo(supporting, { y: 15, opacity: 0.15 },
          { y: 0, opacity: 1, stagger: 0.07, clearProps: 'transform,opacity' }, 0.14)
      }
    } else if (section.matches('.tech-directory, .project-preview')) {
      const surface = section.querySelector('.tech-grid, .preview-stage')
      timeline.fromTo(surface, { clipPath: section.matches('.tech-directory') ? 'inset(0% 12% 0% 0%)' : 'inset(0% 0% 22% 0%)', opacity: 0.42 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 0.76, clearProps: 'clipPath,opacity' })
    } else {
      const stagger = Array.from(section.parentElement.children).indexOf(section) * 0.065
      timeline.fromTo(section, { y: 19, opacity: 0.2 },
        { y: 0, opacity: 1, clearProps: 'transform,opacity' }, stagger)
    }

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 97%',
      end: 'bottom top',
      once: true,
      onEnter: (self) => {
        if (self.progress === 1) timeline.progress(1)
        else timeline.play()
      },
    })

    section.addEventListener('focusin', () => {
      trigger.kill()
      timeline.progress(1).pause()
    }, { once: true, signal: listeners.signal })
  }

  return () => listeners.abort()
}

function scrollProgress(root) {
  const progress = gsap.quickSetter(root.querySelector('.reading-progress'), 'scaleX')
  const update = (trigger) => progress(ScrollTrigger.maxScroll(window) ? trigger.progress : 0)
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: update, onRefresh: update })
  return () => progress(0)
}

function scrollDepth(root) {
  const hero = root.querySelector('.hero')
  if (hero) {
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.34,
        invalidateOnRefresh: true,
      },
    })
      .to(hero.querySelector('.hero-media'), { y: () => Math.min(168, window.innerHeight * 0.21), scale: 1.1 }, 0)
      .to(hero.querySelector('.hero-main'), { yPercent: -14 }, 0)
      .to(hero.querySelector('.hero-caption'), { yPercent: -22 }, 0)
  }
  for (const field of root.querySelectorAll('.contour-field')) {
    gsap.fromTo(field, { '--paper-shift': '-16px' }, {
      '--paper-shift': '25px',
      ease: 'none',
      scrollTrigger: { trigger: field.parentElement, start: 'top bottom', end: 'bottom top', scrub: 0.42 },
    })
  }

  const preview = root.querySelector('.work-layout')
  if (preview && root.querySelector('.project-preview').getClientRects().length) {
    gsap.fromTo(root.querySelector('.preview-stage'), { '--preview-drift': '-5px' }, {
      '--preview-drift': '5px',
      ease: 'none',
      scrollTrigger: { trigger: preview, start: 'top bottom', end: 'bottom top', scrub: 0.35 },
    })
  }
}

const depthTargets = [
  ['.hero', '.hero-depth', 25, 18],
  ['.project-preview', '.preview-frame img', 9, 7],
  ['.contact', '.contour-field', 44, 34],
  ['.resume-link', '.resume-label', 5, 4],
]

function pointerDepth(root) {
  const listeners = new AbortController()
  const options = { passive: true, signal: listeners.signal }
  const clamp = gsap.utils.clamp(-0.5, 0.5)

  for (const [regionSelector, layerSelector, width, height] of depthTargets) {
    const region = root.querySelector(regionSelector)
    if (!region) continue

    const layers = Array.from(region.querySelectorAll(layerSelector))
    if (!layers.length) continue

    const position = layers.map((layer) => ({
      x: gsap.quickTo(layer, 'x', { duration: 0.45, ease: 'power3.out' }),
      y: gsap.quickTo(layer, 'y', { duration: 0.45, ease: 'power3.out' }),
    }))
    let bounds

    function move(event) {
      if (event.pointerType !== 'mouse') return

      if (!bounds) {
        const rect = region.getBoundingClientRect()
        if (!rect.width || !rect.height) return
        bounds = { left: rect.left + window.scrollX, top: rect.top + window.scrollY, width: rect.width, height: rect.height }
      }
      const x = clamp((event.clientX + window.scrollX - bounds.left) / bounds.width - 0.5)
      const y = clamp((event.clientY + window.scrollY - bounds.top) / bounds.height - 0.5)
      position.forEach((axis) => { axis.x(x * width); axis.y(y * height) })
    }

    function reset() {
      bounds = undefined
      position.forEach((axis) => { axis.x(0); axis.y(0) })
    }

    region.addEventListener('pointermove', move, options)
    region.addEventListener('pointerleave', reset, options)
    window.addEventListener('resize', reset, options)
  }

  return () => listeners.abort()
}

export function usePortfolioMotion(page) {
  useGSAP(() => {
    const root = page.current
    const hashTarget = document.getElementById(location.hash.slice(1))
    const navigation = performance.getEntriesByType('navigation')[0]
    if (hashTarget && navigation?.type === 'navigate' && window.scrollY === 0) {
      hashTarget.scrollIntoView({ behavior: 'instant' })
    }

    const media = gsap.matchMedia()
    try {
      media.add(motion, () => {
        heroEntrance(root.querySelector('.hero'))
        const stopReveals = sectionEntrances(root)
        const resetProgress = scrollProgress(root)
        return () => { stopReveals(); resetProgress() }
      })
      media.add(motion + ' and ' + finePointer, () => {
        const stopScroll = smoothScroll(root)
        const stopPointer = pointerDepth(root)
        return () => { stopPointer(); stopScroll() }
      })
      media.add(motion + ' and (min-width: 761px)', () => scrollDepth(root))
    } catch (error) {
      media.revert()
      console.warn('Portfolio motion could not initialize.', error)
    }
    return () => media.revert()
  }, { scope: page })
}
