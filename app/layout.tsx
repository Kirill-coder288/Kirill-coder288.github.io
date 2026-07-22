import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

const PUBLIC_ORIGIN = "https://kirill-coder288.github.io";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "NAILÉ — маникюр с характером",
    description: "Бережный маникюр, тонкое покрытие и спокойная атмосфера. Онлайн-запись через Telegram Mini App.",
    alternates: { canonical: PUBLIC_ORIGIN },
    manifest: "/manifest.webmanifest",
    robots: { index: true, follow: true },
    icons: {
      icon: "/favicon.png",
      shortcut: "/favicon.png",
    },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      url: origin,
      title: "NAILÉ — маникюр с характером",
      description: "Тонкая работа. Спокойная атмосфера. Маникюр, который подходит именно вам.",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "NAILÉ — маникюр с характером" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "NAILÉ — маникюр с характером",
      description: "Тонкая работа. Спокойная атмосфера.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: "NAILÉ",
    description: "Маникюр и онлайн-запись через Telegram Mini App.",
    url: PUBLIC_ORIGIN,
    image: `${PUBLIC_ORIGIN}/og.png`,
    sameAs: ["https://t.me/nogti000bot"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Услуги маникюра",
      itemListElement: [
        ["Маникюр", 1200],
        ["Маникюр + гель-лак", 1900],
        ["Наращивание", 2800],
        ["Снятие покрытия", 500],
        ["Укрепление", 700],
      ].map(([name, price]) => ({
        "@type": "Offer",
        price,
        priceCurrency: "RUB",
        itemOffered: { "@type": "Service", name },
      })),
    },
  };
  return (
    <html lang="ru">
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }} />
      </body>
    </html>
  );
}
