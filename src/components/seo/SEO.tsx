import { Helmet } from 'react-helmet-async'
import { SITE } from '../../lib/site'

interface SEOProps {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}

export default function SEO({
  title,
  description = SITE.description,
  path = '',
  image = SITE.ogImage,
  type = 'website',
}: SEOProps) {
  const fullTitle = title ? `${title} — ${SITE.name}` : SITE.title
  const url = `${SITE.url}${path}`
  const img = image.startsWith('http') ? image : `${SITE.url}${image}`

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
    </Helmet>
  )
}
