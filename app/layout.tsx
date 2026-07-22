import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "NAILÉ — маникюр с характером",
    description: "Бережный маникюр, тонкое покрытие и спокойная атмосфера. Онлайн-запись к мастеру Анне.",
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
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
