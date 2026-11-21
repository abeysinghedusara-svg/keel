import Image from 'next/image'
import Link from 'next/link'
import {navigation} from '@/lib/content'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="section-shell">
        <div className="footer-top">
          <div>
            <Link href="/" aria-label="Keel Talent home"><Image src="/brand/keel-logo.png" width={169} height={40} alt="Keel Talent" /></Link>
            <p>Good people. Steady growth.</p>
          </div>
          <nav aria-label="Footer navigation">
            {navigation.map(([label, id]) => <Link key={id} href={`/#${id}`}>{label}</Link>)}
            <Link href="/blog">Insights</Link>
            <a href="mailto:careers@keeltalentgroup.com">Careers</a>
          </nav>
          <a className="back-to-top" href="#top">Back to top</a>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Keel Talent · Colombo, Sri Lanka</p>
          <p>Keel Talent is not a law firm and does not provide legal advice. Our team members work under the direction and supervision of our clients’ lawyers.</p>
        </div>
      </div>
    </footer>
  )
}
