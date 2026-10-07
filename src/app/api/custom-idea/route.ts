import { NextResponse } from "next/server";
import { emailRows, sendNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  const data = await request.json();

  if (!data?.email || !data?.idea) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  console.log("New Pauella custom idea:", data);

  await sendNotificationEmail({
    subject: `New custom paella idea from ${data.email}`,
    html: emailRows([
      ["Email", data.email],
      ["Favorite ingredients", data.ingredients],
      ["Doesn't like", data.dislikes],
      ["Number of guests", data.guestCount],
      ["Idea", data.idea],
    ]),
    replyTo: data.email,
  });

  return NextResponse.json({ ok: true });
}
