import assert from "node:assert/strict";
import test from "node:test";
const base = process.env.SEO_BASE_URL || "http://127.0.0.1:3000";
const origin = "https://www.pauella.com";
const paths = { en: "/paella-cooking-classes-los-angeles/", es: "/es/clases-de-paella-los-angeles/" };
const alternates = { en: origin + paths.en, es: origin + paths.es, "x-default": origin + paths.en };
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k.toLowerCase(), v]));
const escape = (value) => value.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;");

for (const locale of ["en", "es"]) {
  test(`${locale}: complete class HTML, commercial terms and independent SEO`, async () => {
    const response = await fetch(new URL(paths[locale], base), { redirect: "error", signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200);
    const html = await response.text();
    const title = locale === "en" ? "Paella Cooking Classes in Los Angeles | Pauella" : "Clases de Paella en Los Ángeles | Pauella";
    const h1 = locale === "en" ? "Paella Cooking Classes in Los Angeles" : "Clases de paella en Los Ángeles";
    assert.match(html, new RegExp(`<html[^>]*lang="${locale}"`));
    assert.ok(html.includes(`<title>${title}</title>`));
    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
    assert.equal(h1s.length, 1);
    assert.equal(h1s[0][1], h1);
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attrs(tag));
    assert.deepEqual(links.filter((tag) => tag.rel === "canonical").map((tag) => tag.href), [origin + paths[locale]]);
    assert.deepEqual(Object.fromEntries(links.filter((tag) => tag.rel === "alternate").map((tag) => [tag.hreflang, tag.href])), alternates);
    const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attrs(tag));
    const meta = (key) => metas.find((tag) => (tag.property || tag.name) === key)?.content;
    assert.equal(meta("og:title"), title);
    assert.equal(meta("twitter:title"), title);
    assert.equal(meta("og:url"), origin + paths[locale]);
    assert.equal(meta("og:locale"), locale === "en" ? "en_US" : "es_ES");
    assert.equal(meta("description"), meta("og:description"));
    assert.equal(meta("description"), meta("twitter:description"));
    assert.match(meta("description"), /3/);
    assert.ok(meta("og:image").startsWith(origin + "/images/learn-rice-pour.jpg"));
    assert.ok(!html.includes('data-reveal="pending"'));
    const graph = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
      .filter(([, attr]) => attrs(attr).type === "application/ld+json")
      .flatMap(([, , json]) => JSON.parse(json)["@graph"] || []);
    const service = graph.find((entity) => entity["@type"] === "Service");
    assert.equal(service.url, origin + paths[locale]);
    assert.equal(service.name, h1);
    assert.equal(graph.find((entity) => entity["@type"] === "WebPage").inLanguage, locale);
    assert.ok(!JSON.stringify(graph).includes('"price"'));
    assert.ok(!JSON.stringify(graph).includes('"address"'));
    const faq = graph.find((entity) => entity["@type"] === "FAQPage");
    assert.equal(faq.inLanguage, locale);
    assert.equal(faq.mainEntity.length, 7);
    for (const question of faq.mainEntity) {
      assert.ok(html.includes(escape(question.name)));
      assert.ok(html.includes(escape(question.acceptedAnswer.text)));
    }
    assert.ok(faq.mainEntity.some((q) => q.acceptedAnswer.text.includes("3 horas") || q.acceptedAnswer.text.includes("3 hours")));
    assert.ok(faq.mainEntity.some((q) => /groups|grupos/.test(q.acceptedAnswer.text)));
    assert.ok(faq.mainEntity.some((q) => /distance|distancia/.test(q.acceptedAnswer.text)));
    const breadcrumbs = graph.find((entity) => entity["@type"] === "BreadcrumbList");
    assert.equal(breadcrumbs.itemListElement[1].item, origin + paths[locale]);
    const home = locale === "en" ? "/" : "/es/";
    const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)[1];
    assert.ok(header.includes(`href="${home}#menu"`));
    assert.ok(header.includes(`href="${home}#extras"`));
    assert.ok(header.includes(`href="${home}#about"`));
    assert.ok(header.includes('href="#class-enquiry"'));
    const fields = [...html.matchAll(/<(?:input|textarea)\b[^>]*>/g)].map(([tag]) => attrs(tag)).filter((tag) => tag.name);
    assert.deepEqual(fields.map((field) => field.name).sort(), ["name", "email", "participants", "preferredDate", "location", "message"].sort());
    for (const name of ["name", "email", "participants"]) assert.ok("required" in fields.find((field) => field.name === name));
    for (const name of ["preferredDate", "location", "message"]) assert.ok(!("required" in fields.find((field) => field.name === name)));
    const participants = fields.find((field) => field.name === "participants");
    assert.equal(participants.min, "1");
    assert.ok(!("max" in participants));
  });
}

test("home keeps its sections and adds all three class entry points", async () => {
  for (const locale of ["en", "es"]) {
    const response = await fetch(new URL(locale === "en" ? "/" : "/es/", base));
    assert.equal(response.status, 200);
    const html = await response.text();
    for (const id of ["top", "concept", "experience", "menu", "extras", "learn", "about", "service-area", "faq", "contact"]) assert.ok(html.includes(`id="${id}"`), id);
    const teaser = html.match(/id="learn"([\s\S]*?)<dialog/)[1];
    assert.ok(teaser.includes(`href="${paths[locale]}"`));
    const dialogs = [...html.matchAll(/<dialog\b[^>]*>([\s\S]*?)<\/dialog>/g)].map(([, body]) => body);
    assert.ok(dialogs.some((dialog) => dialog.includes(`href="${paths[locale]}"`)));
    const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)[1];
    assert.ok(footer.includes(`href="${paths[locale]}"`));
  }
});
