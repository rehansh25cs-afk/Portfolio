import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { TechStack } from './TechStack.jsx'
import { usePortfolioMotion } from './usePortfolioMotion.js'
import './styles.css'

const base = import.meta.env.BASE_URL
const resume = base + 'Rehan_Shaikh_Resume.pdf'
const email = 'rehandev07@gmail.com'
const socials = [
  ['GitHub', 'https://github.com/rehansh25cs-afk'],
  ['LinkedIn', 'https://www.linkedin.com/in/rehan-shaikh-7b75b1387/'],
]

const projects = [
  {
    name: 'Snitch',
    type: 'E-commerce',
    image: 'snitch.jpg',
    alt: 'Snitch storefront showing the fall and winter clothing collection',
    intro: 'A storefront for premium and luxury clothing.',
    details: 'Snitch brings a curated clothing collection into an online shopping experience. Shoppers can explore collections, browse products, and add pieces to their bag.',
    url: 'https://snitch-437r.onrender.com/',
  },
  {
    name: 'Perplexity Clone',
    type: 'Conversational AI',
    image: 'perplexity.png',
    alt: 'AI chat workspace with a conversation sidebar and message composer',
    intro: 'A conversational AI web application.',
    details: 'This project explores a chat workflow where you can ask questions, continue a conversation, or start a fresh thread. Recent conversations are accessible from the sidebar.',
    url: 'https://perplexity-1-4jje.onrender.com/',
  },
]

const routes = [
  ['About', ''],
  ['Projects', 'projects/'],
  ['Contact', 'contact/'],
]

const currentPath = window.location.pathname.replace(/\/index\.html$/, '/').replace(/\/?$/, '/')
const currentPage = routes.find(([, route]) => base + route === currentPath)?.[0] ?? 'About'

function ProjectImage({ project, loading = 'lazy' }) {
  return <img src={base + 'media/' + project.image} alt={project.alt} loading={loading} width="1917" height={project.image.endsWith('.png') ? '973' : '966'} />
}

function Header() {
  return (
    <header className="header">
      <div className="shell header-inner">
        <span className="wordmark" aria-label="Rehan Shaikh">RS<span>.</span></span>
        <nav aria-label="Main navigation">
          {routes.map(([label, route]) => (
            <a key={label} href={base + route} aria-current={currentPage === label ? 'page' : undefined}>{label}</a>
          ))}
        </nav>
        <a className="resume-link" href={resume} download="Rehan_Shaikh_Resume.pdf"><span className="resume-label">Résumé <span className="resume-format">PDF</span></span></a>
      </div>
    </header>
  )
}
function Hero() {
  const [showMotion, setShowMotion] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    function update() { setShowMotion(!preference.matches) }
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])
  return (
    <section className="hero shell" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true">
        <div className="hero-media">
          <div className="hero-depth">
            <img src={base + 'media/hero.jpg'} alt="" fetchPriority="high" />
            {showMotion && <video src={base + 'media/hero-motion.mp4'} autoPlay muted playsInline />}
          </div>
        </div>
      </div>
      <div className="hero-main">
        <p className="availability mono"><span aria-hidden="true" />Available for work</p>
        <h1 id="hero-title" className="hero-title">
          <span className="name-line"><span>Rehan</span></span>
          <span className="name-line"><span>Shaikh<span className="title-dot">.</span></span></span>
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
  const [opened, setOpened] = useState(null)
  const dialog = useRef(null)
  const trigger = useRef(null)
  const project = projects[active]

  useEffect(() => {
    if (opened && !dialog.current.open) dialog.current.showModal()
  }, [opened])

  function openProject(index, event) {
    trigger.current = event.currentTarget
    setActive(index)
    setOpened(projects[index])
  }

  function restoreFocus() {
    setOpened(null)
    trigger.current?.focus({ preventScroll: true })
  }

  return (
    <section id="work" className="work section-light" aria-labelledby="work-title">
      <div className="contour-field" aria-hidden="true" />
      <div className="shell section-shell">
        <div className="section-heading">
          <h1 id="work-title"><span className="heading-mask"><span className="heading-inner">Selected work<span className="title-dot">.</span></span></span></h1>
          <p>Two applications I’ve built, from an online clothing storefront to a conversational AI workspace.</p>
        </div>
        <div className="work-layout">
          <div className="project-index">
            {projects.map((item, index) => (
              <button key={item.name} type="button" className={'project-row' + (active === index ? ' current' : '')} onPointerEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={(event) => openProject(index, event)} aria-haspopup="dialog">
                <span className="project-mobile"><ProjectImage project={item} /></span>
                <span className="project-info">
                  <span className="mono project-type">{item.type}</span>
                  <span className="project-name">{item.name}</span>
                  <span className="project-intro">{item.intro}</span>
                </span>
                <span className="project-open" aria-hidden="true">+</span>
              </button>
            ))}
          </div>
          <figure className="project-preview">
            <div className="preview-stage">
              {projects.map((item, index) => (
                <div key={item.name} className={'preview-frame' + (active === index ? ' visible' : '')} aria-hidden={active !== index}>
                  <ProjectImage project={item} />
                </div>
              ))}
            </div>
            <figcaption key={project.name}><span>{project.name}</span><span className="mono">{project.type}</span></figcaption>
          </figure>
        </div>
      </div>
      <dialog ref={dialog} onClose={restoreFocus} aria-labelledby="project-dialog-title" className="project-dialog" data-lenis-prevent>
        {opened && (
          <article>
            <div className="dialog-header">
              <p className="mono">{opened.type}</p>
              <form method="dialog"><button className="close-button" type="submit" autoFocus>Close <span aria-hidden="true">×</span></button></form>
            </div>
            <ProjectImage key={opened.name} project={opened} loading="eager" />
            <div className="dialog-copy">
              <h2 id="project-dialog-title">{opened.name}</h2>
              <p>{opened.details}</p>
              <a href={opened.url} target="_blank" rel="noreferrer" className="pill-link">Open live project</a>
            </div>
          </article>
        )}
      </dialog>
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
            <h2 id="about-title"><span className="heading-mask"><span className="heading-inner">How I build<span className="title-dot">.</span></span></span></h2>
            <p className="about-intro">I’m Rehan Shaikh, a 19-year-old full-stack developer and second-year computer science student at Pillai University.</p>
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
            <Title id="contact-title"><span className="heading-mask"><span className="heading-inner">{compact ? 'Get in touch' : <>Let’s work<br />together</>}<span className="title-dot">.</span></span></span></Title>
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

function App() {
  const page = useRef(null)
  usePortfolioMotion(page)

  const Screen = { About, Projects: Work, Contact }[currentPage]

  return (
    <div className="page" data-page={currentPage.toLowerCase()} ref={page} id="top" tabIndex={-1}>
      <a className="skip-link" href="#main" data-smooth-anchor>Skip to content</a>
      <div className="reading-progress" aria-hidden="true" />
      <Header />
      <main id="main" tabIndex={-1}>
        <Screen />
      </main>
      <Footer />
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
