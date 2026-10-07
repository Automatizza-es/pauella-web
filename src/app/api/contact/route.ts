import { NextResponse } from "next/server";
import { emailRows, sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const data = await request.json();

  if (!data?.name || !data?.email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  console.log("New Pauella event request:", data);

  await sendNotificationEmail({
    subject: `New event request from ${data.name}`,
    html: emailRows([
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone],
      ["Event date", data.eventDate],
      ["Event location", data.eventLocation],
      ["Number of guests", data.guestCount],
      ["Event type", data.eventType],
      ["Asking about", data.interestedPaella],
      ["Message", data.message],
    ]),
    replyTo: data.email,
  });

  return NextResponse.json({ ok: true });
}
