// Dependency injection keeps API tests completely separate from real delivery.
// The production route supplies the existing Resend sender and HTML escaping.
type Sender = (message: { subject: string; html: string; replyTo: string }) => Promise<void>;
type Rows = (fields: [string, unknown][]) => string;
export const COOKING_CLASS_SERVICE = "cooking-class";
const MAX_BODY_BYTES = 24 * 1024;

class InputError extends Error {
  readonly status: number;
  readonly fields: string[];
  constructor(status: number, fields: string[] = []) {
    super("Invalid request");
    this.status = status;
    this.fields = fields;
  }
}

async function readJson(request: Request): Promise<unknown> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new InputError(415);
  const length = request.headers.get("content-length");
  if (length && Number(length) > MAX_BODY_BYTES) throw new InputError(413);
  if (!request.body) throw new InputError(400);
  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let bytes = 0;
  let text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_BODY_BYTES) { await reader.cancel(); throw new InputError(413); }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof InputError) throw error;
    throw new InputError(400);
  } finally { reader.releaseLock(); }
}

export function validateCookingClass(data: unknown) {
  if (!data || typeof data !== "object" || Array.isArray(data)) throw new InputError(400);
  const input = data as Record<string, unknown>;
  const fields: string[] = [];
  function stringField(key: string, max: number, required = false) {
    const raw = input[key];
    if (!required && (raw === undefined || raw === "")) return "";
    if (typeof raw !== "string") { fields.push(key); return ""; }
    const value = raw.trim();
    if (value.length > max || (required && !value)) fields.push(key);
    return value;
  }
  const name = stringField("name", 120, true);
  const email = stringField("email", 254, true);
  const preferredDate = stringField("preferredDate", 10);
  const location = stringField("location", 300);
  const message = stringField("message", 4000);
  if (/[\r\n\x00]/.test(name)) fields.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fields.push("email");
  const participants = typeof input.participants === "number" ? input.participants
    : typeof input.participants === "string" && /^\d+$/.test(input.participants.trim()) ? Number(input.participants) : NaN;
  // Safe integer is a technical parsing constraint, not a commercial capacity.
  if (!Number.isSafeInteger(participants) || participants < 1) fields.push("participants");
  if (preferredDate) {
    const date = /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ? new Date(`${preferredDate}T00:00:00Z`) : new Date(NaN);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== preferredDate) fields.push("preferredDate");
  }
  if (input.serviceId !== undefined && input.serviceId !== COOKING_CLASS_SERVICE) fields.push("serviceId");
  if (fields.length) throw new InputError(400, [...new Set(fields)]);
  return { name, email, participants, preferredDate, location, message, serviceId: COOKING_CLASS_SERVICE };
}

export function createCookingClassHandler(send: Sender, rows: Rows) {
  return async function POST(request: Request) {
    let data: ReturnType<typeof validateCookingClass>;
    try { data = validateCookingClass(await readJson(request)); }
    catch (error) {
      const invalid = error instanceof InputError ? error : new InputError(400);
      return Response.json({ error: "Invalid request", fields: invalid.fields }, { status: invalid.status });
    }
    try {
      await send({
        // Constant subject also avoids exposing names in the existing dev sender log.
        subject: "Pauella cooking-class enquiry",
        replyTo: data.email,
        html: rows([
          ["Service", data.serviceId], ["Name", data.name], ["Email", data.email],
          ["Participants", data.participants], ["Preferred date", data.preferredDate],
          ["Location", data.location], ["Message", data.message],
        ]),
      });
    } catch {
      // Do not expose SDK errors, submitted values or credentials in logs/responses.
      return Response.json({ error: "Unable to send enquiry" }, { status: 502 });
    }
    return Response.json({ ok: true, serviceId: COOKING_CLASS_SERVICE });
  };
}
