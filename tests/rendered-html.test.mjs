import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the finished NAILÉ landing page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="ru">/i);
  assert.match(html, /<title>NAILÉ — маникюр с характером<\/title>/i);
  assert.match(html, /id="services"/);
  assert.match(html, /id="portfolio"/);
  assert.match(html, /href="#portfolio"/);
  assert.match(html, /id="about"/);
  assert.match(html, /id="faq"/);
  assert.match(html, /id="booking"/);
  assert.match(html, /aria-controls="main-navigation"/);
  assert.match(html, /Маникюр \+ гель-лак/);
  assert.match(html, /Открыть запись/);
  assert.match(html, /https:\/\/t\.me\/nogti000bot\?startapp=landing/);
  assert.match(html, /https:\/\/t\.me\/nogti000bot\?startapp=service_1/);
  assert.match(html, /https:\/\/t\.me\/nogti000bot\?startapp=service_5/);
  assert.match(html, /https:\/\/t\.me\/nogti000bot/);
  assert.match(html, /property="og:image" content="http:\/\/localhost(?::3000)?\/og\.png"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
  assert.doesNotMatch(html, /200 довольных|500\+|30\+|Сегодня, 17:30/);
  assert.match(html, /application\/ld\+json/);
});

test("ships the interaction, accessibility and motion contracts", async () => {
  const [page, layout, css, packageJson, robots, sitemap, manifest] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
    readFile(new URL("../public/manifest.webmanifest", import.meta.url), "utf8"),
  ]);

  assert.match(page, /IntersectionObserver/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /aria-expanded=\{isOpen\}/);
  assert.doesNotMatch(page, /setInterval/);
  assert.match(page, /pointermove/);
  assert.doesNotMatch(page, /window\.addEventListener\("scroll"/);
  assert.match(page, /DeviceOrientationEvent/);
  assert.match(page, /requestPermission/);
  assert.match(page, /deviceorientation/);
  assert.match(page, /setSceneMotion/);
  assert.match(page, /device-motion-active/);
  assert.match(page, /Включить эффект движения/);
  assert.match(page, /Движение включено/);
  assert.match(page, /decoding="async"/);
  assert.match(page, /TELEGRAM_MINI_APP_URL/);
  assert.match(page, /TELEGRAM_BOT_URL/);
  assert.match(page, /telegramServiceUrl/);
  assert.match(page, /const jumpToSection/);
  assert.match(page, /event\.preventDefault\(\)/);
  assert.match(page, /window\.history\.replaceState/);
  assert.match(page, /window\.scrollTo\(0, top\)/);
  assert.equal((page.match(/jumpToSection\(event,/g) ?? []).length, 11);
  assert.doesNotMatch(page, /\/api\b/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /x-forwarded-host/);
  assert.match(layout, /alternates: \{ canonical: PUBLIC_ORIGIN \}/);
  assert.match(layout, /application\/ld\+json/);
  assert.match(robots, /sitemap/);
  assert.match(sitemap, /kirill-coder288\.github\.io/);
  assert.equal(JSON.parse(manifest).display, "standalone");
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@keyframes ambient-float/);
  assert.match(css, /@keyframes motion-invite/);
  assert.match(css, /--scene-x:/);
  assert.match(css, /--sage:/);
  assert.match(page, /className="work-grid"/);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/);
  assert.doesNotMatch(css, /scroll-snap-type/);
  assert.doesNotMatch(css, /overflow-x: scroll/);
  assert.doesNotMatch(css, /\.portfolio\s*\{[^}]*overflow:\s*hidden/s);
  assert.doesNotMatch(css, /html\s*\{[^}]*scroll-behavior:\s*smooth/s);
  assert.match(css, /html\s*\{[^}]*overflow-x:\s*clip/s);
  assert.match(css, /\.portfolio\s*\{[^}]*touch-action:\s*pan-y pinch-zoom/s);
  assert.match(css, /button,\s*a\s*\{[^}]*touch-action:\s*manipulation/s);
  assert.match(css, /\.service-card > \.service-booking-link\s*\{[^}]*width:\s*44px;[^}]*height:\s*44px/s);
  assert.match(css, /\.button::before\s*\{[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.motion-permission\s*\{[^}]*min-height:\s*58px/s);
  assert.match(css, /@media \(max-width: 600px\)[\s\S]*?\.motion-permission\s*\{[^}]*min-height:\s*72px/s);
  assert.match(css, /\.work-grid\[data-reveal\]\.is-visible \.work-card/);
  assert.match(css, /\.work-image::after/);
  assert.match(css, /\.nav\s*\{[^}]*pointer-events:\s*none/s);
  assert.match(css, /\.nav\.is-open\s*\{[^}]*pointer-events:\s*auto/s);
  assert.doesNotMatch(css, /transition:[^;]*visibility/);
  assert.doesNotMatch(css, /backdrop-filter/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/images/hero.webp", import.meta.url)),
    access(new URL("../public/images/master.webp", import.meta.url)),
    access(new URL("../public/images/work-6-v2.webp", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
});
