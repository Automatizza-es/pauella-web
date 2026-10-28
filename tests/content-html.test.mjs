import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.SEO_BASE_URL || "http://127.0.0.1:3000";

test("server HTML has one descriptive text H1 and readable reveal defaults", async () => {
  const response = await fetch(new URL("/", baseUrl), {
    redirect: "error",
    signal: AbortSignal.timeout(30_000),
  });
  assert.equal(response.status, 200);
  const html = await response.text();
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/g)];
  assert.equal(headings.length, 1);
  assert.equal(headings[0][1], "Live Paella Catering in Los Angeles");
  const revealClasses = [...html.matchAll(/class="([^"]*data-\[reveal=pending\][^"]*)"/g)];
  assert.ok(revealClasses.length >= 10, "Expected reveal sections in server HTML");
  for (const [, classes] of revealClasses) {
    assert.ok(!classes.split(/\s+/).includes("opacity-0"), classes);
  }
  assert.doesNotMatch(html, /\sdata-reveal="pending"/);
  assert.match(html, /<h3[^>]*>The Classics<\/h3>/);
  assert.match(html, /<h4[^>]*>The Original<\/h4>/);
});
