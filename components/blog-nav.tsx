import Image from 'next/image'
import Link from 'next/link'

export function BlogNav() {
  return (
    <header className="blog-nav">
      <Link href="/" aria-label="Keel Talent home">
        <Image src="/brand/keel-logo.png" width={168} height={40} alt="Keel Talent" priority />
      </Link>
      <nav aria-label="Blog navigation">
        <Link className="blog-nav-link" href="/">Home</Link>
        <Link className="button button-small button-gold" href="/#contact">Let’s talk <span aria-hidden="true">↗</span></Link>
      </nav>
    </header>
  )
}
