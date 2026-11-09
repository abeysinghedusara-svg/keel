"use client";

import { AnimateUIProvider } from "@animate-ui/react/provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AnimateUIProvider reducedMotion="user">{children}</AnimateUIProvider>;
}
