import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: "https://kirill-coder288.github.io/",
    lastModified: new Date("2026-07-22T00:00:00.000Z"),
    changeFrequency: "monthly",
    priority: 1,
  }];
}
