import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {PortableText} from 'next-sanity'
import {Header} from '@/components/header'
import {SiteFooter} from '@/components/site-footer'
import {getPost, getPosts} from '@/sanity/lib/posts'

type Props = {params: Promise<{slug: string}>}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(value))
}

export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map(({slug}) => ({slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const post = await getPost(slug)
  if (!post) return {title: 'Article not found | Keel Talent'}
  const title = post.seoTitle || `${post.title} | Keel Talent`
  const description = post.seoDescription || post.excerpt || 'Thoughtful perspectives from Keel Talent.'
  return {
    title,
    description,
    alternates: {canonical: `/blog/${post.slug}`},
    openGraph: {title, description, type: 'article', publishedTime: post.publishedAt, images: post.image ? [post.image] : undefined},
  }
}

export default async function BlogPostPage({params}: Props) {
  const {slug} = await params
  const post = await getPost(slug)
  if (!post) notFound()
  const words = post.body?.flatMap((block) => Array.isArray(block.children) ? block.children.map((child: {text?: string}) => child.text || '') : []).join(' ').split(/\s+/).filter(Boolean).length || 0
  const readingMinutes = Math.max(1, Math.ceil(words / 220))
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title,
    description: post.seoDescription || post.excerpt, datePublished: post.publishedAt,
    author: post.author ? {'@type': 'Person', name: post.author} : {'@type': 'Organization', name: 'Keel Talent', url: 'https://keeltalentgroup.com'},
    publisher: {'@type': 'Organization', name: 'Keel Talent', url: 'https://keeltalentgroup.com'},
    mainEntityOfPage: `https://keeltalentgroup.com/blog/${post.slug}`,
    ...(post.image ? {image: post.image} : {}),
  }

  return (
    <div className="blog-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header home={false} />
      <main id="main-content">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd).replace(/</g, '\\u003c')}} />
      <div className="blog-shell">
        <article className="article-page">
          <Link className="article-back" href="/blog">All insights</Link>
          <header className="article-header">
            <p className="eyebrow"><span className="tiny-dot" /> {post.categories?.[0] ?? 'THE KEEL JOURNAL'}</p>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="article-dek">{post.excerpt}</p>}
            <div className="article-byline"><span>By {post.author || 'Keel Talent'}</span><span aria-hidden="true">·</span><time dateTime={post.publishedAt}>{dateLabel(post.publishedAt)}</time><span aria-hidden="true">·</span><span>{readingMinutes} min read</span></div>
          </header>
          {post.image && <figure className="article-image"><Image src={post.image} alt={post.imageAlt ?? ''} width={1800} height={1100} unoptimized /><figcaption>{post.imageAlt}</figcaption></figure>}
          {post.body && <div className="article-content"><PortableText value={post.body as never} /></div>}
          <aside className="article-cta"><p className="eyebrow">A LITTLE MORE ROOM TO FOCUS</p><h2>What would you like<br /><em>off your desk?</em></h2><p>Tell us where your firm needs a hand. We’ll help you find the right support.</p><Link className="button button-gold" href="/#contact">Talk with Keel</Link></aside>
        </article>
      </div>
      </main>
      <SiteFooter />
    </div>
  )
}
