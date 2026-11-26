export const siteUrl = 'https://rehanshaikh.tech/'
export const siteName = 'Rehan Shaikh'

export const socials = [
  ['GitHub', 'https://github.com/rehansh25cs-afk'],
  ['LinkedIn', 'https://www.linkedin.com/in/rehan-shaikh-7b75b1387/'],
]

export const pages = [
  {
    id: 'about',
    label: 'About',
    path: '/',
    title: 'Rehan Shaikh | Full Stack Developer Portfolio',
    description: 'Rehan Shaikh is a full-stack developer in Navi Mumbai, India, and a computer science student at Pillai University. Explore his web development portfolio.',
  },
  {
    id: 'projects',
    label: 'Projects',
    path: '/projects/',
    title: 'Full Stack Projects | Rehan Shaikh',
    description: 'Explore Rehan Shaikh’s full-stack projects, including Snitch, an e-commerce storefront, and Perplexity Clone, a conversational AI web app.',
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact/',
    title: 'Contact Rehan Shaikh | Full Stack Developer',
    description: 'Contact Rehan Shaikh, a full-stack developer in Navi Mumbai, about developer roles and independent web projects. Find his email, GitHub, and LinkedIn.',
  },
]

export function getPage(pathname) {
  const path = pathname.replace(/\/index\.html$/, '/').replace(/\/?$/, '/')
  return pages.find((page) => page.path === path)
}
