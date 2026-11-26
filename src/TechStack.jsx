import React, { useLayoutEffect, useRef, useState } from 'react'

const technologies = [
  { name: 'React', icon: 'react', url: 'https://react.dev/', purpose: 'Building interfaces from reusable components.' },
  { name: 'JavaScript', icon: 'javascript', url: 'https://tc39.es/ecma262/', purpose: 'Writing application logic for the browser and server.' },
  { name: 'Node.js', icon: 'nodedotjs', url: 'https://nodejs.org/', purpose: 'Running JavaScript on the server.' },
  { name: 'Express', icon: 'express', url: 'https://expressjs.com/', purpose: 'Building HTTP APIs and handling requests.' },
  { name: 'MongoDB', icon: 'mongodb', url: 'https://www.mongodb.com/docs/', purpose: 'Storing and querying application data.' },
  { name: 'Tailwind CSS', icon: 'tailwindcss', url: 'https://tailwindcss.com/', purpose: 'Composing responsive layouts with utility classes.' },
  { name: 'SCSS', icon: 'sass', url: 'https://sass-lang.com/documentation/syntax/#scss', purpose: 'Organizing styles with reusable Sass features.' },
  { name: 'Python', icon: 'python', url: 'https://www.python.org/', purpose: 'Writing scripts and working through programming problems.' },
  { name: 'Git', icon: 'git', url: 'https://git-scm.com/', purpose: 'Tracking changes and managing branches.' },
  { name: 'GitHub', icon: 'github', url: 'https://github.com/', purpose: 'Hosting repositories and collaborating on code.' },
]

export function TechStack() {
  const [active, setActive] = useState(0)
  const grid = useRef(null)
  const highlight = useRef(null)
  const selected = technologies[active]

  useLayoutEffect(() => {
    const container = grid.current
    const tile = container.querySelector('[data-highlighted="true"]')
    const accent = highlight.current

    function placeHighlight() {
      accent.style.setProperty('--tile-x', tile.offsetLeft + 'px')
      accent.style.setProperty('--tile-y', tile.offsetTop + 'px')
      accent.style.setProperty('--tile-width', tile.offsetWidth + 'px')
      accent.style.setProperty('--tile-height', tile.offsetHeight + 'px')
    }

    placeHighlight()
    const observer = new ResizeObserver(placeHighlight)
    observer.observe(container)
    return () => observer.disconnect()
  }, [active])

  return (
    <section className="tech-section section-light" aria-labelledby="tech-title">
      <div className="shell tech-shell">
        <div className="tech-header">
          <h2 id="tech-title"><span className="heading-mask"><span className="heading-inner">Technologies I use<span className="title-dot" aria-hidden="true">.</span></span></span></h2>
          <p>From interface design to APIs, data, and version control.</p>
        </div>
        <div className="tech-directory">
          <div className="tech-grid" ref={grid}>
            <div ref={highlight} className="tech-highlight" aria-hidden="true" />
            {technologies.map((tool, index) => (
              <a
                key={tool.name}
                className="tech-tile"
                data-highlighted={active === index}
                href={tool.url}
                target="_blank"
                rel="noreferrer"
                onPointerEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                aria-label={tool.name + ' website (opens in a new tab)'}
              >
                <img src={import.meta.env.BASE_URL + 'media/tech/' + tool.icon + '.svg'} width="44" height="44" alt="" loading="lazy" decoding="async" />
                <span>{tool.name}</span>
              </a>
            ))}
          </div>
          <div className="tech-note">
            <div className="tech-note-text" key={selected.name}>
              <strong>{selected.name}</strong>
              <p>{selected.purpose}</p>
            </div>
            <span className="mono">{new URL(selected.url).hostname.replace(/^www\./, '')}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
