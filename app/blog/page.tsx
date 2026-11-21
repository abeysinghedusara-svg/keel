import type {Metadata} from 'next'
import Image from 'next/image'
import Link from 'next/link'
import {Header} from '@/components/header'
import {SiteFooter} from '@/components/site-footer'
import {JournalArt} from '@/components/journal-art'
import {getPosts} from '@/sanity/lib/posts'

export const metadata: Metadata = {
  title: 'Insights for a steadier firm | Keel Talent',
  description: 'Practical perspectives on legal operations, compliance support, and building a calmer working day for your firm.',
  alternates: {canonical: '/blog'},
  openGraph: {title: 'Insights for a steadier firm | Keel Talent', description: 'Practical perspectives for modern law firms.', type: 'website'},
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en', {month: 'long', day: 'numeric', year: 'numeric'}).format(new Date(value))
}

export default async function BlogIndexPage() {
  const posts = await getPosts()

  return (
    <div className="blog-page" id="top">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header home={false} />
      <main id="main-content">
      <div className="blog-shell">
        <section className="blog-intro" aria-labelledby="blog-title">
          <p className="eyebrow"><span className="tiny-dot" /> THE KEEL JOURNAL</p>
          <h1 id="blog-title">Good thinking.<br /><em>A steadier firm.</em></h1>
          <p className="blog-lede">Practical ideas for running your firm, supporting your people, and making room for the work you do best.</p>
        </section>

        {posts.length ? (
          <section className="blog-grid" aria-label="Latest articles">
            {posts.map((post, index) => (
              <article className={`blog-card${index === 0 ? ' blog-card-featured' : ''}`} key={post._id}>
                <Link href={`/blog/${post.slug}`} className="blog-card-link" aria-label={`Read ${post.title}`}>
                  {post.image ? <Image className="blog-card-image" src={post.image} alt={post.imageAlt ?? ''} width={1600} height={900} unoptimized /> : <JournalArt />}
                  <div className="blog-card-copy">
                    <div className="blog-meta"><span>{post.categories?.[0] ?? 'Perspectives'}</span><time dateTime={post.publishedAt}>{dateLabel(post.publishedAt)}</time></div>
                    <h2>{post.title}</h2>
                    {post.excerpt && <p>{post.excerpt}</p>}
                    <span className="blog-read">Read the article</span>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        ) : (
          <section className="blog-empty" aria-live="polite">
            <span className="blog-empty-mark" aria-hidden="true">K</span>
            <p className="eyebrow">A NOTE FROM KEEL</p>
            <h2>Good thinking takes<br /><em>a little time.</em></h2>
            <p>Our first collection of practical perspectives is taking shape. In the meantime, tell us what would give your firm more room to focus.</p>
            <Link className="text-link" href="/#contact">Start a conversation</Link>
          </section>
        )}

      </div>
      </main>
      <SiteFooter />
    </div>
  )
}
