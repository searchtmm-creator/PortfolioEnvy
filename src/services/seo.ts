import { projects } from '../data/portfolio';

export const SITE_URL = 'https://www.sergioalzate.com';
export const projectPath = (project: { slug: string }) => `/work/${project.slug}/`;
export function getProjectForPath(pathname: string) {
  return projects.find(project => projectPath(project) === `${pathname.replace(/\/+$/, '')}/`) ?? null;
}

export function getPageMetadata(pathname: string) {
  const project = getProjectForPath(pathname);
  const isHome = pathname === '/';
  const url = `${SITE_URL}${project ? projectPath(project) : isHome ? '/' : '/404.html'}`;
  const person = {
    '@type': 'Person', '@id': `${SITE_URL}/#sergio-alzate`, name: 'Sergio Alzate', alternateName: 'Search',
    url: `${SITE_URL}/`, jobTitle: 'Creative Director', image: `${SITE_URL}/home.jpg`,
    sameAs: ['https://www.linkedin.com/in/salzate/', 'https://www.behance.net/sergio_thk', 'https://www.instagram.com/ser.confiltros/'],
  };
  const title = project ? `${project.title} — ${project.category.split(' // ')[0]} | Sergio Alzate` : isHome ? 'Sergio Alzate | Creative Director & Copywriter' : 'Page not found | Sergio Alzate';
  const description = project ? `${project.description} Explore the campaign in Sergio Alzate’s advertising portfolio.` : 'Meet Sergio Alzate, creative director and copywriter based in Mexico City. Explore advertising campaigns, experience across Latin America, recognitions and contact.';
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [person, project ? {
      '@type': 'CreativeWork', '@id': `${url}#work`, name: project.title, url,
      description: project.description, genre: project.category.split(' // ')[1],
      about: { '@type': 'Organization', name: project.category.split(' // ')[0] },
      isPartOf: { '@id': `${SITE_URL}/#portfolio` },
    } : {
      '@type': 'ProfilePage', '@id': `${SITE_URL}/#portfolio`, url: `${SITE_URL}/`, name: title,
      mainEntity: { '@id': person['@id'] },
      hasPart: projects.map(work => ({ '@type': 'CreativeWork', name: work.title, url: `${SITE_URL}${projectPath(work)}` })),
    }],
  };
  return { title, description, url, image: project ? `${SITE_URL}/social/${project.slug}.jpg` : `${SITE_URL}/home.jpg`, schema, noindex: !project && !isHome };
}

export function updatePageMetadata(page: ReturnType<typeof getPageMetadata>) {
  document.title = page.title;
  const setMeta = (attribute: 'name' | 'property', key: string, content: string) => {
    let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
    if (!element) { element = document.createElement('meta'); element.setAttribute(attribute, key); document.head.append(element); }
    element.content = content;
  };
  setMeta('name', 'description', page.description);
  setMeta('name', 'robots', page.noindex ? 'noindex, follow' : 'index, follow');
  for (const [key, value] of Object.entries({ title: page.title, description: page.description, url: page.url, image: page.image })) {
    setMeta('property', `og:${key}`, value);
    setMeta('name', `twitter:${key}`, value);
  }
  let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); }
  canonical.href = page.url;
  let schema = document.getElementById('portfolio-schema');
  if (!schema) { schema = document.createElement('script'); schema.id = 'portfolio-schema'; schema.setAttribute('type', 'application/ld+json'); document.head.append(schema); }
  schema.textContent = page.noindex ? '' : JSON.stringify(page.schema);
}
