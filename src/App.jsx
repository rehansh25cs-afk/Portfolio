import React, { useEffect, useRef, useState } from 'react'
import { TechStack } from './TechStack.jsx'
import { pages, socials } from './site.js'

const base = import.meta.env.BASE_URL
const resume = base + 'Rehan_Shaikh_Resume.pdf'
const email = 'rehandev07@gmail.com'
const projects = [
  {
    id: 'snitch',
    name: 'Snitch',
    type: 'E-commerce',
    image: 'snitch.jpg',
    preview: 'snitch-960.webp',
    height: 966,
    alt: 'Snitch storefront showing the fall and winter clothing collection',
    intro: 'A storefront for premium and luxury clothing.',
    details: 'Snitch brings a curated clothing collection into an online shopping experience. Shoppers can explore collections, browse products, and add pieces to their bag.',
    url: 'https://snitch-437r.onrender.com/',
  },
  {
    id: 'perplexity',
    name: 'Perplexity Clone',
    type: 'Conversational AI',
    image: 'perplexity.png',
    height: 973,
    alt: 'Perplexity Clone workspace with a conversation sidebar and message composer',
    intro: 'A conversational AI web application.',
    details: 'This project explores a chat workflow where you can ask questions, continue a conversation, or start a fresh thread. Recent conversations are accessible from the sidebar.',
    url: 'https://perplexity-1-4jje.onrender.com/',
  },
]

function ProjectImage({ project, preview = false, priority = false }) {
  const src = `${base}media/${project.image}`
  const responsive = preview && project.preview
  return (
    <img
      src={src}
      srcSet={responsive ? `${base}media/${project.preview} 960w, ${src} 1917w` : undefined}
      sizes={responsive ? '(max-width: 760px) 91vw, (max-width: 1690px) 50vw, 880px' : undefined}
      alt={project.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding={priority ? undefined : 'async'}
      width="1917"
      height={project.height}
    />
  )
}

function Header({ page }) {
  return (
    <header className="header">
      <div className="shell header-inner">
        <span className="wordmark" aria-hidden="true">RS<span>.</span></span>
        <nav aria-label="Main navigation">
          {pages.map(({ id, label, path }) => (
            <a key={id} href={path} aria-current={page.id === id ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
        <a className="resume-link" href={resume} download="Rehan_Shaikh_Resume.pdf"><span className="resume-label">Résumé <span className="resume-format">PDF</span></span></a>
      </div>
    </header>
  )
}
function Hero() {
  const poster = useRef(null)
  const [showMotion, setShowMotion] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false

    async function update() {
      if (preference.matches) {
        setShowMotion(false)
        return
      }
      await poster.current.decode().catch(() => {})
      if (!disposed && !preference.matches) setShowMotion(true)
    }

    update()
    preference.addEventListener('change', update)
    return () => {
      disposed = true
      preference.removeEventListener('change', update)
    }
  }, [])
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true">
        <div className="hero-media">
          <div className="hero-depth">
            <img
              ref={poster}
              src={base + 'media/hero-1536.webp'}
              srcSet={`${base}media/hero-960.webp 960w, ${base}media/hero-1536.webp 1536w`}
              sizes="(max-width: 760px) 720px, (max-width: 1200px) 960px, 1200px"
              width="1536"
              height="1024"
              alt=""
              fetchPriority="high"
            />
            {showMotion && <video src={base + 'media/hero-motion.mp4'} autoPlay muted playsInline />}
          </div>
        </div>
      </div>
      <div className="hero-main">
        <p className="availability mono"><span aria-hidden="true" />Available for work</p>
        <h1 id="hero-title" className="hero-title">
          <span className="name-line"><span>Rehan</span></span>{' '}
          <span className="name-line"><span>Shaikh<span className="title-dot" aria-hidden="true">.</span></span></span>
        </h1>
      </div>
      <div className="hero-caption">
        <p className="mono">Full-stack developer</p>
        <p>I build web applications from the interface to the database.</p>
      </div>
      <div className="hero-bottom">
        <a href="#about" className="scroll-link" data-smooth-anchor><span className="scroll-mark" aria-hidden="true" />About my work</a>
        <p className="mono hero-university">Pillai University</p>
      </div>
    </section>
  )
}

function Work() {
  const [active, setActive] = useState(0)
  const trigger = useRef(null)
  const project = projects[active]

  function openProject(index, event) {
    event.preventDefault()
    trigger.current = event.currentTarget
    setActive(index)
    document.getElementById(`project-${projects[index].id}`).showModal()
  }

  function restoreFocus() {
    trigger.current?.focus({ preventScroll: true })
    trigger.current = null
  }

  return (
    <section id="work" className="work section-light" aria-labelledby="work-title">
      <div className="contour-field" aria-hidden="true" />
      <div className="shell section-shell">
        <div className="section-heading">
          <h1 id="work-title"><span className="heading-mask"><span className="heading-inner">Selected work<span className="title-dot" aria-hidden="true">.</span></span></span></h1>
          <p>Two applications I’ve built, from an online clothing storefront to a conversational AI workspace.</p>
        </div>
        <div className="work-layout">
          <ul className="project-index" role="list">
            {projects.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={'project-row' + (active === index ? ' current' : '')}
                  onPointerEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={(event) => openProject(index, event)}
                  commandfor={`project-${item.id}`}
                  command="show-modal"
                  aria-haspopup="dialog"
                  aria-controls={`project-${item.id}`}
                  aria-labelledby={`project-name-${item.id}`}
                  aria-describedby={`project-intro-${item.id}`}
                >
                  <span className="project-mobile"><ProjectImage project={item} preview priority={index === 0} /></span>
                  <span className="project-info">
                    <span className="mono project-type">{item.type}</span>
                    <span className="project-name" id={`project-name-${item.id}`}>{item.name}</span>
                    <span className="project-intro" id={`project-intro-${item.id}`}>{item.intro}</span>
                  </span>
                  <span className="project-open" aria-hidden="true">+</span>
                </button>
              </li>
            ))}
          </ul>
          <figure className="project-preview">
            <div className="preview-stage">
              {projects.map((item, index) => (
                <div key={item.name} className={'preview-frame' + (active === index ? ' visible' : '')} aria-hidden={active !== index}>
                  <ProjectImage project={item} preview priority={index === 0} />
                </div>
              ))}
            </div>
            <figcaption key={project.name}><span>{project.name}</span><span className="mono">{project.type}</span></figcaption>
          </figure>
        </div>
      </div>
      {projects.map((item) => (
        <dialog key={item.id} id={`project-${item.id}`} onClose={restoreFocus} aria-labelledby={`project-title-${item.id}`} className="project-dialog" data-lenis-prevent>
          <article>
            <div className="dialog-header">
              <p className="mono">{item.type}</p>
              <form method="dialog"><button className="close-button" type="submit" autoFocus>Close <span aria-hidden="true">×</span></button></form>
            </div>
            <ProjectImage project={item} />
            <div className="dialog-copy">
              <h2 id={`project-title-${item.id}`}>{item.name}</h2>
              <p>{item.details}</p>
              <a href={item.url} target="_blank" rel="noreferrer" className="pill-link" aria-label={`Open live project ${item.name} (opens in a new tab)`}>Open live project</a>
            </div>
          </article>
        </dialog>
      ))}
    </section>
  )
}

