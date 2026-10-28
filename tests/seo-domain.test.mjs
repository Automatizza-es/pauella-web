import assert from "node:assert/strict";
import test from "node:test";

// Deliberately independent of siteConfig: changing it must not change expectations.
const canonicalOrigin = "https://www.pauella.com";
const baseUrl = process.env.SEO_BASE_URL || "http://127.0.0.1:3000";

async function get(path, contentType) {
  const response = await fetch(new URL(path, baseUrl), {
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, path);
  assert.ok(response.headers.get("content-type")?.includes(contentType), path);
  return response.text();
}

function attributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, name, value]) => [name, value]),
  );
}

function assertCanonicalUrl(value, path) {
  assert.ok(value, `Missing URL for ${path}`);
  const url = new URL(value);
  assert.equal(url.origin, canonicalOrigin, path);
  assert.equal(url.pathname, path);
  assert.equal(url.search, "");
  assert.equal(url.hash, "");
}

test("rendered home uses www for canonical, social metadata and business JSON-LD", async () => {
  const html = await get("/", "text/html");
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag));
  const canonical = links.filter((tag) => tag.rel === "canonical");
  assert.equal(canonical.length, 1);
  assertCanonicalUrl(canonical[0].href, "/");

  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
  for (const [property, path] of [
    ["og:url", "/"],
    ["og:image", "/images/hero-seaside.jpg"],
    ["twitter:image", "/images/hero-seaside.jpg"],
  ]) {
    const matches = meta.filter((tag) => (tag.property || tag.name) === property);
    assert.equal(matches.length, 1, property);
    assertCanonicalUrl(matches[0].content, path);
  }

  const schemas = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attrs]) => attributes(attrs).type === "application/ld+json")
    .map(([, , json]) => JSON.parse(json));
  const business = schemas.find((schema) => schema["@type"] === "CateringBusiness");
  assert.ok(business, "Business JSON-LD must be present in server HTML");
  assertCanonicalUrl(business.url, "/");
  assertCanonicalUrl(business.image, "/images/pau-sunset-paella.png");
  assert.doesNotMatch(html, /https?:\/\/pauella\.com(?=[/"\s<\\]|$)/i);
});

test("robots points directly to the www sitemap", async () => {
  const robots = await get("/robots.txt", "text/plain");
  const sitemaps = [...robots.matchAll(/^Sitemap:\s*(\S+)/gim)].map(([, url]) => url);
  assert.deepEqual(sitemaps, [`${canonicalOrigin}/sitemap.xml`]);
});

test("sitemap lists the canonical www home", async () => {
  const xml = await get("/sitemap.xml", "xml");
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, url]) => url);
  assert.ok(locations.length > 0, "Sitemap must not be empty");
  assert.ok(locations.some((url) => new URL(url).pathname === "/"));
  for (const location of locations) {
    assert.equal(new URL(location).origin, canonicalOrigin);
  }
});
