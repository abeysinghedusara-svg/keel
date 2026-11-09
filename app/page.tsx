import Image from "next/image";
import { BrandLoader } from "@/components/brand-loader";
import { Header } from "@/components/header";
import { HeroScene } from "@/components/hero-scene";
import { Services } from "@/components/services";
import { Process } from "@/components/process";
import { Faq } from "@/components/faq";
import { ContactForm } from "@/components/contact-form";
import { Reveal } from "@/components/motion";
import { Icon } from "@/components/icons";
import { navigation } from "@/lib/content";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <BrandLoader />
      <div id="top" className="top-wrap">
        <Header />
        <main id="main">
          <section className="hero section-shell" aria-labelledby="hero-title">
            <div className="hero-copy">
              <div className="eyebrow light">
                <span className="tiny-dot" /> SPECIALIST LEGAL & COMPLIANCE
                SUPPORT
              </div>
              <h1 id="hero-title">
                Skilled support.
                <br />A steadier <em>firm.</em>
              </h1>
              <p className="hero-description">
                Dedicated, legally trained people who take care of the details.
                So you can get back to the work that matters.
              </p>
              <div className="hero-actions">
                <a className="button button-gold" href="#contact">
                  Book a 30-minute call <Icon name="arrow" size={18} />
                </a>
                <a className="hero-secondary" href="#how">
                  <span>
                    <Icon name="play" size={12} />
                  </span>
                  See how it works
                </a>
              </div>
              <div className="hero-bottom">
                <span className="hero-line" />
                <p>
                  Carefully vetted. Trained on your tools.
                  <br />
                  <strong>Part of your team, supported by ours.</strong>
                </p>
              </div>
            </div>
            <HeroScene />
          </section>
          <div className="hero-proof section-shell">
            <p>
              A LEGAL BACKGROUND.
              <br />
              <strong>A higher standard of support.</strong>
            </p>
            <div>
              <strong>
                2 <em>weeks</em>
              </strong>
              <span>to your shortlist</span>
            </div>
            <div>
              <strong>
                6 <em>steps</em>
              </strong>
              <span>of careful vetting</span>
            </div>
            <div>
              <strong>
                1 <em>person</em>
              </strong>
              <span>dedicated to your firm</span>
            </div>
          </div>

          <section
            id="services"
            className="services-section section-shell section-space"
            aria-labelledby="services-title"
          >
            <Reveal className="section-heading">
              <div>
                <span className="eyebrow">01 — ROOM TO DO MORE</span>
                <h2 id="services-title">
                  Your expertise.
                  <br />
                  Our <em>extra pair of hands.</em>
                </h2>
              </div>
              <p>
                From the first email to the final document, give the everyday
                work the attention it deserves.
              </p>
            </Reveal>
            <Reveal>
              <Services />
            </Reveal>
            <div className="service-assurance">
              <Icon name="shield" size={18} />
              <p>
                Law graduates. Confidential by default. Always working under
                your direction.
              </p>
            </div>
          </section>

          <section id="why" className="why-section" aria-labelledby="why-title">
            <div className="section-shell why-inner">
              <Reveal className="why-intro">
                <span className="eyebrow">02 — THE KEEL DIFFERENCE</span>
                <h2 id="why-title">
                  An extension of
                  <br />
                  your team.
                  <br />
                  <em>A weight off your mind.</em>
                </h2>
                <p>
                  Good support is more than a placement. It’s the right person,
                  prepared properly, with people behind them for the long term.
                </p>
                <a href="#contact" className="text-link">
                  Meet your next team member <Icon name="arrow" size={17} />
                </a>
                <div className="keel-wave" aria-hidden="true">
                  <svg viewBox="0 0 300 60">
                    <path d="M1 30C60-35 91 95 150 30S240-35 299 30" />
                    <path d="M1 46C60-19 91 111 150 46S240-19 299 46" />
                  </svg>
                </div>
              </Reveal>
              <div className="why-points">
                {[
                  [
                    "01",
                    "Legal minds, from day one.",
                    "Law graduates who understand legal documents, deadlines, and confidentiality. Tested on English, writing, and practical legal skills before you meet.",
                  ],
                  [
                    "02",
                    "Your systems. Your standards.",
                    "We train your team member on your software, processes, and preferred way of working. One dedicated person, with hours that overlap with yours.",
                  ],
                  [
                    "03",
                    "We stay in your corner.",
                    "Onboarding, quality reviews, and regular check-ins. We handle payroll and HR, and help with cover and replacement when you need it.",
                  ],
                ].map(([n, title, description]) => (
                  <Reveal key={n} className="why-point">
                    <span>{n}</span>
                    <div>
                      <h3>{title}</h3>
                      <p>{description}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          <section
            id="how"
            className="process-section section-space"
            aria-labelledby="how-title"
          >
            <div className="section-shell">
              <Reveal className="section-heading">
                <div>
                  <span className="eyebrow light">
                    03 — A CLEAR PATH FORWARD
                  </span>
                  <h2 id="how-title">
                    Simple from the <em>first call.</em>
                  </h2>
                </div>
                <p>
                  We take care of finding, preparing, and supporting your
                  person. You decide who joins your team.
                </p>
              </Reveal>
              <Process />
              <div className="process-footer">
                <p>
                  <Icon name="shield" size={17} /> Six-step vetting. Nothing
                  left to chance.
                </p>
                <span>
                  Review <i /> English test <i /> Practical task <i /> Interview{" "}
                  <i /> Setup <i /> References
                </span>
              </div>
            </div>
          </section>

          <section
            className="breathing-room section-shell"
            aria-label="Our approach"
          >
            <Reveal>
              <span className="eyebrow">
                LESS TO MANAGE. MORE ROOM TO GROW.
              </span>
              <p>
                Your inbox in order.
                <br />
                Your deadlines in hand.
                <br />
                <em>Your mind on what matters.</em>
              </p>
              <a href="#contact" className="text-link">
                Let’s get your firm on an even keel{" "}
                <Icon name="arrow" size={18} />
              </a>
            </Reveal>
            <div className="breathing-seal" aria-hidden="true">
              <span>K</span>
              <small>WITH YOU, EVERY DAY</small>
            </div>
          </section>

          <section
            id="faq"
            className="faq-section section-shell section-space"
            aria-labelledby="faq-title"
          >
            <Reveal className="faq-heading">
              <span className="eyebrow">04 — A LITTLE MORE CLARITY</span>
              <h2 id="faq-title">
                Good questions.
                <br />
                <em>Straight answers.</em>
              </h2>
              <p>Something else on your mind?</p>
              <a className="text-link" href="mailto:hello@keeltalentgroup.com">
                Ask us directly <Icon name="arrow" size={16} />
              </a>
            </Reveal>
            <Faq />
          </section>

          <section
            id="contact"
            className="contact-section section-shell"
            aria-labelledby="contact-title"
          >
            <Reveal className="contact-copy">
              <span className="eyebrow light">
                YOUR NEXT CHAPTER STARTS HERE
              </span>
              <h2 id="contact-title">
                A steadier firm.
                <br />A little more
                <br />
                <em>room to breathe.</em>
              </h2>
              <p>
                Let’s talk about where you need support. Thirty minutes, a clear
                picture, and no pressure.
              </p>
              <div className="contact-details">
                <a href="mailto:hello@keeltalentgroup.com">
                  hello@keeltalentgroup.com <Icon name="arrow" size={18} />
                </a>
                <span>
                  <span className="tiny-dot" /> We reply within one business
                  day.
                </span>
              </div>
            </Reveal>
            <ContactForm />
          </section>
          <div className="careers section-shell">
            <p>
              <strong>A legal mind looking for a new horizon?</strong>
              <span>Build your international career with Keel Talent.</span>
            </p>
            <a className="text-link" href="mailto:careers@keeltalentgroup.com">
              Join our team <Icon name="arrow" size={17} />
            </a>
          </div>
        </main>
        <footer className="site-footer">
          <div className="section-shell">
            <div className="footer-top">
              <div>
                <a href="#top" aria-label="Keel Talent home">
                  <Image
                    src="/brand/keel-logo.png"
                    width={200}
                    height={47}
                    alt="Keel Talent"
                  />
                </a>
                <p>Good people. Steady growth.</p>
              </div>
              <nav aria-label="Footer navigation">
                {navigation.map(([label, id]) => (
                  <a key={id} href={`#${id}`}>
                    {label}
                  </a>
                ))}
                <a href="mailto:careers@keeltalentgroup.com">Careers</a>
              </nav>
              <a className="back-to-top" href="#top">
                Back to top <Icon name="arrow" size={15} />
              </a>
            </div>
            <div className="footer-bottom">
              <p>
                © {new Date().getFullYear()} Keel Talent · Colombo, Sri Lanka
              </p>
              <p>
                Keel Talent is not a law firm and does not provide legal advice.
                Our team members work under the direction and supervision of our
                clients’ lawyers.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
