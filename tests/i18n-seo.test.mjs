import assert from "node:assert/strict";
import test from "node:test";

const base = process.env.SEO_BASE_URL || "http://127.0.0.1:3000";
const origin = "https://www.pauella.com";
const languages = { en: `${origin}/`, es: `${origin}/es/`, "x-default": `${origin}/` };
async function get(path) {
  const response = await fetch(new URL(path, base), {
    redirect: "error", signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200, path);
  return response.text();
}
function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k.toLowerCase(), v]));
}
for (const [locale, path, title, h1, menu, ogLocale] of [
  ["en", "/", "Pauella | Live Paella Catering in Los Angeles", "Live Paella Catering in Los Angeles", "The Classics", "en_US"],
  ["es", "/es/", "Pauella | Catering de Paellas en Los Ángeles", "Catering de paellas en directo en Los Ángeles", "Los Clásicos", "es_ES"],
]) {
  test(`${path}: server language, metadata, alternates and JSON-LD`, async () => {
    const html = await get(path);
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
    assert.ok(html.includes(`<title>${title}</title>`));
    const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(headings.length, 1);
    assert.equal(headings[0][1], h1);
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attrs(tag));
    assert.deepEqual(links.filter((tag) => tag.rel === "canonical").map((tag) => tag.href), [`${origin}${path}`]);
    assert.deepEqual(Object.fromEntries(links.filter((tag) => tag.rel === "alternate").map((tag) => [tag.hreflang, tag.href])), languages);
    const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attrs(tag));
    const content = (key) => meta.find((tag) => (tag.name || tag.property) === key)?.content;
    assert.equal(content("og:url"), `${origin}${path}`);
    assert.equal(content("og:locale"), ogLocale);
    assert.equal(content("og:title"), title);
    assert.equal(content("twitter:title"), title);
    assert.equal(content("description"), content("og:description"));
    assert.equal(content("description"), content("twitter:description"));
    assert.ok(content("description").startsWith(locale === "es" ? "Catering de paellas" : "Live paella catering"));
    assert.equal(content("robots"), "index, follow");
    const schemas = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter(([, attributes]) => attrs(attributes).type === "application/ld+json")
      .map(([, , json]) => JSON.parse(json));
    const business = schemas.find((schema) => schema["@type"] === "CateringBusiness");
    assert.equal(business.url, `${origin}${path}`);
    assert.equal(business.description, content("description"));
    assert.equal(business.name, "Pauella");
    assert.equal(business.telephone, "+1 (213) 726-4675");
    assert.equal(business.hasMenu.hasMenuSection[0].name, menu);
    const faq = schemas.find((schema) => schema["@type"] === "FAQPage");
    assert.equal(faq.inLanguage, locale);
    for (const question of faq.mainEntity) {
      assert.ok(html.includes(question.name), question.name);
      assert.ok(html.includes(question.acceptedAnswer.text.replaceAll("'", "&#x27;").replaceAll('"', "&quot;")), question.name);
    }
    assert.doesNotMatch(html, /\sdata-reveal="pending"/);
    assert.ok(links.length > 0);
    assert.match(html, /href="\/es\/"/);
    assert.match(html, /href="\/"/);
  });
}

test("sitemap has both canonical URLs, reciprocal alternates, no artificial lastmod", async () => {
  const xml = await get("/sitemap.xml");
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, entry]) => entry);
  assert.equal(entries.length, 2);
  assert.deepEqual(entries.map((entry) => entry.match(/<loc>([^<]*)<\/loc>/)[1]).sort(), [languages.en, languages.es].sort());
  for (const entry of entries) {
    const alternates = [...entry.matchAll(/<xhtml:link\b[^>]*>/g)].map(([tag]) => attrs(tag));
    assert.deepEqual(Object.fromEntries(alternates.map((tag) => [tag.hreflang, tag.href])), languages);
  }
  assert.doesNotMatch(xml, /<lastmod>/);
  const robots = await get("/robots.txt");
  assert.match(robots, /Allow: \/(?:\r?\n|$)/);
  assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
});

test("existing API paths still respond directly without slash redirects", async () => {
  for (const path of ["/api/contact", "/api/custom-idea"]) {
    // Read-only GET must remain method-not-allowed; no form or email is sent.
    const response = await fetch(new URL(path, base), { redirect: "error", signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 405, path);
  }
});
