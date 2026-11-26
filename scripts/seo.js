import { getPage, siteName, siteUrl, socials } from '../src/site.js'

const image = new URL('media/rehan-shaikh-social.jpg', siteUrl).href
const imageAlt = 'Rehan Shaikh, Full Stack Developer, with the portfolio’s metallic artwork'
const personId = `${siteUrl}#person`
const websiteId = `${siteUrl}#website`

function profileGraph(page) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: siteUrl,
        name: siteName,
        inLanguage: 'en',
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}#profile`,
        url: siteUrl,
        name: page.title,
        description: page.description,
        isPartOf: { '@id': websiteId },
        mainEntity: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: siteName,
        url: siteUrl,
        jobTitle: 'Full Stack Developer',
        description: 'Full-stack developer and computer science student at Pillai University.',
        affiliation: { '@type': 'CollegeOrUniversity', name: 'Pillai University' },
        address: { '@type': 'PostalAddress', addressLocality: 'Navi Mumbai', addressCountry: 'IN' },
        sameAs: socials.map(([, url]) => url),
      },
    ],
  }
}

export function portfolioSeo() {
  return {
    name: 'portfolio-seo',
    transformIndexHtml(_html, { path }) {
      const page = getPage(path)
      if (!page) return

      const canonical = new URL(page.path, siteUrl).href
      const isHome = page.path === '/'
      const openGraph = {
        'og:type': isHome ? 'profile' : 'website',
        'og:site_name': siteName,
        'og:title': page.title,
        'og:description': page.description,
        'og:url': canonical,
        'og:image': image,
        'og:image:type': 'image/jpeg',
        'og:image:width': '1200',
        'og:image:height': '630',
        'og:image:alt': imageAlt,
      }
      const metadata = {
        description: page.description,
        'twitter:card': 'summary_large_image',
        'twitter:title': page.title,
        'twitter:description': page.description,
        'twitter:image': image,
        'twitter:image:alt': imageAlt,
      }

      const tags = [
        { tag: 'title', children: page.title },
        { tag: 'link', attrs: { rel: 'canonical', href: canonical } },
        ...Object.entries(metadata).map(([name, content]) => ({ tag: 'meta', attrs: { name, content } })),
        ...Object.entries(openGraph).map(([property, content]) => ({ tag: 'meta', attrs: { property, content } })),
      ]

      if (isHome) {
        tags.push({
          tag: 'script',
          attrs: { type: 'application/ld+json' },
          children: JSON.stringify(profileGraph(page)).replaceAll('<', '\\u003c'),
        })
      }

      return tags.map((tag) => ({ ...tag, injectTo: 'head' }))
    },
  }
}
