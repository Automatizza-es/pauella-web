import assert from "node:assert/strict";
import test from "node:test";
import { createCookingClassHandler } from "../src/lib/cooking-class-handler.ts";
import { emailRows } from "../src/lib/email.ts";

// No actual sender or API credential is used: every notification is a test double.
const valid = { name: "Test person", email: "test@example.invalid", participants: "2", serviceId: "cooking-class" };
function request(data, contentType = "application/json") {
  return new Request("http://localhost/api/cooking-class", {
    method: "POST", headers: { "Content-Type": contentType }, body: typeof data === "string" ? data : JSON.stringify(data),
  });
}
function fixture(sender) {
  const sent = [];
  const handler = createCookingClassHandler(sender || (async (message) => { sent.push(message); }), emailRows);
  return { sent, handler };
}

test("class enquiries have fixed identity and escaped HTML, no reservation or payment", async () => {
  const { handler, sent } = fixture();
  const result = await handler(request({ ...valid, name: "<Guest & Friend>", location: '<b>LA</b>', message: '<script>alert("test")</script>', preferredDate: "2028-02-29" }));
  assert.equal(result.status, 200);
  assert.deepEqual(await result.json(), { ok: true, serviceId: "cooking-class" });
  assert.equal(sent.length, 1);
  assert.equal(sent[0].subject, "Pauella cooking-class enquiry");
  assert.equal(sent[0].replyTo, valid.email);
  assert.ok(sent[0].html.includes("cooking-class"));
  assert.ok(sent[0].html.includes("&lt;Guest &amp; Friend&gt;"));
  assert.ok(sent[0].html.includes("&lt;script&gt;"));
  assert.ok(!sent[0].html.includes("<script>"));
  assert.ok(sent[0].html.includes("Participants"));
});

test("optional fields can be absent and numeric participants have no arbitrary group-size cap", async () => {
  for (const participants of [1, "2", 40, 200]) {
    const { handler, sent } = fixture();
    assert.equal((await handler(request({ ...valid, participants }))).status, 200);
    assert.equal(sent.length, 1);
  }
});

test("rejects missing, malformed or oversized fields without calling delivery", async () => {
  for (const payload of [null, [], {}, { ...valid, name: " " }, { ...valid, name: [] },
    { ...valid, email: "bad" }, { ...valid, email: "a@b.com\nBcc: fake" },
    { ...valid, participants: undefined }, { ...valid, participants: 0 },
    { ...valid, participants: -1 }, { ...valid, participants: 1.5 }, { ...valid, participants: "two" },
    { ...valid, participants: Number.MAX_SAFE_INTEGER + 1 },
    { ...valid, preferredDate: "2027-02-29" }, { ...valid, preferredDate: "2028-13-01" },
    { ...valid, location: "x".repeat(301) }, { ...valid, message: "x".repeat(4001) },
    { ...valid, name: "x".repeat(121) }, { ...valid, serviceId: "catering" }]) {
    const { handler, sent } = fixture();
    const result = await handler(request(payload));
    assert.equal(result.status, 400, JSON.stringify(payload));
    assert.equal(sent.length, 0);
  }
});

test("controls media type, malformed JSON and streamed body size", async () => {
  const { handler, sent } = fixture();
  assert.equal((await handler(request("{broken"))).status, 400);
  assert.equal((await handler(request(valid, "text/plain"))).status, 415);
  assert.equal((await handler(request({ ...valid, message: "x".repeat(25_000) }))).status, 413);
  const oversizedHeader = request(valid);
  oversizedHeader.headers.set("content-length", "30000");
  assert.equal((await handler(oversizedHeader)).status, 413);
  assert.equal(sent.length, 0);
});

test("delivery failure is a generic error, never false success or personal data", async () => {
  const { handler } = fixture(async () => { throw new Error("Private provider error test@example.invalid"); });
  const result = await handler(request(valid));
  assert.equal(result.status, 502);
  const body = await result.text();
  assert.equal(body, '{"error":"Unable to send enquiry"}');
  assert.ok(!body.includes(valid.email));
  assert.ok(!body.includes(valid.name));
});
