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
  assert.match(html, /id="about"/);
  assert.match(html, /id="faq"/);
  assert.match(html, /id="booking"/);
  assert.match(html, /aria-controls="main-navigation"/);
  assert.match(html, /Маникюр \+ покрытие/);
  assert.match(html, /Открыть запись/);
  assert.match(html, /https:\/\/t\.me\/nogti000bot\?startapp=landing/);
  assert.match(html, /https:\/\/t\.me\/nogti000bot/);
  assert.match(html, /property="og:image" content="http:\/\/localhost(?::3000)?\/og\.png"/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("ships the interaction, accessibility and motion contracts", async () => {
  const [page, layout, css, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /IntersectionObserver/);
  assert.match(page, /prefers-reduced-motion/);
  assert.match(page, /aria-expanded=\{isOpen\}/);
  assert.match(page, /gallery\.scrollTo/);
  assert.doesNotMatch(page, /setInterval/);
  assert.doesNotMatch(page, /pointermove/);
  assert.doesNotMatch(page, /window\.addEventListener\("scroll"/);
  assert.match(page, /decoding="async"/);
  assert.match(page, /TELEGRAM_MINI_APP_URL/);
  assert.match(page, /TELEGRAM_BOT_URL/);
  assert.doesNotMatch(page, /\/api\b/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /x-forwarded-host/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /@keyframes ambient-float/);
  assert.match(css, /scroll-snap-type: x proximity/);
  assert.match(css, /touch-action: pan-x pan-y pinch-zoom/);
  assert.doesNotMatch(css, /scroll-snap-type: x mandatory/);
  assert.doesNotMatch(css, /overscroll-behavior-inline: contain/);
  assert.doesNotMatch(css, /backdrop-filter/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await Promise.all([
    access(new URL("../public/images/hero.webp", import.meta.url)),
    access(new URL("../public/images/master.webp", import.meta.url)),
    access(new URL("../public/images/work-6-v2.webp", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);
});
