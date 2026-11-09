"use client";

import { useEffect, useState } from "react";

export function BrandLoader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const timer = window.setTimeout(
      () => setVisible(false),
      reduced ? 0 : 1500,
    );
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div className="brand-intro" aria-hidden="true">
      <div className="intro-mark">
        <span>K</span>
        <svg viewBox="0 0 180 34">
          <path d="M4 18C40-12 59 48 91 18S145-10 176 18" />
        </svg>
      </div>
      <p>GOOD PEOPLE. STEADY GROWTH.</p>
      <div className="intro-track">
        <i />
      </div>
    </div>
  );
}
