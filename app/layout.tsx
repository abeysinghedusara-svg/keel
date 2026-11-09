import type { Metadata } from "next";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Keel Talent | Specialist Legal & Compliance Support",
  description:
    "Dedicated, legally trained team members for your firm. Carefully vetted law graduates, trained on your systems and supported by Keel Talent.",
  applicationName: "Keel Talent",
  openGraph: {
    title: "Keel Talent | A steadier firm",
    description:
      "Specialist legal and compliance support. Your people, supported by ours.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
