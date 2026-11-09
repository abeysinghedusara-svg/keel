"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigation } from "@/lib/content";
import { Icon } from "@/components/icons";

export function Header() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const resize = () => {
      if (window.innerWidth > 860) setOpen(false);
    };
    document.addEventListener("keydown", close);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("keydown", close);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return (
    <header className="site-header">
      <div className="header-inner">
        <a href="#top" aria-label="Keel Talent home" className="brand">
          <Image
            src="/brand/keel-logo.png"
            width={190}
            height={45}
            alt="Keel Talent"
            priority
          />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a href="#contact" className="button button-small button-gold">
            Let’s talk <Icon name="arrow" size={16} />
          </a>
          <button
            ref={toggleRef}
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.25 }}
          >
            {navigation.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                {label}
                <Icon name="arrow" size={17} />
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