function About() {
  return (
    <>
      <Hero />
      <section className="about section-light" id="about" tabIndex={-1} aria-labelledby="about-title">
        <div className="contour-field" aria-hidden="true" />
        <div className="shell section-shell">
          <div className="about-lead">
            <h2 id="about-title"><span className="heading-mask"><span className="heading-inner">How I build<span className="title-dot" aria-hidden="true">.</span></span></span></h2>
            <p className="about-intro">I’m Rehan Shaikh, a full-stack developer in Navi Mumbai, India, and a computer science student at Pillai University.</p>
          </div>
          <div className="approach" aria-label="Development approach">
            <article>
              <h3>Readable code</h3>
              <p>I use clear names and keep related logic together so someone else can understand, maintain, and extend my work.</p>
            </article>
            <article>
              <h3>Room to scale</h3>
              <p>I define clear boundaries between the interface, API, and data so each part can evolve as the application grows.</p>
            </article>
            <article>
              <h3>Practical costs</h3>
              <p>I consider built-in features and open-source tools before adding a paid service, weighing the cost of running and maintaining it.</p>
            </article>
          </div>
        </div>
      </section>
      <TechStack />
      <Contact compact />
    </>
  )
}

function CopyEmail() {
  const [status, setStatus] = useState('')

  async function copy() {
    try {
      await navigator.clipboard.writeText(email)
      setStatus('Email copied.')
    } catch {
      setStatus('You can select and copy the email address above.')
    }
  }

  return (
    <>
      <button type="button" className="copy-email" onClick={copy}>Copy email</button>
      <p className="copy-status" role="status">{status}</p>
    </>
  )
}

function Contact({ compact = false }) {
  const Title = compact ? 'h2' : 'h1'

  return (
    <section className={'contact' + (compact ? ' contact-compact' : '')} aria-labelledby="contact-title">
      <div className="contour-field" aria-hidden="true" />
      <div className="shell section-shell">
        <div className="contact-main">
          <div className="contact-intro">
            <p className="availability mono"><span aria-hidden="true" />Available for work</p>
            <Title id="contact-title"><span className="heading-mask"><span className="heading-inner">{compact ? 'Get in touch' : <>Let’s work<br />together</>}<span className="title-dot" aria-hidden="true">.</span></span></span></Title>
            {!compact && <p className="contact-description">I’m open to developer roles and independent web projects. Tell me what you’re building and where I can help.</p>}
          </div>
          <div className="contact-links">
            <div className="email-group">
              <a className="email-link" href={'mailto:' + email}>{email}</a>
              {!compact && <CopyEmail />}
            </div>
            <div className="socials">
              {socials.map(([name, url]) => <a className="text-link" href={url} key={name} target="_blank" rel="noreferrer">{name}</a>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-bottom">
        <p>Rehan Shaikh</p>
        <a href="https://www.danielebuser.com/" target="_blank" rel="noreferrer">Motion inspiration by Daniele Buser</a>
        <a href="#top" data-smooth-anchor>Back to top</a>
      </div>
    </footer>
  )
}

export function App({ page, pageRef }) {
  const Screen = { about: About, projects: Work, contact: Contact }[page.id]

  return (
    <div className="page" data-page={page.id} ref={pageRef} id="top" tabIndex={-1}>
      <a className="skip-link" href="#main" data-smooth-anchor>Skip to content</a>
      <div className="reading-progress" aria-hidden="true" />
      <Header page={page} />
      <main id="main" tabIndex={-1}>
        <Screen />
      </main>
      <Footer />
    </div>
  )
}
